import Link from "next/link";
import { useState } from "react";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from "next/types";
import type { Author } from "@/interfaces";
import { fetchAuthors, deleteAuthor } from "@/fetchers";
import { Button } from "@/components/Button";
import { TextInput } from "../../components/TextInput/TextInput";

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
      <div className="flex flex-row justify-between items-center">
        <h1 className="prose prose-2xl font-bold">Authors</h1>
        <div>
          <TextInput placeholder="Search for an author" />
          <Link href="authors/add" className="ml-2">
            <Button>+ Add New Author</Button>
          </Link>
        </div>
      </div>
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
                <Link href={`authors/${author.id}`}>
                  <Button variant="info">Edit</Button>
                </Link>
              </td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleClick(author.id)}
                  type="button"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
