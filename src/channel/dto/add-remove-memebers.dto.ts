import { IsArray, IsMongoId } from "class-validator";

export class AddRemoveMembersDto {
    @IsArray()
    @IsMongoId({ each: true })
    memberIds: string[];
}