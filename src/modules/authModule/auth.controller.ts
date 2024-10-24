import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDTO } from './auth.dto';
import { GoogleAuthGuard } from 'src/guards/googleAuth.guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/:role')
  login(
    @Res() res: Response,
    @Body() loginData: LoginDTO,
    @Param('role') role: string,
  ) {
    return this.authService.login(res, loginData, role);
  }

  @Get('check_auth')
  checkAuth(@Res() res: Response, @Req() req: Request) {
    return this.authService.checkAuth(res, req);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleAuth() {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const response = await this.authService.loginByEmail(req, res);
  }
}
