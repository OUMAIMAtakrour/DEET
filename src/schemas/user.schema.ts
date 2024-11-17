import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class Friend {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  id: string;
}

@Schema()
export class User {
 @Prop({ required: true })
  name: string;

  @Prop({
    unique: true,
    required: true,
  })
  email: string;

  @Prop({
    type: [{ name: String, id: { type: Types.ObjectId, ref: 'User' } }],
    default: [],
  })
  friends: Friend[];
}

export const UserSchema = SchemaFactory.createForClass(User);
