import Link from "next/link";
import { useState } from "react";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from "next/types";
import type { IAuthor } from "@/interfaces";
import { fetchAuthors, deleteAuthor } from "@/fetchers";
import { Button } from "@/components/Button";
import toast, { Toaster } from "react-hot-toast";

export const getServerSideProps = (async () => {
  try {
    const authors = await fetchAuthors();
    return { props: { authors } };
  } catch (err) {
    console.error(err);
  }

  return { notFound: true };
}) satisfies GetServerSideProps<{ authors: IAuthor[] }>;

const LoadingAuthors = () => {
  return Array.from({ length: 10 }).map((_, idx) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: idc
    <tr key={idx} className="h-[65px]">
      <td>
        <div className="skeleton" />
      </td>
      <td>
        <div className="skeleton" />
      </td>
      <td>
        <div className="skeleton" />
      </td>
      <td className="w-[65px]">
        <div className="skeleton" />
      </td>
      <td className="w-[65px]">
        <div className="skeleton" />
      </td>
    </tr>
  ));
};

export default function AuthorsPage({
  authors,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [clientAuthors, setClientAuthors] = useState(authors);
  const [fetchingAuthors, setFetchingAuthors] = useState(false);
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 10,
    sortBy: "fullName",
    order: "asc",
  });

  const handleDeleteAuthor = async (authorId: string) => {
    setFetchingAuthors(true);
    try {
      const toastPromise = async () => {
        await deleteAuthor(authorId);
        const authors = await fetchAuthors();
        setClientAuthors(authors);
      };
      await toast.promise(toastPromise(), {
        loading: "Deleting author...",
        success: "Author deleted!",
        error: "Could not delete author, please try again.",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingAuthors(false);
    }
  };

  const handleChangePage = async (type: "prev" | "next") => {
    setFetchingAuthors(true);
    try {
      const page = type === "prev" ? queryParams.page - 1 : queryParams.page + 1;
      setQueryParams((prev) => ({ ...prev, page }));
      const newAuthors = await fetchAuthors({ page });
      setClientAuthors(newAuthors);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingAuthors(false);
    }
  };

  if (!authors) {
    return <div>Oops could not load authors...</div>;
  }

  return (
    <>
      <div className="w-full md:flex md:flex-row justify-between items-center">
        <h1 className="prose prose-2xl font-bold">Authors</h1>
        <Link href="authors/add" className="ml-2">
          <Button>+ Add New Author</Button>
        </Link>
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
          {fetchingAuthors ? (
            <LoadingAuthors />
          ) : (
            clientAuthors.map((author) => (
              <tr key={author.id}>
                <td>{author.id}</td>
                <td>{author.fullName}</td>
                <td>{author.numberOfBooks}</td>
                <td className="w-[65px]">
                  <Link href={`authors/edit/${author.id}`}>
                    <Button variant="info">Edit</Button>
                  </Link>
                </td>
                <td className="w-[65px]">
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteAuthor(author.id)}
                    type="button"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
        <tfoot>
          <tr>
            <td />
            <td />
            <td />
            <td className="w-[65px]">
              {queryParams.page !== 1 && (
                <Button
                  onClick={() => handleChangePage("prev")}
                  variant="ghost"
                >
                  Previous
                </Button>
              )}
            </td>
            <td className="w-[65px]">
              <Button onClick={() => handleChangePage("next")} variant="ghost">
                Next
              </Button>
            </td>
          </tr>
        </tfoot>
      </table>
      <Toaster />
    </>
  );
}
