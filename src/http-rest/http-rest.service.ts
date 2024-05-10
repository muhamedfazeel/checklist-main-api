import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { Readable } from 'stream';
import { CustomLogger } from 'src/custom-logger/custom-logger.service';

@Injectable()
export class HttpRestService {
  constructor(
    private readonly httpService: HttpService,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setContext(HttpRestService.name);
  }

  /**
   * Method to send a GET stream request to a given URL.
   * @param {string} url URL string.
   * @returns {Promise<Readable>} Response data stream.
   */
  async getStream(url: string): Promise<Readable> {
    try {
      const { data } = await lastValueFrom(
        this.httpService.get(encodeURI(url), { responseType: 'stream' }),
      );
      return data;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Method to send a POST request to a given URL.
   * @param {string} url URL string.
   * @param {any} param Request Parameters.
   * @param {any} config Request Configuration.
   * @returns {Promise<T>} Response data.
   */
  async post<T>(url: string, param: any, config?: any): Promise<T> {
    try {
      const { data } = await lastValueFrom(
        this.httpService.post<T>(url, param, config),
      );
      return data;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
