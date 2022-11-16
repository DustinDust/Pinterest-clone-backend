import { PickType } from '@nestjs/swagger';
import { AddPinDto } from './add-pin.dto';

export class RemovePinDto extends PickType(AddPinDto, ['id'] as const) {}
