import { FoodItem, RecipeItem } from "@/types";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import { AddFoodForm } from "../../components/forms/AddFoodForm";
import { AddRecipeForm } from "../../components/forms/AddRecipeForm";

type AddOrEditItemDialogProps = {
  open: boolean;
  onClose: () => void;
  onAddFood: (item: FoodItem) => void;
  onAddRecipe: (item: RecipeItem) => void;
  initialFood?: FoodItem;
  initialRecipe?: RecipeItem;
  onEditFood?: (item: FoodItem) => void;
  onEditRecipe: (item: RecipeItem) => void;
};

type AddMode = "recipe" | "food";

const MODE_TO_FORM_ID: Record<AddMode, string> = {
  recipe: "recipe-form",
  food: "food-form",
};

export function AddOrEditItemDialog({
  open,
  onClose,
  onAddFood,
  onAddRecipe,
  initialFood,
  initialRecipe,
  onEditFood,
  onEditRecipe,
}: AddOrEditItemDialogProps) {
  const [mode, setMode] = useState<AddMode>(initialFood ? "food" : "recipe");
  const isEditMode = !!initialFood || !!initialRecipe;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">
          {isEditMode ? "EDIT ITEM" : "ADD ITEM"}
        </Typography>
      </DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
      >
        {/* Mode tabs */}
        <Box sx={{ display: "flex", gap: 1 }}>
          {[
            { id: "recipe" as AddMode, label: "Recipe" },
            { id: "food" as AddMode, label: "Food" },
          ].map(({ id, label }) => (
            <Button
              key={id}
              variant={mode === id ? "contained" : "outlined"}
              size="small"
              onClick={() => {
                setMode(id);
              }}
              sx={{
                color: mode === id ? "#0d0d0d" : "text.secondary",
                borderColor: "divider",
              }}
            >
              {label}
            </Button>
          ))}
        </Box>

        {mode === "food" ? (
          <AddFoodForm
            initialFood={initialFood}
            onAdd={(initialFood && onEditFood) ? onEditFood : onAddFood}
          />
        ) : (
          <AddRecipeForm
            initialRecipe={initialRecipe}
            onAdd={onAddRecipe}
            onEdit={onEditRecipe}
          />
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} sx={{ color: "text.secondary" }}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" form={MODE_TO_FORM_ID[mode]}>
          {isEditMode ? "SAVE": "ADD"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
