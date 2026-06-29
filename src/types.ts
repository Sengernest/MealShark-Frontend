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

export type Ingredient = {
  foodId: number;
  recipeId: number;
  amount: number;
  unit: Unit;
  food: Food;
  nutrition: Nutrition;
};

export type Recipe = {
  id: number;
  name: string;
  creatorId: number | null;
  ingredients: Ingredient[];
  category?: string;
  description?: string;
  instructions?: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  isSample?: boolean;
  isSaved?: boolean;
  nutrition: Nutrition;
};

export type RecipePost = {
  name: string;
  ingredients: FoodItemPost[];
  category: string | null;
  description: string | null;
  instructions: string | null;
  prepTime: number | null;
  cookTime: number | null;
  servings: number;
};

export type FoodItem = {
  food: Food;
  unit: Unit;
  amount: number;
};

export type RecipeItem = {
  recipe: Recipe;
  servings: number;
};

export type FoodItemPost = {
  foodId: number;
  unitId: number;
  amount: number;
};

export type MealSlot = "breakfast" | "lunch" | "dinner" | "snack";

export type FoodEntry = {
  id: number;
  userId: number;
  logDate: string;
  mealSlot: MealSlot;
  foodId: number;
  food: Food;
  unitId: number;
  unit: Unit;
  amount: number;
  nutrition: Nutrition;
};

export type FoodEntryPost = {
  logDate: string;
  mealSlot: MealSlot;
  foodId: number;
  unitId: number;
  amount: number;
};

export type RecipeEntry = {
  id: number;
  userId: number;
  logDate: string;
  mealSlot: MealSlot;
  recipeId: number;
  recipe: Recipe;
  servings: number;
  nutrition: Nutrition;
};

export type RecipeEntryPost = {
  logDate: string;
  mealSlot: MealSlot;
  recipeId: number;
  servings: number;
};

export type ImportFromMealPlanPost = {
  logDate: string;
  mealSlot: MealSlot;
}

export type ImportAllFromMealPlanPost = {
  logDate: string;
};

export type MealEntry = {
  foodEntries: FoodEntry[];
  recipeEntries: RecipeEntry[];
  nutrition: Nutrition;
};

export type MealLog = {
  nutrition: Nutrition;
  breakfast: MealEntry;
  lunch: MealEntry;
  dinner: MealEntry;
  snack: MealEntry;
};

export type MealPlanFood = {
  id: number;
  foodId: number;
  food: Food;
  unitId: number;
  unit: Unit;
  amount: number;
  mealPlanId: number;
  mealSlot: MealSlot;
  nutrition: Nutrition;
};

export type MealPlanFoodPost = {
  foodId: number;
  unitId: number;
  amount: number;
  mealSlot: MealSlot;
};

export type MealPlanRecipe = {
  id: number;
  recipeId: number;
  recipe: Recipe;
  servings: number;
  mealPlanId: number;
  mealSlot: MealSlot;
  nutrition: Nutrition;
};

export type MealPlanRecipePost = {
  recipeId: number;
  servings: number;
  mealSlot: MealSlot;
};

export type MealPlanMeal = {
  foodItems: MealPlanFood[];
  recipeItems: MealPlanRecipe[];
  nutrition: Nutrition;
};

export type MealPlan = {
  id: number;
  name: string;
  creatorId: number | null;
  description: string | null;
  isActive: boolean;
  isSample: boolean;
  isSaved: boolean;
  targetCalories: number;
  nutrition: Nutrition;
  breakfast: MealPlanMeal;
  lunch: MealPlanMeal;
  dinner: MealPlanMeal;
  snack: MealPlanMeal;
};

export type MealPlanPost = {
  name: string;
  description: string | null;
  targetCalories: number;
  foodItems: MealPlanFoodPost[];
  recipeItems: MealPlanRecipePost[];
};

export type MealLogQueryPost = {
  logDate: Date;
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
