import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: string, metadata: ArgumentMetadata) {
    // console.log({ value, metadata })
    if ( !isValidObjectId(value) ) throw new BadRequestException(`The value ${value} is not a valid mongo id`)
    return value;
  }
}
