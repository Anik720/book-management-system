import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, isValidObjectId, Model } from 'mongoose';
import { Book } from '../../schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AuthorsService } from '../authors/authors.service';
import { isISBN } from 'class-validator';


@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<Book>,
    private authorsService: AuthorsService,
  ) { }

async create(createBookDto: CreateBookDto): Promise<Book | null> {
  const { authorId, isbn } = createBookDto;

  if (!isValidObjectId(authorId)) {
    throw new BadRequestException('Invalid author ID format');
  }

  if (!isISBN(isbn)) {
    throw new BadRequestException('Invalid ISBN format');
  }

  const author = await this.authorsService.findOne(authorId);
  if (!author) {
    throw new BadRequestException('Author does not exist');
  }

  const existingBook = await this.bookModel.findOne({ isbn });
  if (existingBook) {
    throw new ConflictException(`A book with ISBN "${isbn}" already exists.`);
  }

  const book = new this.bookModel({
    ...createBookDto,
    author: authorId,
  });

  const savedBook = await book.save();

  // ✅ Re-fetch with population to ensure full fields
  const populatedBook = await this.bookModel.findById(savedBook._id).populate('author');

  return populatedBook;
}





  async findAll(
    page: number = 1,
    limit: number = 10,
    title?: string,
    isbn?: string,
    authorId?: string,
  ): Promise<{ data: Book[]; total: number }> {
    const query: FilterQuery<Book> = {};

    const searchConditions: FilterQuery<Book>[] = [];

    if (title) {
      searchConditions.push({ title: { $regex: title, $options: 'i' } });
    }

    if (isbn) {
      searchConditions.push({ isbn: { $regex: isbn, $options: 'i' } });
    }

    if (searchConditions.length > 0) {
      query.$or = searchConditions;
    }

    if (authorId) {
      query.author = authorId;
    }

    const [data, total] = await Promise.all([
      this.bookModel
        .find(query)
        .populate('author')
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.bookModel.countDocuments(query),
    ]);

    return { data, total };
  }

  async findOne(id: string): Promise<Book> {

    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid book ID format');
    }

    const book = await this.bookModel.findById(id).populate('author').exec();

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return book;
  }


async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
  if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid Book id format');
  }
  if (updateBookDto.authorId) {
    if (!isValidObjectId(updateBookDto.authorId)) {
      throw new BadRequestException('Invalid authorId format');
    }

    const author = await this.authorsService.findOne(updateBookDto.authorId);
    if (!author) {
      throw new BadRequestException('Author does not exist');
    }
  }


  if (updateBookDto.isbn) {
    const existingBookWithSameIsbn = await this.bookModel.findOne({
      isbn: updateBookDto.isbn,
      _id: { $ne: id }, 
    });

    if (existingBookWithSameIsbn) {
      throw new ConflictException(
        `A book with ISBN "${updateBookDto.isbn}" already exists.`
      );
    }
  }

  const book = await this.bookModel
    .findByIdAndUpdate(
      id,
      {
        $set: {
          ...updateBookDto,
          author: updateBookDto.authorId,
        },
      },
      { new: true }
    )
    .populate('author')
    .exec();

  if (!book) {
    throw new NotFoundException('Book not found');
  }

  return book;
}

  async remove(id: string): Promise<void> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid Book Id format');
    }
    const book = await this.bookModel.findById(id).exec();
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    await this.bookModel.deleteOne({ _id: id }).exec();
  }
}