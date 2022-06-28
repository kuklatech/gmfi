import type { NextApiRequest, NextApiResponse } from "next"
import { VoteFormData } from "../organization/[id]"
import { createVoteForOrganization } from "../../src/db/organizations"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const data: VoteFormData = req.body

  const vote = await createVoteForOrganization(data)

  if (vote) {
    res.status(200).json({ voteId: vote.id })
  } else {
    res.status(400).json({ error: { code: "invalid-input" } })
  }
}
