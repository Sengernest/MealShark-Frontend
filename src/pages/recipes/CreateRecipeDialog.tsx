import { useSearchFoods } from "@/hooks/foods";
import { useCreateRecipe, useUpdateRecipe } from "@/hooks/recipes";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  SubmitHandler,
  useFieldArray,
  useForm,
  UseFormRegister,
  useWatch,
} from "react-hook-form";
import type { Food, FoodItemPost, Recipe, RecipePost, Unit } from "../../types";
import { RECIPE_CATEGORIES } from "./Recipes";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { NutritionRow } from "./NutritionRow";
import { AddIngredientDialog } from "./AddIngredientsDialog";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

type CreateRecipeFormData = {
  name: string;
  description: string | null;
  category: string | null;
  instructions: string | null;
  prepTime: number | null;
  cookTime: number | null;
  servings: number;
  ingredients: Ingredient[];
};

type Ingredient = {
  foodId: number | null;
  unitId: number | null;
  amount: number | null;
};

export function CreateRecipeDialog({
  open,
  onClose,
  recipe,
}: {
  open: boolean;
  onClose: () => void;
  recipe?: Recipe | null;
}) {
  const createRecipe = useCreateRecipe();
  const editRecipe = useUpdateRecipe();
  const [ingredientDialogOpen, setIngredientDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const { data: foods = [] } = useSearchFoods("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    watch,
    reset,
  } = useForm<CreateRecipeFormData>();

  const ingredientsFieldArray = useFieldArray({ control, name: "ingredients" });

  useEffect(() => {
    if (!recipe) return;

    reset({
      name: recipe.name,
      description: recipe.description,
      category: recipe.category,
      instructions: recipe.instructions,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      servings: recipe.servings,
      ingredients: recipe.ingredients.map((i) => ({
        foodId: i.food.id,
        unitId: i.unit.id,
        amount: i.amount,
      })),
    });
  }, [recipe, reset]);

  const onSubmit: SubmitHandler<CreateRecipeFormData> = async (formData) => {
    const payload: RecipePost = {
      ...formData,
      ingredients: formData.ingredients.map((ingredient) => ({
        foodId: ingredient.foodId!,
        amount: ingredient.amount!,
        unitId: ingredient.unitId!,
      })),
    };
    if (recipe) {
      await editRecipe.mutateAsync({
        recipeId: recipe.id,
        data: payload,
      });
    } else {
      await createRecipe.mutateAsync(payload);
    }

    onClose();
  };

  const ingredients = useWatch({
    control,
    name: "ingredients",
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          <Typography variant="h5">
            {" "}
            {recipe ? "EDIT RECIPE" : "CREATE RECIPE"}
          </Typography>
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
        >
          <Stack gap={1}>
            {Object.entries(errors).map(
              ([field, error], i) =>
                field !== "currentIngredient" &&
                error.message && (
                  <Alert key={i} severity="error">
                    {error.message}
                  </Alert>
                ),
            )}
          </Stack>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              {...register("name", { required: "Recipe name is required" })}
              label="Recipe Name"
              fullWidth
              sx={{ gridColumn: "1/-1" }}
            />
            <TextField
              label="Description"
              {...register("description")}
              multiline
              rows={2}
              fullWidth
              sx={{ gridColumn: "1/-1" }}
            />
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <FormControl size="small">
                  <InputLabel>Category</InputLabel>
                  <Select {...field} value={field.value ?? ""} label="Category">
                    {RECIPE_CATEGORIES.slice(1).map((c) => (
                      <MenuItem key={c} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            <TextField
              label="Servings"
              {...register("servings", {
                required: "Servings is required",
                min: { value: 1, message: "Servings must be at least 1" },
                valueAsNumber: true,
              })}
              type="number"
              inputMode="numeric"
            />
            <TextField
              label="Prep Time (min)"
              {...register("prepTime", {
                min: { value: 0, message: "Prep time cannot be negative" },
                valueAsNumber: true,
              })}
              type="number"
            />
            <TextField
              label="Cook Time (min)"
              {...register("cookTime", {
                min: { value: 0, message: "Cook time cannot be negative" },
                valueAsNumber: true,
              })}
              type="number"
            />
          </Box>
          <Divider />
          <Box alignItems="center">
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">INGREDIENTS</Typography>

              <Button
                startIcon={<AddIcon />}
                size="small"
                onClick={() => setIngredientDialogOpen(true)}
              >
                Add Ingredient
              </Button>
            </Box>
            <List dense disablePadding>
              {ingredientsFieldArray.fields.map((field, index) => {
                const ingredient = ingredients?.[index];

                return (
                  <ListItem
                    key={field.id}
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
                          onClick={() => {
                            setEditingIndex(index);
                            setIngredientDialogOpen(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>

                        <IconButton
                          edge="end"
                          color="error"
                          onClick={() => setDeleteIndex(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={
                        ingredient?.foodId
                          ? (foods?.find((f) => f.id === ingredient.foodId)
                              ?.name ?? "Unknown food")
                          : "No food selected"
                      }
                      secondary={
                        ingredient?.unitId
                          ? `${ingredient.amount} ${
                              foods
                                ?.find((f) => f.id === ingredient.foodId)
                                ?.units.find(
                                  (u) => u.unitId === ingredient.unitId,
                                )?.unit.name ?? ""
                            }`
                          : ""
                      }
                      primaryTypographyProps={{
                        variant: "body2",
                        color: "text.primary",
                      }}
                      secondaryTypographyProps={{ variant: "caption" }}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Box>
          <Box sx={{ pt: 1 }}>
            <Typography variant="h6">NUTRITION INFO</Typography>
            <NutritionRow cal={900} prot={40} carbs={30} fat={30} />
          </Box>

          <Divider />
          <Box sx={{ pt: 1 }} alignItems="center">
            <Typography variant="h6">INSTRUCTIONS</Typography>

            <TextField
              label="Instructions"
              {...register("instructions", { maxLength: 2000 })}
              multiline
              rows={4}
              fullWidth
              sx={{ mt: 3 }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={onClose} sx={{ color: "text.secondary" }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {recipe ? "Edit Recipe" : "Create Recipe"}
          </Button>
        </DialogActions>
      </form>

      <AddIngredientDialog
        open={ingredientDialogOpen}
        onClose={() => {
          setIngredientDialogOpen(false);
          setEditingIndex(null);
        }}
        title={editingIndex !== null ? "EDIT INGREDIENT" : "ADD INGREDIENT"}
        button={editingIndex !== null ? "Edit" : "Add"}
        initialValue={
          editingIndex !== null && ingredients?.[editingIndex]
            ? {
                foodId: ingredients[editingIndex].foodId!,
                unitId: ingredients[editingIndex].unitId!,
                amount: ingredients[editingIndex].amount!,
              }
            : undefined
        }
        onAdd={(food: FoodItemPost) => {
          if (editingIndex !== null) {
            ingredientsFieldArray.update(editingIndex, {
              foodId: food.foodId,
              amount: food.amount,
              unitId: food.unitId,
            });
            setEditingIndex(null);
          } else {
            ingredientsFieldArray.append({
              foodId: food.foodId,
              amount: food.amount,
              unitId: food.unitId,
            });
          }

          setIngredientDialogOpen(false);
        }}
      />

      <ConfirmDialog
        open={deleteIndex !== null}
        title="Confirm Delete Ingredient"
        description="Are you sure you want to delete this ingredient?"
        confirmText="Delete"
        confirmColor="error"
        onClose={() => setDeleteIndex(null)}
        onConfirm={() => {
          if (deleteIndex !== null) {
            ingredientsFieldArray.remove(deleteIndex);
            setDeleteIndex(null);
          }
        }}
      />
    </Dialog>
  );
}
