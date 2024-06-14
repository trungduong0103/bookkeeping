import type { Book, IBookKeeperData } from "@/interfaces";
import { generateId } from "../utils";

export class BookKeeperData {
  #data: IBookKeeperData;

  constructor(data: IBookKeeperData) {
    console.log("init...");

    this.#data = data;
  }

  getBooks(): Book[];
  getBooks(id: string): Book | null;
  getBooks(id?: string) {
    if (!id) return Array.from(this.#data.books.values());
    return this.#data.books.get(id) ?? null;
  }

  createBook(book: Omit<Book, "id">) {
    const newId = generateId();
    this.#data.books.set(newId, {
      id: newId,
      ...book,
    });
  }

  updateBook(book: Book) {
    this.#data.books.set(book.id, { ...book });
  }

  deleteBook(bookId: string) {
    this.#data.books.delete(bookId);
  }
}

let bookKeeper: BookKeeperData;

export const init = (data: IBookKeeperData) => {
  if (bookKeeper) return;
  bookKeeper = new BookKeeperData(data);
  return bookKeeper;
};

export { bookKeeper };
