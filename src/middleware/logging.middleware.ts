import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * LoggingMiddleware is a middleware that logs the request and response details.
 * @class
 */
@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  /**
   * The middleware function that logs the request and response details.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @param {NextFunction} next - The next function in the middleware chain.
   */
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

    console.log(
      'Body:',
      req.body ? JSON.stringify(req.body, null, 2) : 'No body',
      '\n\n',
    );

    const originalSend = res.send;

    /**
     * Overriding the send function of the response object to log the response body.
     * @param {any} body - The response body.
     * @returns {any} The result of the original send function.
     */
    res.send = function (body: any): any {
      const formattedBody = JSON.stringify(JSON.parse(body), null, 2);
      console.log('Response:', formattedBody, '\n');
      console.log('---------------------------------------------\n');

      return originalSend.call(this, body);
    };

    next();
  }
}
