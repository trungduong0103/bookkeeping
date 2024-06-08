import crypto from "node:crypto";
import type { Author, Book } from "@/interfaces";

const authorNames = [
  "Ava Harper",
  "Liam Bennett",
  "Olivia Mason",
  "Ethan Clarke",
  "Emma Brooks",
  "Noah Foster",
  "Sophia Reed",
  "Lucas Hayes",
  "Mia Dawson",
  "Mason Gray",
  "Amelia Scott",
  "James Parker",
  "Isabella White",
  "Alexander Moore",
  "Charlotte Walker",
];

const mockAuthors = authorNames.reduce<[string, Author][]>((acc, name) => {
  const author = {
    id: crypto.randomUUID(),
    fullName: name,
    numberOfBooks: 0,
    books: [],
  };
  acc.push([author.id, author]);
  return acc;
}, []);

const BOOKKEEPER_DATA = {
  books: new Map<string, Book>(),
  authors: new Map<string, Author>(mockAuthors),
};

export { BOOKKEEPER_DATA };
