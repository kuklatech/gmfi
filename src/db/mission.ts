import { query } from "./neo4j"

export type Mission = {
  name: string
}

export type ContributeRelationship = {
  id: number
  how: string
}

export const getMissions = async (): Promise<Mission[]> => {
  const missions = await query<Mission[]>(async (session) => {
    const result = await session.run("MATCH (m:Mission) RETURN m")

    const missions: Mission[] = result.records.map((record: any) => {
      const item = record.get(0)

      return {
        name: item.properties.name,
      }
    })

    return missions
  })

  return missions
}
