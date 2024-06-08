import type { NextApiRequest, NextApiResponse } from "next";
import { BOOKKEEPER_DATA } from "@/mock/data";

const authorsData = BOOKKEEPER_DATA.authors;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // TODO;
    authorsData.set(req.body.id, req.body);
    return res
      .status(200)
      .send(JSON.stringify({ data: Array.from(authorsData.values()) }));
  }
  if (req.method === "GET") {
    return res
      .status(200)
      .send(JSON.stringify({ data: Array.from(authorsData.values()) }));
  }
  if (req.method === "PUT") {
    authorsData.set(req.body.id, req.body);
    return res
      .status(200)
      .send(JSON.stringify({ data: Array.from(authorsData.values()) }));
  }
  if (req.method === "DELETE") {
    authorsData.delete(req.body.id);
    return res
      .status(200)
      .send(JSON.stringify({ data: Array.from(authorsData.values()) }));
  }
}
