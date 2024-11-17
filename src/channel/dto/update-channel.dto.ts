import { IsString, IsEnum, IsArray, IsOptional, IsMongoId, MinLength, ValidateIf } from 'class-validator';
import { ChannelType } from 'src/schemas/channel.schema';



export class UpdateChannelDto {
    @IsOptional()
    @IsString()
    @MinLength(1, { message: 'Channel name cannot be empty' })
    name?: string;

    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    members?: string[];
}