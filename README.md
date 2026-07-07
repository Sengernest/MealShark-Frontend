# MealShark

A full-stack nutrition and meal planning web application built to help users calculate their nutrition goals, create recipes and meal plans, and track their daily nutritional food intake. MealShark demonstrates full-stack software engineering with a focus on scalable architecture, clean code, and real-world design decisions.

> **Tech Stack:** React + Vite • TypeScript • TanStack Query • Material UI • Node.js • Express • PostgreSQL • Drizzle ORM •  Zod

**Frontend URL:** *https://meal-shark-frontend.vercel.app/*  
**Backend GitHub Repo:** *https://github.com/Sengernest/MealShark-Backend.git*

---

# Features

### 1. Authentication

- User registration and login
- Secure cookie-based JWT authentication
- Protected routes

### 2. Nutrition Goal Calculator

  Calculate personalised nutrition goals based on:

- Age
- Gender
- Height
- Current Weight
- Goal Weight 
- Activity level
- Weight change goal

MealShark calculates and displays the user's:

- Daily calorie target
- Daily protein target
- Daily carbohydrate target
- Daily fat target

### 3. Recipe Management

Create reusable recipes using food items from the USDA food database.

Each recipe includes:

- Ingredients
- Recipe name and description
- Macronutrients
- Calories
- Category
- Recipe instructions
- Preparation time
- Cook time 
- Servings

Users can:

- Create multiple recipes
- Search recipes
- Filter recipes
- Save favourite recipes
- Sample recipes 

### 4. Meal Planning

Build reusable daily meal plans.

Each meal plan includes:
- Breakfast, Lunch, Dinner and Snack meal slots
- Macronutrients
- Calories
- Target Calories

Users can:

- Create multiple meal plans
- Add recipes and food items in the meal plan
- Set a meal plan as active
- Search meal plans
- Filter meal plans
- Save meal plans
- Sample mean plans

### 5. Meal Logging

Track meals consumed throughout the day.

Each meal log includes:
- Breakfast, Lunch, Dinner and Snack meal slots
- Macronutrients
- Calories

Users can:

- Create daily meal logs 
- Log recipes, food items or meals from their active meal plan
- View their daily nutrition summary


### 6. Imported USDA Food Database

Browse foods with nutrition information including:

- Calories
- Protein
- Carbohydrates
- Fat

---

# Architecture

The backend follows a layered architecture to separate concerns and keep business logic maintainable.

```text
HTTP Request
      │
      ▼
Express Handlers
      │
      ▼
Service Layer
(Business Logic)
      │
      ▼
Data Access Layer
(Drizzle ORM)
      │
      ▼
PostgreSQL
```

This architecture improves:

- Maintainability
- Testability
- Readability
- Separation of concerns

---

# Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Material UI
- TanStack Query
- Axios

## Backend

- Node.js
- Express
- TypeScript
- Drizzle ORM
- Zod

## Database

- PostgreSQL
- USDA Food Database

## Deployment

| Component | Platform |
|-----------|----------|
| Frontend | Vercel |
| Backend | Fly.io |
| Database | Supabase |

---

# Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/MealShark.git
cd MealShark
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

---

# Environment Variables

Example frontend `.env`

```env
VITE_API_URL=http://localhost:3000
```
---

# What This Project Demonstrates

This project demonstrates practical experience with:

- Full-stack TypeScript development
- REST API design
- Layered backend architecture
- Database schema design
- Authentication & authorization
- React state management using TanStack Query
- Form validation with Zod
- PostgreSQL & Drizzle ORM
- Deployment using Vercel, Fly.io, and Supabase
- Production-style CRUD applications
- Software architecture trade-offs
- Clean, maintainable code

---
