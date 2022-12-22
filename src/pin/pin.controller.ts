import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards';
import { PageDto } from 'src/pagination/page.dto';
import { ApiCommon } from 'src/decorators/common-api.docs';
import { PinService } from './pin.service';
import { GetPinOutput } from './swagger/output/get-pin.output';
import { PaginationService } from 'src/pagination/pagination.service';
import { RemoveTagDto } from './dto/remove-tag.dto';
import { CreateTagDto } from './dto/create-tag.dto';
import { RemoveTagOutput } from './swagger/output/remove-tag-from-pin.output';
import { RemoveTagInput } from './swagger/input/remove-tag-from-pin.input';
import { SaveTagOutput } from './swagger/output/save-tag.output';
import { SaveTagInput } from './swagger/input/save-tag.input';

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
  @ApiCreatedResponse({ type: SaveTagOutput })
  @ApiBody({ type: SaveTagInput })
  @ApiCommon()
  @ApiOperation({
    summary: 'save tag',
    description:
      'Save a new tag or exist tag then save it to the pin with the provided id',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'id of the pin you want to save the tag to',
  })
  @UseGuards(JwtAuthGuard)
  @Put(':id/save-tag')
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.CREATED)
  async saveTag(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() tagDto: CreateTagDto,
  ) {
    return await this.pinService.saveTagToPin(
      tagDto,
      id,
    );
  }

  @ApiOkResponse({ type: RemoveTagOutput })
  @ApiBody({ type: [RemoveTagInput] })
  @ApiCommon()
  @ApiOperation({
    summary: 'remove tags',
    description: 'remove tags from pin based on the provided ids in the body',
  })
  @ApiParam({
    name: 'id',
    description: 'tag id',
  })
  @UseGuards(JwtAuthGuard)
  @Put(':id/remove-tag')
  @ApiBearerAuth('access-token')
  async removeTagFromPin(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() dto: RemoveTagDto[],
  ) {
    return await this.pinService.removeTagFromPin(id, dto);
  }
}
