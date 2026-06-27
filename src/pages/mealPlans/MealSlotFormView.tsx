import { MealPlanMeal, MealSlot } from "@/types";
import {
  Box,
  Button,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { MealPlanFormMeal } from "./CreateMealPlanDialog";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

type MealSlotProps = {
  mealSlot: MealSlot;
  meal: MealPlanFormMeal;
  onAddItem: () => void;
  onRemoveFoodItem: (id: string) => void;
  onRemoveRecipeItem: (id: string) => void;
  onEditFoodItem: (id: string) => void;
  onEditRecipeItem: (id: string) => void;
};

export function MealSlotFormView({
  meal,
  mealSlot,
  onAddItem,
  onRemoveFoodItem,
  onRemoveRecipeItem,
  onEditFoodItem,
  onEditRecipeItem,
}: MealSlotProps) {
  return (
    <Box sx={{}}>
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
          <List dense disablePadding>
            {meal.foodItems.map((foodItem) => (
              <ListItem
                key={foodItem.id}
                disablePadding
                sx={{
                  py: 0.75,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
                secondaryAction={
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      edge="end"
                      color="primary"
                      onClick={() => onEditFoodItem(foodItem.id)}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      edge="end"
                      color="error"
                      onClick={() => onRemoveFoodItem(foodItem.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText
                  primary={foodItem.food.name}
                  secondary={`${foodItem.amount} ${foodItem.unit.name}`}
                  primaryTypographyProps={{
                    variant: "body2",
                    color: "text.primary",
                  }}
                  secondaryTypographyProps={{ variant: "caption" }}
                />
              </ListItem>
            ))}
          </List>
          <List dense disablePadding>
            {meal.recipeItems.map((recipeItem) => (
              <ListItem
                key={recipeItem.id}
                disablePadding
                sx={{
                  py: 0.75,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
                secondaryAction={
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      edge="end"
                      color="primary"
                      onClick={() => onEditRecipeItem(recipeItem.id)}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      edge="end"
                      color="error"
                      onClick={() => onRemoveRecipeItem(recipeItem.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText
                  primary={recipeItem.recipe.name}
                  secondary={`${recipeItem.servings} serving(s)`}
                  primaryTypographyProps={{
                    variant: "body2",
                    color: "text.primary",
                  }}
                  secondaryTypographyProps={{ variant: "caption" }}
                />
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Box>
  );
}
