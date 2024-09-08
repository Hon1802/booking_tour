'use strict'
import { Request, Response, NextFunction } from 'express';
import { TourData } from '../../databases/interface/tourInterface';
import tourService from '../../services/tour.service';
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
           
            const userData: TourData = await tourService.tourNew(data);
           
            return res.status(userData.status).json({
                errCode: userData.errCode,
                message: userData.errMessage,
                });
        } catch(error){
            next(error)
        }
    }

    // update tour by id, public

    // support function, private

}

export default new AdminController();