import type { NextPage } from "next"
import Link from "next/link"
import { BasicLayout } from "../../components/basic-layout"
import { getMissions, Mission } from "../../src/db/mission"

const Home: NextPage<{ missions: Mission[] }> = (props) => {
  return (
    <BasicLayout title={"Mission graph"}>
      <Link href={"/mission/add"}>
        <a className="mt-4 inline-flex cursor-pointer items-center rounded border border-transparent bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Add new mission
        </a>
      </Link>

      <h2 className={"text-lead mt-8 text-3xl"}>Mission graph</h2>

      <ul className="mt-8 list-disc pl-8">
        {props.missions.map((mission) => (
          <li key={mission.name} className={"my-4 border-b pb-4"}>
            <Link href={`/mission/${mission.id}`}>
              <a>{mission.name}</a>
            </Link>
          </li>
        ))}
      </ul>
    </BasicLayout>
  )
}

export default Home

export async function getServerSideProps(context: any) {
  const missions = await getMissions()

  return {
    props: {
      missions,
    },
  }
}
