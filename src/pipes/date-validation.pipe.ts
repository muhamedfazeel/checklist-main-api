import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { DateTime } from 'luxon';
import { ERROR_CODES } from '../common/constants';

Injectable();
export class DateValidationPipe implements PipeTransform {
  async transform(payload: any): Promise<any> {
    const invalidStartDateError = {
      code: ERROR_CODES.INPUT.code,
      message: 'Start Date should be lesser than End date',
    };
    const invalidEndDateError = {
      code: ERROR_CODES.INPUT.code,
      message: 'End Date should be lesser than current date and time',
    };
    const startDate = payload.startDate
      ? DateTime.fromISO(payload.startDate)
      : null;
    const endDate = payload.endDate ? DateTime.fromISO(payload.endDate) : null;

    if (startDate && endDate && endDate > DateTime.utc())
      throw new BadRequestException(invalidEndDateError);
    if (startDate && endDate && startDate > endDate)
      throw new BadRequestException(invalidStartDateError);
    if ((!startDate && endDate) || (startDate && !endDate))
      throw new BadRequestException(ERROR_CODES.INPUT);
    return payload;
  }
}
