import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards';
import { BoardService } from './board.service';
import { BaseBoardDto } from './dto/base-board.dto';
import { PageDto } from '../pagination/page.dto';
import { RemovePinDto } from './dto/remove-pin.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { ApiCommon } from 'src/decorators/common-api.docs';
import { CreateBoardInput } from './swagger/input/create-board.input';
import { CreateBoardOutput } from './swagger/output/create-board.output';
import { DeleteBoardOutput } from './swagger/output/delete-board.output';
import { GetAllBoardOutput } from './swagger/output/get-all-board.output';
import { GetPinsOutput } from './swagger/output/get-pins.output';
import { RemovePinInput } from './swagger/input/remove-pin-from-board.input';
import { RemovePinOutput } from './swagger/output/remove-pin-from-board.output';
import { SavePinOutput } from './swagger/output/save-pin.output';
import { SavePinInput } from './swagger/input/save-pin.input';
import { updateBoardInput } from './swagger/input/update-board.input';
import { UpdateBoardOutput } from './swagger/output/update-board.output';
import { PaginationService } from 'src/pagination/pagination.service';
import { ApiOkResponsePaginated } from 'src/pagination/pagination.output';
import { AddPinWithTagDto } from './dto/add-tag.dto';

@ApiTags('board')
@Controller('board')
export class BoardController {
  constructor(
    private boardService: BoardService,
    private pagination: PaginationService,
  ) {}

  @ApiCreatedResponse({ type: CreateBoardOutput })
  @ApiBody({ type: CreateBoardInput })
  @ApiCommon()
  @ApiOperation({
    description: 'Create a new board',
    summary: 'Create board',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.CREATED)
  async createBoard(@Body() boardDto: BaseBoardDto, @Req() req) {
    return await this.boardService.createBoard(req.user.id, boardDto);
  }

  @ApiOkResponse({ type: DeleteBoardOutput })
  @ApiCommon()
  @ApiOperation({
    summary: 'delete a board',
    description: 'Delete a board with provided id and authorization token',
  })
  @ApiParam({
    name: 'id',
    description: 'board id',
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth('access-token')
  async deleteBoard(@Req() req, @Param('id', new ParseIntPipe()) id: number) {
    return await this.boardService.deleteBoard(req.user.id, id);
  }

  @ApiOkResponse({ type: UpdateBoardOutput })
  @ApiBody({ type: updateBoardInput })
  @ApiOperation({
    summary: 'update board',
    description: 'update board information',
  })
  @ApiHeader({
    name: 'id',
    description: 'board id',
  })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiBearerAuth('access-token')
  async updateBoard(
    @Req() req,
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    return await this.boardService.updateBoardInfomation(
      req.user.id,
      id,
      updateBoardDto,
    );
  }

  @ApiCreatedResponse({ type: SavePinOutput })
  @ApiBody({ type: SavePinInput })
  @ApiCommon()
  @ApiConsumes('multipart/form')
  @ApiOperation({
    summary: 'save pin',
    description:
      'Save a new pin or create a new pin then save it to the board with the provided id during saving or add tag with a pin',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'id of the board you want to save the pin to',
  })
  @UseGuards(JwtAuthGuard)
  @Put(':id/save-pin')
  @UseInterceptors(FileInterceptor('image'))
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.CREATED)
  async savePin(
    @Req() req,
    @Param('id', new ParseIntPipe()) id: number,
    @UploadedFile() imageFile: Express.Multer.File,
    @Body() pinTagDto: AddPinWithTagDto,
  ) {
    const data = await this.boardService.savePinToBoard(
      req.user.id,
      pinTagDto,
      id,
      imageFile,
    );
    return {
      ...data,
      pins: data.pins.map((v) => ({
        id: v.id,
      })),
    };
  }

  @ApiOkResponsePaginated(GetAllBoardOutput, true)
  @ApiCommon()
  @ApiOperation({
    summary: 'get all board',
    description:
      'Get all boards of the user with the provided userId. If the user requested match with the one who sent the request, both public and private boards would be returned, otherwise, only the public board is returned',
  })
  @ApiParam({
    name: 'id',
    description: 'Id of the user whose boards you want to fetch',
  })
  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  @ApiBearerAuth('access-token')
  async getAllBoard(
    @Req() req,
    @Param('id', new ParseIntPipe()) id: number,
    @Query() page: PageDto,
  ) {
    const data = await this.boardService.getBoardsByUser(req.user.id, id, page);
    return this.pagination.makePaginatedResponse(page, data.boards, data.count);
  }

  @ApiOkResponsePaginated(GetPinsOutput, false)
  @ApiCommon()
  @ApiOperation({
    summary: 'get pins',
    description: 'Get all pins from the board with the provided id',
  })
  @ApiParam({
    name: 'id',
    description: 'board id',
  })
  @UseGuards(JwtAuthGuard)
  @Get(':id/pins')
  @ApiBearerAuth('access-token')
  async getPins(
    @Req() req,
    @Param('id', new ParseIntPipe()) id: number,
    @Query() page: PageDto,
  ) {
    const data = await this.boardService.getPins(id, req.user.id, page);
    return this.pagination.makePaginatedResponse(page, data.data, data.count);
  }

  @ApiOkResponse({ type: RemovePinOutput })
  @ApiBody({ type: [RemovePinInput] })
  @ApiCommon()
  @ApiOperation({
    summary: 'remove pins',
    description: 'remove pins from board based on the provided ids in the body',
  })
  @ApiParam({
    name: 'id',
    description: 'board id',
  })
  @UseGuards(JwtAuthGuard)
  @Put(':id/remove-pin')
  @ApiBearerAuth('access-token')
  async removePinFromBoard(
    @Req() req,
    @Param('id', new ParseIntPipe()) id: number,
    @Body() dto: RemovePinDto[],
  ) {
    return await this.boardService.removePinsFromBoard(req.user.id, id, dto);
  }
}
