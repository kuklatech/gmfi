import { query, Session } from "./neo4j"
import { VoteFormData } from "../../pages/organization/[id]"
import { OrganizationFormData } from "../../pages/organizations/add"
import { Mission } from "./mission"

export type Organization = {
  id: number
  name: string
  website: string
  description: string
}

export type OrganizationWithMissions = {
  organization: Organization
  missions: Mission[]
}

export type Vote = {
  id: number
  howFillsMission: string
  rating: number
  // mission: string
  // needs: string
}

export type User = {
  email: string
}

export const getOrganizations = async (): Promise<Organization[]> => {
  const organizations = await query<Organization[]>(async (session) => {
    const result = await session.run("MATCH (o:Organization) RETURN o")

    const organizations: Organization[] = result.records.map((record: any) => {
      const item = record.get(0)

      return {
        id: item.identity.toInt(),
        name: item.properties.name,
        website: item.properties.website || "",
        description: item.properties.description || "",
      }
    })

    return organizations
  })

  return organizations
}

async function getOrganizationsWithMissionsRawResult(
  session: Session,
  missionId?: number
) {
  if (missionId !== undefined && !isNaN(missionId)) {
    const result = await session.run(
      "MATCH (o:Organization) " +
        "WITH o " +
        "MATCH (o)-[:FILLS|CONTRIBUTES_TO*1..]->(m:Mission) WHERE id(m) = $missionId RETURN o, collect(m) as missions",
      { missionId }
    )

    return result
  }

  const result = await session.run(
    "MATCH (o:Organization) " +
      "WITH o " +
      "OPTIONAL MATCH (o)-[:FILLS]->(m:Mission) RETURN o, collect(m) as missions"
  )

  return result
}

export const getOrganizationsWithMissions = async (
  missionId?: number
): Promise<OrganizationWithMissions[]> => {
  const organizations = await query<OrganizationWithMissions[]>(
    async (session) => {
      const result = await getOrganizationsWithMissionsRawResult(
        session,
        missionId
      )

      const organizations: OrganizationWithMissions[] = result.records.map(
        (record: any) => {
          const organizationNode = record.get(0)
          const missionNodes = record.get(1)

          const organization: Organization = {
            id: organizationNode.identity.toInt(),
            name: organizationNode.properties.name,
            website: organizationNode.properties.website || "",
            description: organizationNode.properties.description || "",
          }

          const missions: Mission[] = (missionNodes || []).map(
            (missionNode: any) => ({
              name: missionNode.properties.name,
            })
          )

          return { organization, missions }
        }
      )

      return organizations
    }
  )

  return organizations
}

export const getOrganizationById = async (
  id: number
): Promise<Organization | undefined> => {
  return await query<Organization>(async (session) => {
    const result = await session.run(
      "MATCH (o:Organization) WHERE id(o) = $id RETURN o",
      { id }
    )

    const organizations = result.records.map((record: any) => {
      const item = record.get(0)

      const organization: Organization = {
        id: item.identity.toInt(),
        name: item.properties.name,
        website: item.properties.website || "",
        description: item.properties.description || "",
      }

      return organization
    })

    if (organizations.length > 0) {
      return organizations[0]
    }
  })
}

export const getVotesByOrganizationId = async (
  organizationId: number
): Promise<Vote[]> => {
  return await query<Vote[]>(async (session) => {
    const result = await session.run(
      "MATCH (o:Organization)<-[vote:VOTED]-(u:User) WHERE id(o) = $id RETURN vote",
      { id: organizationId }
    )

    if (!result.records) {
      return []
    }

    return result.records.map((record: any) => {
      const item = record.get(0)

      const rating =
        typeof item.properties.rating === "number"
          ? item.properties.rating
          : item.properties.rating.toInt()

      const vote: Vote = {
        id: item.identity.toInt(),
        rating,
        howFillsMission: item.properties.howFillsMission || "",
      }

      return vote
    })
  })
}

export const getMissionsByOrganizationId = async (
  organizationId: number
): Promise<Mission[]> => {
  return await query<Mission[]>(async (session) => {
    const result = await session.run(
      "MATCH (o:Organization)-[:FILLS]->(m:Mission) WHERE id(o) = $id RETURN m",
      { id: organizationId }
    )

    if (!result.records) {
      return []
    }

    return result.records.map((record: any) => {
      const item = record.get(0)

      const mission: Mission = {
        id: item.identity.toInt(),
        name: item.properties.name,
      }

      return mission
    })
  })
}

export const createVoteForOrganization = async (
  data: VoteFormData
): Promise<Vote | undefined> => {
  return await query<Vote>(async (session) => {
    const result = await session.run(
      "MATCH (o:Organization) WHERE id(o) = $id WITH o MERGE (u:User { email: $email }) ON MATCH SET u.newsletter = $newsletter WITH o,u MERGE (o)<-[vote:VOTED { rating: $rating, howFillsMission: $howFillsMission, createdAt: datetime() }]-(u) RETURN vote",
      {
        id: data.organizationId,
        rating: data.rating,
        howFillsMission: data.howFillsMission,
        email: data.email,
        newsletter: data.newsletter,
      }
    )

    if (!result.records) {
      return
    }

    const votes = result.records.map((record: any) => {
      const item = record.get(0)

      const rating =
        typeof item.properties.rating === "number"
          ? item.properties.rating
          : item.properties.rating.toInt()

      const vote: Vote = {
        id: item.identity.toInt(),
        rating,
        howFillsMission: item.properties.howFillsMission,
      }

      return vote
    })

    if (votes.length > 0) {
      return votes[0]
    }
  })
}

export const createOrganization = async (
  data: OrganizationFormData
): Promise<Organization | undefined> => {
  return await query<Organization>(async (session) => {
    const result = await session.run(
      "MATCH (m:Mission { name: $missionName }) MERGE (o:Organization { name: $name, website: $website, description: $description, createdAt: datetime() })-[:FILLS]->(m) RETURN o",
      {
        name: data.name,
        missionName: data.missionName,
        website: data.website,
        description: data.description,
      }
    )

    if (!result.records) {
      return
    }

    const organizations = result.records.map((record: any) => {
      const item = record.get(0)

      const organization: Organization = {
        id: item.identity.toInt(),
        name: item.properties.name,
        website: item.properties.website,
        description: item.properties.description,
      }

      return organization
    })

    if (organizations.length > 0) {
      return organizations[0]
    }
  })
}

export const markOrganizationAsVoted = (organizationId: number) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(`organization_${organizationId}`, "1")
  }
}

export const isOrganizationVoted = (organizationId: number) => {
  if (typeof window !== "undefined") {
    const item = localStorage.getItem(`organization_${organizationId}`)
    return item === "1"
  }

  return false
}
