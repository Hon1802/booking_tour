'use strict'
import { NextFunction, Request, Response } from 'express';
import { UploadImage } from '../../databases/firebase/firebase.uploadImage';
import { StatusTourEnum } from '../../databases/interface/common';
import { IHotelData } from '../../databases/interface/hotelInterface';
import { TourData } from '../../databases/interface/tourInterface';
import { ITransportData } from '../../databases/interface/transportInterface';
import { updateAvatar } from '../../helpers/image';
import { logger } from '../../log';
import hotelService from '../../services/hotel.service';
import tourService from '../../services/tour.service';
import transportService from '../../services/transport.service';
// import { File } from 'multer';
interface MulterRequest extends Request {
    file?: Express.Multer.File;  // Nếu chỉ upload 1 file
    files?: { [fieldname: string]: Express.Multer.File[] }; // Nếu upload nhiều file
  }
class AdminController {

    // add new tour, public

    handleAddNewTour = async (req: Request, res: Response, next: NextFunction)=>{
        try{
            const data = req.body;
           
            const tourData: TourData = await tourService.tourNew(data);
           
            return res.status(tourData.status).json({
                errCode: tourData.errCode,
                message: tourData.errMessage,
                data: tourData.tourInfor || 'null',
                });
        } catch(error){
            next(error)
        }
    }

    // update tour by id
    handleUpdateTourById = async(req: Request, res: Response, next: NextFunction)=>{
        try{
            console.log('Update tour by id')
            const data = req.body;
            if(!data.idTour){
                return res.status(400).json({
                    errCode: 400,
                    message: 'Missing inputs value'
                  });
            }
            const tourData: TourData = await tourService.updateTourId(data);
           
            return res.status(tourData.status).json({
                errCode: tourData.errCode,
                message: tourData.errMessage,
                data: tourData.tourInfor
                });
        } catch(error){
            next(error)
        }
    }

    // image -- add
    handleNewImageTour = async(req: Request, res: Response, next: NextFunction)=>{
        try{
            logger.info(`[P]::new image tour::`);
            // files = req.files;
            updateAvatar.array('image')(req, res, async function (err) {
                const files= req.files as Express.Multer.File[];
                if (!files || files.length === 0) {
                    return res.status(400).json({
                        errCode: 400,
                        message: 'No files uploaded.',
                    });
                }
                
                if (err) {
                    return res.status(400).json({
                        errCode: 400,
                        message: "Error uploading image.",
                    });
                }
                const imageUrls: string[] = [];
                for (const file of files) {
                    try {
                      // Upload each image to Firebase
                      const uploadImageService = new UploadImage();
                      const imageUrl = await uploadImageService.uploadImageTour(file);
                      imageUrls.push(imageUrl);
                    } catch (uploadErr) {
                        console.log('Error uploading image to Firebase:', uploadErr);
                        return res.status(500).json({
                            errCode: 500,
                            message: 'Error uploading image to Firebase.',
                        });
                    }
                }
    
         
                return res.status(200).json({
                    errCode: '200',
                    message: 'success',
                    data: imageUrls
                    });               
                
                
            }); 

            // const userData: TourData = await tourService.statusTour(status, idTour);
           
            // return res.status(userData.status).json({
            //     errCode: userData.errCode,
            //     message: userData.errMessage,
            //     });
        } catch(error){
            next(error)
        }
    }

    // image -- add
    handleUpdateImageTour = async(req: Request, res: Response, next: NextFunction)=>{
        try{
            logger.info(`[P]::add image tour::`);
            // files = req.files;
            updateAvatar.array('image')(req, res, async function (err) {
                const {id} = req.body;
                if(!id){
                    return res.status(400).json({
                        errCode: 400,
                        message: 'Missing inputs value'
                      });
                }
                const files= req.files as Express.Multer.File[];
                if (!files || files.length === 0) {
                    return res.status(400).json({
                        errCode: 400,
                        message: 'No files uploaded.',
                    });
                }
                
                if (err) {
                    return res.status(400).json({
                        errCode: 400,
                        message: "Error uploading image.",
                    });
                }
                const imageUrls: string[] = [];
                for (const file of files) {
                    try {
                      // Upload each image to Firebase
                      const uploadImageService = new UploadImage();
                      const imageUrl = await uploadImageService.uploadImageTour(file);
                      imageUrls.push(imageUrl);
                    } catch (uploadErr) {
                        console.log('Error uploading image to Firebase:', uploadErr);
                        return res.status(500).json({
                            errCode: 500,
                            message: 'Error uploading image to Firebase.',
                        });
                    }
                }
                const tourData: TourData = await tourService.updateImageTour('add',id,imageUrls)
         
                return res.status(tourData.status).json({
                    errCode: tourData.errCode,
                    message: tourData.errMessage,
                    tourInfor: tourData
                    });               
                
                
            }); 

            // const userData: TourData = await tourService.statusTour(status, idTour);
           
            // return res.status(userData.status).json({
            //     errCode: userData.errCode,
            //     message: userData.errMessage,
            //     });
        } catch(error){
            next(error)
        }
    }
    // image -- remove
    handleRemoveImageTour = async(req: Request, res: Response, next: NextFunction)=>{
        try{
            logger.info(`[P]::remove image tour::`);
            const {id, urlImages} = req.body;
            const tourData: TourData = await tourService.updateImageTour('remove', id, urlImages);
        
            return res.status(tourData.status).json({
                errCode: tourData.errCode,
                message: tourData.errMessage,
                data: tourData.tourInfor
                });
        } catch(error){
            next(error)
        }
    }
    // status
    handleUpdateStatusTour = async(req: Request, res: Response, next: NextFunction)=>{
        try{
            const {status, idTour} = req.body;
            if (![StatusTourEnum.ACTIVE.toString(), StatusTourEnum.INACTIVE.toString()].includes(status)) {
                return res.status(400).json({ error: 'Invalid status value' });
            }
            if(!idTour){
                return res.status(400).json({
                    errCode: 400,
                    message: 'Missing inputs value'
                  });
            }
            const userData: TourData = await tourService.statusTour(status, idTour);
           
            return res.status(userData.status).json({
                errCode: userData.errCode,
                message: userData.errMessage,
                });
        } catch(error){
            next(error)
        }
    }

    // filter
    handleFilterStatusTour = async(req: Request, res: Response, next: NextFunction)=>{
        try{
            
            // Lấy các tham số truy vấn và ép kiểu
            const perPage = typeof req.query.perPage === 'string' ? parseInt(req.query.perPage) : null;
            const currentPage = typeof req.query.currentPage === 'string' ? parseInt(req.query.currentPage, 10) : 1;
            const keyword = typeof req.query.keyword === 'string' ? req.query.keyword : '';
            // const status = typeof req.query.status === 'string' ? req.query.status : 'active';
            const status = 
                typeof req.query.status === 'string' 
                    ? (req.query.status === 'active' ? 0 : req.query.status === 'inactive' ? 1 : 2) 
                    : 2;
            const tourData: any = await tourService.filterTour(perPage, currentPage, keyword, status);

            return res.status(200).json({
                errCode: '200',
                message: 'Get success',
                tourData
                });
        } catch(error){
            next(error)
        }
    } 
    // remove
    handleRemoveTour = async(req: Request, res: Response, next: NextFunction)=>{
        try{
            
            const {tourId} = req.body;
            console.log(tourId);
            const dataResponse = await tourService.removeTourById(tourId);
            return res.status(dataResponse.status).json({
                errCode: dataResponse.errCode,
                message: dataResponse.errMessage
            });
        } catch(error){
            next(error)
        }
    }

    // support function, private

    // hotel

    handleAddNewHotel = async (req: Request, res: Response, next: NextFunction)=>{
        try{
            const data = req.body;
           
            const hotelData: IHotelData = await hotelService.hotelNew(data);
           
            return res.status(hotelData.status).json({
                errCode: hotelData.errCode,
                message: hotelData.errMessage,
                data: hotelData.hotelInfo || 'null',
                });
        } catch(error){
            next(error)
        }
    }
    // handle Update Hotel
    handleUpdateHotel = async (req: Request, res: Response, next: NextFunction)=>{
        try{

            const data = req.body;
           
            const hotelData: IHotelData = await hotelService.handleUpdateHotel(data);
           
            return res.status(hotelData.status).json({
                errCode: hotelData.errCode,
                message: hotelData.errMessage,
                data: hotelData.hotelInfo || 'null',
                });
        } catch(error){
            next(error)
        }
    }

    // handle get list Hotel
    handleGetListHotel = async (req: Request, res: Response, next: NextFunction)=>{
        try{

            const location: string | null = typeof req.query.location === 'string' ? req.query.location : null;
            
            const perPage = typeof req.query.perPage === 'string' ? parseInt(req.query.perPage) : 10;
            const currentPage = typeof req.query.currentPage === 'string' ? parseInt(req.query.currentPage, 10) : 1;

            const hotelData: IHotelData = await hotelService.handleGetListHotel(location, perPage, currentPage);
           
            return res.status(hotelData.status).json({
                errCode: hotelData.errCode,
                message: hotelData.errMessage,
                data: hotelData.hotelInfo || 'null',
                total: hotelData.total || 0,
                currentPage:hotelData.currentPage ||0,
                perPage: hotelData.perPage || 0,
                });
        } catch(error){
            next(error)
        }
    }

    // handle remove Hotel
    handleRemoveHotel = async (req: Request, res: Response, next: NextFunction)=>{
        try{

            const { idHotel } = req.body;

            const hotelData: IHotelData = await hotelService.handleRemoveHotelById(idHotel);
           
            return res.status(hotelData.status).json({
                errCode: hotelData.errCode,
                message: hotelData.errMessage,
                data: hotelData.hotelInfo || 'null',
                });
        } catch(error){
            next(error)
        }
    }

    //
    // transport

    handleAddNewTransport = async (req: Request, res: Response, next: NextFunction)=>{
        try{
            const data = req.body;
           
            const transportData: ITransportData = await transportService.transportNew(data);
           
            return res.status(transportData.status).json({
                errCode: transportData.errCode,
                message: transportData.errMessage,
                data: transportData.transportInfo || 'null',
                });
        } catch(error){
            next(error)
        }
    }
    // handle Update Hotel
    handleUpdateTransport = async (req: Request, res: Response, next: NextFunction)=>{
        try{

            const data = req.body;
           
            const transportData: ITransportData = await transportService.handleUpdateTransport(data);
           
            return res.status(transportData.status).json({
                errCode: transportData.errCode,
                message: transportData.errMessage,
                data: transportData.transportInfo || 'null',
                });
        } catch(error){
            next(error)
        }
    }

    // handle get list transport
    handleGetListTransport = async (req: Request, res: Response, next: NextFunction)=>{
        try{

            const departure: string | null = typeof req.query.departure === 'string' ? req.query.departure : null;
            const destination: string | null = typeof req.query.destination === 'string' ? req.query.destination : null;
            const transportName: string | null = typeof req.query.transportName === 'string' ? req.query.transportName : null;

            const perPage = typeof req.query.perPage === 'string' ? parseInt(req.query.perPage) : 10;
            const currentPage = typeof req.query.currentPage === 'string' ? parseInt(req.query.currentPage, 10) : 1;

            const transportData: ITransportData = await transportService.handleGetListTransport(departure, destination, transportName, perPage, currentPage);
           
            return res.status(transportData.status).json({
                errCode: transportData.errCode,
                message: transportData.errMessage,
                data: transportData.transportInfo || 'null',
                total: transportData.total || 0,
                currentPage:transportData.currentPage ||0,
                perPage: transportData.perPage || 0,
                });
        } catch(error){
            next(error)
        }
    }

    // handle remove transport
    handleRemoveTransport = async (req: Request, res: Response, next: NextFunction)=>{
        try{

            const { idTransport } = req.body;

            const transportData: ITransportData = await transportService.handleRemoveTransportById(idTransport);
           
            return res.status(transportData.status).json({
                errCode: transportData.errCode,
                message: transportData.errMessage,
                data: transportData.transportInfo || 'null',
                });
        } catch(error){
            next(error)
        }
    }

    // get list tour incoming

    handleGetListTourIncoming = async (req: Request, res: Response, next: NextFunction)=>{
        try{       

            const perPage = typeof req.query.perPage === 'string' ? parseInt(req.query.perPage) : 10;
            const currentPage = typeof req.query.currentPage === 'string' ? parseInt(req.query.currentPage, 10) : 1;

            const tourData: TourData = await tourService.getListTourComing(perPage, currentPage);
           
            return res.status(tourData.status).json({
                errCode: tourData.errCode,
                message: tourData.errMessage,
                data: tourData.tourInfor || 'null',
                total: tourData.total || 0,
                currentPage:tourData.currentPage ||0,
                perPage: tourData.perPage || 0,
                });
        } catch(error){
            next(error)
        }
    } 
    
    // accept tour incoming

    handleAcceptTourIncoming = async (req: Request, res: Response, next: NextFunction)=>{
        try{       

           const {tourId} = req.body;
           if(!tourId)
           {
                return res.status(400).json({
                    errCode: '400',
                    message: 'Input invalid value - tourId'
                })
           }
           const tourData: TourData = await tourService.AcceptTourComing(tourId);
            return res.status(tourData.status).json({
                errCode: tourData.errCode,
                message: tourData.errMessage
            })

               
        } catch(error){
            next(error)
        }
    }

    // cancel tour incoming

    handleCancelTourIncoming = async (req: Request, res: Response, next: NextFunction)=>{
        try{    
           const {tourId} = req.body;
           if(!tourId)
           {
                return res.status(400).json({
                    errCode: '400',
                    message: 'Input invalid value - tourId'
                })
           }
           const tourData: TourData = await tourService.CancelTourComing(tourId);
            return res.status(tourData.status).json({
                errCode: tourData.errCode,
                message: tourData.errMessage
            })

               
        } catch(error){
            next(error)
        }
    }
}

export default new AdminController();