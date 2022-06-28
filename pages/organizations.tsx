import type { NextPage } from "next"
import Link from "next/link"
import { BasicLayout } from "../components/basic-layout"
import { getOrganizations } from "../src/db/organizations"

const Home: NextPage<{ organizations: any }> = (props) => {
  return (
    <BasicLayout title={"Organizations"}>
      <Link href={"/organizations/add"}>
        <button
          type="button"
          className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Add new organization
        </button>
      </Link>

      <p className={"text-lead mt-8 text-2xl"}>
        Choose an organization from the list
      </p>

      <ul className="mt-8">
        {props.organizations.map((organization: any) => (
          <li key={organization.name}><a href={`/organization/${organization.name}`}>{organization.name}</a></li>
        ))}
      </ul>
    </BasicLayout>
  )
}

export default Home

export async function getServerSideProps(context: any) {
  return {
    props: {
      organizations: await getOrganizations(),
    },
  }
}
