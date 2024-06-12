import type { Book } from "@/interfaces";
const BASE_URL = "http://localhost:3000/api/books";

type TFetchBooksDTO = {
  data: Book[];
};

export const createBook = async (book: Book): Promise<void> => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      body: JSON.stringify({ ...book }),
    });
    if (!response.ok) {
      return Promise.reject(response);
    }
    return;
  } catch (err) {
    console.error(err);
    throw new Error("Error. Could not add Book.");
  }
};

export const fetchBooks = async (): Promise<Book[]> => {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      return Promise.reject(response);
    }
    const jsonResponse = (await response.json()) as TFetchBooksDTO;
    return jsonResponse.data;
  } catch (err) {
    console.error(err);
    throw new Error("Error. Could not fetch Books.");
  }
};

type TFetchBookDTO = {
  data: Book;
};

export const fetchBook = async (bookId: string): Promise<Book> => {
  try {
    const response = await fetch(`${BASE_URL}?id=${bookId}`);
    if (!response.ok) {
      return Promise.reject(response);
    }
    const jsonResponse = (await response.json()) as TFetchBookDTO;
    return jsonResponse.data;
  } catch (err) {
    console.error(err);
    throw new Error("Error. Could not fetch Book.");
  }
};

type TUpdateBookDTO = TFetchBookDTO;

export const updateBook = async (authorId: string, data: Partial<Book>) => {
  try {
    const response = await fetch(`${BASE_URL}?id=${authorId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      return Promise.reject(response);
    }
    const jsonResponse = (await response.json()) as TUpdateBookDTO;
    return jsonResponse.data;
  } catch (err) {
    console.error(err);
    throw new Error("Error. Could not update Book.");
  }
};

export const deleteBook = async (bookId: string): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}?id=${bookId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      return Promise.reject(response);
    }
    return;
  } catch (err) {
    console.error(err);
    throw new Error("Error. Could not delete Book.");
  }
};
