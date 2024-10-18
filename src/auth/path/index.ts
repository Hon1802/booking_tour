// List of URLs to bypass
export const bypassUrls = [
  '/',
  '/v1/api/sign-up',
  '/v1/api/sign-in',
  '/v1/api/log-out',
  '/v1/api/forgot-password',
  '/v1/api/get-tour-by-number/',
  '/v1/api/get-tour-by-id/:tourid',
  '/v1/api/common/verification-email-exist',
  '/v1/api/common/verification-email',
  '/v1/api/common/confirm-otp-email'

].map((url) => url.toLowerCase().trim());

// List of URLs for admin access
const adminBaseUrl = '/v1/api/admin/';

export const adminUrls = [
  // get
  'hot-tour',
  'get-tour-by-number/',
  'get-tour-by-id/:tourid',
  'get-tour-by-number/:count',
  // another
  'update-tour-status/',
  'update-tour-by-id',
  'upload-image-remove',
  'upload-image',
  'new-tour',
// ].map((url) => url.toLowerCase().trim());
].map((endpoint) => (adminBaseUrl + endpoint).toLowerCase().trim());

// List of URLs for admin access

export const userUrl = [
  '/v1/api/get-tour-by-number/',
  '/v1/api/get-tour-by-id/:id',
  '/v1/api/upload-avatar',
  '/v1/api/delete-account',
  '/v1/api/get-user-by-id/:id',
  '/v1/api/get-user-by-id:id',
  '/v1/api/update-password',
  '/v1/api/update-user-by-id'

].map((url) => url.toLowerCase().trim());

