import type { NextApiRequest, NextApiResponse } from "next";
import { BOOKKEEPER_DATA } from "@/mock/data";

const authorsData = BOOKKEEPER_DATA.authors;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(400).send("Error, method not supported");
  }

  const id = req.query.id as string;
  const author = authorsData.get(id) ?? null;

  return res.status(200).send(JSON.stringify({ data: author }));
}
