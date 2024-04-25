import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('---------------------------------------------');
    console.log(
      `\n[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`,
    );

    const relevantHeaders = {
      host: req.headers.host,
      'user-agent': req.headers['user-agent'],
      accept: req.headers.accept,
      'accept-language': req.headers['accept-language'],
      'accept-encoding': req.headers['accept-encoding'],
    };
    console.log('Header:', JSON.stringify(relevantHeaders, null, 2));

    console.log('Body:', JSON.stringify(req.body, null, 2) ?? 'No body', '\n');

    const originalSend = res.send;

    res.send = function (body) {
      const formattedBody = JSON.stringify(JSON.parse(body), null, 2);
      console.log('Response:\n', formattedBody, '\n');
      console.log('---------------------------------------------\n');

      return originalSend.call(this, body);
    };

    next();
  }
}
