import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message,MessageDocument } from 'src/schemas/message.schema';
import { CreateMessageDto } from './dto/create-message.dto';
import { ChannelService } from 'src/channel/channel.service';

@Injectable()
export class MessagesService {
    constructor(
        @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
        private channelService: ChannelService
    ) {}

    async create(createMessageDto: CreateMessageDto) {
        await this.channelService.findOne(createMessageDto.channelId, createMessageDto.userId);

        const newMessage = new this.messageModel({
            content: createMessageDto.content,
            channel: new Types.ObjectId(createMessageDto.channelId),
            sender: new Types.ObjectId(createMessageDto.userId),
        });

        return (await newMessage.save()).populate(['sender', 'channel']);
    }

    async findByChannel(channelId: string, userId: string) {
        await this.channelService.findOne(channelId, userId);

        return this.messageModel
            .find({ channel: new Types.ObjectId(channelId) })
            .populate(['sender', 'channel'])
            .sort({ createdAt: 1 })
            .exec();
    }
}