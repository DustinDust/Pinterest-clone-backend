import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards';
import { PageDto } from 'src/pagination/page.dto';
import { ApiCommon } from 'src/decorators/common-api.docs';
import { PinService } from './pin.service';
import { GetPinOutput } from './swagger/output/get-pin.output';
import { PaginationService } from 'src/pagination/pagination.service';

@ApiTags('pin')
@Controller('pin')
export class PinController {
  constructor(
    private pinService: PinService,
    private paginationService: PaginationService,
  ) {}

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

  @ApiBearerAuth()
  @Get(':id/boards')
  @ApiCommon()
  @UseGuards(JwtAuthGuard)
  async getBoards(
    @Param('id', new ParseIntPipe()) id: number,
    @Req() req,
    @Query() page: PageDto,
  ) {
    const res = await this.pinService.getBoardsByPin(id, req.user.id, page);
    return this.paginationService.makePaginatedResponse(
      page,
      res.data,
      res.total,
    );
  }
}
