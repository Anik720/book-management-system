import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthorsService } from './authors.service';
import { AuthorsController } from './authors.controller';
import { Author, AuthorSchema } from '../../schemas/author.schema';
import { Book, BookSchema } from '../../schemas/book.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Author.name, schema: AuthorSchema },{ name: Book.name, schema: BookSchema }])],
  controllers: [AuthorsController],
  providers: [AuthorsService],
  exports: [AuthorsService],
})
export class AuthorsModule {}