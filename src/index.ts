import 'reflect-metadata';
import http from 'http';
import express from 'express';
import cookieSession from 'cookie-session';
import cors from 'cors';
import { envConfig } from './config/env.config';



async function bootstrap() {
  const app = express();
  const httpServer: http.Server = new http.Server(app);

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
}

bootstrap().catch(console.error);