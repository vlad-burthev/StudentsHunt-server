import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from 'src/modules/authModule/auth.service';
import { TokenService } from 'src/modules/tokenModule/token.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private tokenService: TokenService,
  ) {
    super({
      clientID: configService.get<string>('CLIENT_ID'),
      clientSecret: configService.get<string>('CLIENT_SECRET'),
      callbackURL: configService.get<string>('CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToke: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const userData = await this.authService.validateGoogleUser({
      email: profile.emails[0].value,
    });
    const refreshToken = await this.tokenService.getTokenById(userData.id);
    const user = { userData, refreshToken };
    done(null, user);
  }
}
