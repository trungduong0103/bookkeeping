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
  const book = await fetchBook(context.query.bookId as string);
  const authors = await fetchAuthors();

  if (!book) {
    return {
      notFound: true,
    };
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
  return <Chip title={authorName} onRemove={onRemove} />;
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

  const onSubmit = async (data: Partial<IBook>) => {
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
          <p className="mt-2">Selected Authors (Duplicates are removed): </p>
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
