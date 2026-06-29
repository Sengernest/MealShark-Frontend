import EditIcon from "@mui/icons-material/Edit";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import PeopleIcon from "@mui/icons-material/People";

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import type { Recipe } from "../../types";
import { NutritionRow } from "./NutritionRow";
import { useSaveRecipe, useUnsaveRecipe } from "@/hooks/recipes";

export function RecipeCard({
  recipe,
  onView,
  onEdit,
}: {
  recipe: Recipe;
  onView: () => void;
  onEdit: (recipe: Recipe) => void;
}) {
  const saveRecipe = useSaveRecipe();
  const unsaveRecipe = useUnsaveRecipe();

  const toggleSaveRecipe = async (recipeId: number) => {
    if (recipe.isSaved) {
      await unsaveRecipe.mutateAsync(recipeId);
    } else {
      await saveRecipe.mutateAsync(recipeId);
    }
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.15s",
        "&:hover": { borderColor: "primary.main" },
      }}
    >
      <CardContent sx={{ flex: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1,
          }}
        >
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Chip
              label={recipe.isSample ? "Sample" : "My Recipe"}
              size="small"
              variant="outlined"
              sx={{ fontSize: 11 }}
            />

            <Chip
              label={recipe.category ?? "No category"}
              size="small"
              variant="outlined"
              sx={{ fontSize: 11 }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {!recipe.isSample && (
              <Tooltip title="Edit">
                <IconButton
                  size="small"
                  onClick={() => onEdit(recipe)}
                  color="primary"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title={recipe.isSaved ? "Unsave" : "Save recipe"}>
              <IconButton
                size="small"
                onClick={() => toggleSaveRecipe(recipe.id)}
                sx={{
                  color: recipe.isSaved ? "primary.main" : "text.disabled",
                }}
              >
                {recipe.isSaved ? (
                  <BookmarkIcon fontSize="small" />
                ) : (
                  <BookmarkBorderIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Typography
          variant="h5"
          sx={{ fontSize: 18, mb: 0.5, lineHeight: 1.2 }}
        >
          {recipe.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontSize: 12,
            mb: 1.5,
            height: 36,
            overflow: "hidden",
          }}
        >
          {recipe.description}
        </Typography>
        <Box sx={{ display: "flex", gap: 2, color: "text.disabled" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <AccessTimeIcon sx={{ fontSize: 13 }} />
            <Typography variant="caption">
              {recipe.prepTime && recipe.cookTime
                ? recipe.prepTime + recipe.cookTime + "m"
                : "-"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <PeopleIcon sx={{ fontSize: 13 }} />
            <Typography variant="caption">
              {recipe.servings ?? 1} serving(s)
            </Typography>
          </Box>
        </Box>
        <NutritionRow
          cal={recipe.nutrition.calories}
          prot={recipe.nutrition.macros.protein}
          carbs={recipe.nutrition.macros.carbs}
          fat={recipe.nutrition.macros.fat}
        />
      </CardContent>
      <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
        <Button size="small" variant="outlined" fullWidth onClick={onView}>
          View Recipe
        </Button>
      </CardActions>
    </Card>
  );
}
