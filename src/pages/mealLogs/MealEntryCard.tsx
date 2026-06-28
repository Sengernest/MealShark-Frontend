import {
  FoodItem,
  FoodItemPost,
  MealEntry,
  MealSlot,
  RecipeItem,
} from "@/types";
import {
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
  useRemoveRecipeEntry,
} from "@/hooks/mealLogs";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { useRemoveFoodEntry } from "../../hooks/mealLogs";
import { AddItemDialog } from "./AddItemDialog";

export function MealEntryCard({
  mealEntry,
  mealSlot,
  logDate,
}: {
  mealEntry: MealEntry;
  mealSlot: MealSlot;
  logDate: string;
}) {
  const calories = mealEntry.nutrition.calories;
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [importealOpen, setImportMealOpen] = useState(false);

  const handleClose = () => {
    setAddItemOpen(false);
  };

  const addFoodEntry = useAddFoodEntry();
  const addRecipeEntry = useAddRecipeEntry();
  const removeFoodEntry = useRemoveFoodEntry();
  const removeRecipeEntry = useRemoveRecipeEntry();

  const handleAddFoodEntry = async (foodItem: FoodItem) => {
    await addFoodEntry.mutateAsync({
      foodId: foodItem.food.id,
      unitId: foodItem.unit.id,
      amount: foodItem.amount,
      logDate,
      mealSlot,
    });
    handleClose();
  };
  const handleAddRecipeEntry = async (recipeItem: RecipeItem) => {
    await addRecipeEntry.mutateAsync({
      recipeId: recipeItem.recipe.id,
      servings: recipeItem.servings,
      logDate,
      mealSlot,
    });
    handleClose();
  };

  const handleRemoveFoodEntry = async (entryId: number) => {
    await removeFoodEntry.mutateAsync(entryId);
  };

  const handleRemoveRecipeEntry = async (entryId: number) => {
    await removeRecipeEntry.mutateAsync(entryId);
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
            {mealEntry.recipeEntries.map((recipeItem) => {
              const name = recipeItem.recipe?.name;
              const cal = recipeItem.nutrition.calories;
              return (
                <Box
                  key={recipeItem.recipeId}
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
                      × {recipeItem.servings} servings
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="caption" sx={{ color: "#888" }}>
                      {cal} kcal
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveRecipeEntry(recipeItem.id)}
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

            {mealEntry.foodEntries.map((foodItem) => {
              const name = foodItem.food?.name;
              const cal = foodItem.nutrition.calories;
              return (
                <Box
                  key={foodItem.foodId}
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
                      × {foodItem.amount} {foodItem.unit.name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="caption" sx={{ color: "#888" }}>
                      {cal} kcal
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveFoodEntry(foodItem.id)}
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
            onClick={() => setAddItemOpen(true)}
          >
            Add item
          </Button>

          <Button
            size="small"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setImportMealOpen(true)}
          >
            Import meal
          </Button>
        </Box>

        {addItemOpen && (
          <AddItemDialog
            open
            onClose={handleClose}
            onAddFood={handleAddFoodEntry}
            onAddRecipe={handleAddRecipeEntry}
          />
        )}
      </CardContent>
    </Card>
  );
}
