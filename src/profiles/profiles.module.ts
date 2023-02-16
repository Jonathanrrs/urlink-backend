import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ProfilesController],
  providers: [ProfilesService],
  imports: [TypeOrmModule.forFeature([Profile]), AuthModule],
  exports: [TypeOrmModule],
})
export class ProfilesModule {}
