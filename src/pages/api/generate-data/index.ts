import { Book } from "@/interfaces";
import { init } from "../data-repository/Data.repository";
import { BOOKKEEPER_DATA } from "../../../mock/data";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    console.log("generating data...");

    init(BOOKKEEPER_DATA);
    return res.status(200).send("Init done.");
  }
}
