# 📚 Book Management System (NestJS)

A simple RESTful API for managing books and authors, built with [NestJS](https://nestjs.com/) and MongoDB using Mongoose. This project demonstrates best practices in architecture, data validation, error handling, and testing.

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
- **Database:** MongoDB using Mongoose
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

## 🔐 Environment Variables

Create a `.env` file in the root directory and define the following:

| Variable       | Description                               | Example                                      |
|----------------|-------------------------------------------|----------------------------------------------|
| `PORT`         | Port number the server will run on        | `3000`                                       |
| `MONGODB_URI`  | MongoDB connection string                 | `mongodb://localhost:27017/book_management_db` |

These variables are loaded automatically using `@nestjs/config`.


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
