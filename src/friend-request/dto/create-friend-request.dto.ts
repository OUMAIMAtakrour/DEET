import { IsMongoId, IsOptional, IsEnum } from 'class-validator';
import { RequestStatus } from '../../schemas/friend-request.schema';

export class CreateFriendRequestDto {
    @IsMongoId()
    sender: string;

    @IsMongoId()
    receiver: string;

    @IsOptional()
    @IsEnum(RequestStatus)
    status?: RequestStatus;
}