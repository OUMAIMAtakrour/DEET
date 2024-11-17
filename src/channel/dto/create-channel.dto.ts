import { IsString, IsEnum, IsArray, IsOptional, IsMongoId, MinLength, ValidateIf } from 'class-validator';
import { ChannelType } from 'src/schemas/channel.schema';

export class CreateChannelDto {
    @IsEnum(ChannelType)
    type: ChannelType;

    @IsArray()
    @IsMongoId({ each: true })
    members: string[];

    @ValidateIf(o => o.type === ChannelType.GROUP)
    @IsString()
    @MinLength(1, { message: 'Group name cannot be empty' })
    name?: string;
}