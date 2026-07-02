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

import { useState } from "react";
import { AddFoodForm } from "./AddFoodForm";
import { AddRecipeForm } from "./AddRecipeForm";

type AddItemDialogProps = {
  open: boolean;
  onClose: () => void;
  onAddFood: (item: FoodItem) => void | Promise<void>;
  onAddRecipe: (item: RecipeItem) => void | Promise<void>;
};

type AddMode = "recipe" | "food";

const MODE_TO_FORM_ID: Record<AddMode, string> = {
  recipe: "recipe-form",
  food: "food-form",
};

export function AddItemDialog({
  open,
  onClose,
  onAddFood,
  onAddRecipe,
}: AddItemDialogProps) {
  const [mode, setMode] = useState<AddMode>("recipe");
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">ADD ITEM</Typography>
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
          <AddFoodForm onAdd={onAddFood} setSubmitState={setIsSubmitting} />
        ) : (
          <AddRecipeForm onAdd={onAddRecipe} setSubmitState={setIsSubmitting} />
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} sx={{ color: "text.secondary" }}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          form={MODE_TO_FORM_ID[mode]}
          disabled={isSubmitting}
        >
          ADD
        </Button>
      </DialogActions>
    </Dialog>
  );
}
