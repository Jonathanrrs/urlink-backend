import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(createAuthDto: CreateAuthDto) {
    try {
      const { password, ...userData } = createAuthDto;
      const user = await this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      await this.userRepository.save(user);

      return {
        ...user,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      console.log(error);
      if (error.code === '23505')
        throw new BadRequestException('Email is already exists');
      throw new BadRequestException('There is an error');
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true },
    });
    if (!user)
      throw new UnauthorizedException(`Credentials are not valid(email)`);

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException(`Credentials are not valid(password)`);

    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async getAllUsers() {
    const users = await this.userRepository.find({
      select: { email: true, name: true },
    });
    return {
      total: users.length,
      users,
    };
  }

  async verifyToken(headers: Headers) {
    const headerAuth: string = headers['authorization'];
    const token = headerAuth.split(' ')[1];
    try {
      await this.jwtService.verifyAsync(token);
      return {
        msg: 'Token valid',
      };
    } catch (error) {
      throw new BadRequestException('Token invalid');
    }
  }
}
