import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useSearchFoods } from "@/hooks/foods";
import { useCreateRecipe, useUpdateRecipe } from "@/hooks/recipes";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
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
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import type { FoodItem, FoodItemPost, Recipe, RecipePost } from "../../types";
import { AddIngredientDialog } from "./AddIngredientsDialog";
import { NutritionRow } from "./NutritionRow";
import { RECIPE_CATEGORIES } from "./Recipes";
import { toast } from "react-toastify";
import { calculateRecipeNutrition } from "@/services/nutritionPreview";

type CreateRecipeFormData = {
  name: string;
  description: string | null;
  category: string | null;
  instructions: string | null;
  prepTime: number | null;
  cookTime: number | null;
  servings: number;
  ingredients: FoodItem[];
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    watch,
    reset,
    setError,
    clearErrors,
  } = useForm<CreateRecipeFormData>({
    defaultValues: {
      ingredients: recipe?.ingredients,
    },
  });

  useEffect(() => {
    if (recipe) {
      reset({
        name: recipe.name,
        description: recipe.description,
        category: recipe.category,
        instructions: recipe.instructions,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        ingredients: recipe.ingredients,
      });
    } else {
      reset({
        name: "",
        description: "",
        category: "",
        instructions: "",
        prepTime: null,
        cookTime: null,
        servings: undefined,
        ingredients: [],
      });
    }
  }, [recipe, reset]);

  const ingredientsFieldArray = useFieldArray({ control, name: "ingredients" });

  const ingredients = useWatch({
    control,
    name: "ingredients",
  });

  const servings = watch("servings") || 1;

  const previewNutrition =
    ingredients.length > 0
      ? calculateRecipeNutrition(ingredients, servings)
      : (recipe?.nutrition ?? {
          calories: 0,
          macros: {
            protein: 0,
            carbs: 0,
            fat: 0,
          },
        });

  const nutrition = calculateRecipeNutrition(ingredients ?? [], servings || 1);

  const onSubmit: SubmitHandler<CreateRecipeFormData> = async (formData) => {
    if (formData.ingredients.length === 0) {
      setError("ingredients", {
        type: "manual",
        message:
          "A recipe must contain at least one ingredient. Please try again.",
      });
      return;
    }

    clearErrors("ingredients");
    const payload: RecipePost = {
      ...formData,
      ingredients: formData.ingredients.map((ingredient) => ({
        foodId: ingredient.food.id,
        amount: ingredient.amount,
        unitId: ingredient.unit.id,
      })),
    };
    if (recipe) {
      await editRecipe.mutateAsync(
        {
          recipeId: recipe.id,
          data: payload,
        },
        {
          onSuccess: () => {
            toast.success("Recipe edited successfully!");
          },
        },
      );
    } else {
      await createRecipe.mutateAsync(payload, {
        onSuccess: () => {
          toast.success("Recipe created successfully!");
        },
      });
    }
    onClose();
  };

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
                const ingredient = field;
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
                      primary={ingredient.food.name}
                      secondary={`${ingredient.amount} ${ingredient.unit.name}`}
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
            <NutritionRow
              cal={previewNutrition.calories}
              prot={previewNutrition.macros.protein}
              carbs={previewNutrition.macros.carbs}
              fat={previewNutrition.macros.fat}
            />
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
            {recipe ? "Save Changes" : "Create Recipe"}
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
        buttonText={editingIndex !== null ? "Save" : "Add"}
        initialValue={
          editingIndex !== null && ingredients[editingIndex]
            ? ingredients[editingIndex]
            : undefined
        }
        onAdd={(foodItem: FoodItem) => {
          if (editingIndex !== null) {
            ingredientsFieldArray.update(editingIndex, foodItem);
            setEditingIndex(null);
          } else {
            ingredientsFieldArray.append(foodItem);
          }
          clearErrors("ingredients");
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
