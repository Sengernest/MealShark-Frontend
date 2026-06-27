import { useCreateMealPlan } from "@/hooks/mealPlans";
import { Food, MealPlanPost, MealSlot, Recipe, Unit } from "@/types";
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
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";

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
}: {
  open: boolean;
  onClose: () => void;
}) {
  const createMealPlan = useCreateMealPlan();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MealPlanForm>();

  const foodsFieldArray = useFieldArray({ control, name: "foodItems" });
  const recipesFieldArray = useFieldArray({ control, name: "recipeItems" });

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

    createMealPlan.mutate(payload, {
      onSuccess: () => onClose(),
    });
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

          {/* <MealSlotView mealSlot="breakfast" />
        <MealSlotView mealSlot="lunch" />
        <MealSlotView mealSlot="dinner" />
        <MealSlotView mealSlot="snack" /> */}
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
    </Dialog>
  );
}
