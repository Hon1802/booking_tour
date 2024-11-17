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
                tours: tourData.tourInfor,
                hotel: tourData?.hotel,
                trans: tourData?.transportation
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
            // const priceRanges = Array.isArray(req.query.priceRanges) ? req.query.priceRanges : [];
            // let priceRanges = req.query.priceRanges ? req.query.priceRanges : '';

            // // Kiểm tra nếu priceRanges là chuỗi (trường hợp chỉ có một khoảng giá duy nhất)
            // if (typeof priceRanges === 'string') {
            //     priceRanges = [priceRanges]; // Chuyển đổi thành mảng với một phần tử
            // }
            
            // // Nếu priceRanges là mảng hoặc đã được chuyển đổi thành mảng
            // if (Array.isArray(priceRanges)) {
            //     priceRanges.forEach((range) => {
            //       if (typeof range === 'string') {
            //         const [from, to] = range.split('-').map((value) => parseFloat(value));
            //         console.log('From:', from, 'To:', to);
            //       }
            //     });
            //   }
            // Xử lý priceRanges từ query string
            let priceRanges: string[] = [];
            if (req.query.priceRanges) {
                // Kiểm tra kiểu dữ liệu của priceRanges và ép kiểu nếu cần
                if (Array.isArray(req.query.priceRanges)) {
                  // Nếu priceRanges là mảng, giữ nguyên
                  priceRanges = req.query.priceRanges as string[];
                } else if (typeof req.query.priceRanges === 'string') {
                  // Nếu priceRanges là chuỗi, chuyển thành mảng một phần tử
                  priceRanges = [req.query.priceRanges];
                } else if (req.query.priceRanges instanceof Array) {
                  // Nếu là mảng các đối tượng ParsedQs, bạn sẽ cần kiểm tra và ép kiểu
                  priceRanges = (req.query.priceRanges as string[]).map((value) => value.toString());
                }
              }
            // Xử lý priceRanges (giả sử format là "from-to")
            priceRanges.forEach((range) => {
                const [from, to] = range.split('-').map((value) => parseFloat(value));
                if (!isNaN(from) && !isNaN(to)) {
                console.log('From:', from, 'To:', to);
                } else {
                console.error(`Invalid price range: ${range}`);
                }
            });
            
            logger.info(`perPage : ${perPage}; 
                currentPage : ${currentPage}; 
                keyword : ${keyword}; 
                priceRanges : ${priceRanges}; 
                fromPrice : ${fromPrice}; toPrice : ${toPrice}; 
                location : ${location}; 
                sortBy : ${sortBy};`);
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
                priceRanges,
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
    handleGetLastedTour = async(req: Request, res: Response, next: NextFunction)=>{
        try{            
            const perPage = typeof req.query.perPage === 'string' ? parseInt(req.query.perPage) : null;
            const currentPage = typeof req.query.currentPage === 'string' ? parseInt(req.query.currentPage, 10) : 1;
            logger.info('p:: Get latest tour ');
            // const status = typeof req.query.status === 'string' ? req.query.status : 'active';
            const status = 
                typeof req.query.status === 'string' 
                    ? (req.query.status === 'active' ? 0 : req.query.status === 'inactive' ? 1 : 2) 
                    : 2;
            const tourData: any = await tourService.latestTourCustomer(
                perPage, 
                currentPage, 
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
    handleGetHotTour = async(req: Request, res: Response, next: NextFunction)=>{
        try{            
            const perPage = typeof req.query.perPage === 'string' ? parseInt(req.query.perPage) : null;
            const currentPage = typeof req.query.currentPage === 'string' ? parseInt(req.query.currentPage, 10) : 1;
            logger.info('p:: Get latest tour ');
            // const status = typeof req.query.status === 'string' ? req.query.status : 'active';
            const status = 
                typeof req.query.status === 'string' 
                    ? (req.query.status === 'active' ? 0 : req.query.status === 'inactive' ? 1 : 2) 
                    : 2;
            const tourData: any = await tourService.HotTourCustomer(
                perPage, 
                currentPage, 
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