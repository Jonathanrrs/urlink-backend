import { Controller, Post, Get, Param, ParseUUIDPipe } from '@nestjs/common';
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

  @Get('getBySlug/:slug')
  getProfileBySlug(@Param('slug') slug: string) {
    return this.profilesService.getProfileBySlug(slug);
  }
  @Get('getByID/:id')
  getProfileByID(@Param('id', ParseUUIDPipe) id: string) {
    return this.profilesService.getProfileByID(id);
  }

  @Get()
  @Auth()
  getProfileWithToken(@GetUser() user: User) {
    return this.profilesService.getProfileWithToken(user);
  }

  @Get('allProfiles')
  getAllProfiles() {
    return this.profilesService.getAllProfiles();
  }
}
