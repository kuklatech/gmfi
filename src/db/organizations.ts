import { query } from "./neo4j"
import { VoteFormData } from "../../pages/organization/[id]"
import { OrganizationFormData } from "../../pages/organizations/add"
import { Mission } from "./mission"

export type Organization = {
  id: number
  name: string
  website: string
}

export type Vote = {
  id: number
  rating: number
  mission: string
  needs: string
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
      }
    })

    return organizations
  })

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

      return {
        id: item.identity.toInt(),
        name: item.properties.name,
        website: item.properties.website,
      }
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

      return {
        id: item.identity.toInt(),
        rating,
        mission: item.properties.mission,
        needs: item.properties.needs,
      }
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
      "MATCH (o:Organization) WHERE id(o) = $id WITH o MERGE (u:User { email: $email }) ON MATCH SET u.newsletter = $newsletter WITH o,u MERGE (o)<-[vote:VOTED { rating: $rating, mission: $mission, needs: $needs }]-(u) RETURN vote",
      {
        id: data.organizationId,
        rating: data.rating,
        mission: data.mission,
        needs: data.needs,
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
        mission: item.properties.mission,
        needs: item.properties.needs,
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
      "MATCH (m:Mission { name: $missionName }) MERGE (o:Organization { name: $name })-[:FILLS]->(m) RETURN o",
      {
        name: data.name,
        missionName: data.missionName,
        website: data.website,
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
