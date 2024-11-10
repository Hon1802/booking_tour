interface ErrorCode {
    code: string;
    message: string;
    codeHTTP?:string;
  }
  
  const errorCodes = {
    AUTH: {
      NO_TOKEN: {
        code: 'AUTH_001',
        message: 'No token provided',
      },
      INVALID_TOKEN: {
        code: 'AUTH_002',
        message: 'Token is invalid or expired',
      },
      TOKEN_EXPIRED: {
        code: 'AUTH_003',
        message: 'Token has expired',
      },
      PERMISSION_DENIED: {
        code: 'AUTH_004',
        message: 'Not permitted with current role',
      },
      ERROR_CODE_VERIFY: {
        code: 'AUTH_005',
        message: 'Error when verify token',
      },
      ERROR_UNCERTAIN: {
        code: 'AUTH_006',
        message: 'Uncertain error',
      },
    },
    USER: {
      NOT_FOUND: {
        code: 'USER_001',
        message: 'User not found',
      },
      DUPLICATE_EMAIL: {
        code: 'USER_002',
        message: 'Email already exists',
      },
    },
    TOUR: {
      NOT_FOUND: {
        code: 'TOUR_001',
        message: 'Tour not found',
      },
      INVALID_ID: {
        code: 'TOUR_002',
        message: 'Invalid tour ID',
      },
    },
    GENERAL: {
      INTERNAL_SERVER_ERROR: {
        code: 'GENERAL_001',
        message: 'Internal server error',
      },
      BAD_REQUEST: {
        code: 'GENERAL_002',
        message: 'Bad request',
      },
    },
    RESPONSE:{
      ID_NOT_SUPPORT: {
        code: 'ID_001',
        message: 'Internal server error - id incorrect format',
      },
      TOUR_ACTIVE_OR_BOOKED:{
        code: 'ERROR_TOUR_001',
        errMessage:`Cannot delete the tour. The tour is active or has booked slots.`
      }
    }
  };
  
  export default errorCodes;