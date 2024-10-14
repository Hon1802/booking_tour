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
import { number } from 'joi';

// lodash
import _ from 'lodash';
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

            if(!dataTour.name)
            {
                tourData = {
                    status: 400,
                    errCode: 400,
                    errMessage: {
                        "property": "Name",
                        "constraints": {
                            "Unknown": "Name of tour is required"
                        }
                    }
                  };
                return tourData;
            }

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
            // const startDate = new Date(dataTour?.departureTime);
            // const endDate = new Date(dataTour?.returnTime);
            // const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
            // const durationInDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

            // if(dataTour.images)
            // {
            //     const uploadedImages = dataTour?.images.map( async (item:any) => {
            //         const urlImage = await this.handleUploadImg(item);
            //         console.log(urlImage)
            //         return urlImage;
            //     });
            //     uploadedImages();
            // }
            tour.name = dataTour?.name;
            tour.description = dataTour?.description;
            tour.location = dataTour?.location;
            tour.address = dataTour?.address;
            tour.phone = dataTour?.phone;
            tour.duration= dataTour?.duration;
            tour.regulation = dataTour?.regulation || 'null';
            tour.plan = dataTour?.plan || '';
            tour.priceAdult = dataTour?.priceAdult;
            tour.priceChild = dataTour?.priceChild;
            tour.delFlg = 0;
            tour.buySlot = 0;
            tour.images = [
                {
                    urlImage : 'https://achautravel.com/upload/images/1689131743.jpeg'
                },{
                    urlImage : 'https://asiaholiday.com.vn/pic/Tour/Tour%20Du%20lich%20Ha%20Long%20(5)_2261_HasThumb.jpg'
                }
            ];

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
                const newTour = await managerTour.save(tour);
                logger.info('Tour saved:');
                const formatTour = _.omit(newTour, [
                    'createdAt', 
                    'updatedAt', 
                    'startDay', 
                    'endDay', 
                    'createdBy', 
                    'updatedBy', 
                    'deletedBy', 
                    'deletedAt'
                ]);
                tourData = {
                    status: 200,
                    errCode: 200,
                    errMessage: 'Tour registered successfully.',
                    tourInfor: formatTour
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
                where: { 
                    _id: new ObjectId(id),
                    delFlg: 0
                 }
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
            // const toursObject = tours.reduce((acc, tour) => {
            //     if(tour.id)
            //     acc[tour.id.toString()] = tour;
            //     return acc;
            // }, {} as { [key: string]: typeof tours[0] });
            tourData = {
                status: 200,
                errCode: 200,
                errMessage: `Get tours successfully.`,
                tourInfor: tours
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

    // update tour by id
    updateTourId = async (
        dataTour: any
    ): Promise<TourData> =>{
        try{
            let tourData : TourData;

            // check tour
            const tourHolder = await managerTour.getMongoRepository(Tour).findOne({
                where: { 
                    _id: new ObjectId(dataTour.idTour),
                    delFlg: 0
                 }
              });
            if(!tourHolder){
                tourData = {
                    status: 400,
                    errCode: 400,
                    errMessage: {
                        "property": "id",
                        "constraints": {
                            "isNotEmpty": `No tour with id ${dataTour.idTour} `
                        }
                    }
                  };
                return tourData;
            }
            // 
            
            const tour = new Tour();
            if(dataTour.priceAdult){
                if (isNaN(Number(dataTour.priceAdult))) {
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
            }
            if(dataTour.priceChild){
                if (isNaN(Number(dataTour.priceChild))) {
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
            }

            tour.name = dataTour?.name || tourHolder.name;
            tour.description = dataTour?.description || tourHolder.description;
            tour.location = dataTour?.location || tourHolder.location;
            tour.address = dataTour?.address || tourHolder.address;
            tour.phone = dataTour?.phone || tourHolder.phone;
            tour.duration= dataTour?.duration || tourHolder.duration;
            tour.regulation = dataTour?.regulation || tourHolder.regulation || 'null';
            tour.plan = dataTour?.plan || tourHolder.plan || '';
            tour.priceAdult = dataTour?.priceAdult || tourHolder.priceAdult;
            tour.priceChild = dataTour?.priceChild || tourHolder.priceChild;
            tour.delFlg = 0;
            tour.buySlot = tourHolder.buySlot || 0;
            tour.images = tourHolder.images || [
                {
                    urlImage : 'https://achautravel.com/upload/images/1689131743.jpeg'
                },{
                    urlImage : 'https://asiaholiday.com.vn/pic/Tour/Tour%20Du%20lich%20Ha%20Long%20(5)_2261_HasThumb.jpg'
                }
            ];

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
                const updateTour = await managerTour.getMongoRepository(Tour).findOneAndUpdate(
                    // Điều kiện tìm kiếm
                    { _id: new ObjectId(dataTour.idTour) },
                    // Cập nhật dữ liệu
                    { $set: { 
                        ...tourHolder, 
                        name: dataTour?.name || tourHolder.name,
                        description: dataTour?.description || tourHolder.description,
                        location: dataTour?.location || tourHolder.location,
                        address: dataTour?.address || tourHolder.address,
                        phone: dataTour?.phone || tourHolder.phone,
                        duration: dataTour?.duration || tourHolder.duration,
                        regulation: dataTour?.regulation || tourHolder.regulation || 'null',
                        plan: dataTour?.plan || tourHolder.plan || '',
                        priceAdult: dataTour?.priceAdult || tourHolder.priceAdult,
                        priceChild: dataTour?.priceChild || tourHolder.priceChild,
                        delFlg: 0,
                        buySlot: tourHolder.buySlot || 0,
                        images: dataTour?.images || tourHolder.images || [
                            {
                                urlImage: 'https://achautravel.com/upload/images/1689131743.jpeg'
                            },
                            {
                                urlImage: 'https://asiaholiday.com.vn/pic/Tour/Tour%20Du%20lich%20Ha%20Long%20(5)_2261_HasThumb.jpg'
                            }
                        ]
                    } },
                    { returnDocument: "after" }
                  );
                logger.info(`Tour update:: id ${dataTour.idTour}`);
                const formatTour = _.omit(updateTour?.value, [
                    'createdAt', 
                    'updatedAt', 
                    'startDay', 
                    'endDay', 
                    'createdBy', 
                    'updatedBy', 
                    'deletedBy', 
                    'deletedAt'
                ]);
                tourData = {
                    status: 200,
                    errCode: 200,
                    errMessage: 'Tour update successfully.',
                    tourInfor: formatTour
                  };
              }
            return tourData;
        }catch (error){
            const tourData = {
                status: 400,
                errCode: 400,
                errMessage: 'Can not update tour'
            };
            console.log(error)
            return tourData;
        }
    }

    // update status tour

    statusTour = async (status:string, id: string) : Promise<TourData> =>{
        try{
            let tourData : TourData;
            const numericStatus = Number(status) || 0;
            const tour = await managerTour.getMongoRepository(Tour).findOneAndUpdate(
                // Điều kiện tìm kiếm
                { _id: new ObjectId(id) },
                // Cập nhật dữ liệu
                { $set: { 
                    delFlg: numericStatus
                } }
              );
            if(tour)
            {
                tourData = {
                    status: 200,
                    errCode: 200,
                    errMessage: `Update tours successfully with status ${numericStatus}.`,
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
}
export default new ToursService();