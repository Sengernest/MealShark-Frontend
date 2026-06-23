import { useGetAllRecipes } from "@/hooks/recipes";
import { MealRecipePost } from "@/types";
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
  onAdd: (recipe: MealRecipePost) => void;
};

export function AddRecipeForm({ onAdd }: AddRecipeFormProps) {
  const [recipeSearch, setRecipeSearch] = useState("");
  const { data: recipes = [] } = useGetAllRecipes();

  const { register, handleSubmit, control } = useForm<MealRecipePost>();

  const onSubmit: SubmitHandler<MealRecipePost> = (data) => {
    onAdd(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: 2 }}>
        <FormControl size="small" fullWidth>
          <InputLabel>{"Recipe"}</InputLabel>
          <Controller
            control={control}
            name={"recipeId"}
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
                  <TextField {...params} label={"Recipe"} size="small" />
                )}
              />
            )}
          />
        </FormControl>
        <TextField
          label="Servings"
          {...register("servings", {
            required: "Servings is required",
            valueAsNumber: true,
            min: { value: 1, message: "Servings must be at least 1" },
            validate: (v) =>
              Number.isInteger(v) || "Servings must be an integer",
          })}
          type="number"
          size="small"
        />
      </Box>
    </form>
  );
}
