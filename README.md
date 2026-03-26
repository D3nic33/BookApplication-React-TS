# BookApplication-React-TS

# 📚 BookApplication

A full-stack book management application built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, and **ASP.NET Core**.

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![ASP.NET Core](https://img.shields.io/badge/ASP.NET_Core-8-512BD4?style=flat&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com)

---

## 🛠️ Tech Stack

| Layer      | Technology                            |
|------------|---------------------------------------|
| Frontend   | React 18, TypeScript, Vite            |
| Styling    | Tailwind CSS,                         |
| Routing    | React Router DOM                      |
| Backend    | ASP.NET Core Web API                  |
| Database   | Entity Framework Core                 |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [.NET SDK](https://dotnet.microsoft.com/) (v8+)

### 1. Clone the repository

```bash
git clone https://github.com/D3nic33/BookApplication-React-TS.git
cd BookApplication-React-TS
```

### 2. Run the frontend

```bash
cd client
npm install
npm run dev
```

### 3. Run the backend

```bash
cd server
dotnet restore
dotnet run
```
---

## 🔌 API Endpoints

Here are all the available API endpoints:

**Auth**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |

**Books**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | Get all books for current user |
| GET | `/api/books/{id}` | Get book by ID |
| GET | `/api/books/shelf/{shelf}` | Get books by shelf name |
| GET | `/api/books/shelves` | Get all shelf names for current user |
| GET | `/api/books/user/{userId}` | Get public books grouped by shelf |
| POST | `/api/books` | Add a new book |
| PUT | `/api/books/{id}` | Update a book |
| DELETE | `/api/books/{id}` | Delete a book |

**Highlights**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/highlights/book/{bookId}` | Get highlights for a book |
| POST | `/api/highlights/book/{bookId}` | Add a highlight to a book |
| PUT | `/api/highlights/{id}` | Update a highlight |
| DELETE | `/api/highlights/{id}` | Delete a highlight |

**Notes**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes/book/{bookId}` | Get notes for a book |
| POST | `/api/notes/book/{bookId}` | Add a note to a book |
| PUT | `/api/notes/{id}` | Update a note |
| DELETE | `/api/notes/{id}` | Delete a note |

**Reviews**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reviews/book/{bookId}` | Get all reviews for a book |
| GET | `/api/reviews/book/{bookId}/mine` | Get current user's review for a book |
| POST | `/api/reviews/book/{bookId}` | Create a review |
| PUT | `/api/reviews/{id}` | Update a review |
| DELETE | `/api/reviews/{id}` | Delete a review |

**Users**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/me` | Get current user profile |
| GET | `/api/user/me/counts` | Get current user follow counts |
| GET | `/api/user/me/books/read/count` | Get count of read books |
| GET | `/api/user/{userId}` | Get public profile by user ID |
| PUT | `/api/user/me` | Update current user profile |
| PUT | `/api/user/me/password` | Change password |

**Follow**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/follow/{targetUserId}` | Follow a user |
| DELETE | `/api/follow/{targetUserId}` | Unfollow a user |
| GET | `/api/follow/users/{userId}/followers` | Get followers of a user |
| GET | `/api/follow/users/{userId}/following` | Get users a user is following |
| GET | `/api/follow/isfollowing/{targetUserId}` | Check if following a user |
| GET | `/api/follow/{userId}/counts` | Get follower/following counts |
| GET | `/api/follow/search?query=` | Search users by username |

**Google Books**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/googlebooks/search?q=` | Search Google Books |

---

## 📦 Frontend Dependencies

```bash
npm install react-router-dom
npm install -D tailwind-scrollbar-hide @types/react-router-dom
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
