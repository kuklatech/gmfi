import type { NextApiRequest, NextApiResponse } from "next"
import { getOrganizationByUrl } from "../../src/db/organizations"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "*")

  const url = req.query?.url

  if (!url) {
    return res.status(400).json({ error: { code: "invalid-url" } })
  }

  const organization = await getOrganizationByUrl(url.toString())

  return res.status(200).json(organization)
}
