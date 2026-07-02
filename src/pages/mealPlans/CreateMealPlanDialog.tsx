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
  Alert,
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
import { useEffect, useState } from "react";
import {
  FieldArrayWithId,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { AddItemDialog } from "../../components/forms/AddItemDialog";
import { MealSlotFormView } from "./MealSlotFormView";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { toast } from "react-toastify";
import { EditRecipeItemDialog } from "@/components/forms/EditRecipeItemDialog";
import { calculateMealPlanNutrition } from "@/services/nutritionPreview";
import { NutritionRow } from "../recipes/NutritionRow";

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
  description: string;
  targetCalories: number;
  foodItems: MealPlanFormFood[];
  recipeItems: MealPlanFormRecipe[];
};

export function CreateMealPlanDialog({
  open,
  onClose,
  initialPlan,
}: {
  open: boolean;
  onClose: () => void;
  initialPlan?: MealPlan;
  isEditMode?: boolean;
}) {
  const [itemDialogOpen, setItemDialogOpen] = useState(false);

  // To determine which meal slot to add to
  const [selectedMealSlot, setSelectedMealSlot] =
    useState<MealSlot>("breakfast");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<
    | { type: "food"; fieldId: string }
    | { type: "recipe"; fieldId: string }
    | null
  >(null);
  const [error, setError] = useState("");
  const createMealPlan = useCreateMealPlan();
  const updateMealPlan = useUpdateMealPlan();

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
    reset,
    formState: { errors },
  } = useForm<MealPlanForm>({
    defaultValues: {
      name: initialPlan?.name,
      description: initialPlan?.description ?? "",
      targetCalories: initialPlan?.targetCalories,
      foodItems: initialFoodItems,
      recipeItems: initialRecipeItems,
    },
  });

  useEffect(() => {
    if (initialPlan) {
      reset({
        name: initialPlan.name,
        description: initialPlan.description ?? "",
        targetCalories: initialPlan.targetCalories,
        foodItems: [
          ...initialPlan.breakfast.foodItems,
          ...initialPlan.lunch.foodItems,
          ...initialPlan.dinner.foodItems,
          ...initialPlan.snack.foodItems,
        ],
        recipeItems: [
          ...initialPlan.breakfast.recipeItems,
          ...initialPlan.lunch.recipeItems,
          ...initialPlan.dinner.recipeItems,
          ...initialPlan.snack.recipeItems,
        ],
      });
    } else {
      reset({
        name: "",
        description: "",
        targetCalories: undefined,
        foodItems: [],
        recipeItems: [],
      });
    }
  }, [initialPlan, reset]);

  const foodsFieldArray = useFieldArray({ control, name: "foodItems" });
  const recipesFieldArray = useFieldArray({ control, name: "recipeItems" });

  const nutrition = calculateMealPlanNutrition(
    foodsFieldArray.fields,
    recipesFieldArray.fields,
  );

  const handleAddItem = (mealSlot: MealSlot) => {
    setSelectedMealSlot(mealSlot);
    setItemDialogOpen(true);
  };

  // The current food item being edited
  const [editingFoodId, setEditingFoodId] = useState<string | null>(null);
  const editingFoodItem = foodsFieldArray.fields.find(
    (f) => f.id === editingFoodId,
  );
  // When edit food button is clicked
  const handleEditFood = (fieldId: string) => {
    setEditingRecipeId(null);
    setEditingFoodId(fieldId);
    setItemDialogOpen(true);
  };

  // The current recipe item being edited
  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);
  const editingRecipeItem = recipesFieldArray.fields.find(
    (f) => f.id === editingRecipeId,
  );
  // When edit recipe button is clicked
  const handleEditRecipe = (fieldId: string) => {
    setEditingFoodId(null);
    setEditingRecipeId(fieldId);
    setItemDialogOpen(true);
  };

  const handleCloseItemDialog = () => {
    setItemDialogOpen(false);
    setEditingFoodId(null);
    setEditingRecipeId(null);
  };

  const handleConfirmDelete = () => {
    if (!pendingDelete) return;

    if (pendingDelete.type === "food") {
      const index = foodsFieldArray.fields.findIndex(
        (f) => f.id === pendingDelete.fieldId,
      );

      if (index !== -1) {
        foodsFieldArray.remove(index);
      }
    } else {
      const index = recipesFieldArray.fields.findIndex(
        (f) => f.id === pendingDelete.fieldId,
      );

      if (index !== -1) {
        recipesFieldArray.remove(index);
      }
    }

    setPendingDelete(null);
    setConfirmDeleteOpen(false);
  };

  const handleCancelDelete = () => {
    setPendingDelete(null);
    setConfirmDeleteOpen(false);
  };

  const addFood = (foodItem: FoodItem) => {
    foodsFieldArray.append({
      ...foodItem,
      mealSlot: selectedMealSlot,
    });
    handleCloseItemDialog();
  };

  const addRecipe = (recipeItem: RecipeItem) => {
    recipesFieldArray.append({ ...recipeItem, mealSlot: selectedMealSlot });
    handleCloseItemDialog();
  };

  const editFood = (foodItem: FoodItem) => {
    const index = foodsFieldArray.fields.findIndex(
      (f) => f.id === editingFoodId,
    );
    const mealSlot = foodsFieldArray.fields[index].mealSlot;
    foodsFieldArray.update(index, { ...foodItem, mealSlot });
    handleCloseItemDialog();
  };

  const editRecipe = (servings: number) => {
    if (!editingRecipeItem) return;
    const index = recipesFieldArray.fields.findIndex(
      (f) => f.id === editingRecipeId,
    );
    const mealSlot = recipesFieldArray.fields[index].mealSlot;
    recipesFieldArray.update(index, {
      ...editingRecipeItem,
      servings,
      mealSlot,
    });
  };

  const removeFood = (fieldId: string) => {
    setPendingDelete({ type: "food", fieldId });
    setConfirmDeleteOpen(true);
  };

  const removeRecipe = (fieldId: string) => {
    setPendingDelete({ type: "recipe", fieldId });
    setConfirmDeleteOpen(true);
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
    if (data.foodItems.length === 0 && data.recipeItems.length === 0) {
      setError("A meal plan cannot have no meals. Please try again.");
      return;
    }
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
      await updateMealPlan.mutateAsync(
        {
          mealPlanId: initialPlan.id,
          data: payload,
        },
        {
          onSuccess: () => {
            toast.success("Meal Plan updated successfully!");
          },
        },
      );
    } else {
      await createMealPlan.mutateAsync(payload, {
        onSuccess: () => {
          toast.success("Meal Plan created successfully!");
        },
      });
    }

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          <Typography variant="h5">
            {initialPlan ? "EDIT" : "CREATE"} MEAL PLAN
          </Typography>
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
        >
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              {...register("name", { required: "Required" })}
              label="Plan Name"
              fullWidth
              sx={{ gridColumn: "1/-1", mt: 1 }}
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
              label="Daily Calorie Target/kcal"
              {...register("targetCalories", {
                valueAsNumber: true,
                required: "Required",
                min: {
                  value: 1200,
                  message: "Must be at least 1200",
                },
              })}
              type="number"
              error={!!errors.targetCalories}
              helperText={errors.targetCalories?.message}
              sx={{ width: "250px" }}
            />
          </Box>

          <Divider />
          <Typography variant="h6">PLAN MEALS</Typography>

          <MealSlotFormView
            meal={breakfastItems}
            mealSlot="breakfast"
            onAddItem={() => handleAddItem("breakfast")}
            onRemoveFoodItem={removeFood}
            onRemoveRecipeItem={removeRecipe}
            onEditFoodItem={handleEditFood}
            onEditRecipeItem={handleEditRecipe}
          />
          <MealSlotFormView
            meal={lunchItems}
            mealSlot="lunch"
            onAddItem={() => handleAddItem("lunch")}
            onRemoveFoodItem={removeFood}
            onRemoveRecipeItem={removeRecipe}
            onEditFoodItem={handleEditFood}
            onEditRecipeItem={handleEditRecipe}
          />
          <MealSlotFormView
            meal={dinnerItems}
            mealSlot="dinner"
            onAddItem={() => handleAddItem("dinner")}
            onRemoveFoodItem={removeFood}
            onRemoveRecipeItem={removeRecipe}
            onEditFoodItem={handleEditFood}
            onEditRecipeItem={handleEditRecipe}
          />
          <MealSlotFormView
            meal={snackItems}
            mealSlot="snack"
            onAddItem={() => handleAddItem("snack")}
            onRemoveFoodItem={removeFood}
            onEditFoodItem={handleEditFood}
            onEditRecipeItem={handleEditRecipe}
            onRemoveRecipeItem={removeRecipe}
          />
          <Divider />

          <Box sx={{ pt: 1 }}>
            <Typography variant="h6">NUTRITION INFO</Typography>

            <NutritionRow
              cal={nutrition.calories}
              prot={nutrition.macros.protein}
              carbs={nutrition.macros.carbs}
              fat={nutrition.macros.fat}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={onClose} sx={{ color: "text.secondary" }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            {initialPlan ? "Save Changes" : "Create Plan"}
          </Button>
        </DialogActions>
      </form>
      {itemDialogOpen && (
        <AddItemDialog
          open={itemDialogOpen}
          onClose={handleCloseItemDialog}
          onAddFood={addFood}
          onAddRecipe={addRecipe}
        />
      )}

      {editingRecipeItem && (
        <EditRecipeItemDialog
          recipeName={editingRecipeItem.recipe.name}
          initialServings={editingRecipeItem.servings}
          onSave={editRecipe}
        />
      )}

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Confirm Delete Item"
        description="Are you sure you want to remove this item from your meal plan?"
        confirmText="Delete"
        confirmColor="error"
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </Dialog>
  );
}
