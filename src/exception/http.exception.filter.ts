import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const status = exception.getStatus();
    const response = ctx.getResponse<Response>();

    if (exception instanceof BadRequestException) {
      const message = exception.getResponse()['error'];
      const error = exception.getResponse()['message'];

      response.status(status).json({
        code: status,
        message:
          message == undefined
            ? 'internal server error'
            : message.toLowerCase(),
        error: error,
      });
    } else {
      const message = exception.getResponse()['message'];
      const error = exception.getResponse()['error'];

      response.status(status).json({
        code: status,
        message:
          message == undefined
            ? 'internal server error'
            : message.toLowerCase(),
        error: error,
      });
    }
  }
}
