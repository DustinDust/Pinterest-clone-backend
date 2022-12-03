import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponseProperty,
  getSchemaPath,
} from '@nestjs/swagger';

export class Pagination<T> {
  @ApiResponseProperty({
    type: 'integer',
  })
  pageIndex: number;
  @ApiResponseProperty({
    type: 'integer',
  })
  pageSize: number;
  data: T;
  @ApiResponseProperty({
    type: 'integer',
  })
  total: boolean;
}

export const ApiOkResponsePaginated = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
  isArray: boolean,
) => {
  const data = isArray
    ? {
        type: 'array',
        items: {
          $ref: getSchemaPath(dataDto),
        },
      }
    : {
        $ref: getSchemaPath(dataDto),
      };
  return applyDecorators(
    ApiExtraModels(Pagination, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(Pagination) },
          {
            properties: {
              data: data,
            },
          },
        ],
      },
    }),
  );
};
