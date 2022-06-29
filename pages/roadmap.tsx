import type { NextPage } from "next"
import { BasicLayout } from "../components/basic-layout"
import { ContentSection } from "../components/organisms/ContentSection/ContentSection"

const Home: NextPage = () => {
  return (
    <BasicLayout title={"Roadmap"}>
      <ContentSection title={"What do we plan for the upcoming future?"}>
        <ul className={"list-disc"}>
          <li>Add user-driven mission graph management.</li>
          <li>
            Create a dependency graph for the most common global missions
            organizations have right now.
          </li>
        </ul>
      </ContentSection>
    </BasicLayout>
  )
}

export default Home
