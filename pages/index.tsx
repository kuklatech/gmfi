import type { NextPage } from "next"
import Link from "next/link"
import { BasicLayout } from "../components/basic-layout"

const Home: NextPage = () => {
  return (
    <BasicLayout title={"Global Mission Fulfillment Index"}>
      <p className={"text-lead text-2xl"}>
        Our goal is to list all the companies and organizations that do a good
        job for the world so anyone can see what they’re doing and how to help
        them do more good.
      </p>

      <div className="bg-warm-gray-50">
        <div className="mx-auto max-w-md py-24 px-4 sm:max-w-3xl sm:py-32 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div>
              <h2 className="text-warm-gray-900 text-3xl font-extrabold">
                How to participate?
              </h2>
            </div>
            <div className="mt-12 lg:col-span-2 lg:mt-0">
              <div className="space-y-12">
                <p className="text-warm-gray-500 mt-4 text-lg">
                  1.{" "}
                  <Link href={"/organizations"}>
                    <a className={"underline"} href="/organizations">
                      Find or add an organization
                    </a>
                  </Link>
                  , that you think is doing anything good for the world. It can
                  be any company, NGO, or institution. The one you work for, buy
                  products or services from, or the one you simply know about.
                </p>
                <p className="text-warm-gray-500 mt-4 text-lg">
                  2. Describe what it is doing that you consider to be a good
                  thing and what would they need to do more good.
                </p>
                <p className="text-warm-gray-500 mt-4 text-lg">
                  3. Ask your friends to share their thoughts about this
                  company.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Faq />
    </BasicLayout>
  )
}

export default Home

const faqs = [
  {
    id: 1,
    question: "Why do you want to collect this information?",
    answer:
      "We want to foster all the initiatives that do good for the world. Anyone, who wants to help do something good for the world, can use our collectively created list to find organizations that share the same lifestyle or worldview.\n",
  },
  {
    id: 2,
    question: "Why do I need to share my email address?",
    answer:
      "You don’t have to share it, you can add your vote anonymously. However, your vote will be rated lower than confirmed votes.",
  },
  {
    id: 3,
    question: "How will you use my email address?",
    answer:
      "We will send you a confirmation link to ensure authenticity and prevent misuse.",
  },
  {
    id: 4,
    question: "Will you send me SPAM?",
    answer:
      "No. If you sign up for a newsletter, we will occasionally send you information about our project and the results of the polls we conduct. You can unsubscribe anytime.",
  },
]

const Faq = () => {
  return (
    <div className="bg-warm-gray-50">
      <div className="mx-auto max-w-md py-24 px-4 sm:max-w-3xl sm:py-32 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div>
            <h2 className="text-warm-gray-900 text-3xl font-extrabold">
              Frequently asked questions
            </h2>
            <p className="text-warm-gray-500 mt-4 text-lg"></p>
          </div>
          <div className="mt-12 lg:col-span-2 lg:mt-0">
            <dl className="space-y-12">
              {faqs.map((faq) => (
                <div key={faq.id}>
                  <dt className="text-warm-gray-900 text-lg font-medium">
                    {faq.question}
                  </dt>
                  <dd className="text-warm-gray-500 mt-2 text-base">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
