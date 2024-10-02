'use strict'

import { MongoClient } from 'mongodb';
import currentConfig from '../config';
// Update with your MongoDB URL
const _SERCONDS =5000;

const client = new MongoClient(currentConfig.db.url);
// check overload


export default function countConnections() {

  setInterval( async ()=>{
    try {
      await client.connect();
      const adminDb = client.db().admin();
      const stats = await adminDb.serverStatus();
      const connections = stats.connections;
      console.info(`Number of active connections: ${connections.current}`);
    } catch (err) {
      console.error('Error counting connections:', err);
    } finally {
      await client.close();
    }
  }, _SERCONDS)
  
  
}