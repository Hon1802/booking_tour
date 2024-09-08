'use strict'

import { AppDataSource } from '../databases/connectDatabase';
import { TourData } from '../databases/interface/tourInterface';
const managerTour = AppDataSource.mongoManager;
import { Tour } from '../databases/models/entities/Tour';
import { ObjectId } from 'mongodb';
// firebase
import { v4 as uuidv4 } from "uuid";
import { logger } from '../log';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storageData } from '../databases/firebase/firebase.init';
import { validate } from 'class-validator';
class ToursService {

    // upload image to firebase
    private handleUploadImg = async (file:any) =>{
        if(file){
            const uniqueFileName = `${uuidv4()}-${file.name}`;
            // Tạo tham chiếu đến vị trí nơi bạn muốn lưu trữ hình ảnh
            const imageRef = ref(storageData, `images/${uniqueFileName}`);
      
            try {
              // Tải lên hình ảnh
              await uploadBytes(imageRef, file);
      
              // Lấy URL của hình ảnh đã tải lên
              const downloadURL = await getDownloadURL(imageRef);
            
              return downloadURL;
            } catch (error) {
              console.error("Upload failed:", error);
              return 'error when upload'
            } 
        }else{
            logger.error('no image')
            return 'no-image';
        }
    }

    // new tour
    tourNew = async (
        dataTour: any
    ): Promise<TourData> =>{
        try{
            let tourData : TourData;
            const tour = new Tour();

            if (isNaN(Number(dataTour.priceAdult)) || isNaN(Number(dataTour.priceChild))) {
                tourData = {
                    status: 400,
                    errCode: 400,
                    errMessage: {
                        "property": "price Adult and price Child",
                        "constraints": {
                            "isNotEmpty": "Price adult is contain [0,1,2,3,4,6,7,8,9]"
                        }
                    }
                  };
                return tourData;
            }

            // Calculate the duration in days between startDay and endDay
            const startDate = new Date(dataTour?.departureTime);
            const endDate = new Date(dataTour?.returnTime);
            const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
            const durationInDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

            if(dataTour.images)
            {
                const uploadedImages = dataTour?.images.map( async (item:any) => {
                    const urlImage = await this.handleUploadImg(item);
                    console.log(urlImage)
                    return urlImage;
                });
                uploadedImages();
            }
            tour.name = dataTour?.name;
            tour.description = dataTour?.description;
            tour.location = dataTour?.location;
            tour.regulation = dataTour?.regulation;
            tour.address = dataTour?.address;
            tour.images = [
                {
                    urlImage : 'https://achautravel.com/upload/images/1689131743.jpeg'
                },{
                    urlImage : 'https://asiaholiday.com.vn/pic/Tour/Tour%20Du%20lich%20Ha%20Long%20(5)_2261_HasThumb.jpg'
                }
            ];
            tour.plan = [{
                day: '',
                time: '',
                description: ''
            }];
            tour.phone = dataTour?.phoneContact;
            tour.priceAdult = dataTour?.priceAdult;
            tour.priceChild = dataTour?.priceChild;
            tour.startDay = startDate;
            tour.endDay = endDate;
            tour.duration= durationInDays.toString();
            
            const errors = await validate(tour);
            if (errors.length > 0) {
                tourData = {
                  status: 400,
                  errCode: 400,
                  errMessage: errors.map((err) => ({
                    property: err.property,
                    constraints: err.constraints
                  }))
                };
              } else {
                await managerTour.save(tour);
                logger.info('Tour saved:');
                tourData = {
                    status: 200,
                    errCode: 200,
                    errMessage: 'Tour registered successfully.',
                  };
              }
            return tourData;
        }catch (error){
            const tourData = {
                status: 400,
                errCode: 400,
                errMessage: 'Can not add new tour'
            };
            console.log(error)
            return tourData;
        }
    }
    // get tour by id

    getTourById = async (id: string) : Promise<TourData> =>{
        try{
            let tourData : TourData;
            const tour = await managerTour.getMongoRepository(Tour).findOne({
                where: { _id: new ObjectId(id) }
              });
            if(tour)
            {
                tourData = {
                    status: 200,
                    errCode: 200,
                    errMessage: `Get tours successfully.`,
                    tourInfor: tour || {}
                  };
            }else{
                tourData = {
                    status: 400,
                    errCode: 400,
                    errMessage: `Not found`,
                    tourInfor: tour || {}
                  };
            }
            return tourData;
        }catch (error)
        {
            const tourData = {
                status: 500,
                errCode: 500,
                errMessage: 'Internal error'
            };
            console.log(error)
            return tourData;
        }

    }

    // get tour home

    homeTour = async (count: number) : Promise<TourData> =>{
        try{
            let tourData : TourData;
            const tours = await managerTour.getMongoRepository(Tour).find({
                order: {createdAt: 'DESC'},
                take: count
            })
            // Chuyển đổi mảng tours thành đối tượng với id làm khóa
            const toursObject = tours.reduce((acc, tour) => {
                if(tour.id)
                acc[tour.id.toString()] = tour;
                return acc;
            }, {} as { [key: string]: typeof tours[0] });
            tourData = {
                status: 200,
                errCode: 200,
                errMessage: `Get tours successfully.`,
                tourInfor: toursObject
              };
            return tourData;
        }catch (error)
        {
            const tourData = {
                status: 500,
                errCode: 500,
                errMessage: 'Internal error'
            };
            console.log(error)
            return tourData;
        }

    }

    // get all tour
    
    // api for home

    // add image to tour

}
export default new ToursService();