import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { validate as isUUID } from 'uuid';

@Injectable()
export class CustomParseUUIDPipe implements PipeTransform {
  transform(value: any) {
    if (!isUUID(value)) {
      throw new BadRequestException('Validation failed (UUID is expected)');
    }
    return value;
  }
}
