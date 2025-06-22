import { IsString, IsOptional, IsDateString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthorDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @Length(1, 50)
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @Length(1, 50)
  lastName: string;

  @ApiProperty({ example: 'A renowned author...', required: false })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ example: '1970-01-01', required: false })
  @IsDateString()
  @IsOptional()
  birthDate?: string;
}
