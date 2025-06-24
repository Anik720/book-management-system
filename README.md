# 📚 Book Management System (NestJS)

A simple RESTful API for managing books and authors, built with [NestJS](https://nestjs.com/) and [SQLite](https://www.sqlite.org/) using [TypeORM](https://typeorm.io/). This project demonstrates best practices in architecture, data validation, error handling, and testing.

---

## 🚀 Features

- Create, retrieve, update, and delete authors and books
- Search & filter support for authors and books
- Data validation with `class-validator`
- Error handling with meaningful HTTP status codes
- Pagination for listing endpoints
- Relational mapping between books and authors
- Unit & end-to-end testing

---

## 🛠️ Tech Stack

- **Framework:** [NestJS](https://nestjs.com/)
- **Database:** SQLite (with TypeORM)
  - **Note:** In production, I prefer **PostgreSQL** for its robustness, JSONB support, strong indexing, and advanced querying capabilities.
- **Testing:** Jest & Supertest
- **Validation:** `class-validator`, `class-transformer`

---

## 📦 Installation

```bash
# Clone the repo
git clone https://github.com/Anik720/book-management-system
cd book-management-system

# Install dependencies
npm install



## Running the App

# Start the development server
- npm run start:dev

# Build the project
- npm run test

# Running Tests (authors module)
- npm run test

# End-to-End Tests ()
- npm run test:e2e (books creation)

## API Endpoints
#Authors
- POST /authors – Create a new author
- Body 
    {
    "firstName": "John",
    "lastName": "Doe",
    "bio": "A famous author",
    "birthDate": "1980-05-15"
    }

- GET /authors – List all authors
    Query Parameters:

    page, limit

    firstName, lastName (case-insensitive partial search)


- GET /authors/:id – Get author by ID
- PATCH /authors/:id
- DELETE /authors/:id

# Books
- POST /books – Create a new book
- Body:
    {
    "title": "The  Nove 2",
    "isbn": "9780201633610",
    "publishedDate": "2023-01-01",
    "genre": "Fiction",
    "authorId": "685abf6e98e8b71c6a9e7077"
    }


- GET /books – List all books
  Query Parameters:

      page, limit

      title, isbn (case-insensitive partial search)

      authorId

- GET /books/:id – Get book by ID (with author info)
- PATCH /books/:id – Update book (partial fields)
- DELETE /books/:id – Delete book by ID
