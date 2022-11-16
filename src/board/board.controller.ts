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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards';
import { BoardService } from './board.service';
import { AddPinDto } from './dto/add-pin.dto';
import { BaseBoardDto } from './dto/base-board.dto';
import { PageDto } from './dto/page.dto';
import { RemovePinDto } from './dto/remove-pin.dto';
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
  @Put(':id')
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
  @UseInterceptors(FileInterceptor('image'))
  @ApiBearerAuth()
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

  @UseGuards(JwtAuthGuard)
  @Put(':id/remove-pin')
  @ApiBearerAuth()
  async removePinFromBoard(
    @Req() req,
    @Param('id', new ParseIntPipe()) id: number,
    @Body() dto: RemovePinDto[],
  ) {
    return await this.boardService.removePinsFromBoard(req.user.id, id, dto);
  }
}
