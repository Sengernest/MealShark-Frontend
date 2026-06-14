export type Gender = "male" | "female";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";
export type WeightGoal = "lose_0.5" | "lose_0.25" | "maintain" | "gain_0.25" | "gain_0.5";

export type NutritionGoal = {
  tdee: number;
  dailyCalories: number;
  protein: number; // grams
  carbs: number;
  fat: number;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: Gender;
  height: number; // cm
  weight: number; // kg
  activityLevel: ActivityLevel;
  weightGoal: WeightGoal;
  nutritionGoal: NutritionGoal | null;
};

export type Food = {
  id: string;
  name: string;
  category: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  isCustom: boolean;
};

export type RecipeIngredient = {
  food: Food;
  amount: number;
  unit: string;
};

export type Recipe = {
  id: string;
  name: string;
  description: string;
  category: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  isProvided: boolean;
  isSaved: boolean;
  createdBy: string | null;
};

export type MealItem = {
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
};

export type MealPlan = {
  id: string;
  name: string;
  description: string;
  days: DayPlan[];
  targetCalories: number;
  isProvided: boolean;
  createdBy: string | null;
  createdAt: string;
};

export type MealLogSlot = {
  id: string;
  label: string;
  items: MealItem[];
};

export type MealLogEntry = {
  id: string;
  date: string; // YYYY-MM-DD
  slots: MealLogSlot[];
  userId: string;
};
