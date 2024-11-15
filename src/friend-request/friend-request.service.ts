import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FriendRequest, FriendRequestDocument, RequestStatus } from '../schemas/friend-request.schema';
import { Channel, ChannelDocument, ChannelType } from '../schemas/channel.schema';
import { CreateFriendRequestDto } from './dto/create-friend-request.dto';
import { UpdateFriendRequestDto } from './dto/update-friend-request.dto';

@Injectable()
export class FriendRequestService {
    constructor(
        @InjectModel(FriendRequest.name) private friendRequestModel: Model<FriendRequestDocument>,
        @InjectModel(Channel.name) private channelModel: Model<ChannelDocument>
    ) {}

    async createRequest(createFriendRequestDto: CreateFriendRequestDto) {
        const existingRequest = await this.friendRequestModel.findOne({
            sender: createFriendRequestDto.sender,
            receiver: createFriendRequestDto.receiver,
            status: RequestStatus.PENDING
        });

        if (existingRequest) {
            throw new BadRequestException('Friend request already exists');
        }

        const newRequest = new this.friendRequestModel({
            sender: createFriendRequestDto.sender,
            receiver: createFriendRequestDto.receiver,
            status: createFriendRequestDto.status || RequestStatus.PENDING
        });

        return newRequest.save();
    }

    async updateRequest(requestId: string, updateFriendRequestDto: UpdateFriendRequestDto) {
        const request = await this.friendRequestModel.findById(requestId)
            .populate('sender')
            .populate('receiver');

        if (!request) {
            throw new NotFoundException('Friend request not found');
        }

        request.status = updateFriendRequestDto.status;
        await request.save();

        if (updateFriendRequestDto.status === RequestStatus.ACCEPTED) {
            const newChannel = new this.channelModel({
                type: ChannelType.DIRECT,
                participants: [request.sender, request.receiver]
            });
            await newChannel.save();
            return { request, channel: newChannel };
        }

        return { request };
    }

    async getAllFriendRequests() {
        return this.friendRequestModel.find()
            .populate('sender')
            .populate('receiver')
            .exec();
    }

    async getFriendRequests(userId: string) {
        return this.friendRequestModel.find({
            $or: [
                { sender: userId },
                { receiver: userId }
            ]
        })
        .populate('sender')
        .populate('receiver')
        .exec();
    }
    remove(requestId: number) {
      return `This action removes a #${requestId} request`;
    }
}