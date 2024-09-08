import currentConfig from "../../config";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, FirebaseStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: currentConfig.firebase?.apiKey,
  authDomain: currentConfig.firebase?.authDomain,
  // databaseURL: currentConfig.firebase,
  projectId: currentConfig.firebase?.projectId,
  storageBucket: currentConfig.firebase?.storageBucket,
  messagingSenderId: currentConfig.firebase?.messagingSenderId,
  appId: currentConfig.firebase?.appId,
  measurementId: currentConfig.firebase?.measurementId,
};

class Database {
  // Declare the static instance property
  private static instance: Database;
  private storageData!: FirebaseStorage;

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
      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      this.storageData = getStorage(app);
      // export default database;
      console.info("Storage connection successful!");
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error during database connection:", err.message);
      } else {
        console.error("Unknown error during database connection");
      }
    }
  }
  // Method to get the Firebase storage instance
  public getStorageInstance(): FirebaseStorage {
    return this.storageData;
  }
}

// Singleton instance of the Database class
const instanceStorageFireball = Database.getInstance();
// Export the database instance
export const storageData = instanceStorageFireball.getStorageInstance();
export default instanceStorageFireball;
