import { Injectable } from '@nestjs/common';
import * as K from '../common/constants';

@Injectable()
export class UtilsService {
  /**
   * Validates option text input.
   * @param {string} str String
   * @returns {string} Converted string
   */
  convertToCamel = (str: string): string => {
    return str.replace(/_([a-z1-3])/g, (word: string) => word[1].toUpperCase());
  };

  /**
   * Checks object is an actual JavaScript object.
   * @param {any} obj Object to be checked
   * @returns {boolean} Whether object or not
   */
  private isObject = (obj: any[] | any): boolean => {
    return (
      obj === Object(obj) &&
      obj instanceof Date === false &&
      !Array.isArray(obj) &&
      typeof obj !== 'function'
    );
  };

  /**
   * Converts object or object array's keys to camel case.
   * @param {any[] | any} obj Object or object array
   * @returns {any[] | any} Converted object or object array
   */
  convertKeysToCamelCase = (obj: any[] | any): any[] | any => {
    if (this.isObject(obj)) {
      const newObj = {};

      Object.keys(obj).forEach((key) => {
        newObj[this.convertToCamel(key)] = this.convertKeysToCamelCase(
          obj[key],
        );
      });

      return newObj;
    } else if (Array.isArray(obj)) {
      return obj.map((i) => this.convertKeysToCamelCase(i));
    }

    return obj;
  };

  /**
   * Converts bytes into MB.
   * @param {number} bytes Number of bytes
   * @returns {string} Number of MB
   */
  convertBytesToMB = (bytes: number): string => {
    const ONE_MB_IN_BYTES = 1000000;
    const dataInMB = bytes / ONE_MB_IN_BYTES;

    const size = `${Number(dataInMB.toFixed(2))} MB`;
    return size;
  };

  /**
   * Extracts key from url
   * @param {string} url URL
   * @returns {string} Key
   */
  getKeyFromUrl = (url: string) => url.split('.com/').pop();

  /**
   * Get UTC Timestamp From Epoch Seconds
   * @param {number} seconds Seconds
   * @returns {Date} UTC Timestamp
   */
  getUTCTimeFromEpochSeconds = (seconds: number): Date => {
    const date = new Date(Date.UTC(1970, 0, 1));
    date.setUTCSeconds(seconds);
    return date;
  };

  /**
   * Extract property value
   * @param param
   * @returns
   */
  extractValueFromParam(param: string): string {
    const value = param
      .match(/\[(.+?)\]/g)
      ?.pop()
      ?.replace(/\[|\]/g, '');
    return value;
  }

  /**
   * Function to escape special characters
   * @param {string} str
   * @returns {string}
   */
  escapeSpecialCharacters = (str: string): string => {
    return str.replace(K.SPECIAL_CHARACTERS, (match) => `\\${match}`);
  };

  /**
   * Checks whether given string is valid date or not
   * @param {string} date
   * @returns {boolean}
   */
  static isValidDate = (date: string): boolean => {
    if (date.length !== 8) {
      throw new Error('Invalid date: The date must have exactly 8 characters.');
    }

    // Check if all characters are numbers
    if (!/^\d+$/.test(date)) {
      throw new Error(
        'Invalid date: The date must contain only numeric characters.',
      );
    }

    return true;
  };

  /**
   * Checks whether given string is valid datetime or not
   * @param {string} datetime
   * @returns {boolean}
   */
  static isValidDatetime = (datetime: string): boolean => {
    if (datetime.length !== 12) {
      console.log(datetime);

      throw new Error(
        'Invalid date: The datetime must have exactly 8 characters.',
      );
    }

    // Check if all characters are numbers
    if (!/^\d+$/.test(datetime)) {
      throw new Error(
        'Invalid datetime: The datetime must contain only numeric characters.',
      );
    }

    return true;
  };

  /**
   * Returns current date in YYYYMMDD format
   * @returns {number}
   */
  static getCurrentDateInYYYYMMDDFormat(): number {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');

    return +`${year}${month}${day}`;
  }

  /**
   * Returns date in `YYYY-MM-DD` format
   * @param {string} inputDate in `YYYYMMDD` format
   * @returns {string}
   */
  static formatDate(inputDate: string): string {
    try {
      UtilsService.isValidDate(inputDate);

      const year = inputDate.substring(0, 4);
      const month = inputDate.substring(4, 6);
      const day = inputDate.substring(6, 8);

      // Form the 'YYYY-MM-DD' format
      const formattedDate = `${year}-${month}-${day}`;

      return formattedDate;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Returns date in `YYYY-MM-DD` format
   * @param {string} inputDate in `YYYYMMDD` format
   * @returns {string}
   */
  formatDatetime(inputDatetime: string): string {
    try {
      UtilsService.isValidDatetime(inputDatetime);

      const year = parseInt(inputDatetime.substring(0, 4));
      const month = parseInt(inputDatetime.substring(4, 6));
      const day = parseInt(inputDatetime.substring(6, 8));
      const hour = parseInt(inputDatetime.substring(8, 10));
      const minute = parseInt(inputDatetime.substring(10, 12));

      // Form the 'YYYY-MM-DDTHH:MM:SS.SSSZ' format
      const ISODatetime = new Date(
        year,
        month,
        day,
        hour,
        minute,
      ).toISOString();

      return ISODatetime;
    } catch (error) {
      throw error;
    }
  }
}
