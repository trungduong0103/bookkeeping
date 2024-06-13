import { useState } from "react";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import type { Author } from "@/interfaces";
import { fetchAuthor, updateAuthor } from "@/fetchers";
import { TextInput } from "@/components/TextInput";

export const getServerSideProps = (async (context) => {
  const author = await fetchAuthor(context.query.id as string);

  return { props: { author } };
}) satisfies GetServerSideProps<{ author: Author }>;

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

  if (!author) {
    return <div>Oops could not load that author</div>;
  }

  const onSubmit = async (data: Pick<Author, "fullName">) => {
    await updateAuthor(author.id, { fullName: data.fullName });
    const apiAuthor = await fetchAuthor(author.id);
    setClientAuthor(apiAuthor);
  };

  return (
    <div>
      <h1 className="prose-2xl font-bold leading-3 mb-5">
        Edit author: {clientAuthor.fullName}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Full Name*</label>
        <br />
        <TextInput {...register("fullName")} />
        {errors.fullName && (
          <p className="prose-sm text-red">{errors.fullName.message}</p>
        )}
      </form>
    </div>
  );
}
