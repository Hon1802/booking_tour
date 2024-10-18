import { Database } from "./firebase.init";
import { ref, uploadBytes, getDownloadURL, UploadMetadata } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../../log";
import RedisConnection from "../redis/redis.init";
export class UploadImage extends Database {
    constructor() {
        super();
      }

    public async uploadImageTour(file: Express.Multer.File): Promise<string> {
    try {
        const storageRef = ref(this.getStorageInstance(), `images/tour/${uuidv4()}-${file.originalname}`);
        if (!file.buffer || file.buffer.length === 0) {
            throw new Error("Tệp trống hoặc không hợp lệ");
        }

        const metadata = {
        contentType: file.mimetype,
        } as UploadMetadata;

        await uploadBytes(storageRef, file.buffer, { contentType: metadata.contentType });
        const downloadURL = await getDownloadURL(storageRef);

        const redis = RedisConnection.getInstance();
        const timestamp = new Date().getTime();
        const imageEntry = `${timestamp}+LIVE+${downloadURL}`;
        redis.pushValueArray('IMAGEUPLOAD', imageEntry);
        return downloadURL; // Return the public URL of the uploaded image
    } catch (err) {
        if (err instanceof Error) {
            logger.error("Error uploading image:", err);
        } else {
            logger.error("Unknown error during image upload");
        }
        return '';
    }
    }
}