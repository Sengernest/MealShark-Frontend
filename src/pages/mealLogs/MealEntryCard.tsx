import { MealEntry, MealEntryFood, MealFoodPost, MealRecipePost } from "@/types";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Box,
  Tooltip,
  Button,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { AddItemDialog } from "./AddItemDialog";

export function MealEntryCard({
  mealEntry,
  onRemoveSlot,
}: {
  mealEntry: MealEntry;
  onRemoveSlot: () => void;
}) {
  const calories = mealEntry.nutrition.calories;
  const [addItemOpen, setAddItemOpen] = useState(false)

  const handleRemoveFoodItem = async (foodId: number) => {
    // TODO:
  };

  const handleRemoveRecipeItem = async (recipeId: number) => {};

  const handleAddFoodItem = (food: MealFoodPost) => {};
  const handleAddRecipeItem = (recipe: MealRecipePost) => {};

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
          <Typography variant="h6" sx={{ fontSize: 16 }}>
            {mealEntry.label ?? `Meal ${mealEntry.mealIndex + 1}`}
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
            <Tooltip title="Remove slot">
              <IconButton
                size="small"
                onClick={onRemoveSlot}
                sx={{
                  color: "error.main",
                  opacity: 0.6,
                  "&:hover": { opacity: 1 },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {mealEntry.foodItems.length === 0 &&
        mealEntry.recipeItems.length === 0 ? (
          <Typography
            variant="body2"
            sx={{ color: "text.disabled", mb: 1.5, fontSize: 13 }}
          >
            No items logged.
          </Typography>
        ) : (
          <>
            {mealEntry.recipeItems.map((recipeItem) => {
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
                      onClick={() =>
                        handleRemoveRecipeItem(recipeItem.recipeId)
                      }
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

            {mealEntry.foodItems.map((foodItem) => {
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
                      onClick={() => handleRemoveFoodItem(foodItem.foodId)}
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

        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={() => setAddItemOpen(true)}
          sx={{ mt: 1.5, color: "primary.main" }}
        >
          Add item
        </Button>

        {addItemOpen && (
          <AddItemDialog
            open
            onClose={() => {
              setAddItemOpen(false);
            }}
            onAddFood={handleAddFoodItem}
            onAddRecipe={handleAddRecipeItem}
          />
        )}
      </CardContent>
    </Card>
  );
}
