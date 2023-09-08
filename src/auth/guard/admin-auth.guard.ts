import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserRoles } from '../../constants/user.roles';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    // Assuming your user information is stored in the request user property
    const user = request.user;

    if (user && user.role === UserRoles.ADMIN) {
      return true;
    }

    return false;
  }
}
