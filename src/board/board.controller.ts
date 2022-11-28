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
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards';
import { BoardService } from './board.service';
import { AddPinDto } from './dto/add-pin.dto';
import { BaseBoardDto } from './dto/base-board.dto';
import { PageDto } from './dto/page.dto';
import { RemovePinDto } from './dto/remove-pin.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './board.entity';
import { Pin } from 'src/pin/pin.entity';

@ApiTags('board')
@Controller('board')
export class BoardController {
  constructor(private boardService: BoardService) {}

  @ApiCreatedResponse({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        description: { type: 'string' },
        visibility: { type: 'number', description: '0-private; 1-public' },
        user: { type: 'object', properties: { id: { type: 'number' } } },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid JWT token',
  })
  @ApiOperation({
    description: 'Create a new board',
    summary: 'Create board',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Access token, passed with "Bearer"',
    required: true,
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.CREATED)
  async createBoard(@Body() boardDto: BaseBoardDto, @Req() req) {
    return await this.boardService.createBoard(req.user.id, boardDto);
  }

  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        raw: { type: 'string', default: 'any' },
        affected: { type: 'number', nullable: true },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Board does not exist',
  })
  @ApiForbiddenResponse({
    description: 'User does not own this board',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid access token',
  })
  @ApiOperation({
    summary: 'delete a board',
    description: 'Delete a board with provided id and authorization token',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Access token, passed with "Bearer"',
    required: true,
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

  @ApiOkResponse({
    schema: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'number', nullable: false },
        name: { type: 'string', nullable: true },
        describe: { type: 'string', nullable: true },
        visibility: { type: 'string', nullable: true },
      },
    },
  })
  @ApiOperation({
    summary: 'update board',
    description: 'update board information',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Access token, passed with "Bearer"',
    required: true,
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

  @ApiOkResponse({
    type: Board,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid access-token',
  })
  @ApiForbiddenResponse({
    description: 'User does not own this board',
  })
  @ApiBadRequestResponse({
    description:
      'Invalid json body, perhaps for the board in question can not be found or no url/file was provided',
  })
  @ApiOperation({
    summary: 'save pin',
    description:
      'Save a new pin or create a new pin then save it to the board with the provided id',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Access token, passed with "Bearer"',
    required: true,
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
    @Body() pinDto: AddPinDto,
  ) {
    return await this.boardService.savePinToBoard(
      req.user.id,
      pinDto,
      id,
      imageFile,
    );
  }

  @ApiOkResponse({
    type: [OmitType(Board, ['user', 'pins'])],
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid access token',
  })
  @ApiOperation({
    summary: 'get all board',
    description:
      'Get all boards of the user with the provided userId. If the user requested match with the one who sent the request, both public and private boards would be returned, otherwise, only the public board is returned',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Access token, passed with "Bearer"',
    required: true,
  })
  @ApiParam({
    name: 'id',
    description: 'Id of the user whose boards you want to fetch',
  })
  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  @ApiBearerAuth('access-token')
  async getAllBoard(@Req() req, @Param('id', new ParseIntPipe()) id: number) {
    return await this.boardService.getBoardsByUser(req.user.id, id);
  }

  @ApiOkResponse({
    type: [OmitType(Pin, ['boards'])],
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid access token',
  })
  @ApiOperation({
    summary: 'get pins',
    description: 'Get all pins from the board with the provided id',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Access token, passed with "Bearer"',
    required: true,
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
    return await this.boardService.getPins(id, req.user.id, page);
  }

  @ApiBody({
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'id of the pins you want to remove',
          },
        },
      },
    },
  })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        user: { type: 'object', properties: { id: { type: 'integer' } } },
        pins: {
          type: 'array',
          items: { type: 'object', properties: { id: { type: 'integer' } } },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'invalid access token',
  })
  @ApiForbiddenResponse({
    description: 'User does not own this board',
  })
  @ApiBadRequestResponse({
    description: 'Board with such id does not exist or some invalid json body',
  })
  @ApiOperation({
    summary: 'remove pins',
    description: 'remove pins from board based on the provided ids in the body',
  })
  @ApiParam({
    name: 'id',
    description: 'board id',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Access token, passed with "Bearer"',
    required: true,
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
