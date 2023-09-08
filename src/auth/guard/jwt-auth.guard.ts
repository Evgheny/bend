import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { JwtRefreshMiddleware } from '../../middleware/jwt-refresh.middleware';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly jwtService: JwtService) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];
    const decodedToken: any = this.jwtService.decode(token);

    if (decodedToken && (decodedToken as { exp: number }).exp) {
      const currentTime = Math.floor(Date.now() / 1000);

      if ((decodedToken as { exp: number }).exp - currentTime < 300) {
        const newToken = this.jwtService.sign(
          { id: decodedToken.id, role: decodedToken.role },
          { expiresIn: '1m' },
        );

        request.res.setHeader('New-Token', newToken);
      }
    }

    const jwtRefreshMiddleware = new JwtRefreshMiddleware();
    jwtRefreshMiddleware.use(request, request.res, () => {});

    return true;
  }
}
