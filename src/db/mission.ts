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

export type MissionSet = {
  targetMission: Mission
  secondMission: Mission
  nextMission: Mission | null
}

export const getMissionsSets = async (
  missionId: number
): Promise<MissionSet[]> => {
  const cypherQuery = `MATCH (targetMission:Mission)<-[:CONTRIBUTES_TO]-(secondMission:Mission)
      WHERE id(targetMission) = $missionId
      OPTIONAL MATCH (targetMission)-[:CONTRIBUTES_TO]->(nextMission:Mission)
      RETURN targetMission, secondMission, nextMission`

  const missions = await query<MissionSet[]>(async (session) => {
    const result = await session.run(cypherQuery, { missionId })

    const missions: MissionSet[] = result.records.map((record: any) => {
      const targetMission = node2mission(record.get(0))
      const secondMission = node2mission(record.get(1))
      const nextMission = node2mission(record.get(2))

      return { targetMission, secondMission, nextMission }
    })

    return missions
  })

  return missions
}

const node2mission = (node: any): Mission | null => {
  if (!node) {
    return null
  }

  const mission: Mission = {
    id: node.identity.toInt(),
    name: node.properties.name,
  }
  return mission
}
