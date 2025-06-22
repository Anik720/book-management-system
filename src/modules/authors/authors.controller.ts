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
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Author } from '../../schemas/author.schema';
import { PaginatedAuthorsDto } from './dto/paginated-authors.dto';

@ApiTags('authors')
@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Author created', type: Author })
  create(@Body() createAuthorDto: CreateAuthorDto): Promise<Author> {
    return this.authorsService.create(createAuthorDto);
  }

@Get()
@ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
@ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
@ApiQuery({ name: 'firstName', required: false, type: String })
@ApiQuery({ name: 'lastName', required: false, type: String })
@ApiQuery({ name: 'search', required: false, type: String })
@ApiResponse({
  status: 200,
  description: 'List of authors',
  type: PaginatedAuthorsDto,
})
findAll(
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  @Query('firstName') firstName?: string,
  @Query('lastName') lastName?: string,
  @Query('search') search?: string,
): Promise<PaginatedAuthorsDto> {
  const queryParams = { firstName, lastName, search };
  return this.authorsService.findAll(page, limit, queryParams);
}

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Author found', type: Author })
  @ApiResponse({ status: 404, description: 'Author not found' })
  findOne(@Param('id') id: string): Promise<Author | null> {
    return this.authorsService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Author updated', type: Author })
  @ApiResponse({ status: 404, description: 'Author not found' })
  update(
    @Param('id') id: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ): Promise<Author> {
    return this.authorsService.update(id, updateAuthorDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({ status: 204, description: 'Author deleted' })
  @ApiResponse({ status: 404, description: 'Author not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.authorsService.remove(id);
  }
}