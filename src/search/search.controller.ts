import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { CreateSearchDto } from './dto/create-search.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards';
import { ApiCommon } from 'src/decorators/common-api.docs';
import { GetPinsFromNameTagOutput } from './swagger/output/get-pins-from-name-tag.output';
import { PaginationService } from 'src/pagination/pagination.service';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(
    private searchService: SearchService,
    private pagination: PaginationService,
  ) {}

  @ApiCreatedResponse({ type: GetPinsFromNameTagOutput, isArray: true })
  @ApiCommon()
  @ApiOperation({
    summary: 'get pins',
    description: 'Get pins when query by name tag',
  })
  @ApiQuery({
    name: 'name & pageNum & pageSize',
    description: 'name of tag and pagination',
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth('access-token')
  async findPinWithTag(@Query() nameAndPage: CreateSearchDto) {
    const data = await this.searchService.findPinWithTag(nameAndPage);
    const page = {
      pageNum: nameAndPage.pageNum,
      pageSize: nameAndPage.pageSize,
    };
    return this.pagination.makePaginatedResponse(page, data.data, data.count);
  }
}
