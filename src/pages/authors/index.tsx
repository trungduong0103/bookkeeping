import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from "next/types";
import type { Author } from "@/interfaces";
import { fetchAuthors } from "@/fetchers";
import Link from "next/link";

export const getServerSideProps = (async () => {
  const authors = await fetchAuthors();

  return { props: { authors } };
}) satisfies GetServerSideProps<{ authors: Author[] }>;

export default function AuthorsPage({
  authors,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!authors) {
    return <div>Oops could not load authors...</div>;
  }

  return (
    <>
      <h1 className="prose prose-2xl">Authors</h1>
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
          {authors.map((author) => (
            <tr key={author.id}>
              <td>{author.id}</td>
              <td>{author.fullName}</td>
              <td>{author.numberOfBooks}</td>
              <td>
                <Link href={`authors/${author.id}`}>Edit</Link>
              </td>
              <td>Delete</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
