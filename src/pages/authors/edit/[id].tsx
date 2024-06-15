import { useState } from "react";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import type { IAuthor } from "@/interfaces";
import { fetchAuthor, updateAuthor } from "@/fetchers";
import { Button } from "@/components/Button";
import { TextInput } from "@/components/TextInput";
import toast, { Toaster } from "react-hot-toast";

export const getServerSideProps = (async (context) => {
  try {
    const author = await fetchAuthor(context.query.id as string);
    return { props: { author } };
  } catch (err) {
    console.error(err);
  }

  return { notFound: true };
}) satisfies GetServerSideProps<{ author: IAuthor }>;

type TEditAuthorPageProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

const authorSchema = object()
  .shape({ fullName: string().required("Full Name is required") })
  .required();

export default function EditAuthorPage({ author }: TEditAuthorPageProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(authorSchema),
    defaultValues: {
      fullName: author?.fullName,
    },
  });
  const [clientAuthor, setClientAuthor] = useState(author);
  const [updating, setUpdating] = useState(false);

  if (!author) {
    return <div>Oops could not load that author</div>;
  }

  const onSubmit = async (data: Pick<IAuthor, "fullName">) => {
    setUpdating(true);
    try {
      const toastPromise = async () => {
        await updateAuthor(author.id, { fullName: data.fullName });
        const apiAuthor = await fetchAuthor(author.id);
        setClientAuthor(apiAuthor);
      };
      await toast.promise(toastPromise(), {
        loading: "Updating author...",
        success: "Author updated!",
        error: "Could not update author, please try again.",
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
          <h1 className="prose-2xl font-bold leading-3">
            {clientAuthor.fullName}
          </h1>
        )}
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label className="block font-bold mb-2">Full Name*:</label>
          <TextInput {...register("fullName")} />
          {errors.fullName && (
            <p className="prose-sm text-red">{errors.fullName.message}</p>
          )}
        </div>

        <Button variant="info" disabled={updating} type="submit">
          {updating ? "Submitting..." : "Submit"}
        </Button>
      </form>
      <Toaster />
    </div>
  );
}
