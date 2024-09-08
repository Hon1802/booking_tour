'use strict'
import { Request, Response, NextFunction } from 'express';
import { TourData } from '../../databases/interface/tourInterface';
import tourService from '../../services/tour.service';
import { handleLogin } from '../customers/index';

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
}

export default new ToursController();