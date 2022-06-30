import type { NextPage } from "next"
import { BasicLayout } from "../../components/basic-layout"
import { getOrganizations, Organization } from "../../src/db/organizations"
import { Controller, useForm } from "react-hook-form"
import { useState } from "react"
import axios, { AxiosResponse } from "axios"
import { useRouter } from "next/router"
import Select from "react-select"
import { getMissions, Mission } from "../../src/db/mission"

const Home: NextPage<{ missions: Mission[] }> = (props) => {
  return (
    <BasicLayout title={"Add a new organization"}>
      <NewOrganizationForm missions={props.missions} />
    </BasicLayout>
  )
}

export default Home

export type OrganizationFormData = {
  name: string
  missionName: string
  website: string
  description: string
}

export const NewOrganizationForm = (props: { missions: Mission[] }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<OrganizationFormData>({
    defaultValues: {
      website: "https://",
    },
  })

  const [saving, setSaving] = useState<boolean>(false)
  const router = useRouter()

  const missionsOptions = props.missions.map((mission) => ({
    value: mission.name,
    label: mission.name,
  }))

  const onSubmit = (data: OrganizationFormData) => {
    setSaving(true)

    const url = (process.env.NEXT_PUBLIC_URL || "") + "/api/organizations/add"

    axios
      .post<OrganizationFormData, AxiosResponse<Organization>>(url, data)
      .then((response) => {
        setSaving(false)
        const organizationUrl = `/organization/${response.data.id}`
        return router.push(organizationUrl)
      })
      .finally(() => setSaving(false))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className={"text-lead mt-8 text-3xl"}>Add a new organization</h2>
      <div className="mt-4">
        <label
          htmlFor="name"
          className="block text-xl font-medium text-gray-700"
        >
          Name
        </label>
        <div className="mt-1">
          <input
            type="text"
            {...register("name", {
              required: { value: true, message: "Name is required" },
            })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g. Patagonia Inc."
          />
        </div>
        {!!errors.name && <ErrorMessage message={errors.name.message} />}
      </div>

      <div className="mt-4">
        <label
          htmlFor="mission"
          className="block text-xl font-medium text-gray-700"
        >
          Mission
        </label>
        <div className="mt-1">
          <Controller
            name={"missionName"}
            control={control}
            render={({ field: { value, onChange, onBlur } }) => {
              return (
                <Select
                  instanceId={"missionId"}
                  options={missionsOptions}
                  name={"missionId"}
                  onChange={(options) => {
                    onChange(options?.value)
                  }}
                  onBlur={onBlur}
                ></Select>
              )
            }}
          ></Controller>
        </div>
      </div>

      <div className="mt-4">
        <label
          htmlFor="website"
          className="block text-xl font-medium text-gray-700"
        >
          Website
        </label>
        <div className="mt-1">
          <input
            type="text"
            {...register("website", {
              pattern: {
                value:
                  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/,
                message: "It's not a valid URL",
              },
            })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g. www.patagonia.com"
          />
        </div>
        {!!errors.website && <ErrorMessage message={errors.website.message} />}
      </div>

      <div className="mt-4">
        <label
          htmlFor="description"
          className="block text-xl font-medium text-gray-700"
        >
          Description
        </label>
        <div className="mt-1">
          <textarea
            {...register("description")}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g. Patagonia, Inc. is an American retailer of outdoor clothing. It was founded by Yvon Chouinard in 1973 and is based in Ventura, California. Patagonia has hundreds of stores in 10+ countries across 5 continents, as well as factories in 16 countries."
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="mt-4 inline-flex cursor-pointer items-center rounded border border-transparent bg-indigo-600 px-4 py-1.5 text-lg font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        {saving ? "saving..." : "Add new organization"}
      </button>
    </form>
  )
}

export async function getServerSideProps(context: any) {
  const missions = await getMissions()

  return {
    props: {
      missions,
    },
  }
}

export const ErrorMessage = (props: { message?: string }) => (
  <p className={"my-2 text-red-500"}>{props.message}</p>
)
