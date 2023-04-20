import { readFileSync} from 'fs'
import {Resolvers, User} from '__generated__/schema-types'
import { makeExecutableSchema } from '@graphql-tools/schema'
import {
    typeDefs as scalarTypeDefs,
    resolvers as scalarResolvers,
    mocks as scalarMocks
} from 'graphql-scalars'
import { addMocksToSchema} from '@graphql-tools/mock'
import { AppDataSource } from '../database/dataSource.js'
import { UserOrm } from '../database/users.js'
export interface MyContext {
    dataSource: typeof AppDataSource
}
import { client_id,client_secret } from '../private/spotify.js'
import fetch from 'node-fetch'


const typeDefs = readFileSync('./schema.gql',{encoding: 'utf-8'})


const getUsernameAndMail = ({username, email}:User) => {
    return `username: ${username}, mail: ${email}`
}

const getUserByUsername = (username:string,contextValue:MyContext) => {
    return contextValue.dataSource.manager.find(UserOrm,{where: {username: username}})
}


const getSpotifyToken = async (clientAuthToken:string) => {
    console.log('starting')
    const authHeader = 'Basic ' + (Buffer.from((client_id + ':' + client_secret)).toString('base64'))
    console.log(authHeader)
    const resp = await fetch('https://accounts.spotify.com/api/token',{
    method: 'POST',
    body: new URLSearchParams({
      "code": clientAuthToken,
      "redirect_uri": 'http://localhost:3000/',
      "grant_type": 'authorization_code'
    }),
    headers: {
      "Content-Type" :'application/x-www-form-urlencoded',
      "Authorization": authHeader
    }
    })
    console.log()
    console.log('done')
    return (await resp.json())["access_token"]
}

const resolvers: Resolvers = {
    Query: {
        users: (parent, args, contextValue: MyContext, info) => {
            return contextValue.dataSource.manager.find(UserOrm)
        },
        getUserByUsername:  (parent, args:any, contextValue: MyContext, info) => {
            return getUserByUsername(args.username,contextValue);
        },
        getSpotifyToken: (parent,args:any,contextValue: MyContext,info) => {
            return getSpotifyToken(args.clientAuthToken);
        }
    },
    Mutation: {
        createUser: async(parent,args:any, contextValue: MyContext, info) => {
            await contextValue.dataSource.manager.insert(UserOrm,{username: args.username ,email: 'salim.belakkaf@gmx.de',passwordHash: 'none'})
            return getUserByUsername(args.username,contextValue)
        }
    },
    User: {
        usernameMail: getUsernameAndMail,
    }
}

const schema = makeExecutableSchema({
    typeDefs: [
        ...scalarTypeDefs,
        typeDefs
    ],
    resolvers: {
        ...scalarResolvers,
        ...resolvers,
    }
})

export const execSchema = schema

export const mockedExecSchema = addMocksToSchema({
    schema,
    mocks: {
        ...scalarMocks
    }
})