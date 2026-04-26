import { PipeTransform, Injectable } from '@nestjs/common';
import { validate as isUUID } from 'uuid';
import { ValidationError } from '../errors/custom.errors';

@Injectable()
export class CustomParseUUIDPipe implements PipeTransform {
  transform(value: any) {
    if (!isUUID(value)) {
      throw new ValidationError('Validation failed (UUID is expected)');
    }
    return value;
  }
}
