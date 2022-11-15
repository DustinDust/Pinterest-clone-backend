import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards';
import { BoardService } from './board.service';
import { BaseBoardDto } from './dto/base-board.dto';
import { PageDto } from './dto/page.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@ApiTags('board')
@Controller('board')
export class BoardController {
  constructor(private boardService: BoardService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  async createBoard(@Body() boardDto: BaseBoardDto, @Req() req) {
    return await this.boardService.createBoard(req.user.id, boardDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  async deleteBoard(@Req() req, @Param('id', new ParseIntPipe()) id: number) {
    return await this.boardService.deleteBoard(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  @ApiBearerAuth()
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

  @UseGuards(JwtAuthGuard)
  @Put(':id/save-pin')
  @ApiBearerAuth()
  async savePin(
    @Req() req,
    @Param('id', new ParseIntPipe()) id: number,
    @Body() pin: any,
  ) {
    return await this.boardService.savePinToBoard(req.user.id, pin, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  @ApiBearerAuth()
  async getAllBoard(@Req() req, @Param('id', new ParseIntPipe()) id: number) {
    return await this.boardService.getBoardsByUser(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/pins')
  @ApiBearerAuth()
  async getPins(
    @Req() req,
    @Param('id', new ParseIntPipe()) id: number,
    @Query() page: PageDto,
  ) {
    return await this.boardService.getPins(id, req.user.id, page);
  }
}
