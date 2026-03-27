# ShelfWise — Book Management App

A full-stack book management application where you can organise your reading life, track progress, annotate books, and see what the readers you follow are up to.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![ASP.NET Core](https://img.shields.io/badge/ASP.NET_Core-8-512BD4?style=flat&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript, Vite 6 |
| Routing | React Router v7 |
| Styling | Tailwind CSS v4 (utility-only, no CSS modules) |
| State | React Context API (auth only) |
| Backend | ASP.NET Core 8 (C#) |
| Database | SQL Server · Entity Framework Core |
| Auth | JWT Bearer tokens · PBKDF2-SHA256 password hashing |
| External API | Google Books API |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- SQL Server or SQL Server LocalDB (included with Visual Studio)
- A [Google Books API key](https://developers.google.com/books/docs/v1/using#APIKey)

### 1. Clone the repository

```bash
git clone https://github.com/D3nic33/BookApplication-React-TS.git
cd BookApplication-React-TS
```

### 2. Configure the backend

Add your secrets to `BookApplication-React-TS.Server/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=BookApp;Trusted_Connection=True;"
  },
  "Jwt": {
    "Key": "<your-32+-character-secret>",
    "Issuer": "shelfy",
    "Audience": "shelfy-users"
  },
  "GoogleBooks": {
    "ApiKey": "<your-google-books-api-key>"
  }
}
```

### 3. Run the backend

```bash
cd BookApplication-React-TS.Server
dotnet ef database update
dotnet run
```

The API runs on `https://localhost:7090`.

### 4. Run the frontend

```bash
cd bookapplication-react-ts.client
npm install
npm run dev
```

The Vite dev server starts on `https://localhost:53783` and automatically proxies `/api` requests to the backend.

---

## Frontend Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | TypeScript check + production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build locally |

---

## API Reference

All endpoints except `/api/auth/*` require an `Authorization: Bearer <token>` header.

**Auth**

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login — returns JWT |

**Books**

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/books` | All books for current user |
| GET | `/api/books/{id}` | Single book |
| GET | `/api/books/shelf/{shelf}` | Books filtered by shelf |
| GET | `/api/books/shelves` | All shelf names for current user |
| GET | `/api/books/user/{userId}` | Public books for another user |
| POST | `/api/books` | Add a book |
| PUT | `/api/books/{id}` | Update a book |
| DELETE | `/api/books/{id}` | Delete a book |

**Notes**

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/notes/book/{bookId}` | Notes for a book |
| POST | `/api/notes/book/{bookId}` | Add a note |
| PUT | `/api/notes/{id}` | Update a note |
| DELETE | `/api/notes/{id}` | Delete a note |

**Highlights**

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/highlights/book/{bookId}` | Highlights for a book |
| POST | `/api/highlights/book/{bookId}` | Add a highlight |
| PUT | `/api/highlights/{id}` | Update a highlight |
| DELETE | `/api/highlights/{id}` | Delete a highlight |

**Reviews**

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/reviews/book/{bookId}` | All reviews for a book |
| GET | `/api/reviews/book/{bookId}/mine` | Current user's review |
| POST | `/api/reviews/book/{bookId}` | Create a review |
| PUT | `/api/reviews/{id}` | Update a review |
| DELETE | `/api/reviews/{id}` | Delete a review |

**Users**

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/user/me` | Current user profile |
| GET | `/api/user/me/counts` | Follower / following counts |
| GET | `/api/user/me/books/read/count` | Count of read books |
| GET | `/api/user/{userId}` | Public profile by user ID |
| PUT | `/api/user/me` | Update profile |
| PUT | `/api/user/me/password` | Change password |

**Follow**

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/follow/{targetUserId}` | Follow a user |
| DELETE | `/api/follow/{targetUserId}` | Unfollow a user |
| GET | `/api/follow/users/{userId}/followers` | Followers list |
| GET | `/api/follow/users/{userId}/following` | Following list |
| GET | `/api/follow/isfollowing/{targetUserId}` | Check follow status |
| GET | `/api/follow/search?query=` | Search users by username |

**Activity & Search**

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/activity/feed` | Activity feed for followed users |
| GET | `/api/googlebooks/search?q=` | Search Google Books API |

---

## License

This project is open source and available under the [MIT License](LICENSE).
