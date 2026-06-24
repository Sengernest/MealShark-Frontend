import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { Recipe } from "../../types";
import { NutritionRow } from "./NutritionRow";

export function RecipeDetailDialog({
  recipe,
  onClose,
  onEdit,
  onDelete,
}: {
  recipe: Recipe;
  onClose: () => void;
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipeId: number) => void;
}) {
  const toggleSaveRecipe = (recipeId: number) => {
    // TODO:
  };

  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Chip
              label={recipe.category ?? "No category"}
              size="small"
              variant="outlined"
              sx={{ mb: 1 }}
            />
            <Typography variant="h4">{recipe.name}</Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 0.5 }}>
            <Tooltip title="Edit">
              <IconButton onClick={() => onEdit(recipe)} color="primary">
                <EditIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton color="error" onClick={() => setDeleteOpen(true)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title={recipe.isSaved ? "Unsave" : "Save"}>
              <IconButton
                onClick={() => toggleSaveRecipe(recipe.id)}
                sx={{
                  color: recipe.isSaved ? "primary.main" : "text.disabled",
                }}
              >
                {recipe.isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
          {recipe.description}
        </Typography>

        <Box sx={{ display: "flex", gap: 3, mb: 2.5 }}>
          <Box>
            <Typography variant="caption" sx={{ color: "text.disabled" }}>
              Prep
            </Typography>
            <Typography variant="body2">{recipe.prepTime} min</Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: "text.disabled" }}>
              Cook
            </Typography>
            <Typography variant="body2">{recipe.cookTime} min</Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: "text.disabled" }}>
              Servings
            </Typography>
            <Typography variant="body2">{recipe.servings ?? 1}</Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 2.5 }} />

        <Typography variant="h6" sx={{ mb: 1 }}>
          NUTRITION STATS
        </Typography>

        <NutritionRow
          cal={recipe.nutrition.calories}
          prot={recipe.nutrition.macros.protein}
          carbs={recipe.nutrition.macros.carbs}
          fat={recipe.nutrition.macros.fat}
        />
        
        <Divider sx={{ my: 2.5 }} />

        <Typography variant="h6" sx={{ mb: 1 }}>
          INGREDIENTS
        </Typography>
        <List dense disablePadding>
          {recipe.ingredients.map((ingredient, i) => (
            <ListItem
              key={i}
              disablePadding
              sx={{
                py: 0.75,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <ListItemText
                primary={ingredient.food.name}
                secondary={`${ingredient.amount} ${ingredient.unit.name}`}
                primaryTypographyProps={{
                  variant: "body2",
                  color: "text.primary",
                }}
                secondaryTypographyProps={{ variant: "caption" }}
              />
            </ListItem>
          ))}
        </List>

        {recipe.instructions && recipe.instructions.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mb: 1.5, mt: 2.5 }}>
              INSTRUCTIONS
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                lineHeight: 1.8,
                whiteSpace: "pre-line",
              }}
            >
              {recipe.instructions}
            </Typography>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirm Delete Recipe</DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{recipe.name}</strong>?
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>

          <Button
            color="error"
            variant="contained"
            onClick={() => {
              onDelete(recipe.id);
              setDeleteOpen(false);
              onClose();
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}
