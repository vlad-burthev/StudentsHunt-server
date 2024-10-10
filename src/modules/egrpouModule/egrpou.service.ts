import { Injectable } from '@nestjs/common';
import * as iconv from 'iconv-lite';
import { parseStringPromise } from 'xml2js';
import { EGRPOU } from './egrpou.entity';
import { Repository } from 'typeorm';
import { HttpResponseHandler } from 'src/services/response/HttpResponseHandler';
import { Response } from 'express';
import { IEgrpou } from 'src/interface';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EgrpouService {
  constructor(
    @InjectRepository(EGRPOU)
    private readonly egrpouRepository: Repository<EGRPOU>,
  ) {}

  async addEGRPOU(res: Response, egrpouCode: string): Promise<IEgrpou> {
    try {
      const response = await fetch(
        `https://adm.tools/action/gov/api/?egrpou=${egrpouCode}`,
      );

      if (!response.ok) {
        throw Error('ЄДРПОУ не знайдено');
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const xmlData = iconv.decode(buffer, 'windows-1251');

      const jsonData = await parseStringPromise(xmlData, {
        explicitArray: false,
        trim: true,
      });

      if (jsonData.error) {
        throw Error(jsonData.error);
      }

      return {
        egrpou: jsonData.export.company.$.egrpou,
        name: jsonData.export.company.$.name,
        name_short: jsonData.export.company.$.name_short,
        address: jsonData.export.company.$.address,
        director: jsonData.export.company.$.director,
        kved: jsonData.export.company.$.kved,
        inn: jsonData.export.company.$.inn,
        inn_date: jsonData.export.company.$.inn_date,
      };
    } catch (error) {
      throw HttpResponseHandler.error({
        res,
        message: error.message,
        error: error.name,
        statusCode: error.statusCode || 500,
      });
    }
  }

  async saveEgrpou(res: Response, egrpouData: IEgrpou) {
    try {
      await this.egrpouRepository.save(egrpouData);
      return true;
    } catch (error) {
      return HttpResponseHandler.error({
        res,
        message: error.message,
        error: error.name,
        statusCode: error.statusCode || 500,
      });
    }
  }
}
