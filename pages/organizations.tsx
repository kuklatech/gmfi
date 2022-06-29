import type { NextPage } from "next"
import Link from "next/link"
import { BasicLayout } from "../components/basic-layout"
import {
  getOrganizationsWithMissions,
  OrganizationWithMissions,
} from "../src/db/organizations"

const Home: NextPage<{ organizations: OrganizationWithMissions[] }> = (
  props
) => {
  return (
    <BasicLayout title={"Organizations"}>
      <Link href={"/organizations/add"}>
        <a className="mt-4 inline-flex cursor-pointer items-center rounded border border-transparent bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Add new organization
        </a>
      </Link>

      <ol className="mt-8 list-decimal pl-8">
        {props.organizations.map(({ organization, missions }) => {
          const missionsNames = missions.map((mission) => mission.name)
          return (
            <li key={organization.name} className={"my-4 border-b pb-4"}>
              <Link href={`/organization/${organization.id}`}>
                <a className="flex flex-col">
                  <span>{organization.name}</span>
                  {missionsNames.length > 0 && (
                    <span className={"text-sm text-gray-800"}>
                      Mission: {missionsNames.join(", ")}
                    </span>
                  )}
                </a>
              </Link>
            </li>
          )
        })}
      </ol>
    </BasicLayout>
  )
}

export default Home

export async function getServerSideProps(context: any) {
  const organizations = await getOrganizationsWithMissions()

  return {
    props: {
      organizations,
    },
  }
}
