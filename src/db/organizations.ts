import { query } from "./neo4j"

export type Organization = {
  id: number
  name: string
}

export type Vote = {
  id: number
  rating: number
  mission: string
  needs: string
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

      return {
        id: item.identity.toInt(),
        rating: item.properties.rating.toInt(),
        mission: item.properties.mission,
        needs: item.properties.needs,
      }
    })
  })
}

export const createVoteForOrganization = async (
  vote: Vote,
  organization: Organization
): Promise<void> => {
  return await query<void>(async (session) => {
    await session.run(
      "MATCH (o:Organization {name: $name}) MERGE (o)<-[vote:VOTED { rating: $rating, mission: $mission, needs: $needs }]-(u:User) RETURN vote",
      {
        name: organization.name,
        rating: vote.rating,
        mission: vote.mission,
        needs: vote.mission,
      }
    )
  })
}
