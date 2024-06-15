import type { IAuthor } from "@/interfaces";
const BASE_URL = "https://666bb50349dbc5d7145af2d5.mockapi.io/api/authors";

export const createAuthor = async (fullName: string): Promise<void> => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
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

type TFetchParams = {
  page?: number;
  limit?: number;
  sortBy?: keyof IAuthor;
  order?: "asc" | "desc";
  searchQuery?: string;
  noLimit?: boolean;
};

export const fetchAuthors = async ({
  page = 1,
  limit = 10,
  sortBy = "fullName",
  order = "asc",
  searchQuery = "",
  noLimit = false,
}: TFetchParams = {}): Promise<IAuthor[]> => {
  try {
    const url = new URL(BASE_URL);
    // biome-ignore lint/suspicious/noImplicitAnyLet: idc
    let response;

    if (noLimit) {
      response = await fetch(url);
    } else {
      url.searchParams.append("page", `${page}`);
      url.searchParams.append("limit", `${limit}`);
      sortBy && url.searchParams.append("sortBy", sortBy);
      order && url.searchParams.append("order", order);
      searchQuery && url.searchParams.append("fullName", searchQuery);
      response = await fetch(url);
    }

    if (!response.ok) {
      return Promise.reject(response);
    }

    return await response.json();
  } catch (err) {
    console.error(err);
    throw new Error("Error. Could not fetch Authors.");
  }
};

export const fetchAuthor = async (authorId: string): Promise<IAuthor> => {
  try {
    const response = await fetch(`${BASE_URL}/${authorId}`);
    if (!response.ok) {
      return Promise.reject(response);
    }
    return await response.json();
  } catch (err) {
    console.error(err);
    throw new Error("Error. Could not fetch Author.");
  }
};

export const updateAuthor = async (
  authorId: string,
  data: Partial<IAuthor>
) => {
  try {
    const response = await fetch(`${BASE_URL}/${authorId}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      return Promise.reject(response);
    }
    return;
  } catch (err) {
    console.error(err);
    throw new Error("Error. Could not update Author.");
  }
};

export const deleteAuthor = async (authorId: string): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/${authorId}`, {
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
