import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtRefreshMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const currentTime = Math.floor(Date.now() / 1000);

        if ((decoded as { exp: number }).exp - currentTime < 300) {
          const newToken = jwt.sign(
            { data: decoded.sub },
            process.env.JWT_SECRET,
            { expiresIn: '1m' },
          );
          res.setHeader('New-Token', newToken);

          console.log('newToken', newToken);
        }
      } catch (err) {
        console.error('Token verification failed:', err.message);
        throw new UnauthorizedException();
      }
    }

    next();
  }
}
