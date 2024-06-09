import type { NextApiRequest, NextApiResponse } from "next";
import type { Author } from "@/interfaces";
import { BOOKKEEPER_DATA } from "@/mock/data";

const authorsData = BOOKKEEPER_DATA.authors;

function getAuthors(): Author[];
function getAuthors(id: string): Author | null;
function getAuthors(id?: string) {
  // get all
  if (!id) return Array.from(authorsData.values());
  // get one
  return authorsData.get(id) ?? null;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (req.method === "POST") {
    const newId = crypto.randomUUID();
    authorsData.set(newId, {
      id: newId,
      fullName: JSON.parse(req.body).fullName,
      numberOfBooks: 0,
      books: [],
    });

    return res.status(200).send(
      JSON.stringify({
        message: "Author added",
      })
    );
  }

  const authorId = req.query.id as string;

  if (req.method === "GET") {
    // get all
    if (!authorId) {
      const authors = getAuthors();
      return res
        .status(200)
        .send(
          JSON.stringify({ message: "Get authors success", data: authors })
        );
    }
    // get one
    const author = getAuthors(authorId);
    return res.status(200).send(
      JSON.stringify({
        message: author ? "Get author success" : "Author is not found",
        data: author,
      })
    );
  }

  if (req.method === "PATCH") {
    const author = getAuthors(authorId);
    if (!author) {
      return res
        .status(200)
        .send(JSON.stringify({ message: "Author is not found" }));
    }

    authorsData.set(authorId, { ...author, ...JSON.parse(req.body) });
    return res.status(200).send(JSON.stringify({ message: "Author updated" }));
  }

  if (req.method === "DELETE") {
    const author = getAuthors(authorId);

    if (!author) {
      return res
        .status(200)
        .send(JSON.stringify({ message: "Author is not found" }));
    }

    authorsData.delete(authorId);
    return res.status(200).send(JSON.stringify({ message: "Author deleted" }));
  }
}
