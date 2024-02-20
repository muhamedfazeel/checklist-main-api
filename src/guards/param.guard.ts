import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as Joi from 'joi';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class ParamGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const logger = new Logger(ParamGuard.name);
    const req = context.switchToHttp().getRequest();

    const URLParam = Joi.object().unknown(true);
    const reqParams = URLParam.validate(req.params, { abortEarly: false });
    if (reqParams.error) {
      logger.error(reqParams.error.message);
      return throwError(() => new NotFoundException());
    }
    return true;
  }
}
