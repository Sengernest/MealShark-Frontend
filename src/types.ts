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
  age?: number;
  birthDate?: string;
  height?: number;
  gender?: "male" | "female";
  /*
  activityLevel: ActivityLevel;
  weightGoal: WeightGoal;
  nutritionGoal: NutritionGoal | null; */
};

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

export type Profile = {
  name: string;
  email: string;
  birthDate?: string;
  height?: number;
  gender?: "male" | "female";
};

export type NutritionGoals = {
  id: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  creatorId: number;
  gender: "male" | "female";
  age: number;
  height: number;
  currentWeight: number;
  goalWeight: number;
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active";
  goal: "bulk_0.5" | "bulk_0.25" | "maintenance" | "cut_0.25" | "cut_0.5";
  etaWeeks: number;
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

  units: FoodUnit[];
};

export type Nutrition = {
  calories: number;
  macros: {
    carbs: number;
    protein: number;
    fat: number;
  };
};

export type Unit = {
  id: number;
  name: string;
};

export type FoodUnit = {
  foodId: number;
  unitId: number;
  unit: Unit;
  gramsPerUnit: number;
};

export type RecipeFood = {
  foodId: number;
  recipeId: number;
  amount: number;
  unit: Unit;
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
  foodId: number;
  unitId: number;
  amount: number;
};

export type RecipePost = {
  name: string;
  ingredients: RecipeFoodPost[];
  category: string | null;
  description: string | null;
  instructions: string | null;
  prepTime: number | null;
  cookTime: number | null;
  servings: number;
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
  targetCalories: number;
  description: string | null;
  isActive: boolean;
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

export type NutritionGoalsPost = {
  age: number;
  gender: string;
  currentWeight: number;
  goalWeight: number;
  height: number;
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active";
  goal: "bulk_0.25" | "bulk_0.5" | "maintenance" | "cut_0.25" | "cut_0.5";
};

type MealRecipePost = {
  recipeId: number;
  servings: number;
};

type MealFoodPost = {
  foodId: number;
  amount: number;
};

export type MealPost = {
  mealPlanIndex: number;
  recipeItems: MealRecipePost[];
  foodItems: MealFoodPost[];
};

export type MealPlanPost = {
  name: string;
  description: string | null;
  targetCalories: number;
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
