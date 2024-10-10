export enum EnumHttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

export enum EnumHttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export enum EnumErrorName {
  BAD_REQUEST_ERROR = 'BadRequestError',
  UNAUTHORIZED_ERROR = 'UnauthorizedError',
  FORBIDDEN_ERROR = 'ForbiddenError',
  NOT_FOUND_ERROR = 'NotFoundError',
  TOKEN_EXPIRED_ERROR = 'TokenExpiredError',
}

export enum EnumLogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}