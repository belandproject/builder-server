import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class CollectionGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { user, collection } = context.switchToHttp().getRequest();
    return (
      user.id === collection.owner &&
      !collection.is_published &&
      !collection.locked_at
    );
  }
}
