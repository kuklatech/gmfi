import type { NextPage } from "next"
import { BasicLayout } from "../components/basic-layout"

const Home: NextPage = () => {
  return (
    <BasicLayout title={"Privacy Policy"}>
      <p>
        We save cookies to make sure that the votes aren’t being duplicated.
      </p>

      <p>
        We save an email address to occasionally send information about our
        project and the results of the polls we conduct.
      </p>

      <p>
        The administrator of the database is:
        <br />
        kukla.tech sp. z o. o.
        <br />
        Zawoja 1847
        <br />
        34-222 Zawoja
        <br />
        Poland
        <br />
        VAT UE: PL5521724915
      </p>

      <p>
        To remove your data (email address and votes related to this address)
        write a request to remove your data and send it via email to:
        contact@kukla.tech or via postal mail to the above address.
      </p>
    </BasicLayout>
  )
}

export default Home
