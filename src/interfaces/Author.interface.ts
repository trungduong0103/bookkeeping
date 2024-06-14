import type { IBook } from "./Book.interface";

interface IAuthor {
  id: string;
  fullName: string;
  numberOfBooks: number;
  books: IBook[];
}

export type { IAuthor };
