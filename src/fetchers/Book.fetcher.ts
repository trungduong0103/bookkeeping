import type { IBook } from "@/interfaces";
const BASE_URL = "https://666bb50349dbc5d7145af2d5.mockapi.io/api/books";

export const createBook = async (book: IBook): Promise<void> => {
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

export const fetchBooks = async ({
  page = 1,
  limit = 10,
  sortBy,
  order,
}: {
  page?: number;
  limit?: number;
  sortBy?: keyof IBook;
  order?: "asc" | "desc";
}): Promise<IBook[]> => {
  try {
    const url = new URL(BASE_URL);
    url.searchParams.append("page", `${page}`);
    url.searchParams.append("limit", `${limit}`);
    sortBy && url.searchParams.append("sortBy", sortBy);
    order && url.searchParams.append("order", order);

    const response = await fetch(url);
    if (!response.ok) {
      return Promise.reject(response);
    }
    return await response.json();
  } catch (err) {
    console.error(err);
    throw new Error("Error. Could not fetch Books.");
  }
};

type TFetchBookDTO = {
  data: IBook;
};

export const fetchBook = async (bookId: string): Promise<IBook> => {
  try {
    const response = await fetch(`${BASE_URL}/${bookId}`);
    if (!response.ok) {
      return Promise.reject(response);
    }
    console.log(response);

    return await response.json();
  } catch (err) {
    console.error(err);
    throw new Error("Error. Could not fetch Book.");
  }
};

type TUpdateBookDTO = TFetchBookDTO;

export const updateBook = async (bookId: string, data: Partial<IBook>) => {
  try {
    const response = await fetch(`${BASE_URL}/${bookId}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
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
    const response = await fetch(`${BASE_URL}/${bookId}`, {
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
