import type { NextPage } from "next"
import { BasicLayout } from "../components/basic-layout"
import { ContentSection } from "../components/organisms/ContentSection/ContentSection"

const Home: NextPage = () => {
  return (
    <BasicLayout title={"Roadmap"}>
      <ContentSection title={"What do we plan for the upcoming future?"}>
        <ul className={"list-disc"}>
          <li>Add form for creating a new mission.</li>
          <li>
            Publish information about the project for communities of
            entrepreneurs running eco-friendly businesses.
          </li>
          <li>
            Add a newsletter sign-up form on this very page. (If you want to
            stay up-to-date let us know at{" "}
            <a className={"underline"} href="mailto:contact@gmfindex.com">
              contact@gmfindex.com
            </a>
            )
          </li>
        </ul>
      </ContentSection>
    </BasicLayout>
  )
}

export default Home
