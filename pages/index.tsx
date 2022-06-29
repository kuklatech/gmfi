import type { NextPage } from "next"
import Link from "next/link"
import { BasicLayout } from "../components/basic-layout"
import { ContentSection } from "../components/organisms/ContentSection/ContentSection"
import Image from "next/image"

const Home: NextPage = () => {
  return (
    <BasicLayout title={"Global Mission Fulfillment Index"}>
      <ContentSection title={"Our mission"}>
        <p className={"text-lead text-2xl"}>
          Our mission is to inspire and help people contribute to the positive
          change for the world.
        </p>
      </ContentSection>

      <ContentSection title={"What we do?"}>
        <p className={"text-lead text-2xl"}>We focus on two things:</p>
        <ol className={"text-lead list-decimal text-2xl"}>
          <li>
            Creating a{" "}
            <Link href={"/mission"}>
              <a className={"underline"}>mission graph</a>
            </Link>
            , that shows in a clear way what actions contribute to the mission
            that is important to you.
          </li>
          <li>
            Creating a{" "}
            <Link href={"/organizations"}>
              <a className="underline">
                list of all the companies and organizations
              </a>
            </Link>{" "}
            that do a good job for the world. This way you will be able to find
            out what they&apos;re doing and how to help them do more good.
          </li>
        </ol>
        <p className={"text-lead my-4 pb-4 text-xl"}>
          Here&apos;s an example of a mission graph contributing to stopping
          global warming:
        </p>
        <div className={"mt-4"}>
          <Image
            src="/stop-global-warming.png"
            alt="Stop global warning mission graph"
            width={2475}
            height={2949}
          />
        </div>
      </ContentSection>

      <ContentSection title={"How to participate?"}>
        <p className="text-warm-gray-500 mt-4 text-lg">
          1.{" "}
          <Link href={"/organizations"}>
            <a className={"underline"}>Find or add an organization</a>
          </Link>
          , that you think is doing anything good for the world. It can be any
          company, NGO, or institution. The one you work for, buy products or
          services from, or the one you simply know about.
        </p>
        <p className="text-warm-gray-500 mt-4 text-lg">
          2. Describe what it is doing that you consider to be a good thing and
          what would they need to do more good.
        </p>
        <p className="text-warm-gray-500 mt-4 text-lg">
          3. Ask your friends to share their thoughts about this organization.
        </p>
      </ContentSection>

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
