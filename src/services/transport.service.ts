'use strict'

import { ObjectId } from 'mongodb';
import { AppDataSource } from '../databases/connectDatabase';
import { logger } from '../log';
const managerTransport = AppDataSource.mongoManager;


// lodash
import { validate } from 'class-validator';
import _ from 'lodash';
import errorCodes from '../common/errorCode/errorCodes';
import { ITransportData } from '../databases/interface/transportInterface';
import { Transport } from '../databases/models/entities/Transport';
import { FindOptions } from './common/interface';
class transportsService {

    // new transport
    transportNew = async (
        dataTransport: any
    ): Promise<ITransportData> =>{
        try{
            let transportData : ITransportData;
            const transport = new Transport();

            if(!dataTransport.transportName)
            {
                transportData = {
                    status: 400,
                    errCode: 400,
                    errMessage: {
                        "property": "transportName",
                        "constraints": {
                            "Unknown": "Name of transport is required"
                        }
                    }
                  };
                return transportData;
            }

            transport.company = dataTransport?.company;
            transport.type = dataTransport?.type;
            transport.departure = dataTransport?.departure;
            transport.destination = dataTransport?.destination;
            transport.transportName = dataTransport?.transportName || 'not valid';
            transport.price = parseFloat(dataTransport?.price ?? '0');
            transport.delFlg = 0;
            const errors = await validate(transport);
            if (errors.length > 0) {
                transportData = {
                  status: 400,
                  errCode: 400,
                  errMessage: errors.map((err) => ({
                    property: err.property,
                    constraints: err.constraints
                  }))
                };
              } else {
                const newTransport = await managerTransport.save(transport);
                const formatTransport = _.omit(newTransport, [
                    'createdAt', 
                    'updatedAt', 
                    'startDay', 
                    'endDay', 
                    'createdBy', 
                    'updatedBy', 
                    'deletedBy', 
                    'deletedAt'
                ]);

                transportData = {
                    status: 200,
                    errCode: 200,
                    errMessage: 'transport registered successfully.',
                    transportInfo: formatTransport
                  };
              }
            return transportData;
        }catch (error){
            const transportData = {
                status: 400,
                errCode: 400,
                errMessage: 'Can not add new transport'
            };
            console.log(error)
            return transportData;
        }
    }

    // update transport by id
    handleUpdateTransport = async (
        dataTransport: any
    ): Promise<ITransportData> =>{
        try{

            let transportData : ITransportData;

            // check transport
            const transportHolder = await managerTransport.getMongoRepository(Transport).findOne({
                where: { 
                    _id: new ObjectId(dataTransport.id),
                    delFlg: 0
                 }
              });
            if(!transportHolder){
                transportData = {
                    status: 400,
                    errCode: 400,
                    errMessage: {
                        "property": "id",
                        "constraints": {
                            "isNotEmpty": `No transport with id ${dataTransport.id} `
                        }
                    }
                  };
                return transportData;
            }
            // 
            
            const transport = new Transport();
           
            transport.company = dataTransport?.company;
            transport.departure = dataTransport?.departure;
            transport.destination = dataTransport?.destination;
            transport.type = dataTransport?.type;
            transport.price = parseFloat(dataTransport?.price);
            transport.transportName = dataTransport?.transportName;
            transport.delFlg = 0;

            const errors = await validate(transport);
            if (errors.length > 0) {
                transportData = {
                  status: 400,
                  errCode: 400,
                  errMessage: errors.map((err) => ({
                    property: err.property,
                    constraints: err.constraints
                  }))
                };
              } else {
                const updateTransport = await managerTransport.getMongoRepository(Transport).findOneAndUpdate(
                    // Điều kiện tìm kiếm
                    { _id: new ObjectId(dataTransport.id) },
                    // Cập nhật dữ liệu
                    { $set: { 
                        ...transportHolder, 
                        company: dataTransport?.company || transportHolder.company,
                        departure: dataTransport?.departure || transportHolder.departure,
                        destination: dataTransport?.description || transportHolder.destination,
                        type: dataTransport?.location || transportHolder.type,
                        transportName: dataTransport?.transportName || transportHolder.transportName,
                        price: parseFloat(dataTransport?.price) || transportHolder.price
                    } },
                    { returnDocument: "after" }
                  );
                logger.info(`transport update:: id ${dataTransport.id}`);
                const formatTransport = _.omit(updateTransport?.value, [
                    'createdAt', 
                    'updatedAt', 
                    'startDay', 
                    'endDay', 
                    'createdBy', 
                    'updatedBy', 
                    'deletedBy', 
                    'deletedAt'
                ]);
                transportData = {
                    status: 200,
                    errCode: 200,
                    errMessage: 'transport update successfully.',
                    transportInfo: formatTransport
                  };
              }
            return transportData;
        }catch (error){
            const transportData = {
                status: 400,
                errCode: 400,
                errMessage: 'Can not update transport'
            };
            console.log(error)
            return transportData;
        }
    }
    // get list transport 

    handleGetListTransport = async (
        departure?: string | null, 
        destination?: string | null, 
        transportName?: string | null,
        perPage: number | null = null,
        currentPage: number = 1, 
    ) : Promise<
    ITransportData
    > =>{
        try{
            let transportData : ITransportData;
            const options: FindOptions = {};
            if (perPage) {
                options.limit = perPage;
                options.skip = (currentPage - 1) * perPage; 
            }
            const skip = (currentPage - 1) * (perPage || Number.MAX_SAFE_INTEGER);

            const query: any = {};
            if (departure) {
                query.departure = { $regex: departure, $options: 'i' };
            }
            if (destination) {
                query.destination = { $regex: destination, $options: 'i' };
            }
            if (transportName) {
                query.transportName = { $regex: transportName, $options: 'i' };
            }

            // Total count of matching transport records
            const total = await managerTransport.getMongoRepository(Transport).find({
                where: query,
            });

            // Retrieve transport data with pagination and filters
            const transports = await managerTransport.getMongoRepository(Transport).find({
                where: query,
                take: perPage || 10,
                skip: skip,
            });
            // Kiểm tra nếu có khách sạn trả về
        if (transports.length > 0) {
            transportData = {
                status: 200,
                errCode: 200,
                errMessage: `Get transports successfully.`,
                transportInfo: transports, // Trả về danh sách khách sạn
                total: total.length || 0,      // Tổng số lượng bản ghi
                currentPage: currentPage, // Trang hiện tại
                perPage: perPage || 10 // Số bản ghi mỗi trang (hoặc tất cả nếu không có perPage)
            };
        } else {
            transportData = {
                status: 400,
                errCode: 400,
                errMessage: `Not found`,
                transportInfo: [] // Không tìm thấy khách sạn
            };
        }

        return transportData;
          
        }catch (error)
        {
            const transportData = {
                status: 500,
                errCode: 500,
                errMessage: 'Internal error'
            };
            console.log(error)
            return transportData;
        }

    }

    // remove transport by id

    handleRemoveTransportById = async (id: string): Promise<ITransportData> => {
        try {
            let transportData: ITransportData;
    
            if (!ObjectId.isValid(id)) {
                transportData = {
                    status: 400,
                    errCode: errorCodes.RESPONSE.ID_NOT_SUPPORT.code,
                    errMessage: errorCodes.RESPONSE.ID_NOT_SUPPORT.message
                };
                logger.error('error id');
                return transportData;
            }
    
            const transport = await managerTransport.getMongoRepository(Transport).findOne({
                where: {
                    _id: new ObjectId(id)
                }
            });
    
            if (transport) {
                await managerTransport.getMongoRepository(Transport).remove(transport);
                transportData = {
                    status: 200,
                    errCode: 200,
                    errMessage: `transport deleted successfully.`
                };
            } else {
                transportData = {
                    status: 400,
                    errCode: 400,
                    errMessage: `Not found`
                };
            }
    
            // Trả về dữ liệu dù có tìm thấy hay không
            return transportData;
    
        } catch (error) {
            const transportData = {
                status: 500,
                errCode: 500,
                errMessage: 'Internal error'
            };
            console.log(error);
            return transportData;
        }
    };

    // get transport by id

    // gettransportById = async (id: string) : Promise<transportData> =>{
    //     try{
    //         let transportData : transportData;
    //         const transport = await managerTransport.getMongoRepository(transport).findOne({
    //             where: { 
    //                 _id: new ObjectId(id),
    //                 delFlg: 0
    //              }
    //           });
    //         if(transport)
    //         {
    //             transportData = {
    //                 status: 200,
    //                 errCode: 200,
    //                 errMessage: `Get transports successfully.`,
    //                 transportInfor: transport || {}
    //               };
    //         }else{
    //             transportData = {
    //                 status: 400,
    //                 errCode: 400,
    //                 errMessage: `Not found`,
    //                 transportInfor: transport || {}
    //               };
    //         }
    //         return transportData;
    //     }catch (error)
    //     {
    //         const transportData = {
    //             status: 500,
    //             errCode: 500,
    //             errMessage: 'Internal error'
    //         };
    //         console.log(error)
    //         return transportData;
    //     }

    // }

    getTransById = async (id: string) : Promise<Transport | null> =>{
        try{
            const trans = await managerTransport.getMongoRepository(Transport).findOne({
                where: { 
                    _id: new ObjectId(id)
                 }
              });
            if(trans)
            {
                return trans
            }else{
                return null
            }
        }catch (error)
        {
            return null;
        }

    }
}
export default new transportsService();