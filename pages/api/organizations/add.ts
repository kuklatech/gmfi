import type { NextApiRequest, NextApiResponse } from "next"
import { createOrganization } from "../../../src/db/organizations"
import { OrganizationFormData } from "../../organizations"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const data: OrganizationFormData = req.body

  const organization = await createOrganization(data)

  if (organization) {
    res.status(200).json(organization)
  } else {
    res.status(400).json({ error: { code: "invalid-input" } })
  }
}
