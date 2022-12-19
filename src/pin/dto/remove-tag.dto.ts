import { PartialType, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateTagDto } from './create-tag.dto';

export class RemoveTagDto extends PickType(CreateTagDto, ['id'] as const) {
}
