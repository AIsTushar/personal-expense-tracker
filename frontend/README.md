# Expense Manager Frontend

A modern expense tracking application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 📊 Track and manage expenses with an intuitive interface
- 🔍 Filter expenses by category and date range
- 📈 Visual expense breakdowns with charts
- 💾 Real-time updates and data persistence
- 🎨 Modern, responsive design with Tailwind CSS
- 🔒 User authentication and session management

## Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (v16 or higher)
- npm (v7 or higher)

## Installation

1. Clone the repository and navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

## Configuration

1. Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

For production:

```bash
npm run build
npm run start
```

## Project Structure

```
frontend/
  ├── src/
  │   ├── components/
  │   │   └── ExpenceManagement/
  │   │       ├── Expense.tsx
  │   │       ├── Expense-Chart.tsx
  │   │       ├── Expense-Form.tsx
  │   │       ├── Expense-List.tsx
  │   │       └── Expense-Status.tsx
  │   ├── redux/
  │   └── types/
  ├── public/
  ├── .env.local
  ├── package.json
  └── tsconfig.json
```

## Available Scripts

- `npm run dev` - Start development server using Turbopack
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

## Technologies Used

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Recharts](https://recharts.org/)
