import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { array, number, object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import type { IAuthor, IBook } from "@/interfaces";
import { fetchAuthors, createBook } from "@/fetchers";
import { Chip } from "@/components/Chip";
import { Button } from "@/components/Button";
import { TextInput } from "@/components/TextInput";
import { SelectInput } from "@/components/SelectInput";

export const getServerSideProps = (async (context) => {
  const authors = await fetchAuthors();
  return { props: { authors } };
}) satisfies GetServerSideProps<{ authors: IAuthor[] }>;

const authorSchema = object()
  .shape({
    title: string().required("Title is required"),
    authors: array().of(string().required()).required(),
    publicationYear: number().integer().positive().required(),
  })
  .required();

type TAddBookPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const AuthorChip = ({
  authorName,
  onRemove,
}: {
  authorName: string;
  onRemove: (authorName: string) => void;
}) => {
  return <Chip title={authorName} onRemove={onRemove} />;
};

export default function AddBookPage({ authors }: TAddBookPageProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(authorSchema),
  });
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  // cheat to update on change without controller
  // biome-ignore lint/suspicious/noExplicitAny: bc im lazy
  const selectorOnchangeRef = useRef<(...event: any[]) => void>();

  const onSubmit = async (data: Partial<IBook>) => {
    await createBook(data);
    reset();
  };

  return (
    <div>
      <h1 className="prose-2xl font-bold leading-3 mb-5">Add New Book</h1>
      <form
        className="flex flex-col gap-3 w-[500px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-full flex items-center justify-between">
          <label className="font-bold mr-2">Title:*</label>
          <TextInput {...register("title")} />
        </div>
        {errors.title && (
          <p className="prose-sm text-red">{errors.title.message}</p>
        )}

        <div className="w-full flex items-center justify-between">
          <label className="font-bold">Authors: </label>
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
                      Array.from(new Set([...selectedAuthors, e.target.value]))
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
        </div>

        <p
          title="Duplicates are removed"
          className="cursor-pointer decoration-wavy decoration-1 underline"
        >
          Selected Authors:
        </p>

        <div className="flex gap-2 flex-wrap">
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

        {errors.authors && (
          <p className="prose-sm text-red">{errors.authors.message}</p>
        )}

        <div className="w-full flex items-center justify-between">
          <label className="block font-bold">Publication Year:*</label>
          <TextInput {...register("publicationYear")} />
        </div>
        {errors.publicationYear && (
          <p className="prose-sm text-red">{errors.publicationYear.message}</p>
        )}

        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
