import { query } from "./neo4j"

export type Organization = {
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

    return result.records.map((record: any) => {
      const item = record.get(0)

      return {
        name: item.properties.name,
      }
    })
  })

  return organizations
}

export const getOrganizationByName = async (
  name: string
): Promise<Organization | undefined> => {
  return await query<Organization>(async (session) => {
    const result = await session.run(
      "MATCH (o:Organization {name: $name}) RETURN o",
      { name }
    )

    const organizations = result.records.map((record: any) => {
      const item = record.get(0)

      return {
        name: item.properties.name,
      }
    })

    if (organizations.length > 0) {
      return organizations[0]
    }
  })
}

export const getVotesByOrganizationName = async (
  organizationName: string
): Promise<Vote[]> => {
  return await query<Vote[]>(async (session) => {
    const result = await session.run(
      "MATCH (o:Organization {name: $name})<-[vote:VOTED]-(u:User) RETURN vote",
      { name: organizationName }
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
