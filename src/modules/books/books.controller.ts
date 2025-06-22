import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  HttpCode,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Book } from '../../schemas/book.schema';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Book created', type: Book })
  create(@Body() createBookDto: CreateBookDto): Promise<Book | null> {
    console.log(createBookDto)
    return this.booksService.create(createBookDto);
  }

@Get()
@ApiQuery({ name: 'page', required: false, type: Number })
@ApiQuery({ name: 'limit', required: false, type: Number })
@ApiQuery({ name: 'title', required: false, type: String })
@ApiQuery({ name: 'isbn', required: false, type: String })
@ApiQuery({ name: 'authorId', required: false, type: String })
findAll(
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  @Query('title') title?: string,
  @Query('isbn') isbn?: string,
  @Query('authorId') authorId?: string,
): Promise<{ data: Book[]; total: number }> {
  return this.booksService.findAll(page, limit, title, isbn, authorId);
}

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Book found', type: Book })
  @ApiResponse({ status: 404, description: 'Book not found' })
  findOne(@Param('id') id: string): Promise<Book> {
    return this.booksService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Book updated', type: Book })
  @ApiResponse({ status: 404, description: 'Book not found' })
  update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({ status: 204, description: 'Book deleted' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.booksService.remove(id);
  }
}