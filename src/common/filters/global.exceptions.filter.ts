import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
} from '../errors/custom.errors';

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
    } else if (
      exception instanceof NotFoundError ||
      exception instanceof ValidationError ||
      exception instanceof UnauthorizedError ||
      exception instanceof ForbiddenError
    ) {
      status = (exception as any).statusCode;
      error = exception.name;
      message = exception.message;
    }

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
