import currentConfig from "../../config";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, FirebaseStorage, ref, uploadBytes, getDownloadURL, UploadMetadata, deleteObject } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../../log";
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

  public async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      const storageRef = ref(this.storageData, `images/users/${uuidv4()}-${file.originalname}`);
      if (!file.buffer || file.buffer.length === 0) {
        throw new Error("Tệp trống hoặc không hợp lệ");
      }
      const metadata = {
        contentType: file.mimetype,  // Use file.mimetype to set the content type
      }as UploadMetadata;
      await uploadBytes(storageRef, file.buffer, { contentType: metadata.contentType });
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL; // Return the public URL of the uploaded image
    } catch (err) {
      if (err instanceof Error) {
        logger.error("Error uploading image:", err.message);        
      } else {
        logger.error("Unknown error during image upload",);
      }
      return '';
      // throw new Error("Image upload failed");
    }
  }
  //delete
  public async deleteImage(urlImage: string): Promise<boolean | string> {
    try {
      if (!urlImage) {
        throw new Error("Link trống hoặc không hợp lệ");
      }
      const imageRef = ref(storageData, urlImage);
      
      await deleteObject(imageRef);

      return true; // Return the public URL of the uploaded image
    } catch (err) {
      
      logger.error("Error delete image:", err);
      
      return '';
    }
  }

}

// Singleton instance of the Database class
const instanceStorageFireball = Database.getInstance();
// Export the database instance
export const storageData = instanceStorageFireball.getStorageInstance();
export default instanceStorageFireball;
