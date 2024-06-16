import { useState } from "react";
import type { IBook } from "@/interfaces";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { deleteBook, fetchBooks } from "@/fetchers/Book.fetcher";
import { Button } from "@/components/Button";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export const getServerSideProps = (async () => {
  try {
    const books = await fetchBooks({ sortBy: "title", order: "asc" });
    return { props: { books: books } };
  } catch (err) {
    console.error(err);
  }

  return { notFound: true };
}) satisfies GetServerSideProps<{ books: IBook[] }>;

const LoadingBooks = () => {
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

export default function BooksPage({
  books,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [clientBooks, setClientBooks] = useState(books);
  const [fetchingBooks, setFetchingBooks] = useState(false);
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 10,
    sortBy: "title",
    order: "asc",
  });

  const handleDeleteBook = async (bookId: string) => {
    setFetchingBooks(true);
    try {
      const toastPromise = async () => {
        await deleteBook(bookId);
        // @ts-ignore
        const newBooks = await fetchBooks({ ...queryParams });
        setClientBooks(newBooks);
      };
      await toast.promise(toastPromise(), {
        loading: "Deleting book...",
        success: "Book deleted!",
        error: "Could not delete book, please try again.",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingBooks(false);
    }
  };

  const handleChangePage = async (type: "prev" | "next") => {
    setFetchingBooks(true);
    try {
      const page =
        type === "prev" ? queryParams.page - 1 : queryParams.page + 1;
      setQueryParams((prev) => ({ ...prev, page }));
      const newBooks = await fetchBooks({ page });
      setClientBooks(newBooks);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingBooks(false);
    }
  };

  if (!clientBooks || !clientBooks.length) {
    return (
      <div>
        There aren&apos;t any books yet.{" "}
        <Link className="underline" href="books/add">
          Add a new book
        </Link>{" "}
        to see it here.
      </div>
    );
  }

  return (
    <>
      <div className="w-full md:flex md:flex-row justify-between items-center">
        <h1 className="prose prose-2xl font-bold">Books</h1>
        <Link href="books/add/" className="ml-2">
          <Button>Add New Book</Button>
        </Link>
      </div>
      <table className="table-fixed">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Title</th>
            <th scope="col">Authors</th>
            <th scope="col">Publication Year</th>
            <th scope="col" />
            <th scope="col" />
          </tr>
        </thead>
        <tbody>
          {fetchingBooks ? (
            <LoadingBooks />
          ) : (
            clientBooks.map((book) => (
              <tr key={book.id} className="h-[65px]">
                <td>{book.id}</td>
                <td title={book.title} className="capitalize overflow-hidden">
                  {book.title}
                </td>
                <td className="overflow-hidden">{book.authors.join(", ")}</td>
                <td>{book.publicationYear}</td>
                <td className="w-[65px]">
                  <Link href={`books/edit/${book.id}`}>
                    <Button variant="info">Edit</Button>
                  </Link>
                </td>
                <td className="w-[65px]">
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteBook(book.id)}
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
