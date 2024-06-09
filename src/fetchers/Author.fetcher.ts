import type { Author } from "@/interfaces";
const BASE_URL = "http://localhost:3000/api/authors";

type TFetchAuthorsDTO = {
  data: Author[];
};

export const createAuthor = async (fullName: string): Promise<void> => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      body: JSON.stringify({ fullName }),
    });
    if (!response.ok) {
      return Promise.reject(response);
    }
    return;
  } catch (err) {
    console.error(err);
    throw new Error("Error. Could not add Author.");
  }
};

export const fetchAuthors = async (): Promise<Author[]> => {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      return Promise.reject(response);
    }
    const jsonResponse = (await response.json()) as TFetchAuthorsDTO;
    return jsonResponse.data;
  } catch (err) {
    console.error(err);
    throw new Error("Error. Could not fetch Authors.");
  }
};

type TFetchAuthorDTO = {
  data: Author;
};

export const fetchAuthor = async (authorId: string): Promise<Author> => {
  try {
    const response = await fetch(`${BASE_URL}?id=${authorId}`);
    if (!response.ok) {
      return Promise.reject(response);
    }
    const jsonResponse = (await response.json()) as TFetchAuthorDTO;
    return jsonResponse.data;
  } catch (err) {
    console.error(err);
    throw new Error("Error. Could not fetch Author.");
  }
};

type TUpdateAuthorDTO = TFetchAuthorDTO;

export const updateAuthor = async (authorId: string, data: Partial<Author>) => {
  try {
    const response = await fetch(`${BASE_URL}?id=${authorId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      return Promise.reject(response);
    }
    const jsonResponse = (await response.json()) as TUpdateAuthorDTO;
    return jsonResponse.data;
  } catch (err) {
    console.error(err);
    throw new Error("Error. Could not update Author.");
  }
};

export const deleteAuthor = async (authorId: string): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}?id=${authorId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      return Promise.reject(response);
    }
    return;
  } catch (err) {
    console.error(err);
    throw new Error("Error. Could not delete Author.");
  }
};
