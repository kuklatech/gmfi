import { query } from "./neo4j"

export type Mission = {
  id: number
  name: string
}

export type MissionWithNoOfSubMissions = {
  name: string
  noOfSubMissions: number
}

export type ContributeRelationship = {
  id: number
  how: string
}

export const getMissions = async (): Promise<MissionWithNoOfSubMissions[]> => {
  const missions = await query<MissionWithNoOfSubMissions[]>(
    async (session) => {
      const result = await session.run(
        "MATCH (finalMission:Mission) WITH finalMission OPTIONAL MATCH (finalMission)<-[:CONTRIBUTES_TO*..]-(intermediateMission:Mission) RETURN finalMission, COUNT(intermediateMission) AS counter ORDER BY counter DESC, finalMission.name ASC"
      )

      const missions: MissionWithNoOfSubMissions[] = result.records.map(
        (record: any) => {
          const item = record.get(0)
          const counter = record.get(1)

          return {
            id: item.identity.toInt(),
            name: item.properties.name,
            noOfSubMissions: counter.toInt(),
          }
        }
      )

      return missions
    }
  )

  return missions
}
