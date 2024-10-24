import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Token } from './token.entity';
import { InjectRepository } from '@nestjs/typeorm';

interface IToken {
  user: string;
  refreshToken: string;
}

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly configService: ConfigService,
  ) {}

  generateTokens<T extends Object>(payload: T) {
    const accessToken = jwt.sign(
      payload,
      this.configService.get<string>('JWT_SECRET_KEY')!,
      {
        expiresIn: '1d',
      },
    );

    const refreshToken = jwt.sign(
      payload,
      this.configService.get<string>('JWT_REFRESH_SECRET_KEY')!,
      {
        expiresIn: '30d',
      },
    );
    return { accessToken, refreshToken };
  }

  async saveToken(userId: string, refreshToken: string) {
    try {
      const tokenData = await this.tokenRepository.findOne({
        where: { userId },
      });

      if (!tokenData) {
        // Создаем новый токен, если его нет
        const newToken = await this.tokenRepository.save({
          userId,
          refreshToken,
        });
        return newToken;
      }

      tokenData.refreshToken = refreshToken;
      const updatedToken = await this.tokenRepository.save(tokenData);
      return updatedToken;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async removeToken(refreshToken: string) {
    try {
      const tokenData = await this.tokenRepository.delete({ refreshToken });
      return tokenData;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async validateAccessToken(accessToken: string) {
    try {
      const userData = jwt.verify(
        accessToken,
        this.configService.get<string>('JWT_SECRET_KEY'),
      );
      return userData;
    } catch (error) {
      return null;
    }
  }

  async validateRefreshToken(refreshToken: string) {
    try {
      const userData = jwt.verify(
        refreshToken,
        this.configService.get<string>('JWT_REFRESH_SECRET_KEY'),
      );
      return userData;
    } catch (error) {
      return null;
    }
  }

  async findToken(refreshToken: string) {
    const tokenData = await this.tokenRepository.findOne({
      where: { refreshToken },
    });
    return tokenData;
  }

  async getTokenById(userId: string) {
    const token = await this.tokenRepository.findOne({
      where: { userId },
    });

    return token.refreshToken;
  }
}
