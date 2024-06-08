import type { Author } from "./Author.interface";

interface Book {
  id: string;
  title: string;
  authors: Author[];
  publicationYear: number;
}

export type { Book };
