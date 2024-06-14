import type { Author } from "./Author.interface";
import type { Book } from "./Book.interface";

export interface IBookKeeperData {
  books: Map<string, Book>;
  authors: Map<string, Author>;
}
