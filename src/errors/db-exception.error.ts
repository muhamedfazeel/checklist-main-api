import { HttpException } from '@nestjs/common';
import * as K from '../common/constants';
import { UtilsService } from '../utils/utils.service';

export class DbExceptionError extends HttpException {
  constructor(props, context) {
    const utils = new UtilsService();
    const CONTEXT = 400;

    if (context.includes('duplicate key value violates unique constraint')) {
      props = {
        code: K.ERROR_CODES.INPUT.code,
        message: [
          `${utils.convertToCamel(props.detail.split(/[()]/, 2)[1])} should be unique`,
        ],
      };
      context = CONTEXT;
    } else if (context.includes('violates foreign key constraint')) {
      props = {
        code: K.ERROR_CODES.INPUT.code,
        message: [
          `${utils.convertToCamel(props.detail.split(/[()]/, 2)[1])} is invalid`,
        ],
      };
      context = CONTEXT;
    } else if (context.includes('violates check constraint')) {
      props = {
        code: K.ERROR_CODES.INPUT.code,
        message: [
          `${utils.convertToCamel(
            context.split(/"(.*?)"/g, 2)[1],
          )} should be a allowed value`,
        ],
      };
      context = CONTEXT;
    }
    super(props, context);
  }
}
