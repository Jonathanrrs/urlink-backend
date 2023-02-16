import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './entities/profile.entity';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async create(createProfileDto: CreateProfileDto, user: User) {
    // const { description, urls, photo } = createProfileDto;
    try {
      const profile = this.profileRepository.create({
        ...createProfileDto,
        user,
      });
      await this.profileRepository.save(profile);
      return { ...createProfileDto, user };
    } catch (error) {
      console.log(error);
    }
  }
}
