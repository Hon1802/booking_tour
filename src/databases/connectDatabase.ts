// Singleton pattern for connect database
'use strict'
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { logger } from '../log';
import currentConfig from '../config';


export const AppDataSource = new DataSource({
  type: 'mongodb',
  // url: currentConfig.db.url,
  // url: 'mongodb+srv://mongoAdmin:securePassword123@13.229.198.83:27017/',
  // url:"mongodb+srv://admintest:12345@cluster0.48rjqxr.mongodb.net/",
  // url: 'mongodb://mongoAdmin:securePassword123@13.229.198.83:27017/booking_tour_prod?authSource=admin&authMechanism=SCRAM-SHA-256',
  // host: "13.229.198.83", 
  // port: 27017, 
  // database: "booking_tour_prod", 
  // username: "mongoAdmin",
  // password: "securePassword123",
  url:'mongodb+srv://admintest:12345@cluster0.48rjqxr.mongodb.net/datatourv2',
  useNewUrlParser: true,
  synchronize: true,
  logging: true,
  entities: [__dirname + '/models/entities/*.{js,ts}'],
  subscribers: [],
  migrations: [__dirname + '/migration/*.{js,ts}']
});

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
      console.log('check', err)
      if (err instanceof Error) {
        logger.error('Error during database connection:', err.message);
        logger.error('Stack trace:', err.message); 
      } else {
        logger.error('Unknown error during database connection');
      }
    }
  }
}
const instanceMongoDb = Database.getInstance();
export default instanceMongoDb;