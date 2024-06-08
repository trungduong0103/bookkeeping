import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "next/navigation";
import type { Author } from "@/interfaces";
import { fetchAuthor } from "@/fetchers";

export const getServerSideProps = (async (context) => {
  const author = await fetchAuthor(context.query.id as string);

  return { props: { author } };
}) satisfies GetServerSideProps<{ author: Author }>;

const authorSchema = object()
  .shape({
    fullName: string().min(5).required(),
    what: string().required(),
  })
  .required();

export default function AuthorPage({
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

  if (!author) {
    return <div>Oops could not load that author</div>;
  }

  const onSubmit = (data: unknown) => {
    console.log("submitted");

    console.log(data);
  };

  return (
    <div>
      Author edit page of {params?.id}, full name: {author.fullName}
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Full Name</label>
        <br />
        <input {...register("fullName")} />
        {errors.fullName && <div>Field is required</div>}
      </form>
    </div>
  );
}
