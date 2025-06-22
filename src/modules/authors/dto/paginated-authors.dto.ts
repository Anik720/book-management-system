import { ApiProperty } from '@nestjs/swagger';
import { Author } from '../../../schemas/author.schema';


export class PaginatedAuthorsDto {
  @ApiProperty({ type: [Author] })
  data: Author[];

  @ApiProperty({ type: Number, example: 3 })
  total: number;
}
