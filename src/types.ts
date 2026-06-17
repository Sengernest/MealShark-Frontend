/* export type Gender = "male" | "female";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";
export type WeightGoal = "lose_0.5" | "lose_0.25" | "maintain" | "gain_0.25" | "gain_0.5"; */

import { StringToBoolean } from "class-variance-authority/types";
import { DateRange, WeekNumberLabel } from "react-day-picker";

/* export type NutritionGoal = {
  tdee: number;
  dailyCalories: number;
  protein: number; // grams
  carbs: number;
  fat: number;
}; */

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  /* age: number;
  gender: Gender;
  height: number; // cm
  weight: number; // kg
  activityLevel: ActivityLevel;
  weightGoal: WeightGoal;
  nutritionGoal: NutritionGoal | null; */
};

export type MacroGoals = {
  id: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  creatorId: number;
  gender: string;
  age: number;
  height: number;
  weight: number;
  activityLevel: string;
  goal: string;
};

export type Food = {
  id: number;
  name: string;
  defaultServingSize?: number | null;
  category?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;

  units: FoodUnit[]
};

export type Nutrition = {
  calories: number;
  macros: {
    carbs: number;
    protein: number;
    fat: number;
  };
};

export type FoodUnit = "g" | "ml"

export type RecipeFood = {
  foodId: number;
  recipeId: number;
  amount: number;
  unit?: FoodUnit;
  food: Food;
};

type RecipeBase = {
  id: number;
  name: string;
  creatorId: number | null;
  ingredients: RecipeFood[];

  category?: string;
  description?: string;
  instructions?: string[];
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  isProvided?: boolean;
  isSaved?: boolean;
};

export type Recipe = RecipeBase & {
  nutrition: Nutrition;
};

export type RecipeFoodPost = {
  foodId: number
  amount: number
  unit: FoodUnit
}

export type RecipePost = {
  name: string;
  ingredients: RecipeFoodPost[];
  category?: string;
  description?: string;
  instructions?: string[];
  prepTime?: number;
  cookTime?: number;
  servings?: number;
};

/* export type MealItem = {
  id: string;
  type: "recipe" | "food";
  recipe?: Recipe;
  food?: Food;
  amount: number;
  unit: string;
};

export type MealSlot = {
  id: string;
  label: string; // "Meal 1", "Meal 2", etc.
  items: MealItem[];
};

export type DayPlan = {
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  slots: MealSlot[];
}; */

/* export type MealPlan = {
  id: string;
  name: string;
  description: string;
  days: DayPlan[];
  targetCalories: number;
  isProvided: boolean;
  createdBy: string | null;
  createdAt: string;
}; */

export type MealRecipe = {
  recipeId: number;
  mealId: number;
  servings: number;
  recipe: RecipeBase;
};

export type MealFood = {
  foodId: number;
  amount: number;
  mealId: number;
  food: Food;
};


export type Meal = {
  id: number;
  mealPlanId: number;
  mealPlanIndex: number;
  recipeItems: MealRecipe[];
  foodItems: MealFood[];
};

export type MealWithNutrition = {
  meal: Meal;
  nutrition: Nutrition;
};

export type MealPlan = {
  id: number;
  name: string;
  creatorId: number | null;
  meals: MealWithNutrition[];
  nutrition: Nutrition;
};

export type MealLogRecipe = {
  recipeId: number;
  servings: number;
  mealLogId: number;
  recipe: RecipeBase;
};

export type MealLogFood = {
  foodId: number;
  amount: number;
  mealLogId: number;
  food: Food;
};

export type MealLog = {
  id: number;
  mealId: number | null;
  userId: number;
  logDate: Date;
  mealIndex: number;
  recipeItems: MealLogRecipe[];
  foodItems: MealLogFood[];
};

export type MealLogWithNutrition = {
  mealLog: MealLog;
  nutrition: Nutrition;
};

export type MealSummary = {
  meals: MealLogWithNutrition[];
  nutrition: Nutrition;
};

export type SignupPost = {
  name: string;
  email: string;
  password: string;
};

export type LoginPost = {
  email: string;
  password: string;
};

export type MacroGoalsPost = {
  age: number;
  gender: string;
  weight: number;
  height: number;
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active";
  goal: "cutting" | "bulking" | "maintenance";
};


type MealRecipePost = {
  recipeId: number;
  servings: number;
}

type MealFoodPost = {
  foodId: number;
  amount: number;
}

export type MealPost = {
  mealPlanIndex: number;
  recipeItems: MealRecipePost[];
  foodItems: MealFoodPost[];
};

export type MealPlanPost = {
  name: string;
  meals: MealPost[];
};

export type MealLogPost = {
  logDate: Date;
  mealIndex: number;
  mealId: number;
  recipeItems: MealRecipePost[];
  foodItems: MealFoodPost[];
};

export type MealLogQueryPost = {
  logDate: Date;
};

/* export type MealLogSlot = {
  id: string;
  label: string;
  items: MealItem[];
};

export type MealLogEntry = {
  id: string;
  date: string; // YYYY-MM-DD
  slots: MealLogSlot[];
  userId: string;
}; */
