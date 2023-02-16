import { Controller, Post } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators';
import { Auth, GetUser } from 'src/auth/decorators';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { User } from '../auth/entities/user.entity';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  @Auth()
  create(@Body() createProfileDto: CreateProfileDto, @GetUser() user: User) {
    return this.profilesService.create(createProfileDto, user);
  }
}
