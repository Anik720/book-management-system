import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getConnectionToken } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Author, AuthorSchema } from '../src/schemas/author.schema';
import { CreateBookDto } from '../src/modules/books/dto/create-book.dto';

describe('BooksController (e2e)', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;
  let mongooseConnection: mongoose.Connection;
  let authorId: string;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    process.env.MONGO_URI = uri;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    mongooseConnection = app.get(getConnectionToken());
    const AuthorModel = mongooseConnection.model(Author.name, AuthorSchema);

    const author = new AuthorModel({
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Test author',
      birthDate: '1980-01-01',
    });

    const savedAuthor: any = await author.save();
    authorId = savedAuthor._id.toString();
  });

  afterEach(async () => {
    await mongooseConnection.dropDatabase();

    // Re-create author after DB drop
    const AuthorModel = mongooseConnection.model(Author.name, AuthorSchema);
    const author = new AuthorModel({
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Test author',
      birthDate: '1980-01-01',
    });

    const savedAuthor: any = await author.save();
    authorId = savedAuthor._id.toString();
  });

  afterAll(async () => {
    await mongooseConnection.dropDatabase();
    await mongooseConnection.close();
    await mongoServer.stop();
    await app.close();
  });

  it('should create a book successfully', async () => {
    const book: CreateBookDto = {
      title: 'Test Book',
      isbn: '9783161484100',
      publishedDate: '2023-01-01',
      authorId,
    };

    const response = await request(app.getHttpServer())
      .post('/books')
      .send(book)
      .expect(201);

    expect(response.body.title).toBe(book.title);
    expect(response.body.isbn).toBe(book.isbn);
    expect(response.body.author._id.toString()).toBe(authorId.toString());
  });

  it('should return 400 for invalid author ID', async () => {
    const book: CreateBookDto = {
      title: 'Invalid Author',
      isbn: '9781234567897',
      publishedDate: '2023-01-01',
      authorId: 'invalid-id',
    };

    await request(app.getHttpServer()).post('/books').send(book).expect(400);
  });

  it('should return 400 for non-existent author', async () => {
    const book: CreateBookDto = {
      title: 'Non-existent Author',
      isbn: '9781234567897',
      publishedDate: '2023-01-01',
      authorId: '507f1f77bcf86cd799439011',
    };

    await request(app.getHttpServer()).post('/books').send(book).expect(400);
  });

  it('should return 400 for invalid ISBN format', async () => {
    const book: CreateBookDto = {
      title: 'Invalid ISBN',
      isbn: 'invalid-isbn',
      publishedDate: '2023-01-01',
      authorId,
    };

    await request(app.getHttpServer()).post('/books').send(book).expect(400);
  });

  // 👇 ADD THIS BLOCK AFTER THE LAST TEST
  describe('Book Creation', () => {
    it('should return 409 for duplicate ISBN', async () => {
      const book: CreateBookDto = {
        title: 'Duplicate ISBN',
        isbn: '9783161484100',
        publishedDate: '2023-01-01',
        authorId,
      };

      await request(app.getHttpServer()).post('/books').send(book).expect(201);
      await request(app.getHttpServer()).post('/books').send(book).expect(409);
    });
  });
});
