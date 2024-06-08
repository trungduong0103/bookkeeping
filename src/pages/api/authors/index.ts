import type { NextApiRequest, NextApiResponse } from "next";
import type { Author } from "@/interfaces";
import { BOOKKEEPER_DATA } from "@/mock/data";

const authorsData = BOOKKEEPER_DATA.authors;

function handleGetAuthors(): Author[];
function handleGetAuthors(id: string): Author | null;
function handleGetAuthors(id?: string) {
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
    // TODO;
    authorsData.set(req.body.id, req.body);
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
      const authors = handleGetAuthors();
      return res
        .status(200)
        .send(
          JSON.stringify({ message: "Get authors success", data: authors })
        );
    }
    // get one
    const author = handleGetAuthors(authorId);
    return res.status(200).send(
      JSON.stringify({
        message: author ? "Get author success" : "Author is not found",
        data: author,
      })
    );
  }

  if (req.method === "PATCH") {
    const author = handleGetAuthors(authorId);
    if (!author) {
      return res
        .status(200)
        .send(JSON.stringify({ message: "Author is not found" }));
    }

    authorsData.set(authorId, { ...author, ...JSON.parse(req.body) });

    return res.status(200).send(JSON.stringify({ message: "Author updated" }));
  }

  if (req.method === "DELETE") {
    const author = handleGetAuthors(authorId);

    if (!author) {
      return res
        .status(200)
        .send(JSON.stringify({ message: "Author is not found" }));
    }

    const deleted = authorsData.delete(authorId);
    console.log(authorsData, deleted, authorId);

    return res.status(200).send(JSON.stringify({ message: "Author deleted" }));
  }
}
