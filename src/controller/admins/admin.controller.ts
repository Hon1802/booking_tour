'use strict'
import { Request, Response, NextFunction } from 'express';
import { TourData } from '../../databases/interface/tourInterface';
import tourService from '../../services/tour.service';
import { multerFile, upload } from '../../helpers/image';
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

    // image
    handleUpdateImageTour = async(req: Request, res: Response, next: NextFunction)=>{
        try{
            // files = req.files;
            upload.array('image')(req, res, async function (err) {
                const {id} = req.body;
                if(!id){
                    return res.status(400).json({
                        errCode: 400,
                        message: 'Missing inputs value'
                      });
                }
                const files= req.files as Express.Multer.File[];
                if (err) {
                    return res.status(400).json({
                        errCode: 400,
                        message: "Error uploading image.",
                    });
                }
                let paths = files.map(file => 'src/public/imageTour/' + file.filename);
                console.log(paths)
                
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

    // status
    handleUpdateStatusTour = async(req: Request, res: Response, next: NextFunction)=>{
        try{
            const {status, idTour} = req.body;
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
    // support function, private

}

export default new AdminController();