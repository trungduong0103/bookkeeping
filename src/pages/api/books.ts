import type { NextApiRequest, NextApiResponse } from "next";
import { BOOKKEEPER_DATA } from "@/mock/data";

const booksData = BOOKKEEPER_DATA.books;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // TODO;
    booksData.set(req.body.id, req.body);
    return res
      .status(200)
      .send(JSON.stringify({ data: Array.from(booksData) }));
  }
  if (req.method === "GET") {
    return res
      .status(200)
      .send(JSON.stringify({ data: Array.from(booksData) }));
  }
  if (req.method === "PUT") {
    booksData.set(req.body.id, req.body);
    return res
      .status(200)
      .send(JSON.stringify({ data: Array.from(booksData) }));
  }
  if (req.method === "DELETE") {
    booksData.delete(req.body.id);
    return res
      .status(200)
      .send(JSON.stringify({ data: Array.from(booksData) }));
  }
}
