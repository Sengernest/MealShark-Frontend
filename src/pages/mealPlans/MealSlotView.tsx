import { MealPlanMeal, MealSlot } from "@/types";
import { Box, Chip, Typography } from "@mui/material";

type MealSlotProps = {
  mealSlot: MealSlot;
  meal: MealPlanMeal;
};

export function MealSlotView({ meal, mealSlot }: MealSlotProps) {
  const mealCalories = meal.nutrition.calories;
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
        <Typography
          variant="overline"
          sx={{ fontSize: 10, color: "text.disabled" }}
        >
          {mealSlot}
        </Typography>
        {
          <Typography
            sx={{
              color: "primary.main",
              fontFamily: "'Barlow Condensed'",
              fontWeight: 800,
              fontSize: 13,
            }}
          >
            {mealCalories} kcal
          </Typography>
        }
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
                  //  "#3db5f2",
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
