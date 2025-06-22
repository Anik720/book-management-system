import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthorDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
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