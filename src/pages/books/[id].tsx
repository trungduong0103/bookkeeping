import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { array, number, object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import type { Author, Book } from "@/interfaces";
import { fetchAuthors, fetchBook, updateBook } from "@/fetchers";
import { Button } from "@/components/Button";
import { TextInput } from "@/components/TextInput";
import { SelectInput } from "@/components/SelectInput";

export const getServerSideProps = (async (context) => {
  const book = await fetchBook(context.query.id as string);
  const authors = await fetchAuthors();

  if (!book) {
    return {
      notFound: true,
    };
  }

  return { props: { book, authors } };
}) satisfies GetServerSideProps<{ book: Book; authors: Author[] }>;

const authorSchema = object()
  .shape({
    title: string().required("Title is required"),
    authors: array().of(string().required()).required(),
    publicationYear: number().integer().positive().required(),
  })
  .required();

type TEditAuthorPageProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

const AuthorChip = ({
  authorName,
  onRemove,
}: {
  authorName: string;
  onRemove: (authorName: string) => void;
}) => {
  return (
    <div className="prose text-sm flex gap-2 items-center border-solid border-grey border-[2px] py-1 px-5 rounded-2xl">
      <span>{authorName}</span>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: whatevs */}
      <span
        onClick={() => onRemove(authorName)}
        className="text-[10px] cursor-pointer"
      >
        X
      </span>
    </div>
  );
};

export default function EditAuthorPage({
  book,
  authors,
}: TEditAuthorPageProps) {
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

  const onSubmit = async (data: Partial<Book>) => {
    await updateBook(book.id, { ...data, authors: selectedAuthors });
    const apiBook = await fetchBook(book.id);
    setClientBook(apiBook);
  };

  return (
    <div>
      <h1 className="prose-2xl font-bold leading-3 mb-5">
        Edit book: {clientBook.title}
      </h1>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block font-bold">Title:*</label>
          <TextInput {...register("title")} />
          {errors.title && (
            <p className="prose-sm text-red">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="font-bold">Authors: </label>
          <span>{clientBook.authors.join(", ")}</span>
          <br />
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
          <p>Selected Authors: </p>
          <div className="flex flex-row gap-2">
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
          <label className="block font-bold">Publication Year:*</label>
          <TextInput {...register("publicationYear")} />
          {errors.publicationYear && (
            <p className="prose-sm text-red">
              {errors.publicationYear.message}
            </p>
          )}
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
