import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import * as K from '../common/constants';

export class CustomValidationPipe extends ValidationPipe {
  constructor(private readonly options?: ValidationPipeOptions) {
    super();
  }

  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    this.validatorOptions = {
      ...this.validatorOptions,
      skipMissingProperties: false,
      whitelist: true,
      forbidNonWhitelisted: false,
      ...this.options,
    };

    try {
      const result = await super.transform(value, metadata);

      if (result) {
        Object.entries(result).forEach(([key, value]) => {
          if (value === null || value === undefined) delete result[key];
        });
      }

      return result;
    } catch (error) {
      const errorResponse = {
        code: K.ERROR_CODES.INPUT.code,
        message: error.response?.message,
      };

      throw new HttpException(errorResponse, HttpStatus.BAD_REQUEST);
    }
  }
}
