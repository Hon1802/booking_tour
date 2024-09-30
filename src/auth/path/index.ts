// List of URLs to bypass
export const bypassUrls = [
  '/',
  '/v1/api/sign-up',
  '/v1/api/sign-in',
  '/v1/api/log-out',
  '/v1/api/forgot-password',
  '/v1/api/get-tour-by-number/',
  '/v1/api/get-tour-by-id/:tourid',
  '/v1/api/common/verification-email',
  '/v1/api/common/confirm-otp-email'

].map((url) => url.toLowerCase().trim());

// List of URLs for admin access

export const adminUrls = [
  '/v1/api/admin/new-tour',
  '/v1/api/admin/get-tour-by-id/:tourid',
  '/v1/api/admin/update-tour-status/',
  '/v1/api/admin/get-tour-by-number/:count',
  '/v1/api/admin/get-tour-by-number/',
  '/v1/api/admin/update-tour-image'
].map((url) => url.toLowerCase().trim());

// List of URLs for admin access

export const userUrl = [
  '/v1/api/get-tour-by-number/',
  '/v1/api/get-tour-by-id/:id',
  '/v1/api/upload-avatar',
  '/v1/api/delete-account',
  '/v1/api/get-user-by-id/:id',
  '/v1/api/get-user-by-id:id'

].map((url) => url.toLowerCase().trim());

