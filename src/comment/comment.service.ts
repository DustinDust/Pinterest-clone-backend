import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
  ) {}

  async update(
    commentId: number,
    userId: number,
    updateCommentDto: UpdateCommentDto,
  ) {
    let updatedComment = await this.commentRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        id: commentId,
      },
    });
    console.log(updatedComment);
    if (userId == updatedComment.user.id) {
      await this.commentRepository.update(commentId, updateCommentDto);
    } else {
      throw new BadRequestException('This comment is not yours');
    }
    updatedComment = await this.commentRepository.findOneBy({ id: commentId });
    if (updatedComment) {
      return updatedComment;
    }
    throw new BadRequestException('Comment not found!');
  }

  async remove(commentId: number, userId: number) {
    const comment = await this.commentRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        id: commentId,
      },
    });
    if (!comment) {
      throw new BadRequestException('Comment not found!');
    }
    if (comment.user.id == userId) {
      return await this.commentRepository.delete({ id: commentId });
    } else {
      throw new BadRequestException(' This comment is not yours');
    }
  }
}
