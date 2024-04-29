import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenService {
  encryptToken(payload: object): string {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN;
    try {
      const plainPayload = Object.assign({}, payload);
      return jwt.sign(plainPayload, secret, { expiresIn });
    } catch (error) {
      throw new Error(`Error encrypting token`);
    }
  }
}
