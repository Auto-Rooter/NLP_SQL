import 'reflect-metadata';
import http from 'http';
import express from 'express';
import cookieSession from 'cookie-session';
import cors from 'cors';
import { envConfig } from './config/env.config';
import { AppDataSource } from './database/config';
import { GraphQLSchema, GraphQLFormattedError } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergedGQLSchema } from './graphql/schemas';
import { mergedGQLResolvers } from './graphql/resolvers';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

async function bootstrap() {
  const app = express();
  const httpServer: http.Server = new http.Server(app);

  const schema: GraphQLSchema = makeExecutableSchema({
    typeDefs: mergedGQLSchema,
    resolvers: mergedGQLResolvers
  });
  const server = new ApolloServer({
    schema,
    formatError(error: GraphQLFormattedError){
      return {
        message: error?.message,
        code: error?.extensions?.code || 'INTERNAL_SERVER_ERROR',
      }
    },
    introspection: envConfig?.NODE_ENV != 'production' ? true : false,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer })
    ]
  });
  app.set('trust proxy', 1);
  app.use(
    cookieSession({
      name: 'session',
      keys: [envConfig?.SECRET_KEY_ONE, envConfig?.SECRET_KEY_TWO],
      maxAge: 24 * 7 * 3600 * 1000, // 7 days
  }));
  const corsOptions = {
    origin: [envConfig?.ANGULAR_URL, envConfig?.REACT_URL],
    credentials: true,
    methods: ['GET', 'POST' ,'PUT', 'DELETE', 'OPTIONS'],
  };
  app.use(cors(corsOptions));

  try{
    httpServer.listen(envConfig?.PORT, () => {
      console.log(`[+] Server running on port: ${envConfig?.PORT}`);
    });
  } catch (error) {
    console.log(`[X] Error starting server ${error}`)
  }
};

AppDataSource.initialize().then(() => {
  console.log('[+] Postgres DB connected successfully...');
  bootstrap().catch(console.error);
}).catch(error => {
  console.log(`[X] Error connecting to Postgres Database: ${error?.message || error}`);
})