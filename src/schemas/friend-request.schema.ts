import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

export enum RequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DENIED = 'denied',
}

export type FriendRequestDocument = FriendRequest & Document;

@Schema({ timestamps: true })
export class FriendRequest {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender: User;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  receiver: User;

  @Prop({ type: String, enum: RequestStatus })
  status: RequestStatus;
}

export const FriendRequestSchema = SchemaFactory.createForClass(FriendRequest);
