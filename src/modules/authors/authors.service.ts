import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Author } from '../../schemas/author.schema';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Book } from '../../schemas/book.schema';


@Injectable()
export class AuthorsService {
  constructor(@InjectModel(Author.name) private authorModel: Model<Author>,
             @InjectModel(Book.name) private bookModel: Model<Book>,) {}

async create(createAuthorDto: CreateAuthorDto): Promise<Author> {
  const author = await this.authorModel.create(createAuthorDto);
  return author;
}
async findAll(
    page: number = 1,
    limit: number = 10,
    { firstName, lastName, search }: { firstName?: string; lastName?: string; search?: string } = {},
  ): Promise<{ data: Author[]; total: number }> {

    const query: any = {};

    if (firstName || lastName) {
      query.$and = [];
      if (firstName) {
        query.$and.push({ firstName: { $regex: firstName, $options: 'i' } });
      }
      if (lastName) {
        query.$and.push({ lastName: { $regex: lastName, $options: 'i' } });
      }
    } else if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.authorModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.authorModel.countDocuments(query),
    ]);

    return { data, total };
  }

async findOne(id: string): Promise<Author | null> {

  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestException('Invalid author ID');
  }

  const author = await this.authorModel.findById(id).exec();

  if (!author) {
    throw new NotFoundException('Author not found');
  }

  return author;
  //  return await this.authorModel.findById(id).exec();
}
  async update(id: string, updateAuthorDto: UpdateAuthorDto): Promise<Author> {
    const author = await this.authorModel
      .findByIdAndUpdate(id, { $set: updateAuthorDto }, { new: true })
      .exec();
    if (!author) {
      throw new NotFoundException('Author not found');
    }
    return author;
  }

async remove(id: string): Promise<void> {

  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestException('Invalid author ID');
  }

  const author = await this.authorModel.findById(id).exec();
  if (!author) {
    throw new NotFoundException('Author not found');
  }

  const deleteResult = await this.bookModel.deleteMany({ author: id }).exec();


  if (deleteResult.deletedCount === 0) {
    console.log(`No books found for author with ID ${id}. Proceeding with deletion.`);
  } else {
    console.log(`Deleted ${deleteResult.deletedCount} book(s) for author ${id}`);
  }

  await this.authorModel.deleteOne({ _id: id }).exec();
}

}