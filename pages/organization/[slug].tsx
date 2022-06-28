import type { NextPage } from "next"
import { BasicLayout } from "../../components/basic-layout"
import {
  getOrganizationByName,
  getVotesByOrganizationName,
  Organization,
  Vote,
} from "../../src/db/organizations"
import Link from "next/link"
import { useForm } from "react-hook-form"

const Home: NextPage<{ organization: Organization | null; votes: Vote[] }> = (
  props
) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const onSubmit = (data: any) => console.log(data)

  return (
    <BasicLayout title={`Organization: ${props.organization?.name}`}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-4">
          <label
            htmlFor="mission"
            className="block text-sm font-medium text-gray-700"
          >
            What is this organization&apos;s mission? What is they doing good
            for the world?
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
            className="block text-sm font-medium text-gray-700"
          >
            How well is this organization doing its job?
          </label>
          <span className="text-sm">From 1 (terribly) to 10 (the best)</span>

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
            className="block text-sm font-medium text-gray-700"
          >
            What does this organization need in order to do even better job?
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
            className="block text-sm font-medium text-gray-700"
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

        <input
          type="submit"
          className="mt-4 inline-flex items-center rounded border border-transparent bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          value={"Vote"}
        />
      </form>

      <hr className="my-6" />

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
