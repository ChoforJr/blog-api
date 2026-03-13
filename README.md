# Blog API

A comprehensive RESTful API backend for a blog application with user authentication, post management, and commenting functionality.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Related Projects](#related-projects)
- [Author](#author)
- [License](#license)

## Features

- **User Authentication**: Local strategy with Passport.js
- **Authorization**: JWT (JSON Web Tokens) for secure API access
- **Role-Based Access Control**: User and Admin roles
- **Post Management**: Create, read, update, and delete blog posts
- **Comment System**: Users can comment on posts
- **User Profiles**: Display user information and bio
- **Input Validation**: Comprehensive validation using express-validator
- **Password Security**: Bcrypt encryption for password hashing
- **CORS Protection**: Whitelist-based CORS configuration

## Tech Stack

- **Runtime**: Node.js
- **Language**: JavaScript (ES modules)
- **Framework**: Express.js 5.x
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Passport.js (Local & JWT strategies)
- **Validation**: express-validator
- **Scheduling**: node-cron
- **Password Hashing**: bcryptjs

## Prerequisites

- Node.js (v16 or higher)
- npm
- PostgreSQL database

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ChoforJr/blog-api.git
   cd blog-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Generate Prisma Client**
   ```bash
   npm run prismaGen
   ```

## Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/blog_db

# Authentication
JWT_SECRET=your_jwt_secret_key

# CORS Origins
ALLOWED_URL1=http://localhost:3000
ALLOWED_URL2=http://localhost:3001

# Environment
NODE_ENV=development
PORT=5000
```

### Generate JWT Secret

Run the following command to generate a secure JWT secret key:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and add it to your `.env` file as `JWT_SECRET`.

### Database Setup

1. **Create and migrate the database**

   ```bash
   npm run prismaMg
   ```

   Or for development with auto-migration:

   ```bash
   npm run prismaMg
   ```

2. **View and manage data**
   ```bash
   npx prisma studio
   ```

## Running the Application

### Development Mode

Start the development server with hot reload:

```bash
npm run dev
```

The server will watch for file changes and automatically restart.

### Production Mode

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## API Documentation

### Authentication Endpoints

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Authenticate user and receive JWT
- `POST /auth/logout` - Logout user

### User Endpoints

- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update user profile
- `GET /user/posts` - Get user's posts

### Post Endpoints

- `GET /posts` - Get all published posts
- `POST /posts` - Create a new post (requires authentication)
- `GET /posts/:id` - Get a specific post
- `PUT /posts/:id` - Update a post (requires authentication)
- `DELETE /posts/:id` - Delete a post (requires authentication)

### Comment Endpoints

- `POST /posts/:postId/comments` - Add comment to post (requires authentication)
- `DELETE /comments/:id` - Delete comment (requires authentication)

For detailed API documentation, refer to the API requests in your REST client.

## Project Structure

```
blog-api/
├── app.js                 # Express app entry point
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── prisma.config.ts      # Prisma configuration
│
├── config/               # Configuration files
│   ├── passport.js       # Passport authentication strategies
│   └── prisma.js         # Prisma client instance
│
├── controllers/          # Route controllers
│   ├── read.js          # GET operations
│   ├── post.js          # POST operations
│   ├── put.js           # PUT operations
│   └── delete.js        # DELETE operations
│
├── routes/              # API route definitions
│   ├── authRouter.js    # Authentication routes
│   ├── adminRouter.js   # Admin routes
│   ├── userRouter.js    # User routes
│   └── indexRouter.js   # Index routes
│
├── prisma/              # Prisma ORM
│   ├── schema.prisma    # Database schema
│   └── migrations/      # Database migrations
│
├── prisma_queries/      # Prisma database operations
│   ├── create.js        # Create operations
│   ├── read.js          # Read operations
│   ├── update.js        # Update operations
│   └── delete.js        # Delete operations
│
├── validations/         # Input validation rules
│   ├── validateSignUp.js
│   ├── validateLogIn.js
│   ├── validatePost.js
│   ├── validateComment.js
│   └── validationChanges/ # Validation for updates
│
├── public/              # Static files
│   ├── index.js
│   └── style.css
│
└── views/               # EJS templates (if applicable)
```

## Related Projects

This API is used by two client applications:

- **[Admin Client](https://github.com/ChoforJr/admin-client-blog-api)** - Dashboard for managing posts and users
- **[User Client](https://github.com/ChoforJr/user-client-blog-api)** - Public-facing blog interface

## Author

**FORSAKANG CHOFOR JUNIOR**

- [GitHub](https://github.com/ChoforJr)
- [Repository](https://github.com/ChoforJr/blog-api)
