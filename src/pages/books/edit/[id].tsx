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
import toast, { Toaster } from "react-hot-toast";

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
    title: string().required("Title is required."),
    authors: array()
      .of(
        object().shape({
          id: number().required(),
          fullName: string().required(),
        })
      )
      .required()
      .required("At least an author is required."),
    publicationYear: number()
      .integer()
      .positive()
      .required("Publication Year is required."),
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
  const [selectedAuthors, setSelectedAuthors] = useState<
    Pick<IAuthor, "id" | "fullName">[]
  >([]);
  const [updating, setUpdating] = useState(false);
  // cheat to update on change without controller
  // biome-ignore lint/suspicious/noExplicitAny: bc im lazy
  const selectorOnchangeRef = useRef<(...event: any[]) => void>();

  const onSubmit = async (data: Partial<IBook>) => {
    setUpdating(true);
    try {
      const toastPromise = async () => {
        await updateBook(book.id, { ...data, authors: selectedAuthors });
        const apiBook = await fetchBook(book.id);
        setSelectedAuthors([]);
        setClientBook(apiBook);
      };
      await toast.promise(toastPromise(), {
        loading: "Updating book...",
        success: "Book updated!",
        error: "Could not update book, please try again.",
      });
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
                      className="w-[250px]"
                      {...others}
                      onChange={(e) => {
                        const selectedIdx = e.target.value as unknown as number;
                        const selectedAuthor = {
                          id: authors[selectedIdx].id,
                          fullName: authors[selectedIdx].fullName,
                        };
                        setSelectedAuthors((prev) =>
                          [...prev, selectedAuthor].filter(
                            (obj1, i, arr2) =>
                              arr2.findIndex(
                                (obj2) => obj2.fullName === obj1.fullName
                              ) === i
                          )
                        );
                        onChange(
                          [...selectedAuthors, selectedAuthor].filter(
                            (obj1, i, arr2) =>
                              arr2.findIndex(
                                (obj2) => obj2.fullName === obj1.fullName
                              ) === i
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
            {selectedAuthors.map((author) => (
              <AuthorChip
                key={author.id}
                authorName={author.fullName}
                onRemove={(author) => {
                  setSelectedAuthors((prev) =>
                    prev.filter((curr) => curr.fullName !== author)
                  );
                  selectorOnchangeRef.current?.(
                    selectedAuthors.filter((curr) => curr.fullName !== author)
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
            <TextInput className="w-[250px]" {...register("publicationYear")} />
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
      <Toaster />
    </div>
  );
}
