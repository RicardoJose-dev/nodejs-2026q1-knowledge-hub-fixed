import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exception');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let error = 'Internal Server Error';
    let message = 'An unexpected error occurred';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        error = (exceptionResponse as any).error || error;
        message = (exceptionResponse as any).message || message;
      } else if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      }
    }

    // Log the error with stack trace
    this.logger.error(
      `Error processing ${request.method} ${request.url}`,
      (exception as any).stack || String(exception),
    );

    response.status(status).json({
      statusCode: status,
      error,
      message,
    });
  }
}
