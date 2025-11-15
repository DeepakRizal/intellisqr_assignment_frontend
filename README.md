# Todo App — Frontend

A simple and clean Todo application built with **React**, **TypeScript**, and **Vite**.  
It includes basic authentication and an interface for managing todos.

---

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- React Router
- React Query
- Zustand
- React Hook Form + Zod
- Axios

---

## Features

### Authentication

- Sign up
- Login
- Forgot & Reset password

### Todo Management

- Create todos
- Mark complete and incomplete
- Delete todos
- Auto updates with React Query

## Getting Started

### 1. Install dependencies

Clone this repository change directory to project folder

```bash
npm install
```

### Environment variables

Create a .env file:

- VITE_API_URL=http://localhost:3000/api

### Run the app

```bash
npm run dev
```

> **Note:** The frontend requires the backend server to be running.  
> Without it, actions such as logging in or adding todos will not work.
