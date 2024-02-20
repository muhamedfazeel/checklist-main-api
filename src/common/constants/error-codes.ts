export const ERROR_CODES = {
  DEFAULT: {
    code: 1000,
    message: 'Internal Error',
  },
  INTERNAL: {
    statusCode: 1001,
    message: 'Internal error',
  },
  INPUT: {
    code: 1002,
    message: 'Invalid input format',
  },
  AUTH_ERROR: {
    code: 1003,
    message: 'Authentication error',
  },
  NOT_FOUND: {
    code: 1004,
    message: 'Resource not found',
  },
  FORBIDDEN: {
    code: 1005,
    message: 'This request cannot be fulfilled',
  },
  REQUEST_BODY_LARGE: {
    statusCode: 1006,
    message: 'Request body too large',
  },
  INVALID_ACCESS_TOKEN: {
    code: 1007,
    message: 'Invalid access token',
  },
  INVALID_REFRESH_TOKEN: {
    code: 1008,
    message: 'Invalid refresh token',
  },
  NO_AUTH_TOKEN: {
    code: 1009,
    message: 'No auth token',
  },
  MAX_LOGIN_LIMIT: {
    code: 1010,
    message: 'Maximum login limit reached',
  },
  LOGIN_BLOCKED: {
    code: 1011,
    message: 'Login blocked after consecutive failed login attempts',
  },
  INACTIVE_USER: {
    code: 1012,
    message: 'User is inactive',
  },
  REQUEST_BODY_EMPTY: {
    code: 1020,
    message: 'Request body is empty',
  },
  NOT_EXIST_USER: {
    code: 1033,
    message: 'User does not exist',
  },
};
