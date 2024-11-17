import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { ChannelModule } from './channel/channel.module';
import { UserModule } from './user/user.module';
import { AppGateway } from './app/app.gateway';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { FriendRequestModule } from './friend-request/friend-request.module';
import { MessagesModule } from './messages/messages.module';
import { WebsocketGateway } from './app/websocket/websocket.gateway';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/DEET', {
        autoCreate: true,
    }),
    UserModule,
    ChannelModule,
    AuthModule,
    FriendRequestModule,
    MessagesModule
],
  controllers: [],
  providers: [AppGateway, WebsocketGateway, ],
})
export class AppModule {}
