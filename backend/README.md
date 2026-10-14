# StudyHub - Backend API

A robust RESTful API providing the core infrastructure for StudyHub, a comprehensive platform for sharing and managing academic documents.

## Core Features

*   **Authentication & Authorization:** Secure user authentication using JWT and HttpOnly cookies, combined with strict Role-Based Access Control (Admin vs. Student).
*   **Document Management:** Full lifecycle handling of academic materials including secure uploads, administrative approval workflows, and view/download tracking.
*   **Community & Admin:** Integrated review system allowing users to rate and comment on documents, alongside a dedicated administrative dashboard for global moderation.
*   **Security & Optimization:** Engineered with strict rate-limiting to prevent abuse, comprehensive Joi payload validation, and concurrent database queries for high performance.

## Tech Stack

*   **Core:** Node.js, Express.js, TypeScript
*   **Database:** PostgreSQL (optimized with raw SQL queries)
*   **Cloud & Security:** Cloudinary (file storage), Joi (validation), express-rate-limit

## Folder Structure

```text
StudyHub
└── backend
    ├── node_modules
    ├── src
    │   ├── config
    │   │   └── database.ts
    │   ├── controllers
    │   │   ├── admin
    │   │   │   ├── category.controller.ts
    │   │   │   ├── document.controller.ts
    │   │   │   ├── review.controller.ts
    │   │   │   └── user.controller.ts
    │   │   ├── auth.controller.ts
    │   │   ├── category.controller.ts
    │   │   ├── document.controller.ts
    │   │   ├── review.controller.ts
    │   │   ├── saved-document.controller.ts
    │   │   └── user.controller.ts
    │   ├── helpers
    │   │   ├── cloudinary.helper.ts
    │   │   └── pagination.helper.ts
    │   ├── middlewares
    │   │   ├── auth.middleware.ts
    │   │   ├── authorize.middleware.ts
    │   │   └── upload.middleware.ts
    │   ├── repositories
    │   │   ├── admin
    │   │   │   ├── category.repository.ts
    │   │   │   ├── document.repository.ts
    │   │   │   ├── review.repository.ts
    │   │   │   └── user.repository.ts
    │   │   ├── category.repository.ts
    │   │   ├── document.repository.ts
    │   │   ├── review.repository.ts
    │   │   ├── saved-document.repository.ts
    │   │   └── user.repository.ts
    │   ├── routes
    │   │   ├── admin
    │   │   │   ├── category.route.ts
    │   │   │   ├── document.route.ts
    │   │   │   ├── index.route.ts
    │   │   │   ├── review.route.ts
    │   │   │   └── user.route.ts
    │   │   ├── auth.route.ts
    │   │   ├── category.route.ts
    │   │   ├── document.route.ts
    │   │   ├── index.route.ts
    │   │   ├── review.route.ts
    │   │   └── user.route.ts
    │   ├── services
    │   │   ├── admin
    │   │   │   ├── category.service.ts
    │   │   │   ├── document.service.ts
    │   │   │   ├── review.service.ts
    │   │   │   └── user.service.ts
    │   │   ├── auth.service.ts
    │   │   ├── category.service.ts
    │   │   ├── document.service.ts
    │   │   ├── review.service.ts
    │   │   ├── saved-document.service.ts
    │   │   └── user.service.ts
    │   └── validations
    │       ├── admin
    │       │   ├── category.validate.ts
    │       │   ├── document.validate.ts
    │       │   └── user.validate.ts
    │       ├── auth.validate.ts
    │       ├── document.validate.ts
    │       ├── review.validate.ts
    │       └── index.ts
    ├── .env
    ├── .gitignore
    ├── package.json
    ├── tsconfig.json
    └── yarn.lock
```
## Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/doanthanhphuong29012006-dev/StudyHub-Backend.git
2. Install all dependencies:
   ```bash
   yarn install
3. Start the development server:
   ```bash
   yarn dev

## Environment Variables

Create a .env file in the root directory and configure the following required parameters:
```Plaintext
PORT=1234
ROUTE_ADMIN=admin
DB_USER=postgres
DB_HOST=localhost
DB_NAME=your_database_name
DB_PASSWORD=your_database_password
DB_PORT=5432
JWT_SECRET=your_jwt_secret_key
NODE_ENV=developer
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
