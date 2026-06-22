/*export type FoodItem = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  category: string;
};

export type RecipeIngredient = {
  food: FoodItem;
  quantity: number;
  unit: string;
};

export type Recipe = {
  id: string;
  name: string;
  description: string;
  ingredients: RecipeIngredient[];
  prepTime: number;
  cookTime: number;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: string;
  imageUrl?: string;
  createdAt: string;
};

export type MealEntry = {
  id: string;
  type: "recipe" | "food";
  recipe?: Recipe;
  food?: FoodItem;
  quantity: number;
  unit: string;
  calories: number;
};

export type Meal = {
  id: string;
  name: string;
  time: string;
  entries: MealEntry[];
  totalCalories: number;
};

export type MealPlan = {
  id: string;
  name: string;
  description: string;
  days: {
    day: string;
    meals: Meal[];
  }[];
  targetCalories: number;
  createdAt: string;
};

export type MealLogEntry = {
  id: string;
  date: string;
  meal: string;
  type: "recipe" | "food" | "meal";
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: number;
  unit: string;
};

export const foodItems: FoodItem[] = [
  { id: "f1", name: "Chicken Breast", calories: 165, protein: 31, carbs: 0, fat: 3.6, servingSize: "100g", category: "Protein" },
  { id: "f2", name: "Brown Rice", calories: 216, protein: 5, carbs: 45, fat: 1.8, servingSize: "1 cup cooked", category: "Carbs" },
  { id: "f3", name: "Broccoli", calories: 55, protein: 3.7, carbs: 11, fat: 0.6, servingSize: "1 cup", category: "Vegetables" },
  { id: "f4", name: "Greek Yogurt", calories: 100, protein: 17, carbs: 6, fat: 0.7, servingSize: "170g", category: "Dairy" },
  { id: "f5", name: "Oats", calories: 307, protein: 11, carbs: 55, fat: 5.3, servingSize: "100g", category: "Carbs" },
  { id: "f6", name: "Eggs", calories: 155, protein: 13, carbs: 1.1, fat: 11, servingSize: "2 large", category: "Protein" },
  { id: "f7", name: "Sweet Potato", calories: 103, protein: 2.3, carbs: 24, fat: 0.1, servingSize: "130g", category: "Carbs" },
  { id: "f8", name: "Salmon Fillet", calories: 208, protein: 20, carbs: 0, fat: 13, servingSize: "100g", category: "Protein" },
  { id: "f9", name: "Almonds", calories: 164, protein: 6, carbs: 6, fat: 14, servingSize: "28g", category: "Fats" },
  { id: "f10", name: "Spinach", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, servingSize: "100g", category: "Vegetables" },
  { id: "f11", name: "Banana", calories: 89, protein: 1.1, carbs: 23, fat: 0.3, servingSize: "1 medium", category: "Fruit" },
  { id: "f12", name: "Whey Protein", calories: 120, protein: 25, carbs: 3, fat: 1.5, servingSize: "1 scoop (30g)", category: "Supplement" },
];

export const recipes: Recipe[] = [
  {
    id: "r1",
    name: "High-Protein Chicken Bowl",
    description: "A power-packed meal with lean chicken, brown rice and steamed broccoli. Perfect post-workout fuel.",
    ingredients: [
      { food: foodItems[0], quantity: 200, unit: "g" },
      { food: foodItems[1], quantity: 1, unit: "cup" },
      { food: foodItems[2], quantity: 1, unit: "cup" },
    ],
    prepTime: 10,
    cookTime: 25,
    servings: 1,
    calories: 601,
    protein: 71,
    carbs: 56,
    fat: 6,
    category: "High Protein",
    imageUrl: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop&auto=format",
    createdAt: "2024-01-15",
  },
  {
    id: "r2",
    name: "Overnight Oats Power Bowl",
    description: "Greek yogurt, oats, banana — packed with slow-release energy to kickstart your morning.",
    ingredients: [
      { food: foodItems[4], quantity: 80, unit: "g" },
      { food: foodItems[3], quantity: 1, unit: "serving" },
      { food: foodItems[10], quantity: 1, unit: "medium" },
    ],
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    calories: 496,
    protein: 29,
    carbs: 84,
    fat: 7.8,
    category: "Breakfast",
    imageUrl: "https://images.unsplash.com/photo-1504972014685-80e1e73e2c57?w=400&h=300&fit=crop&auto=format",
    createdAt: "2024-01-16",
  },
  {
    id: "r3",
    name: "Salmon & Sweet Potato",
    description: "Omega-3 rich salmon with roasted sweet potato and wilted spinach. Clean gains only.",
    ingredients: [
      { food: foodItems[7], quantity: 200, unit: "g" },
      { food: foodItems[6], quantity: 1, unit: "medium" },
      { food: foodItems[9], quantity: 100, unit: "g" },
    ],
    prepTime: 10,
    cookTime: 30,
    servings: 1,
    calories: 434,
    protein: 45.3,
    carbs: 27.6,
    fat: 13.5,
    category: "High Protein",
    imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop&auto=format",
    createdAt: "2024-01-18",
  },
  {
    id: "r4",
    name: "Scrambled Egg Whites & Spinach",
    description: "Light, fast, and packed with protein. The athlete's go-to breakfast.",
    ingredients: [
      { food: foodItems[5], quantity: 1, unit: "serving" },
      { food: foodItems[9], quantity: 100, unit: "g" },
    ],
    prepTime: 5,
    cookTime: 8,
    servings: 1,
    calories: 178,
    protein: 15.9,
    carbs: 4.7,
    fat: 11.4,
    category: "Breakfast",
    imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop&auto=format",
    createdAt: "2024-01-20",
  },
];

export const mealPlans: MealPlan[] = [
  {
    id: "mp1",
    name: "Lean Bulk — Week 1",
    description: "High protein, moderate carbs. Designed for muscle gain with minimal fat.",
    targetCalories: 2800,
    createdAt: "2024-01-20",
    days: [
      {
        day: "Monday",
        meals: [
          {
            id: "m1",
            name: "Breakfast",
            time: "07:30",
            entries: [
              { id: "me1", type: "recipe", recipe: recipes[1], quantity: 1, unit: "serving", calories: 496 },
              { id: "me2", type: "food", food: foodItems[11], quantity: 1, unit: "scoop", calories: 120 },
            ],
            totalCalories: 616,
          },
          {
            id: "m2",
            name: "Lunch",
            time: "12:30",
            entries: [
              { id: "me3", type: "recipe", recipe: recipes[0], quantity: 1, unit: "serving", calories: 601 },
            ],
            totalCalories: 601,
          },
          {
            id: "m3",
            name: "Dinner",
            time: "19:00",
            entries: [
              { id: "me4", type: "recipe", recipe: recipes[2], quantity: 1, unit: "serving", calories: 434 },
              { id: "me5", type: "food", food: foodItems[8], quantity: 1, unit: "serving", calories: 164 },
            ],
            totalCalories: 598,
          },
        ],
      },
      {
        day: "Tuesday",
        meals: [
          {
            id: "m4",
            name: "Breakfast",
            time: "07:30",
            entries: [
              { id: "me6", type: "recipe", recipe: recipes[3], quantity: 1, unit: "serving", calories: 178 },
            ],
            totalCalories: 178,
          },
          {
            id: "m5",
            name: "Lunch",
            time: "12:30",
            entries: [
              { id: "me7", type: "recipe", recipe: recipes[0], quantity: 1, unit: "serving", calories: 601 },
            ],
            totalCalories: 601,
          },
        ],
      },
    ],
  },
  {
    id: "mp2",
    name: "Cut Phase — Low Carb",
    description: "Caloric deficit with high protein to preserve muscle mass during cutting.",
    targetCalories: 1900,
    createdAt: "2024-01-22",
    days: [
      {
        day: "Monday",
        meals: [
          {
            id: "m6",
            name: "Breakfast",
            time: "08:00",
            entries: [
              { id: "me8", type: "recipe", recipe: recipes[3], quantity: 1, unit: "serving", calories: 178 },
            ],
            totalCalories: 178,
          },
          {
            id: "m7",
            name: "Dinner",
            time: "19:00",
            entries: [
              { id: "me9", type: "recipe", recipe: recipes[2], quantity: 1, unit: "serving", calories: 434 },
            ],
            totalCalories: 434,
          },
        ],
      },
    ],
  },
];

export const mealLog: MealLogEntry[] = [
  { id: "l1", date: "2024-01-25", meal: "Breakfast", type: "recipe", name: "Overnight Oats Power Bowl", calories: 496, protein: 29, carbs: 84, fat: 7.8, quantity: 1, unit: "serving" },
  { id: "l2", date: "2024-01-25", meal: "Breakfast", type: "food", name: "Whey Protein", calories: 120, protein: 25, carbs: 3, fat: 1.5, quantity: 1, unit: "scoop" },
  { id: "l3", date: "2024-01-25", meal: "Lunch", type: "recipe", name: "High-Protein Chicken Bowl", calories: 601, protein: 71, carbs: 56, fat: 6, quantity: 1, unit: "serving" },
  { id: "l4", date: "2024-01-25", meal: "Snack", type: "food", name: "Almonds", calories: 164, protein: 6, carbs: 6, fat: 14, quantity: 1, unit: "serving" },
  { id: "l5", date: "2024-01-25", meal: "Dinner", type: "recipe", name: "Salmon & Sweet Potato", calories: 434, protein: 45.3, carbs: 27.6, fat: 13.5, quantity: 1, unit: "serving" },
  { id: "l6", date: "2024-01-24", meal: "Breakfast", type: "recipe", name: "Scrambled Egg Whites & Spinach", calories: 178, protein: 15.9, carbs: 4.7, fat: 11.4, quantity: 1, unit: "serving" },
  { id: "l7", date: "2024-01-24", meal: "Lunch", type: "recipe", name: "High-Protein Chicken Bowl", calories: 601, protein: 71, carbs: 56, fat: 6, quantity: 1, unit: "serving" },
  { id: "l8", date: "2024-01-24", meal: "Dinner", type: "food", name: "Salmon Fillet", calories: 416, protein: 40, carbs: 0, fat: 26, quantity: 200, unit: "g" },
  { id: "l9", date: "2024-01-23", meal: "Breakfast", type: "recipe", name: "Overnight Oats Power Bowl", calories: 496, protein: 29, carbs: 84, fat: 7.8, quantity: 1, unit: "serving" },
  { id: "l10", date: "2024-01-23", meal: "Lunch", type: "recipe", name: "High-Protein Chicken Bowl", calories: 601, protein: 71, carbs: 56, fat: 6, quantity: 1, unit: "serving" },
  { id: "l11", date: "2024-01-23", meal: "Snack", type: "food", name: "Greek Yogurt", calories: 100, protein: 17, carbs: 6, fat: 0.7, quantity: 1, unit: "serving" },
  { id: "l12", date: "2024-01-23", meal: "Dinner", type: "recipe", name: "Salmon & Sweet Potato", calories: 434, protein: 45.3, carbs: 27.6, fat: 13.5, quantity: 1, unit: "serving" },
]; */
