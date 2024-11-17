import { Controller, Post, Get, Put, Body, Param, Delete } from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { CreateFriendRequestDto } from './dto/create-friend-request.dto';
import { UpdateFriendRequestDto } from './dto/update-friend-request.dto';

@Controller('friend-requests')
export class FriendRequestController {
    constructor(private readonly friendRequestService: FriendRequestService) {}

    @Post()
    async createRequest(@Body() createFriendRequestDto: CreateFriendRequestDto) {
        return this.friendRequestService.createRequest(createFriendRequestDto);
    }

    @Put(':id')
    async updateRequest(
        @Param('id') id: string,
        @Body() updateFriendRequestDto: UpdateFriendRequestDto
    ) {
        return this.friendRequestService.updateRequest(id, updateFriendRequestDto);
    }

    @Get()
    async getFriendRequests() {
        return this.friendRequestService.getAllFriendRequests();
    }

    @Get(':userId')
    async getUserFriendRequests(@Param('userId') userId: string) {
        return this.friendRequestService.getFriendRequests(userId);
    }
    @Delete(':id')
  remove(@Param('id') id: string) {
    return this.friendRequestService.remove(+id);
  }
}
