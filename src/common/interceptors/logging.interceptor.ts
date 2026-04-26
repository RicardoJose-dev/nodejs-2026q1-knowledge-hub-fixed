import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

function sanitize(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  const sensitiveFields = ['password', 'refreshToken', 'accessToken'];
  const clone = Array.isArray(obj) ? [...obj] : { ...obj };
  for (const key in clone) {
    if (sensitiveFields.includes(key)) {
      clone[key] = '[REDACTED]';
    } else if (typeof clone[key] === 'object') {
      clone[key] = sanitize(clone[key]);
    }
  }
  return clone;
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, originalUrl, query, body } = req;
    const sanitizedBody = sanitize(body);

    const now = Date.now();

    this.logger.log(
      `Incoming Request: ${method} ${originalUrl} | Query: ${JSON.stringify(query)} | Body: ${JSON.stringify(sanitizedBody)}`,
    );

    return next.handle().pipe(
      tap((_) => {
        const res = context.switchToHttp().getResponse();
        const statusCode = res.statusCode;
        const responseTime = Date.now() - now;
        this.logger.log(
          `Outgoing Response: ${method} ${originalUrl} | Status: ${statusCode} | Response Time: ${responseTime}ms`,
        );
      }),
    );
  }
}
