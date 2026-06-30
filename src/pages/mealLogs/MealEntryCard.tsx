import {
  FoodEntry,
  FoodItem,
  MealEntry,
  MealSlot,
  RecipeEntry,
  RecipeItem,
} from "@/types";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";

import {
  useAddFoodEntry,
  useAddRecipeEntry,
  useImportFromMealPlan,
  useRemoveRecipeEntry,
  useUpdateFoodEntry,
  useUpdateRecipeEntry,
} from "@/hooks/mealLogs";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { useRemoveFoodEntry } from "../../hooks/mealLogs";
import { AddOrEditItemDialog } from "./AddItemDialog";
import EditIcon from "@mui/icons-material/Edit";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { toast } from "react-toastify";

export function MealEntryCard({
  mealEntry,
  mealSlot,
  logDate,
  setError,
}: {
  mealEntry: MealEntry;
  mealSlot: MealSlot;
  logDate: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
}) {
  const calories = mealEntry.nutrition.calories;
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [confirmImportOpen, setConfirmImportOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<{
    id: number;
    type: "food" | "recipe";
  } | null>(null);

  const closeAddItem = () => {
    setItemDialogOpen(false);
    setEditingFoodEntry(null);
    setEditingRecipeEntry(null);
  };

  const addFoodEntry = useAddFoodEntry();
  const addRecipeEntry = useAddRecipeEntry();
  const removeFoodEntry = useRemoveFoodEntry();
  const removeRecipeEntry = useRemoveRecipeEntry();
  const updateFoodEntry = useUpdateFoodEntry();
  const updateRecipeEntry = useUpdateRecipeEntry();
  const importFromMealPlan = useImportFromMealPlan();

  const handleAddFoodEntry = async (foodItem: FoodItem) => {
    await addFoodEntry.mutateAsync(
      {
        foodId: foodItem.food.id,
        unitId: foodItem.unit.id,
        amount: foodItem.amount,
        logDate,
        mealSlot,
      },
      {
        onSuccess: () => {
          toast.success("Food item successfully added!");
        },
      },
    );
    closeAddItem();
  };
  const handleAddRecipeEntry = async (recipeItem: RecipeItem) => {
    await addRecipeEntry.mutateAsync(
      {
        recipeId: recipeItem.recipe.id,
        servings: recipeItem.servings,
        logDate,
        mealSlot,
      },
      {
        onSuccess: () => {
          toast.success("Recipe item successfully added!");
        },
      },
    );
    closeAddItem();
  };

  const handleRemoveFoodEntry = async (entryId: number) => {
    await removeFoodEntry.mutateAsync(entryId, {
      onSuccess: () => {
        toast.success("Food item successfully deleted!");
      },
    });
  };

  const handleRemoveRecipeEntry = async (entryId: number) => {
    await removeRecipeEntry.mutateAsync(entryId, {
      onSuccess: () => {
        toast.success("Recioe item successfully deleted!");
      },
    });
  };

  const [editingFoodEntry, setEditingFoodEntry] = useState<FoodEntry | null>(
    null,
  );
  const handleEditFoodEntry = (entry: FoodEntry) => {
    setEditingRecipeEntry(null);
    setEditingFoodEntry(entry);
    setItemDialogOpen(true);
  };

  const [editingRecipeEntry, setEditingRecipeEntry] =
    useState<RecipeEntry | null>(null);
  const handleEditRecipeEntry = (entry: RecipeEntry) => {
    setEditingFoodEntry(null);
    setEditingRecipeEntry(entry);
    setItemDialogOpen(true);
  };

  const handleUpdateFoodEntry = async (foodItem: FoodItem) => {
    if (!editingFoodEntry) return;
    await updateFoodEntry.mutateAsync(
      {
        entryId: editingFoodEntry.id,
        data: {
          foodId: foodItem.food.id,
          unitId: foodItem.unit.id,
          amount: foodItem.amount,
          logDate,
          mealSlot,
        },
      },
      {
        onSuccess: () => {
          toast.success("Food item successfully edited!");
        },
      },
    );
    closeAddItem();
  };

  const handleUpdateRecipeEntry = async (recipeItem: RecipeItem) => {
    if (!editingRecipeEntry) return;
    await updateRecipeEntry.mutateAsync(
      {
        entryId: editingRecipeEntry.id,
        data: {
          recipeId: recipeItem.recipe.id,
          servings: recipeItem.servings,
          logDate,
          mealSlot,
        },
      },
      {
        onSuccess: () => {
          toast.success("Recipe item successfully edited!");
        },
      },
    );
    closeAddItem();
  };

  const handleImportMeal = () => {
    importFromMealPlan.mutate(
      { logDate, mealSlot },
      {
        onSuccess: () => {
          toast.success("Meal successfully imported!");
          setConfirmImportOpen(false);
        },
        onError: (err: any) => {
          setError(
            err?.response?.data?.error ?? "Failed to import from meal plan.",
          );
          setConfirmImportOpen(false);
        },
      },
    );
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1.5,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontSize: 16, textTransform: "capitalize" }}
          >
            {mealSlot}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {
              <Typography
                sx={{
                  color: "primary.main",
                  fontFamily: "'Barlow Condensed'",
                  fontWeight: 800,
                  fontSize: 16,
                }}
              >
                {Math.round(calories)} kcal
              </Typography>
            }
          </Box>
        </Box>

        {mealEntry.foodEntries.length === 0 &&
        mealEntry.recipeEntries.length === 0 ? (
          <Typography
            variant="body2"
            sx={{ color: "text.disabled", mb: 1.5, fontSize: 13 }}
          >
            No items logged.
          </Typography>
        ) : (
          <>
            {mealEntry.recipeEntries.map((recipeEntry) => {
              const name = recipeEntry.recipe?.name;
              const cal = recipeEntry.nutrition.calories;
              return (
                <Box
                  key={recipeEntry.recipeId}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 0.75,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      label={"Recipe"}
                      size="small"
                      variant="outlined"
                      sx={{
                        height: 18,
                        fontSize: 10,
                        color: "primary.main",
                        borderColor: "primary.main",
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: "text.primary", fontSize: 13 }}
                    >
                      {name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.disabled" }}
                    >
                      × {recipeEntry.servings} servings
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="caption" sx={{ color: "#888" }}>
                      {cal} kcal
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleEditRecipeEntry(recipeEntry)}
                      sx={{
                        color: "text.disabled",
                        "&:hover": { color: "error.main" },
                      }}
                    >
                      <EditIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setDeleteItem({
                          id: recipeEntry.id,
                          type: "recipe",
                        });
                        setConfirmDeleteOpen(true);
                      }}
                      sx={{
                        color: "text.disabled",
                        "&:hover": { color: "error.main" },
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Box>
                </Box>
              );
            })}

            {mealEntry.foodEntries.map((foodEntry) => {
              const name = foodEntry.food?.name;
              const cal = foodEntry.nutrition.calories;
              return (
                <Box
                  key={foodEntry.foodId}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 0.75,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      label={"Food"}
                      size="small"
                      variant="outlined"
                      sx={{
                        height: 18,
                        fontSize: 10,
                        color: "#3db5f2",
                        borderColor: "#3db5f2",
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: "text.primary", fontSize: 13 }}
                    >
                      {name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.disabled" }}
                    >
                      × {foodEntry.amount} {foodEntry.unit.name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="caption" sx={{ color: "#888" }}>
                      {cal} kcal
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleEditFoodEntry(foodEntry)}
                      sx={{
                        color: "text.disabled",
                        "&:hover": { color: "error.main" },
                      }}
                    >
                      <EditIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setDeleteItem({
                          id: foodEntry.id,
                          type: "food",
                        });
                        setConfirmDeleteOpen(true);
                      }}
                      sx={{
                        color: "text.disabled",
                        "&:hover": { color: "error.main" },
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Box>
                </Box>
              );
            })}
          </>
        )}
        <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
          <Button
            size="small"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setItemDialogOpen(true)}
          >
            Add item
          </Button>

          <Button
            size="small"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setConfirmImportOpen(true)}
          >
            Import meal
          </Button>
        </Box>

        <ConfirmDialog
          open={confirmImportOpen}
          title={`Confirm Import ${mealSlot.charAt(0).toUpperCase() + mealSlot.slice(1)} Meal`}
          description={`Are you sure you want to remove all current ${mealSlot} items and import the meal from your active meal plan?`}
          confirmText="Import"
          onClose={() => setConfirmImportOpen(false)}
          onConfirm={handleImportMeal}
        />
        <ConfirmDialog
          open={confirmDeleteOpen}
          title="Confirm Delete Item"
          description={`Are you sure you want to remove this item from ${mealSlot}?`}
          confirmText="Delete"
          confirmColor="error"
          onClose={() => {
            setConfirmDeleteOpen(false);
            setDeleteItem(null);
          }}
          onConfirm={async () => {
            if (!deleteItem) return;

            if (deleteItem.type === "food") {
              await handleRemoveFoodEntry(deleteItem.id);
            } else {
              await handleRemoveRecipeEntry(deleteItem.id);
            }

            setConfirmDeleteOpen(false);
            setDeleteItem(null);
          }}
        />

        {itemDialogOpen && (
          <AddOrEditItemDialog
            open
            onClose={closeAddItem}
            onAddFood={handleAddFoodEntry}
            onAddRecipe={handleAddRecipeEntry}
            onEditFood={handleUpdateFoodEntry}
            onEditRecipe={handleUpdateRecipeEntry}
            initialFood={editingFoodEntry ?? undefined}
            initialRecipe={editingRecipeEntry ?? undefined}
          />
        )}
      </CardContent>
    </Card>
  );
}
