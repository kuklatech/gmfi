import type { NextPage } from "next"
import { BasicLayout } from "../../components/basic-layout"
import { getOrganizations, Organization } from "../../src/db/organizations"
import { useForm } from "react-hook-form"
import { useState } from "react"
import axios, { AxiosResponse } from "axios"
import { useRouter } from "next/router"

const Home: NextPage<{ organizations: any }> = (props) => {
  return (
    <BasicLayout title={"Organizations"}>
      <NewOrganizationForm />
    </BasicLayout>
  )
}

export default Home

export type OrganizationFormData = {
  name: string
  website: string
}

export const NewOrganizationForm = () => {
  const { register, handleSubmit } = useForm<OrganizationFormData>()
  const [saving, setSaving] = useState<boolean>(false)
  const router = useRouter()

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
          What is organization&apos;s name?
        </label>
        <div className="mt-1">
          <input
            type="text"
            {...register("name")}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g. Patagonia Inc."
          />
        </div>
      </div>
      <div className="mt-4">
        <label
          htmlFor="website"
          className="block text-xl font-medium text-gray-700"
        >
          What is organization&apos;s website?
        </label>
        <div className="mt-1">
          <input
            type="text"
            {...register("website")}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g. www.patagonia.com"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="mt-4 inline-flex cursor-pointer items-center rounded border border-transparent bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        {saving ? "saving..." : "Add new organization"}
      </button>
    </form>
  )
}

export async function getServerSideProps(context: any) {
  const organizations = await getOrganizations()

  return {
    props: {
      organizations,
    },
  }
}
