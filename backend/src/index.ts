import { ApolloServer } from "@apollo/server";
import http from 'http'

import { expressMiddleware } from '@apollo/server/express4'
import express from 'express'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import cors from "cors"
import pkg from "body-parser"
const {json} = pkg;
/* Database data source */
import { AppDataSource } from "./database/dataSource.js"
/* Executable Schema */
import { execSchema } from './execSchema/execSchema.js';

interface MyContext {
    dataSource: typeof AppDataSource
}

const app = express()
const httpServer = http.createServer(app)

const server = new ApolloServer<MyContext>({
    schema: execSchema,
    introspection: true,
    plugins: [ApolloServerPluginDrainHttpServer({httpServer})]
})

await AppDataSource.initialize().then(async () => {
    console.log("Postgres TypeOrm DB initialized")
}).catch(error => console.log(error))

await server.start()

const corsOptions: cors.CorsOptions = {
    origin: '*',
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
}

app.use(
    '/graphql',
    cors<cors.CorsRequest>(corsOptions),
    json(),
    expressMiddleware(server,{
        context: async () => ({dataSource: AppDataSource})
    })
)



const port = 4000

await new Promise<void> ((resolve) => httpServer.listen({port: port},resolve))
console .log(`server listening at: ${port}`)