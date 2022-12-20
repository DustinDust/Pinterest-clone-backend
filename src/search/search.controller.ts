import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiProperty, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards';
import { ApiCommon } from 'src/decorators/common-api.docs';
import { GetPinsFromNameTagOutput } from './swagger/output/get-pins-from-name-tag.output';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @ApiCreatedResponse({type: GetPinsFromNameTagOutput, isArray: true})
  @ApiCommon()
  @ApiOperation({
    summary: 'get pins',
    description: 'Get pins when query by name tag',
  })
  @ApiQuery({
    name: 'name',
    description: 'name of tag',
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth('access-token')
  findPinWithTag(@Query() name: CreateSearchDto) {
    return this.searchService.findPinWithTag(name);
  }
}
