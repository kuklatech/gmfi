import { connect, disconnect } from "./neo4j"

export const getOrganizations = async ()=> {
    const {driver, session } = connect()

    const result = await session.run(
        'MERGE (o:Organization) RETURN o'
    )

    const organizations = result.records.map((record: any) => {
        const item = record.get(0)

        return {
            name: item.properties.name
        }
    })


    await disconnect(driver, session)

    return organizations
}