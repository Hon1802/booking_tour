// List of URLs to bypass
const passBaseUrl = '/v1/api';

export const bypassUrls = [
  '/',
  '/sign-up',
  '/sign-in',
  '/log-out',
  '/forgot-password',
  '/get-tour-by-number/',
  '/get-tour-by-id/:tourid',
  '/get-tour-by-id/',
  '/get-tour-by-id',
  '/common/verification-email-exist',
  '/common/verification-email',
  '/common/confirm-otp-email',
  
  '/tours/filter',
  '/tours/filter/',
  
  '/hot-tours',
  '/hot-tours/',

  '/latest-tours',
  '/latest-tours/',

].map((endpoint) => (passBaseUrl + endpoint).toLowerCase().trim());

// List of URLs for admin access
const adminBaseUrl = '/v1/api/admin/';

export const adminUrls = [
  // get
  'hot-tour',
  'get-tour-by-number/',
  'get-tour-by-number',
  'get-tour-by-id/:tourid',
  'get-tour-by-id/',
  'get-tour-by-id',
  'get-tour-by-number',
  'get-tour-by-number/',
  'get-tour-by-number/:count',
  'tours/filter',
  'tours/filter/',
  
  // another
  'tours/remove',
  'update-tour-status/',
  'upload-image-remove',
  'update-tour-by-id',
  'update-tour-by-id/',
  'upload-image',
  'new-image',
  'new-tour',
  // hotel
  'hotel',
  'hotel/update',
  'hotel/remove-hotel',
  // transport
  'transport',
  'transport/update',
  'transport/remove-transport',

  //
  'incoming-tours',
  'incoming-tours/accept',
  'incoming-tours/cancel',

  //
  'deposit-users',

  //
  'bookings',
  'bookings/detail',
  'refunds',
  'refunds/status',

  //


// ].map((url) => url.toLowerCase().trim());
].map((endpoint) => (adminBaseUrl + endpoint).toLowerCase().trim());

// List of URLs for admin access
const userBaseUrl = '/v1/api';
export const userUrl = [
  '/get-tour-by-number',
  '/get-tour-by-number/',
  '/get-tour-by-id/:id',
  '/get-tour-by-id/',
  '/get-tour-by-id',
  '/upload-avatar',
  '/delete-account',
  '/get-user-by-id/:id',
  '/get-user-by-id:id',
  '/get-user-by-id',
  '/update-password',
  '/update-user-by-id',
  // booking tour
  '/bookings',
  '/bookings/status',
  '/payment',
  '/bookings',
  '/bookings/detail',
].map((endpoint) => (userBaseUrl + endpoint).toLowerCase().trim());

