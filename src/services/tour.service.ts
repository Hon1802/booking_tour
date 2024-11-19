'use strict'
import { addDays } from 'date-fns';
import { ObjectId } from 'mongodb';
import { AppDataSource } from '../databases/connectDatabase';
import { TourData } from '../databases/interface/tourInterface';
import { Tour } from '../databases/models/entities/Tour';
const managerTour = AppDataSource.mongoManager;
// firebase
import { validate } from 'class-validator';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { v4 as uuidv4 } from "uuid";
import instanceStorageFireball, { storageData } from '../databases/firebase/firebase.init';
import { logger } from '../log';

// lodash
import _ from 'lodash';
import { FilterQuery } from 'mongoose';
import errorCodes from '../common/errorCode/errorCodes';
import { FindOptions } from './common/interface';
import { generateUrlArrayImage, generateUrlImage } from './common/util';
import hotelService from './hotel.service';
import { Hotels } from '../databases/models/entities/Hotel';
import transportService from './transport.service';
import { Transport } from '../databases/models/entities/Transport';
import { BookingService } from './booking.service';
import { sentAcceptMail } from '../helpers/sentAcceptMaill';
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
            tour.transportationId = dataTour?.transportationId;
            tour.hotelId = dataTour?.hotelId;
            tour.estimatedTime = dataTour?.estimatedTime ? new Date(dataTour.estimatedTime) : new Date();
            tour.closeOrderTime = dataTour?.closeOrderTime ? new Date(dataTour.closeOrderTime) : new Date();
            tour.limit = dataTour?.limit;
            tour.isApprove = 0;
            tour.images =  generateUrlImage(dataTour?.images) || [
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
                let hotel: Hotels | null = null;
                let transport: Transport | null = null;

                tour.isApprove = tour.isApprove === 1 ? true : false;

                if(tour?.hotelId)
                {
                    hotel = await hotelService.getHotelById(tour?.hotelId);
                }

                if(tour?.transportationId)
                {
                    transport = await transportService.getTransById(tour?.transportationId);
                }

                tourData = {
                    status: 200,
                    errCode: 200,
                    errMessage: `Get tours successfully.`,
                    tourInfor: tour || {},
                    hotel: hotel,
                    transportation: transport
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
            
            if(tours)
            {
                tours.forEach(tour => {
                    tour.isApprove = tour.isApprove === 1 ? true : false;
                });
            }

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
            tour.isApprove = tourHolder.isApprove;
            tour.transportationId = dataTour?.transportationId;
            tour.hotelId = dataTour?.hotelId;
            tour.estimatedTime = dataTour?.estimatedTime ? new Date(dataTour.estimatedTime) : new Date();
            tour.closeOrderTime = dataTour?.closeOrderTime ? new Date(dataTour.closeOrderTime) : new Date();
            tour.limit = dataTour?.limit;
            tour.images = generateUrlImage(dataTour?.images) || tourHolder.images || [
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
                        transportationId : dataTour?.transportationId || tourHolder.transportationId,
                        hotelId : dataTour?.hotelId || tourHolder.hotelId,
                        estimatedTime : tour.estimatedTime = dataTour?.estimatedTime 
                        ? new Date(dataTour.estimatedTime) 
                        : (tourHolder.estimatedTime ? new Date(tourHolder.estimatedTime) : new Date()),
                        closeOrderTime : tour.closeOrderTime = dataTour?.closeOrderTime 
                        ? new Date(dataTour.closeOrderTime) 
                        : (tourHolder.closeOrderTime ? new Date(tourHolder.closeOrderTime) : new Date()),
                        limit : dataTour?.limit || tourHolder.buySlot,
                        images: generateUrlImage(dataTour?.images) || tourHolder.images || [
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


    // type: add, remove
    updateImageTour = async (type:string, id: string, imageUrls: string[] | string, ) : Promise<TourData> =>{
        try{
            let tourData : TourData;

            if (!ObjectId.isValid(id)) {
                tourData = {
                  status: 400,
                  errCode: errorCodes.RESPONSE.ID_NOT_SUPPORT.code,
                  errMessage: errorCodes.RESPONSE.ID_NOT_SUPPORT.message
                };
                logger.error('error id');
                return tourData;
              }
            let holderStore = await managerTour.findOne(Tour, { where: { _id: new ObjectId(id) } });
            let tourImage = holderStore?.images || [];
            if(type === 'add' &&  Array.isArray(imageUrls) )
            {
                const updateList = generateUrlArrayImage(imageUrls) || []
                if(!tourImage){
                    tourImage = updateList;
                }else{
                    const mergedArray = tourImage.concat(updateList);
                    tourImage = mergedArray;
                }
            } else {
                if(typeof imageUrls === 'string')
                {
                    const updateList = generateUrlImage(imageUrls) || [];
                    if (tourImage && Array.isArray(tourImage) && updateList.length > 0) {
                        tourImage = tourImage.filter(tourItem => 
                            !updateList.some(updateItem => updateItem.urlImage === tourItem.urlImage)
                          );
                      }

                      imageUrls.split(",").map(async(url: string) => (
                        await instanceStorageFireball.deleteImage(url.trim())
                      ));
                    console.log('Remove from firebase')
                }
            }
            // console.log('tets', tourImage)
            const tour = await managerTour.getMongoRepository(Tour).findOneAndUpdate(
                // Điều kiện tìm kiếm
                { _id: new ObjectId(id) },
                // Cập nhật dữ liệu
                { $set: { 
                    images : tourImage
                }},
                { returnDocument: "after" }
              );
            if(tour)
            {
                tourData = {
                    status: 200,
                    errCode: 200,
                    errMessage: `Update tours successfully.`,
                    tourInfor: tour.value.images || tour.value || tour || {}
                  };
            }else
            {
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
                } },
                { returnDocument: "after" }
              );
            if(tour)
            {
                tour.isApprove = tour.isApprove === 1 ? true : false;
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

    // get tour follow page
  
    filterTour = async (
        perPage: number | null = null,
        currentPage: number = 1, 
        keyword: string | null = null,
        status: number = 2
    ) : Promise<{ 
        data: Tour[]; 
        total: number; 
        currentPage: number; 
        perPage: number 
    }
        > =>{
        try{
            // const query: Partial<Tour> = {};
            const query: FilterQuery<Tour> = {}; 
            // if (keyword) {
            //     query.name = { $regex: new RegExp(keyword, 'i') } as any;
            // }

            if (keyword) {
                const regex = new RegExp(keyword, 'i'); // Biểu thức chính quy không phân biệt hoa thường
                query.$or = [ // Sử dụng $or để tìm kiếm trong nhiều trường
                    { name: { $regex: regex } },
                    { description: { $regex: regex } },
                    { address: { $regex: regex } },
                    {location:{ $regex: regex }}
                ];
            }

            if(status!= 2)
            {
                query.delFlg = status;
            }
            const options: FindOptions = {};
            if (perPage) {
                options.limit = perPage;
                options.skip = (currentPage - 1) * perPage; 
            }
             
            const skip = (currentPage - 1) * (perPage || Number.MAX_SAFE_INTEGER);
            
            try {
                const total = await managerTour.getMongoRepository(Tour).count(query); 
                const tours = await managerTour.getMongoRepository(Tour).find({
                    where: query,
                    take: perPage || total, // Nếu perPage không có thì lấy tất cả
                    skip: skip // Bỏ qua số bản ghi đã tính toán
                });
                if(tours)
                {
                    tours.forEach(tour => {
                        tour.isApprove = tour.isApprove === 1 ? true : false;
                    });
                }
                return {
                    data: tours,
                    total,
                    currentPage,
                    perPage: perPage || total // Trả về số bảng ghi lấy được
                };
            } catch (error) {
                console.error("Error fetching tours:");
                throw error;
            }

        }catch (error)
        {
            const tourData = {
                status: 500,
                errCode: 500,
                errMessage: 'Internal error'
            };
            console.log(error)
            return {
                data: [],
                total: 0,
                currentPage,
                perPage: 0 // Trả về số bảng ghi lấy được
            };
        }

    }


    // for customer
    filterTourCustomer = async (
        perPage: number | null = null,
        currentPage: number = 1, 
        keyword: string | null = null,
        fromPrice: string | null = null,
        toPrice: string | null = null,
        priceRanges: string[] | null ,
        location: string | null=null,
        sortBy: string | null = null,
        status: number = 2
    ) : Promise<{ 
        data: Tour[]; 
        total: number; 
        currentPage: number; 
        perPage: number }
        > =>{
        try{
            const query: FilterQuery<Tour> = {}; 
            // Tìm kiếm theo từ khóa
            if (keyword) {
                const regex = new RegExp(keyword, 'i'); 
                query.$or = [
                    { name: { $regex: regex } },
                    { description: { $regex: regex } },
                    { address: { $regex: regex } },
                ];
            }

            if (Array.isArray(priceRanges) && priceRanges.length > 0) {
                console.log(priceRanges);  // In ra giá trị của priceRanges nếu không phải mảng trống
              }
            // Tìm kiếm theo giá
            // Tìm kiếm theo giá
            if (Array.isArray(priceRanges) && priceRanges.length > 0) {
                console.log(priceRanges);  // In ra giá trị của priceRanges nếu không phải mảng trống

                // Kiểm tra và xử lý từng khoảng giá trong priceRanges
                query.$expr = {
                    $or: priceRanges.map((range: string) => {
                        const [from, to] = range.split('-').map((value) => parseFloat(value));

                        if (from && to) {
                            return {
                                $and: [
                                    { $gte: [{ $toDouble: "$priceAdult" }, from] },
                                    { $lte: [{ $toDouble: "$priceAdult" }, to] }
                                ]
                            };
                        } else if (from) {
                            return { $gte: [{ $toDouble: "$priceAdult" }, from] };
                        } else if (to) {
                            return { $lte: [{ $toDouble: "$priceAdult" }, to] };
                        }

                        // Trả về điều kiện mặc định nếu không có giá trị hợp lệ
                        return null;
                    }).filter(Boolean) // Loại bỏ các giá trị không hợp lệ
                };
            } else if (fromPrice && toPrice) { 
                // Tìm kiếm theo khoảng giá cụ thể nếu không có priceRanges
                query.$expr = {
                    $and: [
                        { $gte: [{ $toDouble: "$priceAdult" }, parseFloat(fromPrice)] },
                        { $lte: [{ $toDouble: "$priceAdult" }, parseFloat(toPrice)] }
                    ]
                };
            } else if (fromPrice) { 
                // Tìm kiếm theo giá từ
                query.$expr = {
                    $gte: [{ $toDouble: "$priceAdult" }, parseFloat(fromPrice)]
                };
            } else if (toPrice) {
                // Tìm kiếm theo giá đến
                query.$expr = {
                    $lte: [{ $toDouble: "$priceAdult" }, parseFloat(toPrice)]
                };
            }

            // if (fromPrice && toPrice) { // Kiểm tra cả hai giá trị có tồn tại và không rỗng                
            //     // query.priceAdult = { $gte: parseFloat(fromPrice), $lte: parseFloat(toPrice) };
            //     query.$expr = {
            //         $and: [
            //             { $gte: [{ $toDouble: "$priceAdult" }, parseFloat(fromPrice)] },
            //             { $lte: [{ $toDouble: "$priceAdult" }, parseFloat(toPrice)] }
            //         ]
            //     };
            // } else if (fromPrice) { // Kiểm tra chỉ `fromPrice` tồn tại và không rỗng
            //     // query.priceAdult = { $gte: parseFloat(fromPrice) };
            //     console.log('t2')
            //     query.$expr = {
            //         $gte: [{ $toDouble: "$priceAdult" }, parseFloat(fromPrice)]
            //     };

            // }

            // Tìm kiếm theo địa điểm
            if (location) {
                query.location = location;
            }

            // Lọc theo trạng thái
            if (status !== 2) {
                query.delFlg = status;
            }

            // Thiết lập sắp xếp
            const sort: { [key: string]: 1 | -1 } = {};
            if (sortBy === 'best-selling') {
                sort.buySlot = -1; // Sắp xếp giảm dần theo số lượng bán
            } else if (sortBy === 'cheapest') {
                sort.priceAdult = 1; // Sắp xếp tăng dần theo giá
            }
            
            // Cấu hình phân trang
            const options: FindOptions = {};
            if (perPage) {
                options.limit = perPage;
                options.skip = (currentPage - 1) * perPage; 
            }
             
            const skip = (currentPage - 1) * (perPage || Number.MAX_SAFE_INTEGER);
            
            try {
                // Đếm tổng số kết quả
                const total = await managerTour.getMongoRepository(Tour).count(query); 
                // Truy vấn lấy dữ liệu
                console.log('query : ',query)
                console.log('soft : ',sort)

                const tours = await managerTour.getMongoRepository(Tour).find({
                    where: query,
                    order: sort,
                    take: perPage || total, // Nếu perPage không có thì lấy tất cả
                    skip: skip // Bỏ qua số bản ghi đã tính toán
                });

                if(tours)
                    {
                        tours.forEach(tour => {
                            tour.isApprove = tour.isApprove === 1 ? true : false;
                        });
                    }

                return {
                    data: tours,
                    total,
                    currentPage,
                    perPage: perPage || total // Trả về số bảng ghi lấy được
                };
            } catch (error) {
                console.error("Error fetching tours:");
                throw error;
            }

        }catch (error)
        {
            const tourData = {
                status: 500,
                errCode: 500,
                errMessage: 'Internal error'
            };
            console.log(error)
            return {
                data: [],
                total: 0,
                currentPage,
                perPage: 0 // Trả về số bảng ghi lấy được
            };
        }

    }

    // for customer
    latestTourCustomer = async (
        perPage: number | null = null,
        currentPage: number = 1, 
        status: number = 2
    ) : Promise<{ 
        data: Tour[]; 
        total: number; 
        currentPage: number; 
        perPage: number }
        > =>{
        try{
            const query: FilterQuery<Tour> = {}; 

            // Lọc theo trạng thái
            if (status !== 2) {
                query.delFlg = status;
            }

            // Thiết lập sắp xếp
            const sort: { [key: string]: 1 | -1 } = {};
            sort.createdAt = -1; // Sắp xếp tăng dần theo giá

            
            // Cấu hình phân trang
            const options: FindOptions = {};
            if (perPage) {
                options.limit = perPage;
                options.skip = (currentPage - 1) * perPage; 
            }
             
            const skip = (currentPage - 1) * (perPage || Number.MAX_SAFE_INTEGER);
            
            try {
                // Đếm tổng số kết quả
                const total = await managerTour.getMongoRepository(Tour).count(query); 
                // Truy vấn lấy dữ liệu
                console.log('query : ',query)
                console.log('soft : ',sort)

                const tours = await managerTour.getMongoRepository(Tour).find({
                    where: query,
                    order: sort,
                    take: perPage || total, // Nếu perPage không có thì lấy tất cả
                    skip: skip // Bỏ qua số bản ghi đã tính toán
                });

                if(tours)
                    {
                        tours.forEach(tour => {
                            tour.isApprove = tour.isApprove === 1 ? true : false;
                        });
                    }

                return {
                    data: tours,
                    total,
                    currentPage,
                    perPage: perPage || total // Trả về số bảng ghi lấy được
                };
            } catch (error) {
                console.error("Error fetching tours:");
                throw error;
            }

        }catch (error)
        {
            const tourData = {
                status: 500,
                errCode: 500,
                errMessage: 'Internal error'
            };
            console.log(error)
            return {
                data: [],
                total: 0,
                currentPage,
                perPage: 0 // Trả về số bảng ghi lấy được
            };
        }

    }
     // for customer
    HotTourCustomer = async (
        perPage: number | null = null,
        currentPage: number = 1, 
        status: number = 2
    ) : Promise<{ 
        data: Tour[]; 
        total: number; 
        currentPage: number; 
        perPage: number }
        > =>{
        try{
            const query: FilterQuery<Tour> = {}; 

            // Lọc theo trạng thái
            if (status !== 2) {
                query.delFlg = status;
            }

            // Thiết lập sắp xếp
            const sort: { [key: string]: 1 | -1 } = {};
            sort.buySlot = -1;

            
            // Cấu hình phân trang
            const options: FindOptions = {};
            if (perPage) {
                options.limit = perPage;
                options.skip = (currentPage - 1) * perPage; 
            }
             
            const skip = (currentPage - 1) * (perPage || Number.MAX_SAFE_INTEGER);
            
            try {
                // Đếm tổng số kết quả
                const total = await managerTour.getMongoRepository(Tour).count(query); 
                // Truy vấn lấy dữ liệu
                console.log('query : ',query)
                console.log('soft : ',sort)

                const tours = await managerTour.getMongoRepository(Tour).find({
                    where: query,
                    order: sort,
                    take: perPage || total, // Nếu perPage không có thì lấy tất cả
                    skip: skip // Bỏ qua số bản ghi đã tính toán
                });

                if(tours)
                    {
                        tours.forEach(tour => {
                            tour.isApprove = tour.isApprove === 1 ? true : false;
                        });
                    }

                return {
                    data: tours,
                    total,
                    currentPage,
                    perPage: perPage || total // Trả về số bảng ghi lấy được
                };
            } catch (error) {
                console.error("Error fetching tours:");
                throw error;
            }

        }catch (error)
        {
            const tourData = {
                status: 500,
                errCode: 500,
                errMessage: 'Internal error'
            };
            console.log(error)
            return {
                data: [],
                total: 0,
                currentPage,
                perPage: 0 // Trả về số bảng ghi lấy được
            };
        }

    }

    // remove tour by id

    removeTourById = async (id: string) : Promise<TourData> =>{
    try{
        let tourData : TourData;

        if (!ObjectId.isValid(id)) {
            tourData = {
              status: 400,
              errCode: errorCodes.RESPONSE.ID_NOT_SUPPORT.code,
              errMessage: errorCodes.RESPONSE.ID_NOT_SUPPORT.message
            };
            logger.error('error id');
            return tourData;
          }

        const tour = await managerTour.getMongoRepository(Tour).findOne({
            where: { 
                _id: new ObjectId(id)
                }
            });
        if(tour)
        {
            if (tour.delFlg === 1 || tour.buySlot === 0) {
                await managerTour.getMongoRepository(Tour).remove(tour);
                tourData = {
                    status: 200,
                    errCode: 200,
                    errMessage: `Tour deleted successfully.`,
                    tourInfor: tour
                };
            } else {
                tourData = {
                    status: 400,
                    errCode: errorCodes.RESPONSE.TOUR_ACTIVE_OR_BOOKED.code,
                    errMessage: `Cannot delete the tour. The tour is active or has booked slots.`,
                    tourInfor: tour
                };
            }
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
    // accept booking with id tour

    AcceptTourComing = async (id: string) : Promise<TourData> =>{
    try{
        let tourData : TourData;

        if (!ObjectId.isValid(id)) {
            tourData = {
              status: 400,
              errCode: errorCodes.RESPONSE.ID_NOT_SUPPORT.code,
              errMessage: errorCodes.RESPONSE.ID_NOT_SUPPORT.message
            };
            logger.error('error id');
            return tourData;
          }

        const tour = await managerTour.getMongoRepository(Tour).findOne({
            where: { 
                _id: new ObjectId(id),
                delFlg: 0,
                isApprove: { $ne: 1 },
                }
            });

            const testHTML = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <title>Mail Acceptance Form</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                }
                .container {
                  width: 60%;
                  margin: auto;
                  border: 1px solid #ddd;
                  padding: 20px;
                  border-radius: 10px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                  text-align: center;
                  background-color: #f4f4f4;
                  padding: 10px;
                  border-bottom: 2px solid #ddd;
                }
                .content {
                  margin-top: 20px;
                }
                .footer {
                  margin-top: 30px;
                  text-align: center;
                  font-size: 0.9em;
                  color: #555;
                }
                .button {
                  display: inline-block;
                  background-color: #28a745;
                  color: white;
                  padding: 10px 20px;
                  text-decoration: none;
                  border-radius: 5px;
                  margin-top: 20px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h2>Chấp Nhận Đăng Ký</h2>
                </div>
                <div class="content">
                  <p>Kính gửi <strong>{{customerName}}</strong>,</p>
                  <p>Chúng tôi vui mừng thông báo rằng yêu cầu của bạn đã được chấp nhận. Dưới đây là thông tin chi tiết:</p>
                  <ul>
                    <li><strong>Mã yêu cầu:</strong> {{requestID}}</li>
                    <li><strong>Ngày xác nhận:</strong> {{confirmationDate}}</li>
                  </ul>
                  <p>Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi. Nếu bạn có bất kỳ thắc mắc nào, xin vui lòng liên hệ với chúng tôi qua email hoặc số điện thoại được cung cấp.</p>
                  <a href="{{supportLink}}" class="button">Liên hệ hỗ trợ</a>
                </div>
                <div class="footer">
                  <p>Trân trọng,<br>Đội ngũ dịch vụ khách hàng</p>
                </div>
              </div>
            </body>
            </html>
            `;
            
        await sentAcceptMail('soihoang1802@gmail.com','nguyenvanhon.tk4@gmail.com',testHTML,'Accept require tour')
        if(tour)
        {
            const bookingService = new BookingService;
            tour.isApprove = 1;
            await managerTour.getMongoRepository(Tour).save(tour);
            const accept = await bookingService.acceptBooking(id);
            if(accept)
            {
                //sent mail
                tourData = {
                    status: 200,
                    errCode: 200,
                    errMessage: `Tour accept successfully.`,
                };
            } else{
                tourData = {
                    status: 400,
                    errCode: 400,
                    errMessage: `Booking is not available.`,
                };
            }
        }else{
            tourData = {
                status: 400,
                errCode: errorCodes.RESPONSE.TOUR_ACTIVE_OR_BOOKED.code,
                errMessage: `Cannot accpet the tour. The tour is not available.`,
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
    // get list tour coming
    getListTourComing = async (
        perPage: number | null = null,
        currentPage: number = 1, 
    ) : Promise<
    TourData
    > =>{
        try{
            let tourData : TourData;
            const options: FindOptions = {};
            if (perPage) {
                options.limit = perPage;
                options.skip = (currentPage - 1) * perPage; 
            }
            const skip = (currentPage - 1) * (perPage || Number.MAX_SAFE_INTEGER);

             // Tính ngày hiện tại và ngày trong vòng 7 ngày tới
            const currentDate = new Date();
            const endDate = addDays(currentDate, 7);

            const query: any = {
                closeOrderTime: {
                    $gte: currentDate,  
                    $lte: endDate,      
                },
            };
            const total = await managerTour.getMongoRepository(Tour).find({
                where: query,
            });

            const tour = await managerTour.getMongoRepository(Tour).find({
                where: query,
                take: perPage || 10,
                skip: skip,
            });
        if (tour.length > 0) {
            tourData = {
                status: 200,
                errCode: 200,
                errMessage: `Get transports successfully.`,
                tourInfor: tour, 
                total: total.length || 0,      
                currentPage: currentPage, 
                perPage: perPage || 10 
            };
        } else {
            tourData = {
                status: 400,
                errCode: 400,
                errMessage: `Not found`,
                tourInfor: [] 
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


    // get tour by id

    checkTourApprove = async (id: string) : Promise<boolean> =>{
        try{
            
            const tour = await managerTour.getMongoRepository(Tour).findOne({
                where: { 
                    _id: new ObjectId(id),
                    delFlg: 0
                 }
              });
            if(tour)
            {
                return tour.isApprove == 1 ? true : false;
            }else{
                return false;
            }
        }catch (error)
        {
            console.log(error)
            return false;
        }

    }

    checkTour = async (id: string): Promise<boolean> => {
        try {
          let holderStore = await managerTour.findOne(Tour, { where: { _id: new ObjectId(id) } });
          if (holderStore) {
            return true;
          } else {
            return false;
          }
        } catch (error) {
          return false;
        }
      };

}
export default new ToursService();