import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsService } from './authors.service';
import { getModelToken } from '@nestjs/mongoose';
import { Author } from '../../schemas/author.schema';
import { Book } from '../../schemas/book.schema';
import { Model, Types } from 'mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

describe('AuthorsService', () => {
  let service: AuthorsService;
  let authorModel: Model<Author>;
  let bookModel: Model<Book>;

  const mockAuthor = {
    _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
    firstName: 'John',
    lastName: 'Doe',
    bio: 'Test author',
    birthDate: '1970-01-01',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAuthorModel = {
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
    deleteOne: jest.fn(),
  };

  const mockBookModel = {
    deleteMany: jest.fn(),
  };

  beforeEach(async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {}); // Suppress console logs
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorsService,
        {
          provide: getModelToken(Author.name),
          useValue: mockAuthorModel,
        },
        {
          provide: getModelToken(Book.name),
          useValue: mockBookModel,
        },
      ],
    }).compile();

    service = module.get<AuthorsService>(AuthorsService);
    authorModel = module.get<Model<Author>>(getModelToken(Author.name));
    bookModel = module.get<Model<Book>>(getModelToken(Book.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and return a new author', async () => {
      const createAuthorDto: CreateAuthorDto = {
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Test author',
        birthDate: '1970-01-01',
      };

      mockAuthorModel.create.mockResolvedValueOnce(mockAuthor);

      const result = await service.create(createAuthorDto);

      expect(mockAuthorModel.create).toHaveBeenCalledWith(createAuthorDto);
      expect(result).toEqual(mockAuthor);
    });
  });

  describe('findAll', () => {
    it('should return paginated authors without query params', async () => {
      const mockAuthors = [mockAuthor];
      const total = 1;

      mockAuthorModel.find.mockReturnValueOnce({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce(mockAuthors),
      });
      mockAuthorModel.countDocuments.mockResolvedValueOnce(total);

      const result = await service.findAll(1, 10);

      expect(mockAuthorModel.find).toHaveBeenCalledWith({});
      expect(mockAuthorModel.countDocuments).toHaveBeenCalledWith({});
      expect(result).toEqual({ data: mockAuthors, total });
    });

    it('should return paginated authors with firstName filter', async () => {
      const mockAuthors = [mockAuthor];
      const total = 1;
      const queryParams = { firstName: 'John' };

      mockAuthorModel.find.mockReturnValueOnce({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce(mockAuthors),
      });
      mockAuthorModel.countDocuments.mockResolvedValueOnce(total);

      const result = await service.findAll(1, 10, queryParams);

      expect(mockAuthorModel.find).toHaveBeenCalledWith({
        $and: [{ firstName: { $regex: 'John', $options: 'i' } }],
      });
      expect(result).toEqual({ data: mockAuthors, total });
    });

    it('should return paginated authors with search filter', async () => {
      const mockAuthors = [mockAuthor];
      const total = 1;
      const queryParams = { search: 'John' };

      mockAuthorModel.find.mockReturnValueOnce({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce(mockAuthors),
      });
      mockAuthorModel.countDocuments.mockResolvedValueOnce(total);

      const result = await service.findAll(1, 10, queryParams);

      expect(mockAuthorModel.find).toHaveBeenCalledWith({
        $or: [
          { firstName: { $regex: 'John', $options: 'i' } },
          { lastName: { $regex: 'John', $options: 'i' } },
        ],
      });
      expect(result).toEqual({ data: mockAuthors, total });
    });
  });

  describe('findOne', () => {
    it('should return an author by ID', async () => {
      mockAuthorModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockAuthor),
      });

      const result = await service.findOne('507f1f77bcf86cd799439011');

      expect(mockAuthorModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockAuthor);
    });

    it('should throw BadRequestException for invalid ID', async () => {
      await expect(service.findOne('invalid-id')).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if author not found', async () => {
      mockAuthorModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(service.findOne('507f1f77bcf86cd799439011')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return an author', async () => {
      const updateAuthorDto: UpdateAuthorDto = { firstName: 'Jane' };

      mockAuthorModel.findByIdAndUpdate.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce({ ...mockAuthor, firstName: 'Jane' }),
      });

      const result = await service.update('507f1f77bcf86cd799439011', updateAuthorDto);

      expect(mockAuthorModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        { $set: updateAuthorDto },
        { new: true },
      );
      expect(result).toEqual({ ...mockAuthor, firstName: 'Jane' });
    });

    it('should throw NotFoundException if author not found', async () => {
      mockAuthorModel.findByIdAndUpdate.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(service.update('507f1f77bcf86cd799439011', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete an author and associated books', async () => {
      mockAuthorModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockAuthor),
      });
      mockBookModel.deleteMany.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce({ deletedCount: 2 }),
      });
      mockAuthorModel.deleteOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce({ deletedCount: 1 }),
      });

      await service.remove('507f1f77bcf86cd799439011');

      expect(mockAuthorModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(mockBookModel.deleteMany).toHaveBeenCalledWith({ author: '507f1f77bcf86cd799439011' });
      expect(mockAuthorModel.deleteOne).toHaveBeenCalledWith({ _id: '507f1f77bcf86cd799439011' });
    });

    it('should throw BadRequestException for invalid ID', async () => {
      await expect(service.remove('invalid-id')).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if author not found', async () => {
      mockAuthorModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(service.remove('507f1f77bcf86cd799439011')).rejects.toThrow(NotFoundException);
    });

    it('should handle case with no associated books', async () => {
      mockAuthorModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockAuthor),
      });
      mockBookModel.deleteMany.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce({ deletedCount: 0 }),
      });
      mockAuthorModel.deleteOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce({ deletedCount: 1 }),
      });

      await service.remove('507f1f77bcf86cd799439011');

      expect(mockBookModel.deleteMany).toHaveBeenCalledWith({ author: '507f1f77bcf86cd799439011' });
      expect(mockAuthorModel.deleteOne).toHaveBeenCalledWith({ _id: '507f1f77bcf86cd799439011' });
    });
  });
});