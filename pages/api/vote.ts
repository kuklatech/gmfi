import type { NextApiRequest, NextApiResponse } from "next"
import { VoteFormData } from "../organization/[id]"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const data: VoteFormData = req.body
  res.status(200).json({ name: "John Doe" })
}
