# MealShark

<img width="2876" height="1458" alt="image" src="https://github.com/user-attachments/assets/146d7cfc-aac4-4e28-b8d6-0dbf30d712db" />


A full-stack nutrition and meal planning web application built to help users calculate their nutrition goals, create recipes and meal plans, and track their daily nutritional food intake. MealShark demonstrates full-stack software engineering with a focus on scalable architecture, clean code, and real-world design decisions.

> **Tech Stack:** React + Vite • TypeScript • TanStack Query • Material UI • Node.js • Express • PostgreSQL • Drizzle ORM •  Zod

**Frontend URL:** *https://meal-shark-frontend.vercel.app/*  
**Backend GitHub Repo:** *https://github.com/Sengernest/MealShark-Backend.git*

---

# Features

### 1. Authentication
<img width="2870" height="1450" alt="image" src="https://github.com/user-attachments/assets/083d25ac-01a1-4c94-b0a1-b34f8aaf1b4d" />

- User registration and login
- Secure cookie-based JWT authentication
- Protected routes

### 2. Nutrition Goals Calculator
<img width="2880" height="1460" alt="image" src="https://github.com/user-attachments/assets/8cc844b4-f662-403b-886a-612e82eda478" />

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

### 3. Food items library
Search and browse food items from imported USDA food database. 

<img width="2880" height="1448" alt="image" src="https://github.com/user-attachments/assets/758a1b0f-628f-4e65-bf15-ffdf0e39b5ba" />

Each food item contains information aboout:

- Calories
- Protein
- Carbohydrates
- Fat

- Age
- Gender
- Height
- Current Weight
- Goal Weight 
- Activity level
- Weight change goal

### 4. Recipe Management
Create reusable recipes using food items from the USDA food database.

<img width="2866" height="1454" alt="image" src="https://github.com/user-attachments/assets/c940314f-1e37-4c1a-8240-3a640f0df4e0" />

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

### 5. Meal Planning

Build reusable daily meal plans.
<img width="2874" height="1464" alt="image" src="https://github.com/user-attachments/assets/88901f09-e2da-4ecb-9162-6c5aaeb21e4e" />


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

### 6. Meal Logging
Track meals consumed throughout the day.
<img width="2880" height="1454" alt="image" src="https://github.com/user-attachments/assets/153e53b6-d1fc-4203-a5a8-090a480d3237" />


Each meal log includes:
- Breakfast, Lunch, Dinner and Snack meal slots
- Macronutrients
- Calories

Users can:

- Create daily meal logs 
- Log recipes, food items or meals from their active meal plan
- View their daily nutrition summary

---

# Architecture

The backend follows a layered architecture to separate concerns and keep business logic maintainable.

```text
HTTP Request from Frontend
      │
      ▼
Zod Validator
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
git clone https://github.com/Sengernest/MealShark-Frontend.git
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

### 4. Create .env file and include the API url

```env
VITE_API_URL=http://localhost:3000
```
---

# Practices and skills demonstrated
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
