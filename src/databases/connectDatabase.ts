// Singleton pattern for connect database
'use strict'
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { logger } from '../log';
import { mongoURL } from '../config';

export const AppDataSource = new DataSource({
  type: 'mongodb',
  url: mongoURL,
  database: 'datatourv2',
  useNewUrlParser: true,
  synchronize: true,
  logging: true,
  entities: [__dirname + '/models/entities/*.ts'],
  subscribers: [],
  migrations: [__dirname + '/migration/*.ts']
});

// const initializeConnection = async (): Promise<void> => {
//   try {
//     await AppDataSource.initialize();
//     logger.info('Connect success!');
//   } catch (err) {
//     if (err instanceof Error) {
//       logger.error('Error during connect to database', err);
//     } else {
//       logger.error('Unknown error during connect to database');
//     }
//   }
// };
const closeConnection = async (): Promise<void> => {
  try {
    await AppDataSource.destroy(); // Close the connection
    logger.info('Connection closed successfully!');
  } catch (err) {
    if (err instanceof Error) {
      logger.error('Error during closing connection', err);
    } else {
      logger.error('Unknown error during closing connection');
    }
  }
};

// Handle application shutdown or cleanup
process.on('SIGINT', async () => {
  await closeConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeConnection();
  process.exit(0);
});


class Database {
  // Declare the static instance property
  private static instance: Database;

  private constructor() {
    this.initializeConnection();
  }

  // Singleton pattern to ensure a single instance
  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  // Connect to the database
  private async initializeConnection(): Promise<void> {
    try {
      await AppDataSource.initialize();
      logger.info('Database connection successful!');
    } catch (err) {
      if (err instanceof Error) {
        logger.error('Error during database connection:', err.message);
      } else {
        logger.error('Unknown error during database connection');
      }
    }
  }
}
const instanceMongoDb = Database.getInstance();
export default instanceMongoDb;