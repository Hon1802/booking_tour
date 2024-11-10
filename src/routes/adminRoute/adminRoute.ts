// 'use strict'
// import { Router } from 'express';
// import adminController from '../../controller/admins/admin.controller';
// import tourController from '../../controller/tours/tour.controller';
// export const adminRoute = Router();

// adminRoute.post('/new-tour', adminController.handleAddNewTour);

// adminRoute.get('/get-tour-by-number', tourController.handleGetTourByNumber);

// adminRoute.get('/get-tour-by-id', tourController.handleGetTourById);

// adminRoute.patch('/update-tour-status', adminController.handleUpdateStatusTour);

// adminRoute.patch('/update-tour-by-id', adminController.handleUpdateTourById);

// adminRoute.patch('/upload-image', adminController.handleUpdateImageTour);

// adminRoute.patch('/new-image', adminController.handleNewImageTour);

// adminRoute.patch('/upload-image-remove', adminController.handleRemoveImageTour);

// adminRoute.get('/tours/filter', adminController.handleFilterStatusTour);


// adminRoute.delete('/tours/remove', adminController.handleRemoveTour);
'use strict';
import { Router } from 'express';
import adminController from '../../controller/admins/admin.controller';
import tourController from '../../controller/tours/tour.controller';

export const adminRoute = Router();

/**
 * @openapi
 * /v1/api/admin/new-tour:
 *   post:
 *     description: Add a new tour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               duration:
 *                 type: number
 *     responses:
 *       201:
 *         description: New tour created
 */
adminRoute.post('/new-tour', adminController.handleAddNewTour);

/**
 * @openapi
 * /v1/api/admin/get-tour-by-number:
 *   get:
 *     description: Get tour by tour number
 *     parameters:
 *       - in: query
 *         name: number
 *         schema:
 *           type: string
 *         required: true
 *         description: The tour number
 *     responses:
 *       200:
 *         description: Successfully retrieved tour details
 */
adminRoute.get('/get-tour-by-number', tourController.handleGetTourByNumber);

/**
 * @openapi
 * /v1/api/admin/get-tour-by-id:
 *   get:
 *     description: Get tour by ID
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The tour ID
 *     responses:
 *       200:
 *         description: Successfully retrieved tour details
 */
adminRoute.get('/get-tour-by-id', tourController.handleGetTourById);

/**
 * @openapi
 * /v1/api/admin/update-tour-status:
 *   patch:
 *     description: Update tour status
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tourId:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated tour status
 */
adminRoute.patch('/update-tour-status', adminController.handleUpdateStatusTour);

/**
 * @openapi
 * /v1/api/admin/update-tour-by-id:
 *   patch:
 *     description: Update tour details by ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tourId:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               duration:
 *                 type: number
 *     responses:
 *       200:
 *         description: Successfully updated tour
 */
adminRoute.patch('/update-tour-by-id', adminController.handleUpdateTourById);

/**
 * @openapi
 * /v1/api/admin/upload-image:
 *   patch:
 *     description: Upload image for a tour
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               tourId:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Successfully uploaded image
 */
adminRoute.patch('/upload-image', adminController.handleUpdateImageTour);

/**
 * @openapi
 * /v1/api/admin/new-image:
 *   patch:
 *     description: Add new image for a tour
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               tourId:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Successfully added new image
 */
adminRoute.patch('/new-image', adminController.handleNewImageTour);

/**
 * @openapi
 * /v1/api/admin/upload-image-remove:
 *   patch:
 *     description: Remove image from a tour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tourId:
 *                 type: string
 *               imageId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully removed image
 */
adminRoute.patch('/upload-image-remove', adminController.handleRemoveImageTour);

/**
 * @openapi
 * /v1/api/admin/tours/filter:
 *   get:
 *     description: Filter tours by status
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         required: true
 *         description: The status of the tours to filter
 *     responses:
 *       200:
 *         description: Successfully filtered tours
 */
adminRoute.get('/tours/filter', adminController.handleFilterStatusTour);

/**
 * @openapi
 * /v1/api/admin/tours/remove:
 *   delete:
 *     description: Remove a tour
 *     parameters:
 *       - in: query
 *         name: tourId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the tour to remove
 *     responses:
 *       200:
 *         description: Successfully removed tour
 */
adminRoute.delete('/tours/remove', adminController.handleRemoveTour);
