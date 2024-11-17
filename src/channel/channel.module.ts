import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelService } from './channel.service';
import { Channel, ChannelSchema } from 'src/schemas/channel.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Channel.name, schema: ChannelSchema }])],
  providers: [ChannelService],
  exports: [ChannelService],
})
export class ChannelModule {}
