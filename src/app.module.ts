import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { ChannelModule } from './channel/channel.module';
import { UserModule } from './user/user.module';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/DEET', {
        autoCreate: true,
    }),
    UserModule,
    ChannelModule
],
  controllers: [],
  providers: [],
})
export class AppModule {}
