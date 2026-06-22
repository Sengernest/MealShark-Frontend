import { useSearchFoods } from "@/hooks/foods";
import { useCreateRecipe } from "@/hooks/recipes";
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
import { useState } from "react";
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
import type { Food, RecipePost, Unit } from "../../types";
import { NutritionRow, RECIPE_CATEGORIES } from "./Recipes";
import DeleteIcon from "@mui/icons-material/Delete";

type CreateRecipeFormData = {
  name: string;
  description: string | null;
  category: string | null;
  instructions: string | null;
  prepTime: number | null;
  cookTime: number | null;
  servings: number;
  ingredients: {
    food: Food | null;
    unitId: number | null;
    amount: number | null;
  }[];
};

export function CreateRecipeDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [foodSearch, setFoodSearch] = useState("");
  const { data } = useSearchFoods(foodSearch, 20);
  const foods = data ?? [];
  const createRecipe = useCreateRecipe();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    watch,
  } = useForm<CreateRecipeFormData>();

  const ingredientsFieldArray = useFieldArray({ control, name: "ingredients" });

  const addIngredient = async () => {
    ingredientsFieldArray.append({
      food: null,
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
        foodId: ingredient.food!.id,
        amount: ingredient.amount!,
        unitId: ingredient.unitId!,
      })),
    };
    await createRecipe.mutateAsync(payload);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          <Typography variant="h5">CREATE RECIPE</Typography>
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
            <FormControl size="small">
              <InputLabel>Category</InputLabel>
              <Select {...register("category")} label="Category">
                {RECIPE_CATEGORIES.slice(1).map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
            onClick={addIngredient}
            sx={{ height: 40 }}
          >
            Add
          </Button>
          <Stack gap={2}>
            {ingredientsFieldArray.fields.map((ingredient, index) => (
              <IngredientRow
                key={ingredient.id}
                index={index}
                control={control}
                register={register}
                errors={errors}
                onRemove={removeIngredient}
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
            Create Recipe
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

type IngredientRowProps = {
  index: number;
  control: Control<CreateRecipeFormData>;
  register: UseFormRegister<CreateRecipeFormData>;
  errors: FieldErrors<CreateRecipeFormData>;
  onRemove: (index: number) => void;
};

export function IngredientRow({
  index,
  control,
  register,
  errors,
  onRemove,
}: IngredientRowProps) {
  const [foodSearch, setFoodSearch] = useState("");

  const { data } = useSearchFoods(foodSearch, 20);
  const foods = data ?? [];

  const selectedFood = useWatch({
    control,
    name: `ingredients.${index}.food`,
  });

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 90px 80px auto",
        gap: 1.5,
        alignItems: "start",
      }}
    >
      <Controller
        name={`ingredients.${index}.food`}
        control={control}
        rules={{ required: "Required" }}
        render={({ field }) => (
          <Autocomplete
            options={foods}
            value={field.value}
            onChange={(_, food) => field.onChange(food)}
            inputValue={foodSearch}
            onInputChange={(_, value) => setFoodSearch(value)}
            getOptionLabel={(food) => food.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            filterOptions={(x) => x}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Food"
                size="small"
                error={!!errors.ingredients?.[index]?.food}
                helperText={errors.ingredients?.[index]?.food?.message}
              />
            )}
          />
        )}
      />

      <TextField
        label="Amount"
        size="small"
        type="number"
        {...register(`ingredients.${index}.amount`, {
          required: "Required",
          valueAsNumber: true,
          validate: (v) => (v && v > 0) || "Must be positive",
        })}
        error={!!errors.ingredients?.[index]?.amount}
        helperText={errors.ingredients?.[index]?.amount?.message}
      />

      <FormControl size="small" error={!!errors.ingredients?.[index]?.unitId}>
        <InputLabel>Unit</InputLabel>

        <Controller
          name={`ingredients.${index}.unitId`}
          control={control}
          rules={{ required: "Required" }}
          render={({ field }) => (
            <Select {...field} label="Unit">
              {selectedFood?.units?.map((unit) => (
                <MenuItem key={unit.unit.id} value={unit.unit.id}>
                  {unit.unit.name}
                </MenuItem>
              ))}
            </Select>
          )}
        />

        <FormHelperText>
          {errors.ingredients?.[index]?.unitId?.message}
        </FormHelperText>
      </FormControl>

      <IconButton edge="end" size="small" onClick={() => onRemove(index)}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}
