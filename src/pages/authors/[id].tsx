import { useState } from "react";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "next/navigation";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import type { Author } from "@/interfaces";
import { fetchAuthor, updateAuthor } from "@/fetchers";

export const getServerSideProps = (async (context) => {
  const author = await fetchAuthor(context.query.id as string);

  return { props: { author } };
}) satisfies GetServerSideProps<{ author: Author }>;

const authorSchema = object()
  .shape({ fullName: string().required() })
  .required();

export default function EditAuthorPage({
  author,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const params = useParams<{ id: string }>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(authorSchema),
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
      Author edit page of {params?.id}, full name: {clientAuthor.fullName}
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Full Name</label>
        <br />
        <input {...register("fullName")} />
        {errors.fullName && <div>{errors.fullName.message}</div>}
      </form>
    </div>
  );
}
