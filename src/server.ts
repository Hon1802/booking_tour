'use strict'
import bodyParser from 'body-parser';
import express, { Application, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import database from './databases/connectDatabase';
// wagger
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
// redis

import { routes } from './routes';

import currentConfig from './config';
import checkToken from './auth';
import RedisConnection from './databases/redis/redis.init';

const port = currentConfig.app.port;

dotenv.config();
const app = express();
//cors
const allowedOrigins = {
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001',
    'https://re-project.vercel.app'
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true
};

// Wait initialize the database
async function startApp() {
  try {
    await database;
    console.log('Database initialized, starting application...');
    const redis = RedisConnection.getInstance();
    await redis.init(); 
  } catch (error) {
    console.error('Failed to initialize the database:', error);
    process.exit(1); // Exit if the database fails to initialize
  }
}

startApp();
// count connect of database
// countConnections();
// 
app.use(cors(allowedOrigins));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// check token
// app.use(checkToken)


// wagger
// Cấu hình Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentation for my Express API written in TypeScript',
    },
  },
  // apis: ['./src/routes/*.ts'], // Đường dẫn chứa các định nghĩa API
  apis: ['./src/routes/**/*.ts'], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
//routes
app.use('/', routes);

// middleware
interface CustomError extends Error {
  status?: number;
}
app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  const status = err?.status || 500; // Mặc định là 500 nếu không được cung cấp
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    error: {
      message,
      status,
    },
  });
});

app.listen(port, () => {
  console.log('run on : ' + port);
});
