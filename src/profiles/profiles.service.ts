import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './entities/profile.entity';
import { User } from '../auth/entities/user.entity';
import { UploadImage } from './helpers';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async create(
    createProfileDto: CreateProfileDto,
    user: User,
    file: Express.Multer.File,
  ) {
    try {
      let photo = null;
      if (file) {
        const image = new UploadImage();
        const resp = await image.upload(file);
        if (!resp)
          throw new BadRequestException('There was a problem with the file');
        photo = resp.url;
      }
      const profile = this.profileRepository.create({
        ...createProfileDto,
        user,
        photo: photo,
      });
      await this.profileRepository.save(profile);
      return { ...createProfileDto, user, photo: photo };
    } catch (error) {
      if (error.code === '23505')
        throw new BadRequestException('Profile is already exists');
    }
  }
}
