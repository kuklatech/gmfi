import type { GetServerSideProps, NextPage } from "next"
import { BasicLayout } from "../../components/basic-layout"
import {
  getMissionsByOrganizationId,
  getOrganizationById,
  getVotesByOrganizationId,
  isOrganizationVoted,
  Organization,
  Vote,
} from "../../src/db/organizations"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import axios from "axios"

import { Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { CheckIcon, GlobeIcon } from "@heroicons/react/outline"

import {
  FacebookShareButton,
  TelegramShareButton,
  TwitterShareButton,
} from "react-share"
import { Mission } from "../../src/db/mission"
import { useRouter } from "next/router"

export type VoteFormData = {
  organizationId: number
  rating: number
  howFillsMission: string
  email: string
  newsletter: boolean
}

const Home: NextPage<{
  organization: Organization | null
  missions: Mission[]
  votes: Vote[]
}> = (props) => {
  const { register, handleSubmit } = useForm<VoteFormData>()
  const [saving, setSaving] = useState<boolean>(false)
  const [isModalOpened, setModalOpened] = useState<boolean>(false)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [copiedToClipboard, setCopiedToClipboard] = useState<boolean>(false)
  const router = useRouter()

  const organizationId = Number(props.organization?.id)

  useEffect(() => {
    if (organizationId) {
      setShowForm(!isOrganizationVoted(organizationId))
    }
  }, [organizationId])

  const onSubmit = (data: VoteFormData) => {
    setSaving(true)
    const url = (process.env.NEXT_PUBLIC_URL || "") + "/api/vote"

    data.organizationId = organizationId
    data.rating = Number(data.rating)
    data.newsletter = !!data.newsletter

    axios
      .post(url, data)
      .then((response) => {
        // markOrganizationAsVoted(data.organizationId)
        setTimeout(() => {
          setModalOpened(true)
        }, 100)
      })
      .finally(() => setSaving(false))
  }

  let organizationProfileUrl
  if (typeof window !== "undefined") {
    organizationProfileUrl = window.location.href
  }

  const message = `Is ${props.organization?.name} doing anything good for the world? Check out their mission and vote!`
  const copyToClipboardMessage = `${organizationProfileUrl} ${message}`

  const copyShareLinkButtonClicked = () =>
    navigator.clipboard
      .writeText(copyToClipboardMessage)
      .then(() => setCopiedToClipboard(true))

  return (
    <BasicLayout
      title={`${props.organization?.name}`}
      subtitle={
        <div className="mt-4">
          <div className="mt-2">
            <span className="text-xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-3xl">
              Mission:{" "}
              {props.missions.map((mission) => mission.name).join(", ")}
            </span>
          </div>
          <div className="mt-2">
            <span className="inline-flex text-xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-3xl">
              <GlobeIcon
                className="mr-2 h-8 w-8 text-white"
                aria-hidden="true"
              />{" "}
              {props.organization?.website && (
                <a
                  rel="nofollow noindex ugc noreferrer"
                  href={props.organization?.website}
                  target="_blank"
                >
                  {props.organization?.website}
                </a>
              )}
            </span>
          </div>
        </div>
      }
    >
      {showForm && (
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-4xl">Share your thoughts about this company</h2>
            <div className="mt-4">
              <label
                htmlFor="mission"
                className="block text-xl font-medium text-gray-700"
              >
                What is this organization doing to fill their mission?
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  {...register("howFillsMission")}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="e.g. using recycled materials, producing energy efficient devices, etc"
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
                  min={1}
                  max={10}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="from 1 to 10"
                  {...register("rating")}
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
              className="mt-4 inline-flex cursor-pointer items-center rounded border border-transparent bg-indigo-600 px-8 py-1.5 text-lg font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              value={saving ? "saving..." : "Vote"}
            />
          </form>

          <hr className="my-6" />
        </>
      )}

      <h2 className="mt-8 text-4xl">
        Votes {props.votes.length > 0 && <span>({props.votes.length})</span>}
      </h2>

      {props.votes.map((vote) => (
        <div key={vote.id} className={"my-8 border-t pt-8"}>
          <dl>
            <dt className="mt-2 font-bold">How is it filling its mission?</dt>
            <dl>{vote.howFillsMission}</dl>

            <dt className="mt-2 font-bold">How well is doing its job?</dt>
            <dl>{vote.rating}/10</dl>
          </dl>
        </div>
      ))}

      <Transition.Root show={isModalOpened} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setModalOpened}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                  <div>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <CheckIcon
                        className="h-6 w-6 text-green-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Thank you for your contribution! Now share it and find
                        out what your friends think about it.
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-left text-sm text-gray-500">
                          The more people vote for the organization, the better
                          our mission index will be.
                        </p>

                        <div className="mt-4 flex space-x-1 text-sm text-gray-600">
                          <TwitterShareButton
                            url={organizationProfileUrl || ""}
                          >
                            <span className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                                role="img"
                                className="iconify iconify--logos h-7 w-7"
                                preserveAspectRatio="xMidYMid meet"
                                viewBox="0 0 256 209"
                              >
                                <path
                                  fill="#55acee"
                                  d="M256 25.45a105.04 105.04 0 0 1-30.166 8.27c10.845-6.5 19.172-16.793 23.093-29.057a105.183 105.183 0 0 1-33.351 12.745C205.995 7.201 192.346.822 177.239.822c-29.006 0-52.523 23.516-52.523 52.52c0 4.117.465 8.125 1.36 11.97c-43.65-2.191-82.35-23.1-108.255-54.876c-4.52 7.757-7.11 16.78-7.11 26.404c0 18.222 9.273 34.297 23.365 43.716a52.312 52.312 0 0 1-23.79-6.57c-.003.22-.003.44-.003.661c0 25.447 18.104 46.675 42.13 51.5a52.592 52.592 0 0 1-23.718.9c6.683 20.866 26.08 36.05 49.062 36.475c-17.975 14.086-40.622 22.483-65.228 22.483c-4.24 0-8.42-.249-12.529-.734c23.243 14.902 50.85 23.597 80.51 23.597c96.607 0 149.434-80.031 149.434-149.435c0-2.278-.05-4.543-.152-6.795A106.748 106.748 0 0 0 256 25.45"
                                ></path>
                              </svg>
                            </span>
                          </TwitterShareButton>

                          <TelegramShareButton
                            url={organizationProfileUrl || ""}
                          >
                            <span className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                                role="img"
                                className="iconify iconify--logos h-7 w-7"
                                preserveAspectRatio="xMidYMid meet"
                                viewBox="0 0 256 256"
                              >
                                <path
                                  fill="#40B3E0"
                                  d="M128 0C57.307 0 0 57.307 0 128s57.307 128 128 128s128-57.307 128-128S198.693 0 128 0Z"
                                ></path>
                                <path
                                  fill="#FFF"
                                  d="M190.283 73.63L167.42 188.899s-3.197 7.994-11.99 4.157l-52.758-40.448l-19.184-9.272l-32.294-10.872s-4.956-1.758-5.436-5.595c-.48-3.837 5.596-5.915 5.596-5.915l128.376-50.36s10.552-4.636 10.552 3.038"
                                ></path>
                                <path
                                  fill="#D2E5F1"
                                  d="M98.618 187.603s-1.54-.144-3.46-6.22c-1.917-6.075-11.67-38.049-11.67-38.049l77.538-49.24s4.477-2.718 4.317 0c0 0 .799.48-1.6 2.718c-2.397 2.239-60.91 54.836-60.91 54.836"
                                ></path>
                                <path
                                  fill="#B5CFE4"
                                  d="m122.901 168.115l-20.867 19.026s-1.632 1.238-3.416.462l3.996-35.34"
                                ></path>
                              </svg>
                            </span>
                          </TelegramShareButton>

                          <FacebookShareButton
                            url={organizationProfileUrl || ""}
                          >
                            <span className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                                role="img"
                                className="iconify iconify--logos h-7 w-7"
                                preserveAspectRatio="xMidYMid meet"
                                viewBox="0 0 256 256"
                              >
                                <path
                                  fill="#395185"
                                  d="M241.871 256.001c7.802 0 14.129-6.326 14.129-14.129V14.129C256 6.325 249.673 0 241.871 0H14.129C6.324 0 0 6.325 0 14.129v227.743c0 7.803 6.324 14.129 14.129 14.129h227.742"
                                ></path>
                                <path
                                  fill="#FFF"
                                  d="M176.635 256.001v-99.137h33.277l4.982-38.635h-38.259V93.561c0-11.186 3.107-18.809 19.148-18.809l20.459-.009V40.188c-3.54-.471-15.684-1.523-29.812-1.523c-29.498 0-49.692 18.005-49.692 51.071v28.493h-33.362v38.635h33.362v99.137h39.897"
                                ></path>
                              </svg>
                            </span>
                          </FacebookShareButton>

                          <span
                            className={
                              "inline-flex cursor-pointer items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" +
                              (copiedToClipboard
                                ? " border-2 border-green-700"
                                : "")
                            }
                            onClick={copyShareLinkButtonClicked}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                              role="img"
                              className="iconify iconify--logos h-7 w-7"
                              width="32"
                              height="32"
                              preserveAspectRatio="xMidYMid meet"
                              viewBox="0 0 24 24"
                            >
                              <g
                                fill="none"
                                stroke="#888888"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                              >
                                <path d="M10 14a3.5 3.5 0 0 0 5 0l4-4a3.5 3.5 0 0 0-5-5l-.5.5"></path>
                                <path d="M14 10a3.5 3.5 0 0 0-5 0l-4 4a3.5 3.5 0 0 0 5 5l.5-.5"></path>
                              </g>
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                      onClick={() => {
                        setModalOpened(false)
                        router.reload()
                      }}
                    >
                      Go back
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </BasicLayout>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = Number(context.params?.id)
  const organization = (await getOrganizationById(id)) || null

  const votes: Vote[] = await getVotesByOrganizationId(id)
  const missions: Mission[] = await getMissionsByOrganizationId(id)

  return {
    props: {
      organization,
      votes,
      missions,
    },
  }
}
