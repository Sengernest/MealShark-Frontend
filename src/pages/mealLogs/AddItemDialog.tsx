import {
  MealEntry,
  MealEntryFood,
  MealEntryPost,
  MealEntryRecipe,
  MealFood,
  MealFoodPost,
  MealRecipePost,
} from "@/types";
import {
  Dialog,
  DialogTitle,
  Typography,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  DialogActions,
  Button,
  Box,
} from "@mui/material";

import { useState } from "react";
import { AddRecipeForm } from "./AddRecipeForm";
import { AddFoodForm } from "./AddFoodForm";
import { AddPlanForm } from "./AddPlanForm";

type AddItemDialogProps = {
  open: boolean;
  onClose: () => void;
  onAddFood: (item: MealFoodPost) => void;
  onAddRecipe: (item: MealRecipePost) => void;
};

type AddMode = "recipe" | "food" | "plan";

export function AddItemDialog({
  open,
  onClose,
  onAddFood,
  onAddRecipe,
}: AddItemDialogProps) {
  const [mode, setMode] = useState<AddMode>("recipe");
  const handleAdd = () => {
    if (mode === "plan") {
    } else if (mode === "recipe") {
    } else {
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">ADD TO MEAL SLOT</Typography>
      </DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
      >
        {/* Mode tabs */}
        <Box sx={{ display: "flex", gap: 1 }}>
          {[
            { id: "recipe" as AddMode, label: "Recipe" },
            { id: "food" as AddMode, label: "Food" },
            { id: "plan" as AddMode, label: "From Plan" },
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

        {mode === "plan" ? (
          <AddPlanForm />
        ) : mode === "recipe" ? (
          <AddRecipeForm onAdd={onAddRecipe} />
        ) : (
          <AddFoodForm onAdd={onAddFood} />
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} sx={{ color: "text.secondary" }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleAdd}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
