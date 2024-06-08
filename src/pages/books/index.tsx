import type { InferGetServerSidePropsType } from "next";

export const getServerSideProps = async () => {
  const response = await fetch("http://localhost:3000/api/books");
  const json = await response.json();

  return { props: { books: json.data } };
};

export default function BooksPage({
  books,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <div>Hello World!</div>;
}
