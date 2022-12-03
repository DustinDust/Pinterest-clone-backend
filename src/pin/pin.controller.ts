import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards';
import { ApiCommon } from 'src/decorators/common-api.docs';
import { PinService } from './pin.service';
import { GetPinOutput } from './swagger/output/get-pin.output';

@ApiTags('pin')
@Controller('pin')
export class PinController {
  constructor(private pinService: PinService) {}

  @ApiCommon()
  @ApiOkResponse({ type: GetPinOutput })
  @ApiParam({
    name: 'id',
    type: 'integer',
    required: true,
  })
  @ApiBearerAuth('access-token')
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getPin(@Param('id', new ParseIntPipe()) id: number) {
    return await this.pinService.getPin(id);
  }
}
