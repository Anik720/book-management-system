import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Author } from './author.schema';
import { IsDateString, IsOptional, IsString, Length, Matches } from 'class-validator';

@Schema({ timestamps: true })
export class Book extends Document {
  @IsString()
  @Length(1, 255)
  title: string;

  @IsString()
  @Matches(/^(97(8|9))?\d{9}(\d|X)$/, { message: 'ISBN must be a valid format' })
  isbn: string;

  @IsOptional()
  @IsDateString({}, { message: 'publishedDate must be a valid ISO date string (YYYY-MM-DD)' })
  publishedDate?: string;


  @IsOptional()
  @IsString()
  genre?: string;

  @Prop({ type: Types.ObjectId, ref: 'Author', required: true })
  author: Author;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const BookSchema = SchemaFactory.createForClass(Book);