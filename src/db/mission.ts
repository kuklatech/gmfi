import { query } from "./neo4j"
import { Organization } from "./organizations"

export type Mission = {
  id: number
  name: string
}

export type ContributeRelationship = {
  id: number
  how: string
}

export const getMissions = async (): Promise<Mission[]> => {
  const missions = await query<Mission[]>(async (session) => {
    const result = await session.run("MATCH (o:Mission) RETURN o")

    const missions: Mission[] = result.records.map((record: any) => {
      const item = record.get(0)

      return {
        id: item.identity.toInt(),
        name: item.properties.name,
      }
    })

    return missions
  })

  return missions
}
