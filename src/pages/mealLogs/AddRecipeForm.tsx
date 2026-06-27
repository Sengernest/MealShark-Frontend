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

type AddRecipeFormProps = {
  onAdd: (recipe: RecipeItem) => void;
};

export function AddRecipeForm({ onAdd }: AddRecipeFormProps) {
  const [recipeSearch, setRecipeSearch] = useState("");
  const { data: recipes = [] } = useGetAllRecipes();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RecipeItem>();

  const onSubmit: SubmitHandler<RecipeItem> = (data) => {
    onAdd(data);
  };

  return (
    <form id="recipe-form" onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: 2 }}>
        <FormControl size="small" fullWidth>
          <Controller
            control={control}
            name={"recipe.id"}
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
                    error={!!errors.recipe?.id}
                    helperText={errors.recipe?.id?.message}
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
