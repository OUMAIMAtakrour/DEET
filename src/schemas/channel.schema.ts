import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

export enum ChannelType {
    DIRECT = 'direct',
    GROUP = 'group',
    CONVO ='convo'
}

export type ChannelDocument = Channel & Document;

@Schema({ timestamps: true })
export class Channel {
   
    @Prop({ type: String, enum: ChannelType, required: true })
    type: ChannelType;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
    members: User[];

    @Prop({ type: String })
    name?: string;  
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);
