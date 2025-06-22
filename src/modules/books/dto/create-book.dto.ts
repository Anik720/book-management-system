import {
  IsNotEmpty,
  IsMongoId,
  IsString,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @IsNotEmpty({ message: 'ISBN is required' })
  @IsString({ message: 'ISBN must be a string' })
  isbn: string;

  @IsOptional()
  @IsDateString({}, { message: 'Published date must be a valid ISO date string' })
  publishedDate?: string;

  @IsOptional()
  @IsString({ message: 'Genre must be a string' })
  genre?: string;

  @IsNotEmpty({ message: 'Author ID is required' })
  @IsMongoId({ message: 'Author ID must be a valid MongoDB ObjectId' })
  authorId: string;
}
