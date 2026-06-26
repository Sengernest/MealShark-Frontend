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
import DeleteIcon from "@mui/icons-material/Delete";
import { NutritionRow } from "./NutritionRow";
import { FoodSelector } from "@/components/common/FoodSelector";
import { AddIngredientDialog } from "./AddIngredientsDialog";

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

  const addIngredient = async () => {
    ingredientsFieldArray.append({
      foodId: null,
      unitId: null,
      amount: null,
    });
  };

  const removeIngredient = (i: number) => {
    ingredientsFieldArray.remove(i);
  };

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
          <Typography variant="h6">INGREDIENTS</Typography>
          <Button
            variant="outlined"
            onClick={() => setIngredientDialogOpen(true)}
          >
            Add
          </Button>
          <Stack gap={2}>
            {ingredientsFieldArray.fields.map((ingredient, index) => (
              <FoodSelector
                key={ingredient.id}
                control={control}
                register={register}
                errors={errors}
                foodName={`ingredients.${index}.foodId`}
                amountName={`ingredients.${index}.amount`}
                unitName={`ingredients.${index}.unitId`}
                foodRules={{
                  required: "Required",
                  validate: (foodId) => {
                    if (!foodId) return true;

                    const duplicates = ingredients.filter(
                      (ingredient) => ingredient.foodId === foodId,
                    );

                    return (
                      duplicates.length <= 1 ||
                      "This food has been added more than once"
                    );
                  },
                }}
                amountRules={{
                  required: "Required",
                  valueAsNumber: true,
                  validate: (v) => Number(v) > 0 || "Must be positive",
                }}
                unitRules={{
                  required: "Required",
                }}
                onRemove={() => removeIngredient(index)}
              />
            ))}
          </Stack>
          <Box sx={{ pt: 1 }}>
            <NutritionRow cal={900} prot={40} carbs={30} fat={30} />
          </Box>

          <Divider />
          <TextField
            label="Instructions"
            {...register("instructions", { maxLength: 2000 })}
            multiline
            rows={4}
            fullWidth
          />
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
        onClose={() => setIngredientDialogOpen(false)}
        onAdd={(food: FoodItemPost) => {
          ingredientsFieldArray.append({
            foodId: food.foodId,
            amount: food.amount,
            unitId: food.unitId,
          });

          setIngredientDialogOpen(false);
        }}
      />
    </Dialog>
  );
}
