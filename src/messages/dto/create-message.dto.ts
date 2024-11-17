import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateMessageDto {
    @IsMongoId()
    @IsNotEmpty()
    channelId: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsMongoId()
    @IsNotEmpty()
    userId: string; // Using userId instead of email
}