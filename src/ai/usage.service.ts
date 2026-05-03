import { Injectable } from '@nestjs/common';

@Injectable()
export class AiUsageService {
  private totalRequests = 0;
  private requestsByEndpoint: Record<string, number> = {};

  increment(endpoint: string) {
    this.totalRequests += 1;
    this.requestsByEndpoint[endpoint] =
      (this.requestsByEndpoint[endpoint] ?? 0) + 1;
  }

  getTotalRequests(): number {
    return this.totalRequests;
  }

  getRequestsByEndpoint(): Record<string, number> {
    return { ...this.requestsByEndpoint };
  }
}
