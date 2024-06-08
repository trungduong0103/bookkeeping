import type { Book } from "./Book.interface";

interface Author {
  id: string;
  fullName: string;
  numberOfBooks: number;
  books: Book[];
}

export type { Author };
