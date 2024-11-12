'use strict'

import { AppDataSource } from '../databases/connectDatabase';
const managerHotel = AppDataSource.mongoManager;
import { ObjectId } from 'mongodb';
import { logger } from '../log';


// lodash
import _ from 'lodash';
import { generateUrlArrayImage, generateUrlImage } from './common/util';
import errorCodes from '../common/errorCode/errorCodes';
import { FindOptions } from './common/interface';
import { FilterQuery } from 'mongoose';
import { IHotelData } from '../databases/interface/hotelInterface';
import { Hotels } from '../databases/models/entities/Hotel';
import { validate } from 'class-validator';
class hotelsService {

    // new hotel
    hotelNew = async (
        dataHotel: any
    ): Promise<IHotelData> =>{
        try{
            let hotelData : IHotelData;
            const hotel = new Hotels();

            if(!dataHotel.hotelName)
            {
                hotelData = {
                    status: 400,
                    errCode: 400,
                    errMessage: {
                        "property": "hotelName",
                        "constraints": {
                            "Unknown": "Name of hotel is required"
                        }
                    }
                  };
                return hotelData;
            }

            hotel.hotelName = dataHotel?.hotelName;
            hotel.address = dataHotel?.address;
            hotel.location = dataHotel?.location;
            hotel.description = dataHotel?.description;
            hotel.starRating = parseFloat(dataHotel?.starRating ?? '0');
            hotel.pricePerNight = parseFloat(dataHotel?.pricePerNight ?? '0');
            hotel.delFlg = 0;
            const errors = await validate(hotel);
            if (errors.length > 0) {
                hotelData = {
                  status: 400,
                  errCode: 400,
                  errMessage: errors.map((err) => ({
                    property: err.property,
                    constraints: err.constraints
                  }))
                };
              } else {
                const newHotel = await managerHotel.save(hotel);
                const formatHotel = _.omit(newHotel, [
                    'createdAt', 
                    'updatedAt', 
                    'startDay', 
                    'endDay', 
                    'createdBy', 
                    'updatedBy', 
                    'deletedBy', 
                    'deletedAt'
                ]);

                hotelData = {
                    status: 200,
                    errCode: 200,
                    errMessage: 'hotel registered successfully.',
                    hotelInfo: formatHotel
                  };
              }
            return hotelData;
        }catch (error){
            const hotelData = {
                status: 400,
                errCode: 400,
                errMessage: 'Can not add new hotel'
            };
            console.log(error)
            return hotelData;
        }
    }

    // update hotel by id
    handleUpdateHotel = async (
        dataHotel: any
    ): Promise<IHotelData> =>{
        try{

            let hotelData : IHotelData;

            // check hotel
            const hotelHolder = await managerHotel.getMongoRepository(Hotels).findOne({
                where: { 
                    _id: new ObjectId(dataHotel.id),
                    delFlg: 0
                 }
              });
            if(!hotelHolder){
                hotelData = {
                    status: 400,
                    errCode: 400,
                    errMessage: {
                        "property": "id",
                        "constraints": {
                            "isNotEmpty": `No hotel with id ${dataHotel.id} `
                        }
                    }
                  };
                return hotelData;
            }
            // 
            
            const hotel = new Hotels();
           
            hotel.hotelName = dataHotel?.hotelName;
            hotel.address = dataHotel?.address;
            hotel.location = dataHotel?.location;
            hotel.description = dataHotel?.description;
            hotel.starRating = parseFloat(dataHotel?.starRating ?? '0');
            hotel.pricePerNight = parseFloat(dataHotel?.pricePerNight ?? '0');
            hotel.delFlg = 0;

            const errors = await validate(hotel);
            if (errors.length > 0) {
                hotelData = {
                  status: 400,
                  errCode: 400,
                  errMessage: errors.map((err) => ({
                    property: err.property,
                    constraints: err.constraints
                  }))
                };
              } else {
                const updateHotel = await managerHotel.getMongoRepository(Hotels).findOneAndUpdate(
                    // Điều kiện tìm kiếm
                    { _id: new ObjectId(dataHotel.id) },
                    // Cập nhật dữ liệu
                    { $set: { 
                        ...hotelHolder, 
                        hotelName: dataHotel?.hotelName || hotelHolder.hotelName,
                        address: dataHotel?.address || hotelHolder.address,
                        description: dataHotel?.description || hotelHolder.description,
                        location: dataHotel?.location || hotelHolder.location,
                        starRating: parseFloat(dataHotel?.starRating) || hotelHolder.starRating,
                        pricePerNight: parseFloat(dataHotel?.pricePerNight) || hotelHolder.pricePerNight
                    } },
                    { returnDocument: "after" }
                  );
                logger.info(`hotel update:: id ${dataHotel.idhotel}`);
                const formatHotel = _.omit(updateHotel?.value, [
                    'createdAt', 
                    'updatedAt', 
                    'startDay', 
                    'endDay', 
                    'createdBy', 
                    'updatedBy', 
                    'deletedBy', 
                    'deletedAt'
                ]);
                hotelData = {
                    status: 200,
                    errCode: 200,
                    errMessage: 'hotel update successfully.',
                    hotelInfo: formatHotel
                  };
              }
            return hotelData;
        }catch (error){
            const hotelData = {
                status: 400,
                errCode: 400,
                errMessage: 'Can not update hotel'
            };
            console.log(error)
            return hotelData;
        }
    }
    // get list hotel 

    handleGetListHotel = async (
        location?: string | null, 
        perPage: number | null = null,
        currentPage: number = 1, 
    ) : Promise<
    IHotelData
    > =>{
        try{
            let hotelData : IHotelData;
            const options: FindOptions = {};
            if (perPage) {
                options.limit = perPage;
                options.skip = (currentPage - 1) * perPage; 
            }
            const skip = (currentPage - 1) * (perPage || Number.MAX_SAFE_INTEGER);
            const total = await managerHotel.getMongoRepository(Hotels).find({
                where: location ? {
                    location: {
                        $regex: location,
                        $options: 'i'
                    }
                } : {}
            });
            // Lấy danh sách khách sạn theo location hoặc tất cả nếu không có location
            const hotels = await managerHotel.getMongoRepository(Hotels).find({
                where: location ? {
                    location: {
                        $regex: location,
                        $options: 'i'
                    }
                } : {},
                take: perPage || 10, // Nếu `perPage` không có thì lấy tất cả
                skip: skip
            });
            // Kiểm tra nếu có khách sạn trả về
        if (hotels.length > 0) {
            hotelData = {
                status: 200,
                errCode: 200,
                errMessage: `Get hotels successfully.`,
                hotelInfo: hotels, // Trả về danh sách khách sạn
                total: total.length || 0,      // Tổng số lượng bản ghi
                currentPage: currentPage, // Trang hiện tại
                perPage: perPage || 10 // Số bản ghi mỗi trang (hoặc tất cả nếu không có perPage)
            };
        } else {
            hotelData = {
                status: 400,
                errCode: 400,
                errMessage: `Not found`,
                hotelInfo: [] // Không tìm thấy khách sạn
            };
        }

        return hotelData;
          
        }catch (error)
        {
            const hotelData = {
                status: 500,
                errCode: 500,
                errMessage: 'Internal error'
            };
            console.log(error)
            return hotelData;
        }

    }

    // remove hotel by id

    handleRemoveHotelById = async (id: string): Promise<IHotelData> => {
        try {
            let hotelData: IHotelData;
    
            if (!ObjectId.isValid(id)) {
                hotelData = {
                    status: 400,
                    errCode: errorCodes.RESPONSE.ID_NOT_SUPPORT.code,
                    errMessage: errorCodes.RESPONSE.ID_NOT_SUPPORT.message
                };
                logger.error('error id');
                return hotelData;
            }
    
            const hotel = await managerHotel.getMongoRepository(Hotels).findOne({
                where: {
                    _id: new ObjectId(id)
                }
            });
    
            if (hotel) {
                await managerHotel.getMongoRepository(Hotels).remove(hotel);
                hotelData = {
                    status: 200,
                    errCode: 200,
                    errMessage: `hotel deleted successfully.`
                };
            } else {
                hotelData = {
                    status: 400,
                    errCode: 400,
                    errMessage: `Not found`
                };
            }
    
            // Trả về dữ liệu dù có tìm thấy hay không
            return hotelData;
    
        } catch (error) {
            const hotelData = {
                status: 500,
                errCode: 500,
                errMessage: 'Internal error'
            };
            console.log(error);
            return hotelData;
        }
    };

    // get hotel by id

    // gethotelById = async (id: string) : Promise<hotelData> =>{
    //     try{
    //         let hotelData : hotelData;
    //         const hotel = await managerhotel.getMongoRepository(hotel).findOne({
    //             where: { 
    //                 _id: new ObjectId(id),
    //                 delFlg: 0
    //              }
    //           });
    //         if(hotel)
    //         {
    //             hotelData = {
    //                 status: 200,
    //                 errCode: 200,
    //                 errMessage: `Get hotels successfully.`,
    //                 hotelInfor: hotel || {}
    //               };
    //         }else{
    //             hotelData = {
    //                 status: 400,
    //                 errCode: 400,
    //                 errMessage: `Not found`,
    //                 hotelInfor: hotel || {}
    //               };
    //         }
    //         return hotelData;
    //     }catch (error)
    //     {
    //         const hotelData = {
    //             status: 500,
    //             errCode: 500,
    //             errMessage: 'Internal error'
    //         };
    //         console.log(error)
    //         return hotelData;
    //     }

    // }

    // get hotel home

    // homehotel = async (count: number) : Promise<hotelData> =>{
    //     try{
    //         let hotelData : hotelData;
    //         const hotels = await managerhotel.getMongoRepository(hotel).find({
    //             order: {createdAt: 'DESC'},
    //             take: count
    //         })
    //         // Chuyển đổi mảng hotels thành đối tượng với id làm khóa
    //         // const hotelsObject = hotels.reduce((acc, hotel) => {
    //         //     if(hotel.id)
    //         //     acc[hotel.id.toString()] = hotel;
    //         //     return acc;
    //         // }, {} as { [key: string]: typeof hotels[0] });
    //         hotelData = {
    //             status: 200,
    //             errCode: 200,
    //             errMessage: `Get hotels successfully.`,
    //             hotelInfor: hotels
    //           };
    //         return hotelData;
    //     }catch (error)
    //     {
    //         const hotelData = {
    //             status: 500,
    //             errCode: 500,
    //             errMessage: 'Internal error'
    //         };
    //         console.log(error)
    //         return hotelData;
    //     }

    // }

    // update hotel by id
    // updatehotelId = async (
    //     dataHotel: any
    // ): Promise<hotelData> =>{
    //     try{
    //         let hotelData : hotelData;

    //         // check hotel
    //         const hotelHolder = await managerhotel.getMongoRepository(hotel).findOne({
    //             where: { 
    //                 _id: new ObjectId(dataHotel.idhotel),
    //                 delFlg: 0
    //              }
    //           });
    //         if(!hotelHolder){
    //             hotelData = {
    //                 status: 400,
    //                 errCode: 400,
    //                 errMessage: {
    //                     "property": "id",
    //                     "constraints": {
    //                         "isNotEmpty": `No hotel with id ${dataHotel.idhotel} `
    //                     }
    //                 }
    //               };
    //             return hotelData;
    //         }
    //         // 
            
    //         const hotel = new hotel();
    //         if(dataHotel.priceAdult){
    //             if (isNaN(Number(dataHotel.priceAdult))) {
    //                 hotelData = {
    //                     status: 400,
    //                     errCode: 400,
    //                     errMessage: {
    //                         "property": "price Adult and price Child",
    //                         "constraints": {
    //                             "isNotEmpty": "Price adult is contain [0,1,2,3,4,6,7,8,9]"
    //                         }
    //                     }
    //                   };
    //                 return hotelData;
    //             }
    //         }
    //         if(dataHotel.priceChild){
    //             if (isNaN(Number(dataHotel.priceChild))) {
    //                 hotelData = {
    //                     status: 400,
    //                     errCode: 400,
    //                     errMessage: {
    //                         "property": "price Adult and price Child",
    //                         "constraints": {
    //                             "isNotEmpty": "Price adult is contain [0,1,2,3,4,6,7,8,9]"
    //                         }
    //                     }
    //                   };
    //                 return hotelData;
    //             }
    //         }

    //         hotel.name = dataHotel?.name || hotelHolder.name;
    //         hotel.description = dataHotel?.description || hotelHolder.description;
    //         hotel.location = dataHotel?.location || hotelHolder.location;
    //         hotel.address = dataHotel?.address || hotelHolder.address;
    //         hotel.phone = dataHotel?.phone || hotelHolder.phone;
    //         hotel.duration= dataHotel?.duration || hotelHolder.duration;
    //         hotel.regulation = dataHotel?.regulation || hotelHolder.regulation || 'null';
    //         hotel.plan = dataHotel?.plan || hotelHolder.plan || '';
    //         hotel.priceAdult = dataHotel?.priceAdult || hotelHolder.priceAdult;
    //         hotel.priceChild = dataHotel?.priceChild || hotelHolder.priceChild;
    //         hotel.delFlg = 0;
    //         hotel.buySlot = hotelHolder.buySlot || 0;
    //         hotel.transportationId = dataHotel?.transportationId;
    //         hotel.hotelId = dataHotel?.hotelId;
    //         hotel.estimatedTime = dataHotel?.estimatedTime ? new Date(dataHotel.estimatedTime) : new Date();
    //         hotel.closeOrderTime = dataHotel?.closeOrderTime ? new Date(dataHotel.closeOrderTime) : new Date();
    //         hotel.limit = dataHotel?.limit;
    //         hotel.images = generateUrlImage(dataHotel?.images) || hotelHolder.images || [
    //             {
    //                 urlImage : 'https://achautravel.com/upload/images/1689131743.jpeg'
    //             },{
    //                 urlImage : 'https://asiaholiday.com.vn/pic/hotel/hotel%20Du%20lich%20Ha%20Long%20(5)_2261_HasThumb.jpg'
    //             }
    //         ];

    //         const errors = await validate(hotel);
    //         if (errors.length > 0) {
    //             hotelData = {
    //               status: 400,
    //               errCode: 400,
    //               errMessage: errors.map((err) => ({
    //                 property: err.property,
    //                 constraints: err.constraints
    //               }))
    //             };
    //           } else {
    //             const updatehotel = await managerhotel.getMongoRepository(hotel).findOneAndUpdate(
    //                 // Điều kiện tìm kiếm
    //                 { _id: new ObjectId(dataHotel.idhotel) },
    //                 // Cập nhật dữ liệu
    //                 { $set: { 
    //                     ...hotelHolder, 
    //                     name: dataHotel?.name || hotelHolder.name,
    //                     description: dataHotel?.description || hotelHolder.description,
    //                     location: dataHotel?.location || hotelHolder.location,
    //                     address: dataHotel?.address || hotelHolder.address,
    //                     phone: dataHotel?.phone || hotelHolder.phone,
    //                     duration: dataHotel?.duration || hotelHolder.duration,
    //                     regulation: dataHotel?.regulation || hotelHolder.regulation || 'null',
    //                     plan: dataHotel?.plan || hotelHolder.plan || '',
    //                     priceAdult: dataHotel?.priceAdult || hotelHolder.priceAdult,
    //                     priceChild: dataHotel?.priceChild || hotelHolder.priceChild,
    //                     delFlg: 0,
    //                     buySlot: hotelHolder.buySlot || 0,
    //                     transportationId : dataHotel?.transportationId || hotelHolder.transportationId,
    //                     hotelId : dataHotel?.hotelId || hotelHolder.hotelId,
    //                     estimatedTime : hotel.estimatedTime = dataHotel?.estimatedTime 
    //                     ? new Date(dataHotel.estimatedTime) 
    //                     : (hotelHolder.estimatedTime ? new Date(hotelHolder.estimatedTime) : new Date()),
    //                     closeOrderTime : hotel.closeOrderTime = dataHotel?.closeOrderTime 
    //                     ? new Date(dataHotel.closeOrderTime) 
    //                     : (hotelHolder.closeOrderTime ? new Date(hotelHolder.closeOrderTime) : new Date()),
    //                     limit : dataHotel?.limit || hotelHolder.buySlot,
    //                     images: generateUrlImage(dataHotel?.images) || hotelHolder.images || [
    //                         {
    //                             urlImage: 'https://achautravel.com/upload/images/1689131743.jpeg'
    //                         },
    //                         {
    //                             urlImage: 'https://asiaholiday.com.vn/pic/hotel/hotel%20Du%20lich%20Ha%20Long%20(5)_2261_HasThumb.jpg'
    //                         }
    //                     ]
    //                 } },
    //                 { returnDocument: "after" }
    //               );
    //             logger.info(`hotel update:: id ${dataHotel.idhotel}`);
    //             const formathotel = _.omit(updatehotel?.value, [
    //                 'createdAt', 
    //                 'updatedAt', 
    //                 'startDay', 
    //                 'endDay', 
    //                 'createdBy', 
    //                 'updatedBy', 
    //                 'deletedBy', 
    //                 'deletedAt'
    //             ]);
    //             hotelData = {
    //                 status: 200,
    //                 errCode: 200,
    //                 errMessage: 'hotel update successfully.',
    //                 hotelInfor: formathotel
    //               };
    //           }
    //         return hotelData;
    //     }catch (error){
    //         const hotelData = {
    //             status: 400,
    //             errCode: 400,
    //             errMessage: 'Can not update hotel'
    //         };
    //         console.log(error)
    //         return hotelData;
    //     }
    // }
 
    // update status hotel

    // statushotel = async (status:string, id: string) : Promise<hotelData> =>{
    //     try{
    //         let hotelData : hotelData;
    //         const numericStatus = Number(status) || 0;
    //         const hotel = await managerhotel.getMongoRepository(hotel).findOneAndUpdate(
    //             // Điều kiện tìm kiếm
    //             { _id: new ObjectId(id) },
    //             // Cập nhật dữ liệu
    //             { $set: { 
    //                 delFlg: numericStatus
    //             } },
    //             { returnDocument: "after" }
    //           );
    //         if(hotel)
    //         {
    //             hotelData = {
    //                 status: 200,
    //                 errCode: 200,
    //                 errMessage: `Update hotels successfully with status ${numericStatus}.`,
    //                 hotelInfor: hotel || {}
    //               };
    //         }else{
    //             hotelData = {
    //                 status: 400,
    //                 errCode: 400,
    //                 errMessage: `Not found`,
    //                 hotelInfor: hotel || {}
    //               };
    //         }
    //         return hotelData;
    //     }catch (error)
    //     {
    //         const hotelData = {
    //             status: 500,
    //             errCode: 500,
    //             errMessage: 'Internal error'
    //         };
    //         console.log(error)
    //         return hotelData;
    //     }

    // }

    // get hotel follow page
  
    // filterhotel = async (
    //     perPage: number | null = null,
    //     currentPage: number = 1, 
    //     keyword: string | null = null,
    //     status: number = 2
    // ) : Promise<{ 
    //     data: hotel[]; 
    //     total: number; 
    //     currentPage: number; 
    //     perPage: number }
    //     > =>{
    //     try{
    //         // const query: Partial<hotel> = {};
    //         const query: FilterQuery<hotel> = {}; 
    //         // if (keyword) {
    //         //     query.name = { $regex: new RegExp(keyword, 'i') } as any;
    //         // }

    //         if (keyword) {
    //             const regex = new RegExp(keyword, 'i'); // Biểu thức chính quy không phân biệt hoa thường
    //             query.$or = [ // Sử dụng $or để tìm kiếm trong nhiều trường
    //                 { name: { $regex: regex } },
    //                 { description: { $regex: regex } },
    //                 { address: { $regex: regex } },
    //                 {location:{ $regex: regex }}
    //             ];
    //         }

    //         if(status!= 2)
    //         {
    //             query.delFlg = status;
    //         }
    //         const options: FindOptions = {};
    //         if (perPage) {
    //             options.limit = perPage;
    //             options.skip = (currentPage - 1) * perPage; 
    //         }
             
    //         const skip = (currentPage - 1) * (perPage || Number.MAX_SAFE_INTEGER);
            
    //         try {
    //             const total = await managerhotel.getMongoRepository(hotel).count(query); 
    //             const hotels = await managerhotel.getMongoRepository(hotel).find({
    //                 where: query,
    //                 take: perPage || total, // Nếu perPage không có thì lấy tất cả
    //                 skip: skip // Bỏ qua số bản ghi đã tính toán
    //             });
    //             return {
    //                 data: hotels,
    //                 total,
    //                 currentPage,
    //                 perPage: perPage || total // Trả về số bảng ghi lấy được
    //             };
    //         } catch (error) {
    //             console.error("Error fetching hotels:");
    //             throw error;
    //         }

    //     }catch (error)
    //     {
    //         const hotelData = {
    //             status: 500,
    //             errCode: 500,
    //             errMessage: 'Internal error'
    //         };
    //         console.log(error)
    //         return {
    //             data: [],
    //             total: 0,
    //             currentPage,
    //             perPage: 0 // Trả về số bảng ghi lấy được
    //         };
    //     }

    // }

    
}
export default new hotelsService();