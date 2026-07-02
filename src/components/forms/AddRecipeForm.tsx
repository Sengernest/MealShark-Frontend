import { useGetAllRecipes } from "@/hooks/recipes";
import { RecipeItem } from "@/types";
import {
  Autocomplete,
  Box,
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

type AddRecipeFormData = {
  recipeId: number;
  servings: number;
};

type AddRecipeFormProps = {
  onAdd: (recipe: RecipeItem) => void | Promise<void>;
  setSubmitState?: (state: boolean) => void;
};

export function AddRecipeForm({ onAdd, setSubmitState }: AddRecipeFormProps) {
  const [recipeSearch, setRecipeSearch] = useState("");
  const { data: recipes = [] } = useGetAllRecipes();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AddRecipeFormData>();

  const onSubmit: SubmitHandler<AddRecipeFormData> = async (data) => {
    const recipe = recipes.find((recipe) => recipe.id === data.recipeId)!;
    await onAdd({ recipe, servings: data.servings });
  };

  useEffect(() => {
    setSubmitState?.(isSubmitting);
  }, [isSubmitting, setSubmitState]);

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
                options={recipes}
                value={recipes.find((r) => r.id === field.value) ?? null}
                getOptionLabel={(recipe) => recipe.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(_, value) => field.onChange(value?.id)}
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
