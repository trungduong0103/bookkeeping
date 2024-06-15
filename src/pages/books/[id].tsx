import { useState } from "react";
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
  const authors = await fetchAuthors();
  if (context.resolvedUrl.includes("/add")) {
    return { props: { book: {} as IBook, authors } };
  }

  const book = await fetchBook(context.query.id as string);
  if (context.resolvedUrl.includes("/edit")) {
    return { props: { book, authors } };
  }

  return { props: { book, authors } };
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
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block font-bold mb-2">Title:*</label>
          {updating ? (
            <div className="skeleton w-[200px]" />
          ) : (
            <TextInput {...register("title")} />
          )}
          {errors.title && (
            <p className="prose-sm text-red">{errors.title.message}</p>
          )}
        </div>

        <div>
          <div className="mb-2">
            <label className="font-bold">Authors: </label>
            <span>{clientBook.authors.join(", ")}</span>
          </div>

          {updating ? (
            <div className="skeleton w-[200px]" />
          ) : (
            <Controller
              control={control}
              name="authors"
              render={({ field: { onChange, ...others } }) => (
                <SelectInput
                  {...others}
                  onChange={(e) => {
                    setSelectedAuthors((prev) =>
                      Array.from(new Set([...prev, e.target.value]))
                    );
                    onChange(
                      Array.from(new Set([...selectedAuthors, e.target.value]))
                    );
                  }}
                  options={authors.map((author) => ({
                    key: author.id,
                    value: author.fullName,
                  }))}
                />
              )}
            />
          )}
          <p
            title="Duplicates are removed. Authors are overwritten"
            className="underline decoration-wavy decoration-black my-2"
          >
            Selected Authors:
          </p>
          <div className="flex flex-row flex-wrap gap-2">
            {selectedAuthors.map((name) => (
              <AuthorChip
                key={name}
                authorName={name}
                onRemove={(author) =>
                  setSelectedAuthors((prev) =>
                    prev.filter((curr) => curr !== author)
                  )
                }
              />
            ))}
          </div>
          {errors.authors && (
            <p className="prose-sm text-red">{errors.authors.message}</p>
          )}
        </div>

        <div>
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

        <Button variant="info" disabled={updating} type="submit">
          {updating ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
}
