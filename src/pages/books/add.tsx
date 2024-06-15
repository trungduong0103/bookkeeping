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
import toast, { Toaster } from "react-hot-toast";

export const getServerSideProps = (async () => {
  const authors = await fetchAuthors({ noLimit: true });
  return { props: { authors } };
}) satisfies GetServerSideProps<{ authors: IAuthor[] }>;

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
  const [selectedAuthors, setSelectedAuthors] = useState<
    Pick<IAuthor, "id" | "fullName">[]
  >([]);
  const [creating, setCreating] = useState(false);
  // cheat to update on change without controller
  // biome-ignore lint/suspicious/noExplicitAny: bc im lazy
  const selectorOnchangeRef = useRef<(...event: any[]) => void>();

  const onSubmit = async (data: Pick<IBook, "title" | "publicationYear"> & { authors: { id: string, fullName: string}[] }) => {
    setCreating(true);
    try {
      const toastPromise = async () => {
        await createBook(data);
        setSelectedAuthors([]);
        reset();
      };
      await toast.promise(toastPromise(), {
        loading: "Creating book...",
        success: "Book created!",
        error: "Could not create book, please try again.",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
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
          {creating ? (
            <div className="skeleton w-[200px]" />
          ) : (
            <TextInput className="w-[250px]" {...register("title")} />
          )}
        </div>
        {errors.title && (
          <p className="prose-sm text-red">{errors.title.message}</p>
        )}

        <div className="w-full flex items-center justify-between">
          <label className="font-bold">Authors: </label>
          {creating ? (
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
                      setSelectedAuthors((prev) => [...prev, selectedAuthor]);
                      onChange([...selectedAuthors, selectedAuthor]);
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

        <p
          title="Duplicates are removed"
          className="cursor-pointer decoration-wavy decoration-1 underline"
        >
          Selected Authors:
        </p>

        <div className="flex gap-2 flex-wrap">
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
        {errors.authors && (
          <p className="prose-sm text-red">{errors.authors.message}</p>
        )}

        <div className="w-full flex items-center justify-between">
          <label className="block font-bold">Publication Year:*</label>
          {creating ? (
            <div className="skeleton w-[200px]" />
          ) : (
            <TextInput className="w-[250px]" {...register("publicationYear")} />
          )}
        </div>
        {errors.publicationYear && (
          <p className="prose-sm text-red">{errors.publicationYear.message}</p>
        )}

        <Button type="submit">{creating ? "Creating..." : "Submit"}</Button>
      </form>
      <Toaster />
    </div>
  );
}
