import { useGetAllRecipes } from "@/hooks/recipes";
import { RecipeItem } from "@/types";
import {
  Autocomplete,
  Box,
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

type AddRecipeFormData = {
  recipeId: number;
  servings: number;
};

type AddRecipeFormProps = {
  onAdd: (recipe: RecipeItem) => void;
  onEdit: (recipe: RecipeItem) => void
  initialRecipe?: RecipeItem;
};

export function AddRecipeForm({ onAdd, onEdit, initialRecipe }: AddRecipeFormProps) {
  const [recipeSearch, setRecipeSearch] = useState("");
  const { data: recipes = [] } = useGetAllRecipes();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AddRecipeFormData>({
    defaultValues: {
      recipeId: initialRecipe?.recipe.id,
      servings: initialRecipe?.servings,
    },
  });

  const onSubmit: SubmitHandler<AddRecipeFormData> = (data) => {
    const recipe = recipes.find((recipe) => recipe.id === data.recipeId)!;
    if (initialRecipe) {
      onAdd({ recipe, servings: data.servings });
    } else {
      onAdd({ recipe, servings: data.servings });
    }
  };

  return (
    <form id="recipe-form" onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: 2 }}>
        <FormControl size="small" fullWidth>
          <Controller
            control={control}
            name={"recipeId"}
            rules={{ required: "Required" }}
            render={({ field }) => (
              <Autocomplete
                options={recipes.map((recipe) => recipe.id)}
                value={field.value}
                getOptionLabel={(value) =>
                  recipes.find((recipe) => recipe.id === value)?.name ?? ""
                }
                onChange={(_, value) => field.onChange(value)}
                inputValue={recipeSearch}
                onInputChange={(_, value) => setRecipeSearch(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={"Recipe"}
                    size="small"
                    error={!!errors.recipeId}
                    helperText={errors.recipeId?.message}
                  />
                )}
              />
            )}
          />
        </FormControl>
        <TextField
          label="Servings"
          {...register("servings", {
            required: "Required",
            valueAsNumber: true,
            min: { value: 1, message: "Servings must be at least 1" },
            validate: (v) =>
              Number.isInteger(v) || "Servings must be an integer",
          })}
          type="number"
          size="small"
          error={!!errors.servings}
          helperText={errors.servings?.message}
        />
      </Box>
    </form>
  );
}
