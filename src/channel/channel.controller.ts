import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  Query,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelType } from '../schemas/channel.schema';

@Controller('channels')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  create(@Body() createChannelDto: {
      type: ChannelType;
      members: string[];
      name?: string;
  }) {
      return this.channelService.create(
          createChannelDto.type,
          createChannelDto.members,
          createChannelDto.name
      );
  }

  @Get()
  findAll(
      @Query('userId') userId: string,
      @Query('type') type?: ChannelType
  ) {
      if (type) {
          return this.channelService.findByType(userId, type);
      }
      return this.channelService.findAll(userId);
  }

  @Get(':id')
  findOne(
      @Param('id') id: string,
      @Query('userId') userId: string
  ) {
      return this.channelService.findOne(id, userId);
  }

  @Patch(':id')
  update(
      @Param('id') id: string,
      @Query('userId') userId: string,
      @Body() updateData: {
          name?: string;
          members?: string[];
      }
  ) {
      return this.channelService.update(
          id,
          userId,
          updateData.name,
          updateData.members
      );
  }

  @Post(':id/members')
  addMembers(
      @Param('id') id: string,
      @Query('userId') userId: string,
      @Body() body: { memberIds: string[] }
  ) {
      return this.channelService.addMembers(id, userId, body.memberIds);
  }

  @Delete(':id/members')
  removeMembers(
      @Param('id') id: string,
      @Query('userId') userId: string,
      @Body() body: { memberIds: string[] }
  ) {
      return this.channelService.removeMembers(id, userId, body.memberIds);
  }

  @Delete(':id')
  remove(
      @Param('id') id: string,
      @Query('userId') userId: string
  ) {
      return this.channelService.remove(id, userId);
  }
}