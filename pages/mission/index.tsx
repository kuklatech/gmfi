import type { NextPage } from "next"
import Link from "next/link"
import { BasicLayout } from "../../components/basic-layout"
import {
  getMissions,
  getMissionsSets,
  Mission,
  MissionSet,
} from "../../src/db/mission"
import dynamic from "next/dynamic"
import { GetServerSideProps } from "next"
import Select, { SingleValue } from "react-select"
import { useRouter } from "next/router"

const Graphviz = dynamic(() => import("graphviz-react"), { ssr: false })

const Home: NextPage<{ missions: Mission[]; missionSets: MissionSet[] }> = (
  props
) => {
  const missionsOptions = props.missions.map((mission) => ({
    value: mission.id,
    label: mission.name,
  }))
  const router = useRouter()
  const missionId = Number(router.query?.mission)

  const selectMission = (
    option: SingleValue<{ value: number; label: string }>
  ) => {
    if (option) {
      return router.push(`/mission?mission=${option.value}`)
    } else {
      return router.push("/mission")
    }
  }

  return (
    <BasicLayout title={"Mission graph"}>
      {/*<Link href={"/mission/add"}>*/}
      {/*  <a className="mt-4 inline-flex cursor-pointer items-center rounded border border-transparent bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">*/}
      {/*    Add new mission*/}
      {/*  </a>*/}
      {/*</Link>*/}

      <h2 className={"text-lead mt-8 mb-4 text-3xl"}>Mission graph</h2>

      <span className={"mt-4 pt-4"}>Choose a mission to show a graph for:</span>
      <Select
        className={"mt-2"}
        options={missionsOptions}
        onChange={selectMission}
        defaultValue={missionsOptions.find(
          (mission) => mission.value === missionId
        )}
      />

      {missionId >= 0 && (
        <div className={"mt-2"}>
          <Link href={`/organizations?mission=${missionId}`}>
            <a className={"underline"}>Show organizations with this mission</a>
          </Link>
        </div>
      )}

      <Graph missionSets={props.missionSets} />
    </BasicLayout>
  )
}

export default Home

const Graph = (props: { missionSets: MissionSet[] }) => {
  const rules: string[] = []

  props.missionSets.map((missionSet) => {
    const targetMission = missionSet.targetMission.name
    const secondMission = missionSet.secondMission.name
    const nextMission = missionSet.nextMission?.name

    const mainRule = `"${secondMission}"  -> "${targetMission}";`

    rules.push(mainRule)

    if (nextMission) {
      const additionalRule = `"${targetMission}" -> "${nextMission}";`
      if (!rules.find((rule) => rule === additionalRule)) {
        rules.push(additionalRule)
      }
    }
  })

  const dot = `digraph {
      ${rules.join("")}
}`

  return (
    <Graphviz
      dot={dot}
      options={{ width: 1000, height: 800, engine: "circo" }}
    />
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const missionId = Number(context.query?.mission)
  const missions = await getMissions()
  const missionSets = await getMissionsSets(missionId)

  return {
    props: {
      missions,
      missionSets,
    },
  }
}
