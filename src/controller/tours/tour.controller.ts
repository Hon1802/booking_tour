'use strict'
import { Request, Response, NextFunction } from 'express';
import { TourData } from '../../databases/interface/tourInterface';
import tourService from '../../services/tour.service';
import { handleLogin } from '../customers/index';
import { logger } from '../../log';

class ToursController {

    // get home tour

    handleGetTourByNumber = async (req: Request, res: Response, next: NextFunction)=>{
        try{
            let count: number = Number(req.query.count);
            if(isNaN(Number(count)))
            {
                count = 30;
            }
            console.log(`[P]::getTour with ::`, count);
            const tourData: TourData = await tourService.homeTour(Number(count));
            
            return res.status(tourData.status).json({
                errCode: tourData.errCode,
                message: tourData.errMessage,
                tours: tourData.tourInfor
                });
        } catch(error){
            next(error)
        }
    }
    
    // get all tour, public

    // get tour by id, public
    handleGetTourById = async (req: Request, res: Response, next: NextFunction)=>{
        try{
            const tourId = req.query.tourId as string;
            if(!tourId ){
                return res.status(400).json({
                    errCode: 400,
                    message: 'Missing inputs value "Tour Id:"'
                  });
            }
            console.log(`[P]::getTour with id ::`, tourId);
            const tourData: TourData = await tourService.getTourById(tourId);
            
            return res.status(tourData.status).json({
                errCode: tourData.errCode,
                message: tourData.errMessage,
                tours: tourData.tourInfor
                });
        } catch(error){
            next(error)
        }
    }

    handleFilterTour = async(req: Request, res: Response, next: NextFunction)=>{
        try{            
            // Lấy các tham số truy vấn và ép kiểu
            const perPage = typeof req.query.perPage === 'string' ? parseInt(req.query.perPage) : null;
            const currentPage = typeof req.query.currentPage === 'string' ? parseInt(req.query.currentPage, 10) : 1;
            const keyword = typeof req.query.keyword === 'string' ? req.query.keyword : '';
            const fromPrice = typeof req.query.fromPrice === 'string' ? req.query.fromPrice : '';
            const toPrice = typeof req.query.toPrice === 'string' ? req.query.toPrice : '';
            const location = typeof req.query.location === 'string' ? req.query.location : '';
            const sortBy = typeof req.query.sortBy === 'string' ? req.query.sortBy : '';
            logger.info(`perPage : ${perPage}; currentPage : ${currentPage}; keyword : ${keyword}; fromPrice : ${fromPrice}; toPrice : ${toPrice};; location : ${location};; sortBy : ${sortBy};`);
            // const status = typeof req.query.status === 'string' ? req.query.status : 'active';
            const status = 
                typeof req.query.status === 'string' 
                    ? (req.query.status === 'active' ? 0 : req.query.status === 'inactive' ? 1 : 2) 
                    : 2;
            const tourData: any = await tourService.filterTourCustomer(
                perPage, 
                currentPage, 
                keyword, 
                fromPrice,
                toPrice,
                location,
                sortBy,
                status
            );

            return res.status(200).json({
                errCode: '200',
                message: 'Get success',
                tourData
                });
        } catch(error){
            next(error)
        }
    }

}

export default new ToursController();