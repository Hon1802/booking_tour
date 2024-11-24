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

/**
 * @openapi
 * /v1/api/admin/hotel:
 *   post:
 *     description: Add a new hotel to the system.
 *     parameters:
 *       - in: body
 *         name: hotel
 *         description: The hotel data to be added to the system.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             hotelName:
 *               type: string
 *               description: The name of the hotel.
 *               example: "Oceanview Hotel"
 *             address:
 *               type: string
 *               description: The address of the hotel.
 *               example: "123 Beach Avenue, Miami"
 *             location:
 *               type: string
 *               description: The location of the hotel.
 *               example: "Miami Beach"
 *             description:
 *               type: string
 *               description: A brief description of the hotel.
 *               example: "A luxury hotel with ocean views."
 *             starRating:
 *               type: integer
 *               description: The star rating of the hotel (1 to 5 stars).
 *               example: 4
 *             pricePerNight:
 *               type: number
 *               description: The price per night at the hotel in USD.
 *               example: 200
 *     responses:
 *       200:
 *         description: Successfully added the hotel to the system.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 errCode:
 *                   type: integer
 *                   example: 200
 *                 errMessage:
 *                   type: string
 *                   example: "Hotel registered successfully."
 *                 hotelInfo:
 *                   type: object
 *                   properties:
 *                     hotelName:
 *                       type: string
 *                       example: "Oceanview Hotel"
 *                     address:
 *                       type: string
 *                       example: "123 Beach Avenue, Miami"
 *                     location:
 *                       type: string
 *                       example: "Miami Beach"
 *                     description:
 *                       type: string
 *                       example: "A luxury hotel with ocean views."
 *                     starRating:
 *                       type: integer
 *                       example: 4
 *                     pricePerNight:
 *                       type: number
 *                       example: 200
 *       400:
 *         description: Bad request due to validation errors or missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 errCode:
 *                   type: integer
 *                   example: 400
 *                 errMessage:
 *                   type: string
 *                   example: "Name of hotel is required."
 *       500:
 *         description: Internal server error while adding the hotel.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 errCode:
 *                   type: integer
 *                   example: 500
 *                 errMessage:
 *                   type: string
 *                   example: "Can not add new hotel."
 */
adminRoute.post('/hotel', adminController.handleAddNewHotel);

/**
 * @openapi
 * /v1/api/admin/hotel/{id}:
 *   patch:
 *     description: Update an existing hotel by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the hotel to update.
 *         schema:
 *           type: string
 *           example: "60c72b2f9e4b3c001f7d3bfa"
 *       - in: body
 *         name: hotel
 *         description: The hotel data to update.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             hotelName:
 *               type: string
 *               description: The name of the hotel.
 *               example: "Updated Oceanview Hotel"
 *             address:
 *               type: string
 *               description: The address of the hotel.
 *               example: "456 Beach Avenue, Miami"
 *             location:
 *               type: string
 *               description: The location of the hotel.
 *               example: "Miami Beach"
 *             description:
 *               type: string
 *               description: A brief description of the hotel.
 *               example: "An updated luxury hotel with a better ocean view."
 *             starRating:
 *               type: integer
 *               description: The star rating of the hotel (1 to 5 stars).
 *               example: 5
 *             pricePerNight:
 *               type: number
 *               description: The price per night at the hotel in USD.
 *               example: 250
 *     responses:
 *       200:
 *         description: Successfully updated the hotel.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 errCode:
 *                   type: integer
 *                   example: 200
 *                 errMessage:
 *                   type: string
 *                   example: "Hotel updated successfully."
 *                 hotelInfo:
 *                   type: object
 *                   properties:
 *                     hotelName:
 *                       type: string
 *                       example: "Updated Oceanview Hotel"
 *                     address:
 *                       type: string
 *                       example: "456 Beach Avenue, Miami"
 *                     location:
 *                       type: string
 *                       example: "Miami Beach"
 *                     description:
 *                       type: string
 *                       example: "An updated luxury hotel with a better ocean view."
 *                     starRating:
 *                       type: integer
 *                       example: 5
 *                     pricePerNight:
 *                       type: number
 *                       example: 250
 *       400:
 *         description: Bad request due to invalid or missing data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 errCode:
 *                   type: integer
 *                   example: 400
 *                 errMessage:
 *                   type: string
 *                   example: "No hotel with id 60c72b2f9e4b3c001f7d3bfa"
 *       500:
 *         description: Internal server error while updating the hotel.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 errCode:
 *                   type: integer
 *                   example: 500
 *                 errMessage:
 *                   type: string
 *                   example: "Cannot update hotel."
 */

adminRoute.put('/hotel/update', adminController.handleUpdateHotel);

/**
 * @openapi
 * /v1/api/admin/hotels:
 *   get:
 *     description: Get a list of hotels, optionally filtered by location.
 *     parameters:
 *       - in: query
 *         name: location
 *         required: false
 *         description: Location to filter hotels by.
 *         schema:
 *           type: string
 *           example: "Miami"
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of hotels.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 errCode:
 *                   type: integer
 *                   example: 200
 *                 errMessage:
 *                   type: string
 *                   example: "Get hotels successfully."
 *                 hotelInfo:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       hotelName:
 *                         type: string
 *                         example: "Oceanview Hotel"
 *                       address:
 *                         type: string
 *                         example: "123 Beach Road, Miami"
 *                       location:
 *                         type: string
 *                         example: "Miami Beach"
 *                       description:
 *                         type: string
 *                         example: "A luxury hotel with stunning ocean views."
 *                       starRating:
 *                         type: integer
 *                         example: 5
 *                       pricePerNight:
 *                         type: number
 *                         example: 250
 *       400:
 *         description: No hotels found matching the given location.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 errCode:
 *                   type: integer
 *                   example: 400
 *                 errMessage:
 *                   type: string
 *                   example: "Not found"
 *       500:
 *         description: Internal server error while retrieving hotels.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 errCode:
 *                   type: integer
 *                   example: 500
 *                 errMessage:
 *                   type: string
 *                   example: "Internal error"
 */
adminRoute.get('/hotel', adminController.handleGetListHotel);

/**
 * @openapi
 * /v1/api/admin/hotels/{id}:
 *   delete:
 *     description: Remove a hotel by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the hotel to remove.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully removed the hotel.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 errCode:
 *                   type: integer
 *                   example: 200
 *                 errMessage:
 *                   type: string
 *                   example: "hotel deleted successfully."
 *       400:
 *         description: Invalid ID or hotel not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 errCode:
 *                   type: integer
 *                   example: 400
 *                 errMessage:
 *                   type: string
 *                   example: "Not found"
 *       500:
 *         description: Internal server error while removing the hotel.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 errCode:
 *                   type: integer
 *                   example: 500
 *                 errMessage:
 *                   type: string
 *                   example: "Internal error"
 */

adminRoute.delete('/hotel/remove-hotel', adminController.handleRemoveHotel);
/**
 * @openapi
 * /v1/api/admin/transport:
 *   post:
 *     description: Create a new transport entry.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transportName:
 *                 type: string
 *                 description: Name of the transport.
 *                 example: "Luxury Bus"
 *               company:
 *                 type: string
 *                 description: Transport company.
 *                 example: "Express Travel"
 *               type:
 *                 type: string
 *                 description: Type of transport (e.g., bus, train).
 *                 example: "Bus"
 *               departure:
 *                 type: string
 *                 description: Departure location.
 *                 example: "Hanoi"
 *               destination:
 *                 type: string
 *                 description: Destination location.
 *                 example: "Ho Chi Minh City"
 *               price:
 *                 type: number
 *                 description: Ticket price.
 *                 example: 50.5
 *     responses:
 *       200:
 *         description: Transport created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 errCode:
 *                   type: integer
 *                   example: 200
 *                 errMessage:
 *                   type: string
 *                   example: "transport registered successfully."
 *       400:
 *         description: Missing or invalid data.
 *       500:
 *         description: Internal server error.
 */
adminRoute.post('/transport', adminController.handleAddNewTransport);
/**
 * @openapi
 * /v1/api/admin/transport:
 *   get:
 *     description: Retrieve a list of transports with optional filters for departure and destination, and pagination.
 *     parameters:
 *       - in: query
 *         name: departure
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter transports by departure location.
 *         example: "Hanoi"
 *       - in: query
 *         name: destination
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter transports by destination location.
 *         example: "Ho Chi Minh City"
 *       - in: query
 *         name: perPage
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of transport records per page.
 *         example: 10
 *       - in: query
 *         name: currentPage
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The current page number for pagination.
 *         example: 2
 *     responses:
 *       200:
 *         description: Transports retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 errCode:
 *                   type: integer
 *                   example: 200
 *                 errMessage:
 *                   type: string
 *                   example: "Get transports successfully."
 *                 transportInfo:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "646c5d1234abcd56789ef012"
 *                       transportName:
 *                         type: string
 *                         example: "Luxury Bus"
 *                       company:
 *                         type: string
 *                         example: "Express Travel"
 *                       type:
 *                         type: string
 *                         example: "Bus"
 *                       departure:
 *                         type: string
 *                         example: "Hanoi"
 *                       destination:
 *                         type: string
 *                         example: "Ho Chi Minh City"
 *                       price:
 *                         type: number
 *                         example: 50.5
 *                 total:
 *                   type: integer
 *                   example: 50
 *                 currentPage:
 *                   type: integer
 *                   example: 2
 *                 perPage:
 *                   type: integer
 *                   example: 10
 *       400:
 *         description: No transport records found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 errCode:
 *                   type: integer
 *                   example: 400
 *                 errMessage:
 *                   type: string
 *                   example: "Not found"
 *                 transportInfo:
 *                   type: array
 *                   items: {}
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 errCode:
 *                   type: integer
 *                   example: 500
 *                 errMessage:
 *                   type: string
 *                   example: "Internal error"
 */
adminRoute.get('/transport', adminController.handleGetListTransport);
/**
 * @openapi
 * /v1/api/admin/transport/update:
 *   put:
 *     description: Update a transport by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the transport to be updated.
 *         example: "646c5d1234abcd56789ef012"
 *       - in: body
 *         name: dataTransport
 *         required: true
 *         description: The updated transport data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 company:
 *                   type: string
 *                   description: The company of the transport.
 *                   example: "Transport Co."
 *                 departure:
 *                   type: string
 *                   description: The departure location of the transport.
 *                   example: "Hanoi"
 *                 destination:
 *                   type: string
 *                   description: The destination of the transport.
 *                   example: "Ho Chi Minh City"
 *                 type:
 *                   type: string
 *                   description: The type of transport (e.g., bus, train).
 *                   example: "Bus"
 *                 price:
 *                   type: number
 *                   description: The price of the transport.
 *                   example: 100.5
 *     responses:
 *       200:
 *         description: Transport updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 errCode:
 *                   type: integer
 *                   example: 200
 *                 errMessage:
 *                   type: string
 *                   example: "Transport updated successfully."
 *                 transportInfo:
 *                   type: object
 *                   description: The updated transport information.
 *                   properties:
 *                     company:
 *                       type: string
 *                     departure:
 *                       type: string
 *                     destination:
 *                       type: string
 *                     type:
 *                       type: string
 *                     price:
 *                       type: number
 *       400:
 *         description: Invalid ID or transport not found, or validation errors.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 errCode:
 *                   type: integer
 *                   example: 400
 *                 errMessage:
 *                   type: string
 *                   example: "No transport with id {id}"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 errCode:
 *                   type: integer
 *                   example: 500
 *                 errMessage:
 *                   type: string
 *                   example: "Internal error"
 */
adminRoute.put('/transport/update', adminController.handleUpdateTransport);
/**
 * @openapi
 * /v1/api/admin/transport/remove-transport:
 *   delete:
 *     description: Delete a transport by its unique ID.
 *     parameters:
 *       - in: path
 *         name: idTransport
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the transport to be deleted.
 *         example: "646c5d1234abcd56789ef012"
 *     responses:
 *       200:
 *         description: Transport deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 errCode:
 *                   type: integer
 *                   example: 200
 *                 errMessage:
 *                   type: string
 *                   example: "Transport deleted successfully."
 *       400:
 *         description: Invalid ID or transport not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 errCode:
 *                   type: integer
 *                   example: 400
 *                 errMessage:
 *                   type: string
 *                   example: "Not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 errCode:
 *                   type: integer
 *                   example: 500
 *                 errMessage:
 *                   type: string
 *                   example: "Internal error"
 */
adminRoute.delete('/transport/remove-transport', adminController.handleRemoveTransport);

adminRoute.get('/incoming-tours', adminController.handleGetListTourIncoming);

// duyệt tour
adminRoute.post('/incoming-tours/accept', adminController.handleAcceptTourIncoming);
adminRoute.post('/incoming-tours/cancel', adminController.handleCancelTourIncoming); 

// get list deposit user
adminRoute.get('/deposit-users', adminController.handleGetListDepositUser); 

// get list booking
adminRoute.get('/bookings', adminController.handleGetListBooking); 
adminRoute.get('/bookings/detail', adminController.handleBookingById); 
