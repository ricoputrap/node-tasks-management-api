# Tasks Management API

> A simple CRUD REST API to serve a Tasks Management App built using NodeJS in TypeScript.

### I. Overview

This project is the **backend** for Tasks Management App built using **NodeJS**, **TypeScript**, and **SQLite**, incorporating **Role-Based Access Control (RBAC)** to manage user permissions effectively. The system provides a comprehensive **RESTful API** for user authentication, task management, and user management.

The authentication is utilizing **JWT**, a built-in NodeJS library known as **Crypto** for password hashing, and **Zod** for data validation.

### II. Table of Contents

- [Tasks Management API](#tasks-management-api)
    - [I. Overview](#i-overview)
    - [II. Table of Contents](#ii-table-of-contents)
    - [III. Features](#iii-features)
    - [IV. Technologies](#iv-technologies)
    - [V. Getting Started](#v-getting-started)
    - [VI. API Endpoints](#vi-api-endpoints)
      - [A. User Authentication (`/api/auth`)](#a-user-authentication-apiauth)
      - [B. Task Management (`/api/tasks`)](#b-task-management-apitasks)
      - [C. User Management (`/api/users`)](#c-user-management-apiusers)

### III. Features

- **A. User Authentication**
  - [x] Create New Account
  - [x] Login
  - [x] Logout
  - [x] Refresh Token
- **B. Task Management** by **User**
  - [x] Get All Tasks
  - [x] Get Task by ID
  - [x] Create New Task
  - [x] Edit Task
  - [x] Delete Task
- **C. User Management** by **Admin**
  - [ ] Get All Users
  - [ ] Get User by ID
  - [ ] Delete User

### IV. Technologies

- **NodeJS**: JavaScript runtime for building scalable network applications.
- **TypeScript**: A superset of JavaScript that compiles to plain JavaScript, providing static typing.
- **SQLite**: A lightweight database engine for local data storage. Supported in NodeJS as a built-in package since Node v22.5.0.
- **Crypto**: Node.js's built-in library for cryptographic functions, used for password hashing and verification.
- **JWT (JSON Web Tokens)**: For secure user authentication and session management.
- **Zod**: A TypeScript-first schema declaration and validation library, used for validating user input and API requests.

### V. Getting Started

To get started with this project, follow these steps:

1. **Clone the repository**
    ```bash
    git clone https://github.com/ricoputrap/node-tasks-management-api
    cd node-tasks-management-api
    ```

2. **Install Dependencies**
  Make sure you have Node.js v22.5.0 or above and npm installed. Then run:
    ```bash
    npm install
    ```

3. **Set Up Environment Variables**:
  Copy the `.env.example` file and rename it to `.env` and fill in the values for all variables.

     1. **How to generate values for `CRYPTO_KEY` and `CRYPTO_IV`**
       Write a simple JS script below:
         ```javascript
         // generate-crypto-keys.js
         const crypto = require('crypto');

         const key = crypto.randomBytes(32);
         const iv = crypto.randomBytes(16);

         const CRYPTO_KEY = key.toString('hex');
         const CRYPTO_IV = iv.toString('hex');

         console.log("CRYPTO_KEY:", CRYPTO_KEY)
         console.log("CRYPTO_IV:", CRYPTO_IV)
         ```

          1. Run the JS script above: `node generate-crypto-keys.js`
          2. Store the generated value of `CRYPTO_KEY` and `CRYPTO_IV` in your `.env` file.

     2. **How to generate values for `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET`**
      Basically you can put anything inside those two variables.

4. **Compile TypeScript**:
   Compile the TypeScript files to JavaScript:
   ```bash
   npm run build
   ```

5. **Run the Application**:
   Start the server:
   ```bash
   npm start
   ```

6. **Testing the API**:
   TODO

### VI. API Endpoints

#### A. User Authentication (`/api/auth`)
Path | Method | Description | Role
---|---|---|---
`/api/auth/register` | POST | Create New Account | Public
`/api/auth/login` | POST | Login | User, Admin
`/api/auth/logout` | POST | Logout | User, Admin
`/api/auth/refresh-tokens` | POST | Refresh Token | User, Admin

#### B. Task Management (`/api/tasks`)
Path | Method | Description | Role
---|---|---|---
`/api/tasks` | GET | Get All Tasks | User
`/api/tasks/:id` | GET | Get Task by ID | User
`/api/tasks` | POST | Create New Task | User
`/api/tasks/:id` | PUT | Edit Task | User
`/api/tasks/:id` | DELETE | Delete Task | User

#### C. User Management (`/api/users`)
Path | Method | Description | Role
---|---|---|---
`/api/users` | GET | Get All Users | Admin
`/api/users/:id` | GET | Get User by ID | Admin
`/api/users/:id` | PUT | Edit User | Admin
`/api/users/:id` | DELETE | Delete User | Admin