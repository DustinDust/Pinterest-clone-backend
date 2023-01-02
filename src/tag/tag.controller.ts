import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { JwtAuthGuard } from 'src/auth/guards';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ApiCommon } from 'src/decorators/common-api.docs';
import { CreateTagOutput } from './swagger/output/create-tag.output';
import { CreateTagInput } from './swagger/input/create-tag.input';
import { DeleteTagOutput } from './swagger/output/delete-tag.output';
import { UpdateTagOutput } from './swagger/output/update-tag.output';
import { UpdateTagInput } from './swagger/input/update-tag.input';
import { GetAllTagOutput } from './swagger/output/get-all-tag.output';
import { GetTagOutput } from './swagger/output/get-tag.output';

@ApiTags('tag')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiCreatedResponse({ type: CreateTagOutput })
  @ApiBody({ type: CreateTagInput })
  @ApiCommon()
  @ApiOperation({
    description: 'Create a new tag',
    summary: 'Create tag',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.CREATED)
  async createTag(@Body() createTagDto: CreateTagDto) {
    return await this.tagService.create(createTagDto);
  }

  @ApiOkResponse({ type: GetAllTagOutput, isArray: true })
  @ApiCommon()
  @ApiOperation({
    summary: 'get all tags',
    description: 'Get all tags ',
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth('access-token')
  async findAll() {
    return await this.tagService.findAll();
  }

  @ApiOkResponse({ type: GetTagOutput })
  @ApiCommon()
  @ApiOperation({
    summary: 'get a tag',
    description: 'get a tag with provided id and authorization token',
  })
  @ApiParam({
    name: 'id',
    description: 'get id',
  })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiBearerAuth('access-token')
  async findOne(@Param('id') id: string) {
    return await this.tagService.findOne(Number(id));
  }

  @ApiOkResponse({ type: UpdateTagOutput })
  @ApiBody({ type: UpdateTagInput })
  @ApiOperation({
    summary: 'update tag',
    description: 'update name tag',
  })
  @ApiParam({
    name: 'id',
    description: 'tag id',
  })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiBearerAuth('access-token')
  async update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return await this.tagService.update(+id, updateTagDto);
  }

  @ApiOkResponse({ type: DeleteTagOutput })
  @ApiCommon()
  @ApiOperation({
    summary: 'delete a tag',
    description: 'delete a tag with provided id and authorization token',
  })
  @ApiParam({
    name: 'id',
    description: 'tag id',
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth('access-token')
  async removeTag(@Param('id') id: number) {
    return await this.tagService.remove(id);
  }
}
