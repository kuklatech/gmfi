import type { GetServerSideProps, NextPage } from "next"
import { BasicLayout } from "../../components/basic-layout"
import {
  getOrganizationById,
  getVotesByOrganizationId,
  isOrganizationVoted,
  markOrganizationAsVoted,
  Organization,
  Vote,
} from "../../src/db/organizations"
import { useForm } from "react-hook-form"
import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/router"

export type VoteFormData = {
  organizationId: number
  rating: number
  mission: string
  needs: string
  email: string
  newsletter: boolean
}

const Home: NextPage<{ organization: Organization | null; votes: Vote[] }> = (
  props
) => {
  const { register, handleSubmit } = useForm<VoteFormData>()
  const [saving, setSaving] = useState<boolean>(false)
  const organizationId = Number(props.organization?.id)

  const showForm = !isOrganizationVoted(organizationId)

  const onSubmit = (data: VoteFormData) => {
    setSaving(true)
    const url = (process.env.NEXT_PUBLIC_URL || "") + "/api/vote"

    data.organizationId = organizationId
    data.rating = Number(data.rating)
    data.newsletter = !!data.newsletter

    axios
      .post(url, data)
      .then((response) => {
        markOrganizationAsVoted(data.organizationId)
        setTimeout(() => {
          // TODO: Show modal with share links
          console.log("NOW SHOW MODAL WITH SHARE LINKS")
        }, 100)
      })
      .finally(() => setSaving(false))
  }

  return (
    <BasicLayout title={`Organization: ${props.organization?.name}`}>
      {showForm && (
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-4">
              <label
                htmlFor="mission"
                className="block text-xl font-medium text-gray-700"
              >
                What is this organization&apos;s mission? What is they doing
                good for the world?
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  {...register("mission")}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="e.g. preventing climate change"
                />
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="rating"
                className="block text-xl font-medium text-gray-700"
              >
                How well is this organization doing its job?
              </label>
              <span className="text-sm">
                From 1 (terribly) to 10 (the best)
              </span>

              <div className="mt-1">
                <input
                  type="number"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="from 1 to 10"
                  {...register("rating")}
                />
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="needs"
                className="block text-xl font-medium text-gray-700"
              >
                What does this organization need in order to do the job even
                better?
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  {...register("needs")}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="e.g. people, money, government's support, etc."
                />
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="email"
                className="block text-xl font-medium text-gray-700"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  type={"email"}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="you@example.com"
                  {...register("email")}
                />
              </div>
            </div>
            <div className="relative mt-2 flex items-start">
              <div className="flex h-5 items-center">
                <input
                  aria-describedby="newsletter-description"
                  id={"newsletter"}
                  value={1}
                  {...register("newsletter")}
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="newsletter"
                  className="font-medium text-gray-700"
                >
                  Sign up for a newsletter to get information about the project.
                </label>
                <p id="comments-description" className="text-gray-500">
                  We keep your email private.
                </p>
              </div>
            </div>

            <input
              disabled={saving}
              type="submit"
              className="mt-4 inline-flex items-center rounded border border-transparent bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              value={saving ? "saving..." : "Vote"}
            />
          </form>

          <hr className="my-6" />
        </>
      )}

      <h2 className="mt-8 text-2xl font-bold">Votes</h2>
      {props.votes.map((vote) => (
        <div key={vote.id} className={"my-8 border-t pt-8"}>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = Number(context.params?.id)
  const organization = (await getOrganizationById(id)) || null

  const votes: Vote[] = await getVotesByOrganizationId(id)

  return {
    props: {
      organization,
      votes,
    },
  }
}
