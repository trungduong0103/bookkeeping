import { useState } from "react";
import type { Book } from "@/interfaces";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { deleteBook, fetchBooks } from "@/fetchers/Book.fetcher";
import { TextInput } from "@/components/TextInput";
import { Button } from "@/components/Button";
import Link from "next/link";

export const getServerSideProps = (async () => {
  const books = await fetchBooks();

  return { props: { books: books } };
}) satisfies GetServerSideProps<{ books: Book[] }>;

export default function BooksPage({
  books,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [clientBooks, setClientBooks] = useState(books);
  if (!books) {
    return <div>Ooops could not load books...</div>;
  }

  const handleDeleteBook = async (bookId: string) => {
    await deleteBook(bookId);
    const apiBooks = await fetchBooks();
    setClientBooks(apiBooks);
  };

  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <h1 className="prose prose-2xl font-bold">Books</h1>
        <div>
          <TextInput placeholder="Search for a book" />
          <Link href="books/add" className="ml-2">
            <Button>+ Add New Book</Button>
          </Link>
        </div>
      </div>
      <table>
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
          {clientBooks.map((book) => (
            <tr key={book.id}>
              <td>{book.id}</td>
              <td>{book.title}</td>
              <td>{book.authors.join(", ")}</td>
              <td>{book.publicationYear}</td>
              <td>
                <Link href={`books/${book.id}`}>
                  <Button variant="info">Edit</Button>
                </Link>
              </td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteBook(book.id)}
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
