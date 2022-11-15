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
import { JwtAuthGuard } from 'src/auth/guards';
import { BoardService } from './board.service';
import { BaseBoardDto } from './dto/base-board.dto';
import { PageDto } from './dto/page.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Controller('board')
export class BoardController {
  constructor(private boardService: BoardService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createBoard(@Body() boardDto: BaseBoardDto, @Req() req) {
    return await this.boardService.createBoard(req.user.id, boardDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteBoard(@Req() req, @Param('id', new ParseIntPipe()) id: number) {
    return await this.boardService.deleteBoard(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
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
  async savePin(
    @Req() req,
    @Param('id', new ParseIntPipe()) id: number,
    @Body() pin: any,
  ) {
    return await this.boardService.savePinToBoard(req.user.id, pin, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  async getAllBoard(@Req() req, @Param('id', new ParseIntPipe()) id: number) {
    return await this.boardService.getBoardsByUser(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/pins')
  async getPins(
    @Req() req,
    @Param('id', new ParseIntPipe()) id: number,
    @Query() page: PageDto,
  ) {
    return await this.boardService.getPins(id, req.user.id, page);
  }
}
