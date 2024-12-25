// Singleton pattern for connect database
'use strict'
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { logger } from '../log';
import currentConfig from '../config';


export const AppDataSource = new DataSource({
  type: 'mongodb',
  // url: currentConfig.db.url,
  url:'mongodb://mongoAdmin:securePassword123@54.255.182.230:27017/booking_tour_prod?authSource=admin&authMechanism=SCRAM-SHA-256',
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


// class Database {
//   // Declare the static instance property
//   private static instance: Database;

//   private constructor() {
//     this.initializeConnection();
//   }

//   // Singleton pattern to ensure a single instance
//   static getInstance(): Database {
//     if (!Database.instance) {
//       Database.instance = new Database();
//     }
//     return Database.instance;
//   }

//   // Connect to the database
//   private async initializeConnection(): Promise<void> {
//     try {
//       await AppDataSource.initialize();
//       logger.info('Database connection successful!');
//     } catch (err) {
//       console.log('check', err)
//       if (err instanceof Error) {
//         logger.error('Error during database connection:', err.message);
//         logger.error('Stack trace:', err.message); 
//       } else {
//         logger.error('Unknown error during database connection');
//       }
//     }
//   }
// }


class Database {
  private static instance: Database;

  private constructor() {
    this.initializeConnectionWithRetry();
  }

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private async initializeConnectionWithRetry(
    retries = 5,
    delay = 5000 // 5 seconds
  ): Promise<void> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await AppDataSource.initialize();
        logger.info('Database connection successful!');
        return; // Exit if successful
      } catch (err) {
        if (attempt < retries) {
          logger.warn(
            `Database connection failed on attempt ${attempt}. Retrying in ${delay / 1000} seconds...`
          );
          await this.sleep(delay);
        } else {
          logger.error(
            `Failed to connect to database after ${retries} attempts. Exiting...`
          );
          if (err instanceof Error) {
            logger.error('Error during database connection:', err.message);
          } else {
            logger.error('Unknown error during database connection');
          }
          logger.error(`Failed to connect to database after ${retries} attempts. Exiting...`);
          process.exit(1); // Exit the application if unable to connect
        }
      }
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

const instanceMongoDb = Database.getInstance();
export default instanceMongoDb;