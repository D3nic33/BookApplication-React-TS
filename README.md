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

| Method | Endpoint                       | Description         |
|--------|--------------------------------|---------------------|
| GET    | `/api/books`                   | Get all books       |
| GET    | `/api/books/{id}`              | Get book by ID      |
| GET    | `/api/books/shelf/{shelfName}` | Get book by shelf   |
| POST   | `/api/books`                   | Add a new book      |
| PUT    | `/api/books/{id}`              | Update a book       |
| DELETE | `/api/books/{id}`              | Delete a book       |

---

## 📦 Frontend Dependencies

```bash
npm install react-router-dom
npm install -D tailwind-scrollbar-hide @types/react-router-dom
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
