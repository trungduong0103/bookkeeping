import type { NextApiRequest, NextApiResponse } from "next";
import { BOOKKEEPER_DATA } from "@/mock/data";
import type { Book } from "@/interfaces";

const booksData = BOOKKEEPER_DATA.books;

function getBooks(): Book[];
function getBooks(id: string): Book | null;
function getBooks(id?: string) {
  if (!id) return Array.from(booksData.values());
  return booksData.get(id) ?? null;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const newId = crypto.randomUUID();
    booksData.set(newId, {
      id: newId,
      ...JSON.parse(req.body),
    } as Book);
    return res
      .status(200)
      .send(
        JSON.stringify({ message: "Book added", data: Array.from(booksData) })
      );
  }

  const bookId = req.query.id as string;

  if (req.method === "GET") {
    if (!bookId) {
      const books = getBooks();
      return res.status(200).send(
        JSON.stringify({
          message: "Get books success",
          data: books,
        })
      );
    }
    const book = getBooks(bookId);
    return res.status(200).send(
      JSON.stringify({
        message: book ? "Get book success" : "Book is not found",
        data: book,
      })
    );
  }

  if (req.method === "PATCH") {
    const book = getBooks(bookId);
    if (!book) {
      return res
        .status(200)
        .send(JSON.stringify({ message: "Book is not found" }));
    }

    booksData.set(bookId, { ...book, ...JSON.parse(req.body) });
    return res.status(200).send(JSON.stringify({ message: "Author updated" }));
  }
  if (req.method === "DELETE") {
    const book = getBooks(bookId);

    if (!book) {
      return res
        .status(200)
        .send(JSON.stringify({ message: "Book is not found" }));
    }

    booksData.delete(req.body.id);
    return res.status(200).send(JSON.stringify({ message: "Book deleted" }));
  }
}
