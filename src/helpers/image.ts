import multer from "multer";
//function for images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './src/public/imageTour');
    },
    filename: (req, file, cb) => {
    //   cb(null, file.originalname);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
  });
//function for images
// const storageUser = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, './src/public/imageUsers');
//   },
//   filename: (req, file, cb) => {
//   //   cb(null, file.originalname);
//   const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
//   cb(null, `${uniqueSuffix}-${file.originalname}`);
//   },
// });
export interface multerFile {
    buffer: Buffer, 
    encoding: string, 
    fieldname: string, 
    mimetype: string, 
    originalname: string, 
    size: number;
};
// for tour
export const upload = multer({ storage });
// for user
// export const updateAvatar = multer({  storage: storageUser });

// Cấu hình lưu trữ cho ảnh người dùng
const storageUser = multer.memoryStorage(); // Thay đổi từ diskStorage sang memoryStorage
export const updateAvatar = multer({ storage: storageUser });