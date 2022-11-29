import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiCommon() {
  return applyDecorators(
    ApiHeader({
      name: 'Authorization',
      description: 'Pass your JWT Token in here, prepended with "Bearer"',
      required: true,
    }),
    ApiBadRequestResponse({
      description: 'Invalid JSON body or queried object is not presented',
    }),
    ApiUnauthorizedResponse({
      description: 'Invalid JWT token',
    }),
    ApiForbiddenResponse({
      description: 'User does not possess the authorization required.',
    }),
  );
}
