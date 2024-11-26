import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ErrorMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    res.on('finish', () => {
      if (res.statusCode >= 400) {
        console.error(`[Error]: ${req.method} ${req.url} - ${res.statusCode}`);
      }
    });
    next();
  }
}
