import type { NextPage } from "next"
import Link from "next/link"
import { BasicLayout } from "../components/basic-layout"
import { getOrganizations } from "../src/db/organizations"

const Home: NextPage<{organizations: any}> = (props) => {
  return (
    <BasicLayout title={"Organizations"}>
      <p className={"text-lead text-2xl"}>
        Find or add a new organizations
      </p>
      
      <ul className="mt-8">
          {props.organizations.map((organization: any) => (
          <li key={organization.name}>{organization.name}</li>
          ))}
      </ul>

    </BasicLayout>
  )
}

export default Home

export async function getServerSideProps(context: any) {
    return {
        props: {
            organizations: await getOrganizations()
        }
    }}