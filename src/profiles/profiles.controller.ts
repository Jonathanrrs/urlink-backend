import { Controller, Post } from '@nestjs/common';
import { Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Auth, GetUser } from 'src/auth/decorators';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { User } from '../auth/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/fileNamer.helper';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      preservePath: true,
      storage: diskStorage({
        destination: './static/profiles',
        filename: fileNamer,
      }),
    }),
  )
  @Auth()
  create(
    @Body() createProfileDto: CreateProfileDto,
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.profilesService.create(createProfileDto, user, file);
  }
}
