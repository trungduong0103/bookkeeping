import type { Author } from "@/interfaces";
const BASE_URL = "http://localhost:3000/api/authors";

type TFetchAuthorsDTO = {
  data: Author[];
};

type TFetchAuthorDTO = {
  data: Author;
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

export const fetchAuthor = async (authorId: string): Promise<Author> => {
  try {
    const response = await fetch(`${BASE_URL}/${authorId}`);
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
