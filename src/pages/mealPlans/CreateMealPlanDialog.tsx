import { useCreateMealPlan, useUpdateMealPlan } from "@/hooks/mealPlans";
import {
  Food,
  FoodItem,
  FoodItemPost,
  MealPlan,
  MealPlanPost,
  MealSlot,
  Recipe,
  RecipeItem,
  Unit,
} from "@/types";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import {
  FieldArrayWithId,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { AddItemDialog } from "../mealLogs/AddItemDialog";
import { MealSlotFormView } from "./MealSlotFormView";

type MealPlanFormFood = {
  food: Food;
  unit: Unit;
  amount: number;
  mealSlot: MealSlot;
};

type MealPlanFormRecipe = {
  recipe: Recipe;
  servings: number;
  mealSlot: MealSlot;
};

export type MealPlanFormMeal = {
  foodItems: FieldArrayWithId<MealPlanForm, "foodItems", "id">[];
  recipeItems: FieldArrayWithId<MealPlanForm, "recipeItems", "id">[];
};

type MealPlanForm = {
  name: string;
  description: string | null;
  targetCalories: number;
  foodItems: MealPlanFormFood[];
  recipeItems: MealPlanFormRecipe[];
};

export function CreatePlanDialog({
  open,
  onClose,
  initialPlan,
}: {
  open: boolean;
  onClose: () => void;
  initialPlan?: MealPlan;
}) {
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [selectedMealSlot, setSelectedMealSlot] =
    useState<MealSlot>("breakfast");
  const createMealPlan = useCreateMealPlan();
  const updateMealPlan = useUpdateMealPlan();

  const handleAddItem = (mealSlot: MealSlot) => {
    setSelectedMealSlot(mealSlot);
    setAddItemOpen(true);
  };

  // Pre-population for edit mode
  const initialFoodItems = !initialPlan
    ? []
    : [
        ...initialPlan.breakfast.foodItems,
        ...initialPlan.lunch.foodItems,
        ...initialPlan.dinner.foodItems,
        ...initialPlan.snack.foodItems,
      ];
  const initialRecipeItems = !initialPlan
    ? []
    : [
        ...initialPlan.breakfast.recipeItems,
        ...initialPlan.lunch.recipeItems,
        ...initialPlan.dinner.recipeItems,
        ...initialPlan.snack.recipeItems,
      ];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MealPlanForm>({
    defaultValues: {
      name: initialPlan?.name,
      description: initialPlan?.description,
      targetCalories: initialPlan?.targetCalories,
      foodItems: initialFoodItems,
      recipeItems: initialRecipeItems,
    },
  });

  const foodsFieldArray = useFieldArray({ control, name: "foodItems" });
  const recipesFieldArray = useFieldArray({ control, name: "recipeItems" });

  const handleAddFood = (mealSlot: MealSlot, foodItem: FoodItem) => {
    foodsFieldArray.append({
      ...foodItem,
      mealSlot,
    });
    setAddItemOpen(false);
  };

  const handleAddRecipe = (mealSlot: MealSlot, recipeItem: RecipeItem) => {
    recipesFieldArray.append({ ...recipeItem, mealSlot });
    setAddItemOpen(false);
  };

  const handleRemoveFood = (fieldId: string) => {
    const index = foodsFieldArray.fields.findIndex((f) => f.id === fieldId);
    foodsFieldArray.remove(index);
  };

  const handleRemoveRecipe = (fieldId: string) => {
    const index = recipesFieldArray.fields.findIndex((f) => f.id === fieldId);
    recipesFieldArray.remove(index);
  };

  const breakfastItems = {
    foodItems: foodsFieldArray.fields.filter(
      (item) => item.mealSlot === "breakfast",
    ),
    recipeItems: recipesFieldArray.fields.filter(
      (item) => item.mealSlot === "breakfast",
    ),
  };
  const lunchItems = {
    foodItems: foodsFieldArray.fields.filter(
      (item) => item.mealSlot === "lunch",
    ),
    recipeItems: recipesFieldArray.fields.filter(
      (item) => item.mealSlot === "lunch",
    ),
  };
  const dinnerItems = {
    foodItems: foodsFieldArray.fields.filter(
      (item) => item.mealSlot === "dinner",
    ),
    recipeItems: recipesFieldArray.fields.filter(
      (item) => item.mealSlot === "dinner",
    ),
  };
  const snackItems = {
    foodItems: foodsFieldArray.fields.filter(
      (item) => item.mealSlot === "snack",
    ),
    recipeItems: recipesFieldArray.fields.filter(
      (item) => item.mealSlot === "snack",
    ),
  };

  const onSubmit: SubmitHandler<MealPlanForm> = async (data) => {
    const payload: MealPlanPost = {
      ...data,
      foodItems: data.foodItems.map((foodItem) => ({
        foodId: foodItem.food.id,
        unitId: foodItem.unit.id,
        amount: foodItem.amount,
        mealSlot: foodItem.mealSlot,
      })),
      recipeItems: data.recipeItems.map((recipeItem) => ({
        recipeId: recipeItem.recipe.id,
        servings: recipeItem.servings,
        mealSlot: recipeItem.mealSlot,
      })),
    };

    if (initialPlan) {
      await updateMealPlan.mutateAsync({
        mealPlanId: initialPlan.id,
        data: payload,
      });
    } else {
      await createMealPlan.mutateAsync(payload);
    }

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          <Typography variant="h5">CREATE MEAL PLAN</Typography>
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
        >
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              {...register("name", { required: "Required" })}
              label="Plan Name"
              fullWidth
              sx={{ gridColumn: "1/-1" }}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              label="Description"
              {...register("description")}
              fullWidth
              sx={{ gridColumn: "1/-1" }}
            />
            <TextField
              label="Daily Calorie Target"
              {...register("targetCalories", { valueAsNumber: true })}
              type="number"
              error={!!errors.targetCalories}
              helperText={errors.targetCalories?.message}
            />
          </Box>

          <Divider />
          <Typography variant="h6">PLAN MEALS</Typography>

          <MealSlotFormView
            meal={breakfastItems}
            mealSlot="breakfast"
            onAddItem={() => handleAddItem("breakfast")}
            onRemoveFoodItem={handleRemoveFood}
            onRemoveRecipeItem={handleRemoveRecipe}
          />
          <MealSlotFormView
            meal={lunchItems}
            mealSlot="lunch"
            onAddItem={() => handleAddItem("lunch")}
            onRemoveFoodItem={handleRemoveFood}
            onRemoveRecipeItem={handleRemoveRecipe}
          />
          <MealSlotFormView
            meal={dinnerItems}
            mealSlot="dinner"
            onAddItem={() => handleAddItem("dinner")}
            onRemoveFoodItem={handleRemoveFood}
            onRemoveRecipeItem={handleRemoveRecipe}
          />
          <MealSlotFormView
            meal={snackItems}
            mealSlot="snack"
            onAddItem={() => handleAddItem("snack")}
            onRemoveFoodItem={handleRemoveFood}
            onRemoveRecipeItem={handleRemoveRecipe}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={onClose} sx={{ color: "text.secondary" }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Create Plan
          </Button>
        </DialogActions>
      </form>
      <AddItemDialog
        open={addItemOpen}
        onClose={() => setAddItemOpen(false)}
        onAddFood={(foodItem) => handleAddFood(selectedMealSlot, foodItem)}
        onAddRecipe={(recipeItem) =>
          handleAddRecipe(selectedMealSlot, recipeItem)
        }
      />
    </Dialog>
  );
}
