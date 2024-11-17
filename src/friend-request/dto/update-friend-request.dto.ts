// import { PartialType } from '@nestjs/mapped-types';
// import { CreateFriendRequestDto } from './create-friend-request.dto';

// export class UpdateFriendRequestDto extends PartialType(CreateFriendRequestDto) {}
import { IsEnum } from 'class-validator';
import { RequestStatus } from '../../schemas/friend-request.schema';

export class UpdateFriendRequestDto {
  @IsEnum(RequestStatus)
  status: RequestStatus;
}
