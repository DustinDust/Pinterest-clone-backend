import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { CreateSearchDto } from './dto/create-search.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards';
import { ApiCommon } from 'src/decorators/common-api.docs';
import { GetPinsFromNameTagOutput } from './swagger/output/get-pins-from-name-tag.output';
import { PaginationService } from 'src/pagination/pagination.service';
import { UserSearchDto } from './dto/user-search.dto';
import { GetUsersFromNameDisplayOutput } from './swagger/output/get-users-from-nameDisplay.output';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(
    private searchService: SearchService,
    private pagination: PaginationService,
  ) {}

  @ApiOkResponse({ type: GetPinsFromNameTagOutput })
  @ApiCommon()
  @ApiOperation({
    summary: 'get pins',
    description: 'Get pins when query by name tag',
  })
  @UseGuards(JwtAuthGuard)
  @Get('pin')
  @ApiBearerAuth('access-token')
  async findPinWithTag(@Query() nameAndPage: CreateSearchDto) {
    const data = await this.searchService.findPinWithTag(nameAndPage);
    const page = {
      pageNum: nameAndPage.pageNum,
      pageSize: nameAndPage.pageSize,
    };
    return this.pagination.makePaginatedResponse(page, data.data, data.count);
  }

  @ApiOkResponse({ type: GetUsersFromNameDisplayOutput })
  @ApiCommon()
  @ApiOperation({
    summary: 'get users',
    description: 'Get users by nameDisplay',
  })
  @UseGuards(JwtAuthGuard)
  @Get('user')
  @ApiBearerAuth('access-token')
  async findUserWithDisplayName(@Query() userName: UserSearchDto) {
    const data = await this.searchService.findUserByDisplayName(userName);
    const page = {
      pageNum: userName.pageNum,
      pageSize: userName.pageSize,
    };
    return this.pagination.makePaginatedResponse(page, data.data, data.count);
  }
}
