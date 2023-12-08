import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';

const errorTypes = {
  DB_ERROR: 'DB error!',
  HTTP_ERROR: 'Http error!',
  SERVER_ERROR: 'Server error!',
  LOGIN_ERROR: 'Login error!',
};

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const timestamp = new Date().toISOString();
    //db exception

    if (exception.detail) {
      this.logger.error({
        type: errorTypes.DB_ERROR,
        errorDetails: exception.errorDetails,
        path: request.url,
        timestamp,
      });
      response.status(400).json({
        type: errorTypes.DB_ERROR,
        message: exception.detail,
      });
    } else if (!!exception?.response?.statusCode) {
      this.logger.error({
        type: errorTypes.HTTP_ERROR,
        errorDetails: exception.getResponse()['error'],
        path: request.url,
        timestamp,
      });
      response.status(exception.status || 500).json({
        type: errorTypes.HTTP_ERROR,
        message: exception?.response?.message || 'Http error',
      });
    } else {
      this.logger.error({
        type: errorTypes.SERVER_ERROR,
        errorDetails: exception,
        path: request.url,
        timestamp,
        message: exception?.message || 'SERVER ERROR!',
      });
      response.status(exception.status || 500).json({
        type: errorTypes.SERVER_ERROR,
        message: exception?.message || 'SERVER ERROR',
      });
    }
  }
}
