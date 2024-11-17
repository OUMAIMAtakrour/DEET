import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Channel, ChannelDocument, ChannelType } from '../schemas/channel.schema';
import { User } from '../schemas/user.schema';

@Injectable()
export class ChannelService {
    constructor(
        @InjectModel(Channel.name) private channelModel: Model<ChannelDocument>
    ) {}

   
    async create(type: ChannelType, members: string[], name?: string) {
        if (!members || members.length === 0) {
            throw new BadRequestException('Channel must have at least one member');
        }

        switch (type) {
            case ChannelType.DIRECT:
                return this.createDirectChannel(members);

            case ChannelType.GROUP:
                if (!name?.trim()) {
                    throw new BadRequestException('Group channels must have a name');
                }
                return this.createGroupChannel(members, name);

            case ChannelType.CONVO:
                if (members.length !== 2) {
                    throw new BadRequestException('Conversation channels must have exactly 2 members');
                }
                return this.createConversationChannel(members);

            default:
                throw new BadRequestException('Invalid channel type');
        }
    }

    private async createDirectChannel(members: string[]) {
        const memberIds = members.map(id => new Types.ObjectId(id));
        
        const existingChannel = await this.channelModel.findOne({
            type: ChannelType.DIRECT,
            members: { 
                $all: memberIds,
                $size: memberIds.length
            }
        });

        if (existingChannel) {
            throw new BadRequestException('Direct channel already exists with these members');
        }

        return this.saveChannel(ChannelType.DIRECT, memberIds);
    }

    private async createGroupChannel(members: string[], name: string) {
        const trimmedName = name.trim();
        const memberIds = members.map(id => new Types.ObjectId(id));

        const existingGroup = await this.channelModel.findOne({
            type: ChannelType.GROUP,
            name: trimmedName
        });

        if (existingGroup) {
            throw new BadRequestException('Group with this name already exists');
        }

        return this.saveChannel(ChannelType.GROUP, memberIds, trimmedName);
    }

    private async createConversationChannel(members: string[]) {
        const memberIds = members.map(id => new Types.ObjectId(id));

        const existingChannel = await this.channelModel.findOne({
            type: ChannelType.CONVO,
            members: { 
                $all: memberIds,
                $size: 2
            }
        });

        if (existingChannel) {
            return existingChannel;
        }

        return this.saveChannel(ChannelType.CONVO, memberIds);
    }

    private async saveChannel(type: ChannelType, memberIds: Types.ObjectId[], name?: string) {
        const newChannel = new this.channelModel({
            type,
            members: memberIds,
            name
        });

        return (await newChannel.save()).populate('members', '-password');
    }

 
    async findAll(userId: string) {
        return await this.channelModel
            .find({
                members: new Types.ObjectId(userId)
            })
            .populate('members', '-password')
            .sort({ updatedAt: -1 })
            .exec();
    }

  
    async findByType(userId: string, type: ChannelType) {
        return await this.channelModel
            .find({
                type,
                members: new Types.ObjectId(userId)
            })
            .populate('members', '-password')
            .sort({ updatedAt: -1 })
            .exec();
    }

   
    async findOne(channelId: string, userId: string) {
        const channel = await this.channelModel
            .findOne({
                _id: new Types.ObjectId(channelId),
                members: new Types.ObjectId(userId)
            })
            .populate('members', '-password')
            .exec();

        if (!channel) {
            throw new NotFoundException('Channel not found');
        }

        return channel;
    }

    
    async update(channelId: string, userId: string, name?: string, members?: string[]) {
        const channel = await this.findOne(channelId, userId);

        if (channel.type === ChannelType.CONVO) {
            throw new BadRequestException('Cannot update conversation channels');
        }

        const updateData: any = {};

        if (name !== undefined) {
            if (channel.type === ChannelType.GROUP && !name.trim()) {
                throw new BadRequestException('Group name cannot be empty');
            }
            updateData.name = name.trim();
        }

        if (members !== undefined) {
            if (members.length === 0) {
                throw new BadRequestException('Channel must have at least one member');
            }
            updateData.members = members.map(id => new Types.ObjectId(id));
        }

        return await this.channelModel
            .findByIdAndUpdate(channelId, updateData, { new: true })
            .populate('members', '-password')
            .exec();
    }

    
    async addMembers(channelId: string, userId: string, newMemberIds: string[]) {
        const channel = await this.findOne(channelId, userId);

        if (channel.type === ChannelType.CONVO) {
            throw new BadRequestException('Cannot modify conversation channels');
        }

        const memberObjectIds = newMemberIds.map(id => new Types.ObjectId(id));

        return await this.channelModel
            .findByIdAndUpdate(
                channelId,
                { $addToSet: { members: { $each: memberObjectIds } } },
                { new: true }
            )
            .populate('members', '-password')
            .exec();
    }

   
    async removeMembers(channelId: string, userId: string, memberIdsToRemove: string[]) {
        const channel = await this.findOne(channelId, userId);

        if (channel.type === ChannelType.CONVO) {
            throw new BadRequestException('Cannot modify conversation channels');
        }

        const remainingMembersCount = channel.members.length - memberIdsToRemove.length;
        if (remainingMembersCount < 1) {
            throw new BadRequestException('Channel must have at least one member');
        }

        const memberObjectIds = memberIdsToRemove.map(id => new Types.ObjectId(id));

        return await this.channelModel
            .findByIdAndUpdate(
                channelId,
                { $pullAll: { members: memberObjectIds } },
                { new: true }
            )
            .populate('members', '-password')
            .exec();
    }

    
    async remove(channelId: string, userId: string) {
        const channel = await this.findOne(channelId, userId);

        if (channel.type === ChannelType.CONVO) {
            throw new BadRequestException('Cannot delete conversation channels');
        }

        return await this.channelModel.findByIdAndDelete(channelId);
    }
}