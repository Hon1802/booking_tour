import bodyParser from 'body-parser';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import database from './databases/connectDatabase';
import { routes } from './routes';
import checkToken from './auth'
import { port } from './config';
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
    // Start your application logic
    console.log('Database initialized, starting application...');
    // Rest of your application logic here
  } catch (error) {
    console.error('Failed to initialize the database:', error);
    process.exit(1); // Exit if the database fails to initialize
  }
}

startApp();

app.use(cors(allowedOrigins));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// check token
app.use(checkToken)
//routes
app.use('/', routes);

app.listen(port, () => {
  console.log('run on : ' + port);
});
