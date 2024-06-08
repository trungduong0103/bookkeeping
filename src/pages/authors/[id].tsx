import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useParams } from "next/navigation";
import type { Author } from "@/interfaces";
import { fetchAuthor } from "@/fetchers";

export const getServerSideProps = (async (context) => {
  const author = await fetchAuthor(context.query.id as string);

  return { props: { author } };
}) satisfies GetServerSideProps<{ author: Author }>;

export default function AuthorPage({
  author,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const params = useParams<{ id: string }>();
  if (!author) {
    return <div>Oops could not load that author</div>;
  }

  return (
    <div>
      Author edit page of {params?.id}, full name: {author.fullName}
    </div>
  );
}
