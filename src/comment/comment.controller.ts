import {
  Controller,
  Body,
  Param,
  Delete,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards';
import { ApiCommon } from 'src/decorators/common-api.docs';
import { CommentService } from './comment.service';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { UpdateCommentInput } from './swagger/input/update-comment.input';
import { DeleteCommentOutput } from './swagger/output/delete-comment.output';
import { UpdateCommentOutput } from './swagger/output/update-comment.output';

@ApiTags('comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOkResponse({ type: UpdateCommentOutput })
  @ApiBody({ type: UpdateCommentInput })
  @ApiOperation({
    summary: 'update comment',
    description: "update comment content given that you're authorized",
  })
  @ApiParam({
    name: 'id',
    description: 'comment id',
  })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiBearerAuth('access-token')
  async update(
    @Req() req,
    @Param('id') id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return await this.commentService.update(id, req.user.id, updateCommentDto);
  }

  @ApiOkResponse({ type: DeleteCommentOutput })
  @ApiCommon()
  @ApiOperation({
    summary: 'delete a comment',
    description:
      'delete a comment with provided id and authorization token and own',
  })
  @ApiParam({
    name: 'id',
    description: 'comment id',
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth('access-token')
  async removeComment(@Req() req, @Param('id') id: number) {
    return await this.commentService.remove(id, req.user.id);
  }
}
