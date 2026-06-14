import type { Food, Recipe, MealPlan, MealItem } from "../../types";

export const FOODS: Food[] = [
  { id: "f1", name: "Chicken Breast", category: "Protein", caloriesPer100g: 165, proteinPer100g: 31, carbsPer100g: 0, fatPer100g: 3.6, isCustom: false },
  { id: "f2", name: "Chicken Thigh", category: "Protein", caloriesPer100g: 209, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 11, isCustom: false },
  { id: "f3", name: "Salmon Fillet", category: "Protein", caloriesPer100g: 208, proteinPer100g: 20, carbsPer100g: 0, fatPer100g: 13, isCustom: false },
  { id: "f4", name: "Eggs (whole)", category: "Protein", caloriesPer100g: 155, proteinPer100g: 13, carbsPer100g: 1.1, fatPer100g: 11, isCustom: false },
  { id: "f5", name: "Ground Beef (lean)", category: "Protein", caloriesPer100g: 215, proteinPer100g: 27, carbsPer100g: 0, fatPer100g: 11, isCustom: false },
  { id: "f6", name: "Tuna (canned)", category: "Protein", caloriesPer100g: 116, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 0.8, isCustom: false },
  { id: "f7", name: "Spaghetti", category: "Carbs", caloriesPer100g: 371, proteinPer100g: 13, carbsPer100g: 74, fatPer100g: 1.5, isCustom: false },
  { id: "f8", name: "Brown Rice", category: "Carbs", caloriesPer100g: 362, proteinPer100g: 8, carbsPer100g: 76, fatPer100g: 2.7, isCustom: false },
  { id: "f9", name: "White Rice", category: "Carbs", caloriesPer100g: 365, proteinPer100g: 7, carbsPer100g: 80, fatPer100g: 0.7, isCustom: false },
  { id: "f10", name: "Oats", category: "Carbs", caloriesPer100g: 389, proteinPer100g: 17, carbsPer100g: 66, fatPer100g: 7, isCustom: false },
  { id: "f11", name: "Sweet Potato", category: "Carbs", caloriesPer100g: 86, proteinPer100g: 1.6, carbsPer100g: 20, fatPer100g: 0.1, isCustom: false },
  { id: "f12", name: "Potato", category: "Carbs", caloriesPer100g: 77, proteinPer100g: 2, carbsPer100g: 17, fatPer100g: 0.1, isCustom: false },
  { id: "f13", name: "Broccoli", category: "Vegetables", caloriesPer100g: 34, proteinPer100g: 2.8, carbsPer100g: 7, fatPer100g: 0.4, isCustom: false },
  { id: "f14", name: "Spinach", category: "Vegetables", caloriesPer100g: 23, proteinPer100g: 2.9, carbsPer100g: 3.6, fatPer100g: 0.4, isCustom: false },
  { id: "f15", name: "Carrot", category: "Vegetables", caloriesPer100g: 41, proteinPer100g: 0.9, carbsPer100g: 10, fatPer100g: 0.2, isCustom: false },
  { id: "f16", name: "Garlic", category: "Vegetables", caloriesPer100g: 149, proteinPer100g: 6.4, carbsPer100g: 33, fatPer100g: 0.5, isCustom: false },
  { id: "f17", name: "Olive Oil", category: "Fats", caloriesPer100g: 884, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 100, isCustom: false },
  { id: "f18", name: "Almonds", category: "Fats", caloriesPer100g: 579, proteinPer100g: 21, carbsPer100g: 22, fatPer100g: 50, isCustom: false },
  { id: "f19", name: "Greek Yogurt", category: "Dairy", caloriesPer100g: 59, proteinPer100g: 10, carbsPer100g: 3.6, fatPer100g: 0.4, isCustom: false },
  { id: "f20", name: "Whey Protein", category: "Supplements", caloriesPer100g: 400, proteinPer100g: 80, carbsPer100g: 10, fatPer100g: 5, isCustom: false },
  { id: "f21", name: "Banana", category: "Fruit", caloriesPer100g: 89, proteinPer100g: 1.1, carbsPer100g: 23, fatPer100g: 0.3, isCustom: false },
  { id: "f22", name: "Paprika", category: "Spices", caloriesPer100g: 282, proteinPer100g: 14, carbsPer100g: 54, fatPer100g: 13, isCustom: false },
];

function calcNutrition(ingredients: { food: Food; amount: number; unit: string }[]) {
  let cal = 0, prot = 0, carbs = 0, fat = 0;
  ingredients.forEach(({ food, amount, unit }) => {
    const g = unit === "tbsp" ? amount * 15 : unit === "cloves" ? amount * 5 : amount;
    cal += (food.caloriesPer100g * g) / 100;
    prot += (food.proteinPer100g * g) / 100;
    carbs += (food.carbsPer100g * g) / 100;
    fat += (food.fatPer100g * g) / 100;
  });
  return { calories: Math.round(cal), protein: Math.round(prot * 10) / 10, carbs: Math.round(carbs * 10) / 10, fat: Math.round(fat * 10) / 10 };
}

const chickenChopIngredients = [
  { food: FOODS[1], amount: 200, unit: "g" },
  { food: FOODS[16], amount: 1, unit: "tbsp" },
  { food: FOODS[21], amount: 1, unit: "tbsp" },
];
const aglioIngredients = [
  { food: FOODS[6], amount: 100, unit: "g" },
  { food: FOODS[16], amount: 80, unit: "ml" },
  { food: FOODS[15], amount: 6, unit: "cloves" },
];
const chickenBroccoliRiceIngredients = [
  { food: FOODS[0], amount: 180, unit: "g" },
  { food: FOODS[12], amount: 150, unit: "g" },
  { food: FOODS[7], amount: 80, unit: "g" },
];
const proteinSmoothieIngredients = [
  { food: FOODS[19], amount: 30, unit: "g" },
  { food: FOODS[20], amount: 170, unit: "g" },
  { food: FOODS[18], amount: 1, unit: "tbsp" },
];
const beefEggRiceIngredients = [
  { food: FOODS[4], amount: 150, unit: "g" },
  { food: FOODS[3], amount: 100, unit: "g" },
  { food: FOODS[8], amount: 80, unit: "g" },
];
const chickenStewIngredients = [
  { food: FOODS[0], amount: 200, unit: "g" },
  { food: FOODS[11], amount: 150, unit: "g" },
  { food: FOODS[14], amount: 100, unit: "g" },
];

export const RECIPES: Recipe[] = [
  {
    id: "r1",
    name: "Chicken Chop",
    description: "Juicy pan-seared chicken thigh with smoky paprika seasoning.",
    category: "High Protein",
    ingredients: chickenChopIngredients.map((i, idx) => ({ ...i, id: `r1_i${idx}` })),
    instructions: [
      "Pat chicken dry and season generously with paprika, salt and pepper.",
      "Heat olive oil in a pan over medium-high heat.",
      "Sear chicken 6-7 minutes per side until cooked through.",
      "Rest 5 minutes before serving.",
    ],
    prepTime: 5,
    cookTime: 15,
    servings: 1,
    ...calcNutrition(chickenChopIngredients),
    isProvided: true,
    isSaved: false,
    createdBy: null,
  },
  {
    id: "r2",
    name: "Aglio Olio Spaghetti",
    description: "Classic Italian pasta with garlic, olive oil and a touch of heat.",
    category: "Carbs",
    ingredients: aglioIngredients.map((i, idx) => ({ ...i, id: `r2_i${idx}` })),
    instructions: [
      "Cook spaghetti until al dente. Reserve ½ cup pasta water.",
      "Thinly slice garlic and gently fry in olive oil until golden.",
      "Add chili flakes then toss in drained pasta.",
      "Use pasta water to loosen if needed. Season and serve.",
    ],
    prepTime: 5,
    cookTime: 15,
    servings: 1,
    ...calcNutrition(aglioIngredients),
    isProvided: true,
    isSaved: false,
    createdBy: null,
  },
  {
    id: "r3",
    name: "Chicken Breast, Broccoli & Rice",
    description: "The classic clean bulk meal. Simple, effective, and nutritious.",
    category: "High Protein",
    ingredients: chickenBroccoliRiceIngredients.map((i, idx) => ({ ...i, id: `r3_i${idx}` })),
    instructions: [
      "Season chicken breast and grill or pan-fry 6 minutes per side.",
      "Steam broccoli 4–5 minutes until tender-crisp.",
      "Cook brown rice according to package instructions.",
      "Plate together and season to taste.",
    ],
    prepTime: 5,
    cookTime: 25,
    servings: 1,
    ...calcNutrition(chickenBroccoliRiceIngredients),
    isProvided: true,
    isSaved: false,
    createdBy: null,
  },
  {
    id: "r4",
    name: "Protein Smoothie",
    description: "Quick, high-protein shake to start your morning right.",
    category: "Breakfast",
    ingredients: proteinSmoothieIngredients.map((i, idx) => ({ ...i, id: `r4_i${idx}` })),
    instructions: [
      "Add all ingredients to a blender.",
      "Blend on high for 30 seconds until smooth.",
      "Serve immediately.",
    ],
    prepTime: 3,
    cookTime: 0,
    servings: 1,
    ...calcNutrition(proteinSmoothieIngredients),
    isProvided: true,
    isSaved: false,
    createdBy: null,
  },
  {
    id: "r5",
    name: "Ground Beef, Eggs & Rice",
    description: "High-protein, filling meal packed with essential amino acids.",
    category: "High Protein",
    ingredients: beefEggRiceIngredients.map((i, idx) => ({ ...i, id: `r5_i${idx}` })),
    instructions: [
      "Brown ground beef in a pan over high heat, breaking it up.",
      "Scramble eggs alongside the beef.",
      "Cook rice and serve everything together.",
      "Season with soy sauce or salt to taste.",
    ],
    prepTime: 5,
    cookTime: 15,
    servings: 1,
    ...calcNutrition(beefEggRiceIngredients),
    isProvided: true,
    isSaved: false,
    createdBy: null,
  },
  {
    id: "r6",
    name: "Chicken Stew with Potatoes & Carrots",
    description: "Hearty one-pot chicken stew for a satisfying dinner.",
    category: "High Protein",
    ingredients: chickenStewIngredients.map((i, idx) => ({ ...i, id: `r6_i${idx}` })),
    instructions: [
      "Brown chicken pieces in a pot with oil.",
      "Add diced potatoes and carrots, cover with chicken broth.",
      "Simmer 30 minutes until vegetables are tender.",
      "Season with salt, pepper and herbs. Serve hot.",
    ],
    prepTime: 10,
    cookTime: 35,
    servings: 2,
    ...calcNutrition(chickenStewIngredients),
    isProvided: true,
    isSaved: false,
    createdBy: null,
  },
];

export const MEAL_PLANS: MealPlan[] = [
  {
    id: "mp1",
    name: "Lean Bulk Starter",
    description: "A balanced week plan targeting muscle gain with consistent high-protein meals.",
    targetCalories: 2800,
    isProvided: true,
    createdBy: null,
    createdAt: "2024-01-01",
    days: [
      {
        day: "Mon",
        slots: [
          { id: "s1", label: "Meal 1", items: [{ id: "mi1", type: "recipe", recipe: RECIPES[3], amount: 1, unit: "serving" }] },
          { id: "s2", label: "Meal 2", items: [{ id: "mi2", type: "recipe", recipe: RECIPES[1], amount: 1, unit: "serving" }, { id: "mi3", type: "recipe", recipe: RECIPES[0], amount: 1, unit: "serving" }] },
          { id: "s3", label: "Meal 3", items: [{ id: "mi4", type: "recipe", recipe: RECIPES[4], amount: 1, unit: "serving" }] },
        ],
      },
      {
        day: "Tue",
        slots: [
          { id: "s4", label: "Meal 1", items: [{ id: "mi5", type: "recipe", recipe: RECIPES[3], amount: 1, unit: "serving" }] },
          { id: "s5", label: "Meal 2", items: [{ id: "mi6", type: "recipe", recipe: RECIPES[2], amount: 1, unit: "serving" }] },
          { id: "s6", label: "Meal 3", items: [{ id: "mi7", type: "recipe", recipe: RECIPES[5], amount: 1, unit: "serving" }] },
        ],
      },
      {
        day: "Wed",
        slots: [
          { id: "s7", label: "Meal 1", items: [{ id: "mi8", type: "recipe", recipe: RECIPES[3], amount: 1, unit: "serving" }] },
          { id: "s8", label: "Meal 2", items: [{ id: "mi9", type: "recipe", recipe: RECIPES[1], amount: 1, unit: "serving" }, { id: "mi10", type: "recipe", recipe: RECIPES[0], amount: 1, unit: "serving" }] },
          { id: "s9", label: "Meal 3", items: [{ id: "mi11", type: "recipe", recipe: RECIPES[4], amount: 1, unit: "serving" }] },
        ],
      },
      {
        day: "Thu",
        slots: [
          { id: "s10", label: "Meal 1", items: [{ id: "mi12", type: "recipe", recipe: RECIPES[3], amount: 1, unit: "serving" }] },
          { id: "s11", label: "Meal 2", items: [{ id: "mi13", type: "recipe", recipe: RECIPES[2], amount: 1, unit: "serving" }] },
          { id: "s12", label: "Meal 3", items: [{ id: "mi14", type: "recipe", recipe: RECIPES[5], amount: 1, unit: "serving" }] },
        ],
      },
      {
        day: "Fri",
        slots: [
          { id: "s13", label: "Meal 1", items: [{ id: "mi15", type: "recipe", recipe: RECIPES[3], amount: 1, unit: "serving" }] },
          { id: "s14", label: "Meal 2", items: [{ id: "mi16", type: "recipe", recipe: RECIPES[2], amount: 1, unit: "serving" }] },
          { id: "s15", label: "Meal 3", items: [{ id: "mi17", type: "recipe", recipe: RECIPES[4], amount: 1, unit: "serving" }] },
        ],
      },
      {
        day: "Sat",
        slots: [
          { id: "s16", label: "Meal 1", items: [{ id: "mi18", type: "recipe", recipe: RECIPES[3], amount: 1, unit: "serving" }] },
          { id: "s17", label: "Meal 2", items: [{ id: "mi19", type: "recipe", recipe: RECIPES[1], amount: 1, unit: "serving" }, { id: "mi20", type: "recipe", recipe: RECIPES[0], amount: 1, unit: "serving" }] },
          { id: "s18", label: "Meal 3", items: [{ id: "mi21", type: "recipe", recipe: RECIPES[5], amount: 1, unit: "serving" }] },
        ],
      },
      {
        day: "Sun",
        slots: [
          { id: "s19", label: "Meal 1", items: [{ id: "mi22", type: "recipe", recipe: RECIPES[3], amount: 1, unit: "serving" }] },
          { id: "s20", label: "Meal 2", items: [{ id: "mi23", type: "recipe", recipe: RECIPES[1], amount: 1, unit: "serving" }, { id: "mi24", type: "recipe", recipe: RECIPES[0], amount: 2, unit: "serving" }] },
          { id: "s21", label: "Meal 3", items: [{ id: "mi25", type: "recipe", recipe: RECIPES[4], amount: 1, unit: "serving" }] },
        ],
      },
    ],
  },
];
