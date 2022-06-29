import neo4j from "neo4j-driver"
export { Session } from "neo4j-driver"

export const connect = () => {
  const driver = neo4j.driver(
    process.env.GRAPH_DB_URI || "",
    neo4j.auth.basic("neo4j", process.env.GRAPH_DB_PASS || "")
  )
  const session = driver.session()

  return { driver, session }
}

export const disconnect = async (driver: any, session: any) => {
  await session.close()
  await driver.close()
}

export const query = async <T>(callback: (session: any) => Promise<T>) => {
  const { driver, session } = connect()

  const result = await callback(session)

  await disconnect(driver, session)

  return result
}
