import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() body: { name: string; email: string; password: string },
  ): Promise<unknown> {
    if (!body.name || !body.email || !body.password) {
      throw new HttpException(
        'Name, email and password are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.authService.register(body);
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
  ): Promise<unknown> {
    if (!body.email || !body.password) {
      throw new HttpException(
        'Email and password are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.authService.login(body.email, body.password);
  }
}
