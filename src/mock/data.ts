import type { Author, Book } from "@/interfaces";
import { generateId } from "@/pages/api/utils";

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
    id: generateId(),
    fullName: name,
    numberOfBooks: 0,
    books: [],
  };
  acc.push([author.id, author]);
  return acc;
}, []);

const books = [
  {
    title: "The Quantum Realm",
    authors: [],
    publicationYear: 2021,
  },
  {
    title: "Artificial Intelligence and Society",
    authors: [],
    publicationYear: 2020,
  },
  {
    title: "Climate Change and Its Impact",
    authors: [],
    publicationYear: 2019,
  },
  {
    title: "The Future of Renewable Energy",
    authors: [],
    publicationYear: 2022,
  },
  {
    title: "Advances in Biotechnology",
    authors: [],
    publicationYear: 2018,
  },
  {
    title: "Space Exploration: Past, Present, and Future",
    authors: [],
    publicationYear: 2023,
  },
  {
    title: "The Evolution of the Internet",
    authors: [],
    publicationYear: 2021,
  },
  {
    title: "Cybersecurity in the Modern World",
    authors: [],
    publicationYear: 2022,
  },
  {
    title: "Nanotechnology Innovations",
    authors: [],
    publicationYear: 2017,
  },
  {
    title: "Medical Breakthroughs of the 21st Century",
    authors: [],
    publicationYear: 2019,
  },
];

const mockBooks = books.reduce<[string, Book][]>((acc, book) => {
  const bookWithId = {
    id: generateId(),
    ...book,
  } as Book;
  acc.push([bookWithId.id, bookWithId]);
  return acc;
}, []);

const BOOKKEEPER_DATA = {
  books: new Map<string, Book>(mockBooks),
  authors: new Map<string, Author>(mockAuthors),
};

export { BOOKKEEPER_DATA };
