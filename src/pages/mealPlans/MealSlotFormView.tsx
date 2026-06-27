import { MealPlanMeal, MealSlot } from "@/types";
import { Box, Button, Chip, Typography } from "@mui/material";
import { MealPlanFormMeal } from "./CreateMealPlanDialog";
import AddIcon from '@mui/icons-material/Add';

type MealSlotProps = {
  mealSlot: MealSlot;
  meal: MealPlanFormMeal;
  onAddItem: () => void
};

export function MealSlotFormView({ meal, mealSlot, onAddItem }: MealSlotProps) {
  return (
    <Box sx={{ py: 1, borderBottom: "1px solid", borderColor: "divider" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 0.5,
        }}
      >
        <Typography variant="overline" sx={{ color: "text.disabled" }}>
          {mealSlot}
        </Typography>

        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={onAddItem}
          sx={{ color: "primary.main" }}
        >
          Add item
        </Button>
      </Box>
      {meal.recipeItems.length === 0 && meal.recipeItems.length ? (
        <Typography
          variant="body2"
          sx={{ color: "text.disabled", fontSize: 12 }}
        >
          Empty slot
        </Typography>
      ) : (
        <>
          {meal.foodItems.map((foodItem) => (
            <Box
              key={foodItem.id}
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.25 }}
            >
              <Chip
                label={"Food"}
                size="small"
                variant="outlined"
                sx={{
                  height: 16,
                  fontSize: 9,
                  color: "#3db5f2",
                  borderColor: "#3db5f2",
                }}
              />
              <Typography
                variant="body2"
                sx={{ fontSize: 13, color: "text.primary" }}
              >
                {foodItem.food.name}
                {
                  <Box component="span" sx={{ color: "text.disabled" }}>
                    {" "}
                    × {foodItem.amount} {foodItem.unit.name}
                  </Box>
                }
              </Typography>
            </Box>
          ))}
          {meal.recipeItems.map((recipeItem) => (
            <Box
              key={recipeItem.id}
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.25 }}
            >
              <Chip
                label={"Recipe"}
                size="small"
                variant="outlined"
                sx={{
                  height: 16,
                  fontSize: 9,
                  color: "primary.main",
                  borderColor: "primary.main",
                }}
              />
              <Typography
                variant="body2"
                sx={{ fontSize: 13, color: "text.primary" }}
              >
                {recipeItem.recipe.name}
                {
                  <Box component="span" sx={{ color: "text.disabled" }}>
                    {" "}
                    ×{recipeItem.servings}
                  </Box>
                }
              </Typography>
            </Box>
          ))}
        </>
      )}
    </Box>
  );
}
