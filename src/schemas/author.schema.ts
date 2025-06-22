import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsDateString, IsOptional, IsString, Length } from 'class-validator';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Author extends Document {

  @IsString()
  @Length(1, 50)
  firstName: string;

  @IsString()
  @Length(1, 50)
  lastName: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsDateString({}, { message: 'birthDate must be a valid ISO 8601 date string (YYYY-MM-DD)' })
  birthDate?: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);