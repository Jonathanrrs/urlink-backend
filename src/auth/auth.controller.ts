import { Controller, Post, Body, Get, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth } from './decorators';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.signup(createAuthDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('users')
  @Auth()
  getAllUsers() {
    return this.authService.getAllUsers();
  }

  @Get('verify-token')
  @Auth()
  verifyToken(@Headers() headers: Headers) {
    return this.authService.verifyToken(headers);
  }
}
