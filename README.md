# NewsShield

NewsShield is a full-stack web application for checking news claims. It searches recent news sources, uses AI to assess a claim, and saves verification history for signed-in users.

## What this project does

NewsShield helps users evaluate whether a news claim is likely to be real or misleading. A user enters a claim, and the application:

1. Searches for relevant recent news coverage using Tavily.
2. Collects and compares information from the returned sources.
3. Uses Groq AI to analyze the claim against those sources.
4. Shows a verdict, confidence score, explanation, and supporting source links.
5. Saves each verification to the user's history after they sign in.

The project also includes user registration and login, protected pages, and a history page where users can review or delete previous checks.

## Tech stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB/Mongoose
- **Services:** Tavily Search and Groq AI

## Project structure

```text
NewsShield-final/
├── backend/     # Express API and MongoDB models
└── frontend/    # React + Vite application
```

## Prerequisites

- Node.js 18 or later
- A MongoDB connection string
- A Tavily API key
- A Groq API key

## Installation

Install the backend dependencies:

```bash
cd backend
npm install
```

Install the frontend dependencies:

```bash
cd ../frontend
npm install
```

## Environment variables

Create `backend/.env`. Do **not** commit this file—it is already excluded by `.gitignore`.

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
TAVILY_API_KEY=your_tavily_api_key
GROQ_API_KEY=your_groq_api_key
```

`PORT=5001` matches the frontend's current API configuration.

## Run locally

Start the backend in one terminal:

```bash
cd backend
node server.js
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

Open the local URL displayed by Vite, normally `http://localhost:5173`.

## GitHub safety

Never upload `backend/.env`, `node_modules`, build folders, or API keys. The repository's `.gitignore` excludes these files. Commit the `package-lock.json` files so others can install the same dependency versions.
