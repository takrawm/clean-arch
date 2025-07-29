import { v4 as uuidv4 } from 'uuid';
import { IdGeneratorInterface } from '../../domain/utils/idGeneratorInterfaec';

export class UuidGenerator implements IdGeneratorInterface {
  generate(): string {
    return uuidv4();
  }
}
