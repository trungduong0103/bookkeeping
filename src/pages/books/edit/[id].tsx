import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { array, number, object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import type { IAuthor, IBook } from "@/interfaces";
import { fetchAuthors, fetchBook, updateBook } from "@/fetchers";
import { Chip } from "@/components/Chip";
import { Button } from "@/components/Button";
import { TextInput } from "@/components/TextInput";
import { SelectInput } from "@/components/SelectInput";

export const getServerSideProps = (async (context) => {
  try {
    const authors = await fetchAuthors({ noLimit: true });
    const book = await fetchBook(context.query.id as string);
    return { props: { book, authors } };
  } catch (err) {
    console.error();
  }

  return { notFound: true };
}) satisfies GetServerSideProps<{ book: IBook; authors: IAuthor[] }>;

const authorSchema = object()
  .shape({
    title: string().required("Title is required"),
    authors: array().of(string().required()).required(),
    publicationYear: number().integer().positive().required(),
  })
  .required();

type TBookPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const AuthorChip = ({
  authorName,
  onRemove,
}: {
  authorName: string;
  onRemove: (authorName: string) => void;
}) => {
  return <Chip title={authorName} onRemove={onRemove} />;
};

export default function BookPage({ book, authors }: TBookPageProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(authorSchema),
    defaultValues: {
      title: book.title,
      authors: book.authors,
      publicationYear: book.publicationYear,
    },
  });
  const [clientBook, setClientBook] = useState(book);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [updating, setUpdating] = useState(false);
  // cheat to update on change without controller
  // biome-ignore lint/suspicious/noExplicitAny: bc im lazy
  const selectorOnchangeRef = useRef<(...event: any[]) => void>();

  const onSubmit = async (data: Partial<IBook>) => {
    setUpdating(true);
    try {
      await updateBook(book.id, { ...data, authors: selectedAuthors });
      const apiBook = await fetchBook(book.id);
      setSelectedAuthors([]);
      setClientBook(apiBook);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <div className="flex gap-2 items-center mb-5">
        <h1 className="prose-2xl font-bold leading-3">Edit book: </h1>
        {updating ? (
          <span className="skeleton inline-block w-[200px]" />
        ) : (
          <h1 className="prose-2xl font-bold leading-3">{clientBook.title}</h1>
        )}
      </div>
      <form
        className="flex flex-col gap-3 w-[500px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-full flex items-center justify-between">
          <label className="block font-bold mb-2">Title:*</label>
          {updating ? (
            <div className="skeleton w-[200px]" />
          ) : (
            <TextInput className="w-[250px]" {...register("title")} />
          )}
          {errors.title && (
            <p className="prose-sm text-red">{errors.title.message}</p>
          )}
        </div>

        <div className="w-full flex items-center justify-between">
          <div className="mb-2 flex flex-col">
            <label className="font-bold">Authors: </label>
            {updating ? (
              <div className="skeleton w-[200px]" />
            ) : (
              <span>{clientBook.authors.join(", ")}</span>
            )}
          </div>

          <div>
            {updating ? (
              <div className="skeleton w-[200px]" />
            ) : (
              <Controller
                control={control}
                name="authors"
                render={({ field: { onChange, ...others } }) => {
                  selectorOnchangeRef.current = onChange;
                  return (
                    <SelectInput
                      {...others}
                      onChange={(e) => {
                        setSelectedAuthors((prev) =>
                          Array.from(new Set([...prev, e.target.value]))
                        );
                        onChange(
                          Array.from(
                            new Set([...selectedAuthors, e.target.value])
                          )
                        );
                      }}
                      options={authors.map((author) => ({
                        key: author.id,
                        value: author.fullName,
                      }))}
                    />
                  );
                }}
              />
            )}
          </div>
        </div>
        {errors.authors && (
          <p className="prose-sm text-red">{errors.authors.message}</p>
        )}

        <div>
          <p
            title="Duplicates are removed. Authors are overwritten."
            className="underline decoration-wavy decoration-black my-2"
          >
            Selected Authors:
          </p>
          <div className="flex flex-row flex-wrap gap-2">
            {selectedAuthors.map((name) => (
              <AuthorChip
                key={name}
                authorName={name}
                onRemove={(author) => {
                  setSelectedAuthors((prev) =>
                    prev.filter((curr) => curr !== author)
                  );
                  selectorOnchangeRef.current?.(
                    selectedAuthors.filter((curr) => curr !== author)
                  );
                }}
              />
            ))}
          </div>
        </div>

        <div className="w-full flex items-center justify-between">
          <label className="block font-bold mb-2">Publication Year:*</label>
          {updating ? (
            <div className="skeleton w-[200px]" />
          ) : (
            <TextInput {...register("publicationYear")} />
          )}
          {errors.publicationYear && (
            <p className="prose-sm text-red">
              {errors.publicationYear.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={updating}>
          {updating ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
}
