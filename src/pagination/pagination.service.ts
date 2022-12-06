import { Injectable } from '@nestjs/common';
import { PageDto } from 'src/pagination/page.dto';

@Injectable()
export class PaginationService {
  makePaginatedResponse(page: PageDto, data: any, total: number) {
    return {
      pageIndex: page.pageNum,
      pageSize: page.pageSize,
      total: total,
      data: data,
    };
  }
}
