import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendRequestController } from './friend-request.controller';
import { FriendRequestService } from './friend-request.service';
import {
  FriendRequest,
  FriendRequestSchema,
} from '../schemas/friend-request.schema';
import { Channel, ChannelSchema } from '../schemas/channel.schema';
import { User, UserSchema } from '../schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FriendRequest.name, schema: FriendRequestSchema },
      { name: Channel.name, schema: ChannelSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [FriendRequestController],
  providers: [FriendRequestService],
})
export class FriendRequestModule {}
