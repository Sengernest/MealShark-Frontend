import { FoodItem, RecipeItem } from "@/types";

export type Nutrition = {
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
};

function roundValue(value: number) {
  return Math.round(value * 10) / 10;
}

export function roundNutrition(nutrition: Nutrition): Nutrition {
  return {
    calories: roundValue(nutrition.calories),
    macros: {
      protein: roundValue(nutrition.macros.protein),
      carbs: roundValue(nutrition.macros.carbs),
      fat: roundValue(nutrition.macros.fat),
    },
  };
}

export function sumNutrition(...items: { nutrition: Nutrition }[]): Nutrition {
  return items.reduce(
    (acc, item) => {
      acc.calories += item.nutrition.calories;
      acc.macros.protein += item.nutrition.macros.protein;
      acc.macros.carbs += item.nutrition.macros.carbs;
      acc.macros.fat += item.nutrition.macros.fat;
      return acc;
    },
    {
      calories: 0,
      macros: {
        protein: 0,
        carbs: 0,
        fat: 0,
      },
    },
  );
}

export function foodItemNutrition(foodItem: FoodItem): Nutrition {
  const foodUnit = foodItem.food.units.find(
    (u) => u.unitId === foodItem.unit.id,
  );

  if (!foodUnit) {
    return {
      calories: 0,
      macros: {
        protein: 0,
        carbs: 0,
        fat: 0,
      },
    };
  }

  const amountInGrams = foodItem.amount * foodUnit.gramsPerUnit;
  const factor = amountInGrams / 100;

  return {
    calories: factor * foodItem.food.calories,
    macros: {
      protein: factor * foodItem.food.protein,
      carbs: factor * foodItem.food.carbs,
      fat: factor * foodItem.food.fat,
    },
  };
}

export function calculateRecipeNutrition(
  ingredients: FoodItem[],
  servings: number,
): Nutrition {
  const ingredientNutrition = ingredients.map((ingredient) => ({
    nutrition: foodItemNutrition(ingredient),
  }));

  const total = sumNutrition(...ingredientNutrition);

  return roundNutrition({
    calories: total.calories / servings,
    macros: {
      protein: total.macros.protein / servings,
      carbs: total.macros.carbs / servings,
      fat: total.macros.fat / servings,
    },
  });
}

export function calculateMealPlanNutrition(
  foodItems: FoodItem[],
  recipeItems: RecipeItem[],
): Nutrition {
  const foods = foodItems.map((foodItem) => ({
    nutrition: foodItemNutrition(foodItem),
  }));

  const recipes = recipeItems.map((recipeItem) => ({
    nutrition: {
      calories: recipeItem.recipe.nutrition.calories * recipeItem.servings,
      macros: {
        protein:
          recipeItem.recipe.nutrition.macros.protein * recipeItem.servings,
        carbs: recipeItem.recipe.nutrition.macros.carbs * recipeItem.servings,
        fat: recipeItem.recipe.nutrition.macros.fat * recipeItem.servings,
      },
    },
  }));

  return roundNutrition(sumNutrition(...foods, ...recipes));
}
