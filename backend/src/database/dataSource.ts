import 'reflect-metadata'
import { DataSource } from 'typeorm'

import { UserOrm } from './users.js'

export const AppDataSource = new DataSource({
    type:'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'spotify',
    synchronize: true,
    logging: true,
    entities: [UserOrm],
    migrations: [],
    subscribers: []

})