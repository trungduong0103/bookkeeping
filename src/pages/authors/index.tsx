import Link from "next/link";
import { useState } from "react";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from "next/types";
import type { Author } from "@/interfaces";
import { fetchAuthors, deleteAuthor } from "@/fetchers";

export const getServerSideProps = (async () => {
  const authors = await fetchAuthors();

  return { props: { authors } };
}) satisfies GetServerSideProps<{ authors: Author[] }>;

export default function AuthorsPage({
  authors,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [clientAuthors, setClientAuthors] = useState(authors);

  if (!authors) {
    return <div>Oops could not load authors...</div>;
  }

  const handleClick = async (authorId: string) => {
    await deleteAuthor(authorId);
    const authors = await fetchAuthors();
    setClientAuthors(authors);
  };

  return (
    <>
      <h1 className="prose prose-2xl">Authors</h1>
      <button type="button">
        <Link href={"authors/add"}>Add</Link>
      </button>
      <table>
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Full Name</th>
            <th scope="col">Number Of Books</th>
            <th scope="col" />
            <th scope="col" />
          </tr>
        </thead>
        <tbody>
          {clientAuthors.map((author) => (
            <tr key={author.id}>
              <td>{author.id}</td>
              <td>{author.fullName}</td>
              <td>{author.numberOfBooks}</td>
              <td>
                <Link href={`authors/${author.id}`}>Edit</Link>
              </td>
              <td>
                <button onClick={() => handleClick(author.id)} type="button">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
