import type { NextPage } from "next"
import { BasicLayout } from "../../components/basic-layout"
import {
  getOrganizationByName,
  getVotesByOrganizationName,
  Organization,
  Vote,
} from "../../src/db/organizations"
import Link from "next/link"

const Home: NextPage<{ organization: Organization | null; votes: Vote[] }> = (
  props
) => {
  return (
    <BasicLayout title={`Organization: ${props.organization?.name}`}>
      <Link
        href={`/organizations/vote?organization=${props.organization?.name}`}
      >
        <button
          type="button"
          className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Vote for organization
        </button>

        <form></form>
      </Link>

      <h2 className="mt-8 font-bold">Votes</h2>
      {props.votes.map((vote) => (
        <div key={vote.id}>
          <dl>
            <dt className="mt-2 font-bold">What is the mission?</dt>
            <dl>{vote.mission}</dl>

            <dt className="mt-2 font-bold">How well is doing its job?</dt>
            <dl>{vote.rating}/10</dl>

            <dt className="mt-2 font-bold">What does it need to do better?</dt>
            <dl>{vote.needs}</dl>
          </dl>
        </div>
      ))}
    </BasicLayout>
  )
}

export default Home

export async function getServerSideProps(context: any) {
  const slug = context.params.slug
  const organization = (await getOrganizationByName(slug)) || null

  const votes: Vote[] = await getVotesByOrganizationName(slug)

  return {
    props: {
      organization,
      votes,
    },
  }
}
