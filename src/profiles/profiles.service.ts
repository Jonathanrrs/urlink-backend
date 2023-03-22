import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './entities/profile.entity';
import { User } from '../auth/entities/user.entity';
import { UploadImage } from './helpers';
import { UpdateProfileDto } from './dto/update-profile.dto';

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
        await image.deleteFromFileSystem(file);
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

  async getProfileBySlug(slug: string) {
    const found = await this.profileRepository.findOne({
      where: { slug },
      relations: {
        user: true,
      },
    });
    if (!found)
      throw new NotFoundException(
        `The profile with slug ${slug} was not found`,
      );
    return found;
  }

  async getProfileByID(id: string) {
    const found = await this.profileRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });
    if (!found)
      throw new NotFoundException(`The profile with slug ${id} was not found`);
    return found;
  }

  async getProfileWithToken(user: User) {
    const found = await this.profileRepository.findOne({
      where: { user },
      relations: {
        user: true,
      },
    });
    if (!found) throw new NotFoundException(`The profile does not exist`);
    return found;
  }

  async getAllProfiles() {
    const profiles = this.profileRepository.find({
      select: {
        slug: true,
        photo: true,
        description: true,
        user: {
          name: true,
          lastName: true,
        },
      },
      relations: {
        user: true,
      },
    });

    return profiles;
  }

  async update(
    user: User,
    updateProfileDto: UpdateProfileDto,
    file: Express.Multer.File,
  ) {
    const foundUser = await this.getProfileWithToken(user);

    if (foundUser) {
      if (file) {
        let photo = null;
        const image = new UploadImage();
        if (foundUser.photo) {
          const splitPhoto = foundUser.photo.split('/');
          const getIdPhoto = splitPhoto[splitPhoto.length - 1].split('.')[0];
          await image.deleteFromCloudinary(getIdPhoto);
        }
        const resp = await image.upload(file);
        if (!resp)
          throw new BadRequestException('There was a problem with the file');
        await image.deleteFromFileSystem(file);
        photo = resp.url;
        console.log(photo, 'new photo');

        updateProfileDto = { ...updateProfileDto, photo };
      }
      /* actualizar img */
      const updated = { ...foundUser, ...updateProfileDto };
      const profileUpdated = this.profileRepository.save(updated);
      return profileUpdated;
    }
  }
}
