import { Injectable } from '@nestjs/common';
import * as QueryString from 'querystring';

@Injectable()
export class UtilsService {
  /**
   * Method to produce a URL query string from a given object by iterating through the object's own properties.
   * @param {Record<string, any>} obj Object to be converted into a query string.
   * @returns {string} Query string.
   */
  convertObjectToQueryString(obj: Record<string, any>): string {
    const queryString = QueryString.stringify(obj);
    return queryString ? `?${queryString}` : '';
  }

  /**
   * Validates option text input.
   * @param {string} str String
   * @returns {string} Converted string
   */
  toCamel = (str: string): string => {
    return str.replace(/_([a-z])/g, (word: string) => word[1].toUpperCase());
  };

  /**
   * Validates option text input.
   * @param {string} str String
   * @returns {string} Converted string
   */
  toSnake = (str: string): string => {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase();
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
        newObj[this.toCamel(key)] = this.convertKeysToCamelCase(obj[key]);
      });

      return newObj;
    } else if (Array.isArray(obj)) {
      return obj.map((i) => this.convertKeysToCamelCase(i));
    }

    return obj;
  };

  /**
   * Converts object or object array's keys to snake case.
   * @param {any[] | any} obj Object or object array
   * @returns {any[] | any} Converted object or object array
   */
  convertKeysToSnakeCase = (obj: any[] | any): any[] | any => {
    if (this.isObject(obj)) {
      const newObj = {};

      Object.keys(obj).forEach((key) => {
        newObj[this.toSnake(key)] = this.convertKeysToSnakeCase(obj[key]);
      });

      return newObj;
    } else if (Array.isArray(obj)) {
      return obj.map((i) => this.convertKeysToSnakeCase(i));
    }

    return obj;
  };

  /**
   * Checks whether given string is valid date (YYYYMMDD) or not
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
   * Returns current date in YYYYMMDD format
   * @returns {number}
   */
  static getCurrentDateInYYYYMMDDFormat = (): number => {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');

    return +`${year}${month}${day}`;
  };

  /**
   * Returns date in `YYYY-MM-DD` format
   * @param {string} inputDate in `YYYYMMDD` format
   * @returns {string}
   */
  static formatDate = (inputDate: string): string => {
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
  };
}
