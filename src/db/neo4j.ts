const neo4j = require('neo4j-driver')

export const connect = () => {
    const driver = neo4j.driver(process.env.GRAPH_DB_URI, neo4j.auth.basic("neo4j", process.env.GRAPH_DB_PASS))
    const session = driver.session()

    return {driver, session}
}

export const disconnect = async (driver: any, session: any) => {
    await session.close()
    await driver.close()
}
