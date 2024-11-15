import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { ChannelModule } from './channel/channel.module';
import { UserModule } from './user/user.module';
import { AppGateway } from './app/app.gateway';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/DEET', {
        autoCreate: true,
    }),
    UserModule,
    ChannelModule,
    AuthModule,
],
  controllers: [],
  providers: [AppGateway, ],
})
export class AppModule {}
