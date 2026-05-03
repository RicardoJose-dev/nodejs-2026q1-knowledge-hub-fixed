import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private requestsMap = new Map<string, { count: number; timestamp: number }>();
  private readonly limit = parseInt(process.env.AI_RATE_LIMIT_RPM ?? '20', 10);
  private readonly ttl = 60 * 1000;

  use(req: Request, res: Response, next: NextFunction) {
    const key = req.ip;
    const now = Date.now();

    let entry = this.requestsMap.get(key);

    if (!entry || now - entry.timestamp > this.ttl) {
      entry = { count: 1, timestamp: now };
    } else {
      entry.count += 1;
    }

    this.requestsMap.set(key, entry);

    if (entry.count > this.limit) {
      const retryAfter = Math.ceil((this.ttl - (now - entry.timestamp)) / 1000);
      res.setHeader('Retry-After', retryAfter);
      return res
        .status(429)
        .json({ message: 'Too Many Requests. Please try again later.' });
    }

    next();
  }
}
