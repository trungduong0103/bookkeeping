import type { Author } from "./Author.interface";

interface Book {
  id: string;
  title: string;
  authors: string[];
  publicationYear: number;
}

export type { Book };
