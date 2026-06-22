import { useSearchFoods } from "@/hooks/foods";
import { useCreateRecipe } from "@/hooks/recipes";
import { zodResolver } from "@hookform/resolvers/zod";
import DeleteIcon from "@mui/icons-material/Delete";
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
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import type { Food, RecipePost, Unit } from "../../types";
import { NutritionRow, RECIPE_CATEGORIES } from "./Recipes";

const createRecipeSchema = z.object({
  name: z.string().min(1, "Recipe name is required"),
  description: z.string(),
  category: z.string(),
  instructions: z.string(),
  prepTime: z.preprocess(
    (v) => (v === "" || v == null ? null : Number(v)),
    z.number("Prep time must be a number").nonnegative("Prep time must be non-negative").nullable(),
  ),
  cookTime: z.preprocess(
    (v) => (v === "" || v == null ? null : Number(v)),
    z.number("Cook time must be a number").nonnegative("Cook time must be non-negative").nullable(),
  ),
  servings: z.int("Servings must be an integer")
    .positive("Servings must be at least 1"),
  currentIngredient: z.object({
    foodId: z.int("Ingredient food is required").positive(),
    unitId: z.int("Ingredient unit is required").positive(),
    amount: z.number().positive("Ingredient amount must be positive"),
  }),
});

type CreateRecipeFormData = z.infer<typeof createRecipeSchema>;

type Ingredient = {
  food: Food;
  unit: Unit;
  amount: number;
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
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    getValues,
    resetField,
    trigger,
  } = useForm({
    resolver: zodResolver(createRecipeSchema),
    defaultValues: {
      currentIngredient: {
        amount: 0,
        foodId: undefined,
        unitId: undefined,
      },
    },
  });

  const currentIngredient = watch("currentIngredient");
  // Food that is currently selected
  const currentFood = foods.find(
    (food) => food.id === currentIngredient.foodId,
  );
  const currentUnit = currentFood?.units.find(
    (foodUnit) => foodUnit.unitId === currentIngredient.unitId,
  )?.unit;

  const addIngredient = async () => {
    // Validate food, amount and unit fields before adding
    const valid = await trigger([
      "currentIngredient.foodId",
      "currentIngredient.amount",
      "currentIngredient.unitId",
    ]);
    if (!valid) return;

    // These values should never be null after the validation above
    if (!currentFood || !currentUnit) {
      return;
    }

    // Add to ingredients list
    setIngredients((prev) => [
      ...prev,
      {
        food: currentFood,
        unit: currentUnit,
        amount: currentIngredient.amount,
      },
    ]);

    // Clear current ingredient state
    resetField("currentIngredient");

    // Clear food search input
    setFoodSearch("");
  };

  const removeIngredient = (i: number) => {
    setIngredients((prev) => prev.filter((_, index) => index !== i));
  };

  const onSubmit: SubmitHandler<CreateRecipeFormData> = async (formData) => {
    const { currentIngredient, ...recipe } = formData;
    const payload: RecipePost = {
      ...recipe,
      ingredients: ingredients.map((ingredient) => ({
        foodId: ingredient.food.id,
        amount: ingredient.amount,
        unitId: ingredient.unit.id,
      })),
    };
    await createRecipe.mutateAsync(payload);
    onClose();
  };

  const ingredientErrors = [
    { message: errors.currentIngredient?.foodId?.message },
    { message: errors.currentIngredient?.amount?.message },
    { message: errors.currentIngredient?.unitId?.message },
  ];

  console.log(currentIngredient);

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
                field !== "currentIngredient" && (
                  <Alert key={i} severity="error">
                    {error.message}
                  </Alert>
                ),
            )}
          </Stack>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              {...register("name")}
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
              {...register("servings", {valueAsNumber: true})}
              type="number"
            />
            <TextField
              label="Prep Time (min)"
              {...register("prepTime")}
              type="number"
            />
            <TextField
              label="Cook Time (min)"
              {...register("cookTime")}
              type="number"
            />
          </Box>
          <Divider />
          <Typography variant="h6">INGREDIENTS</Typography>
          <Stack gap={1}>
            {ingredientErrors.map(
              (error, i) =>
                error.message && (
                  <Alert key={i} severity="error">
                    {error.message}
                  </Alert>
                ),
            )}
          </Stack>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 90px 80px auto",
              gap: 1.5,
              alignItems: "center",
            }}
          >
            <Controller
              name="currentIngredient.foodId"
              rules={{ required: "Ingredient food is required" }}
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={foods}
                  getOptionLabel={(food) => food.name}
                  value={foods.find((f) => f.id === field.value) ?? null}
                  onChange={(_, food) => field.onChange(food?.id ?? null)}
                  inputValue={foodSearch}
                  onInputChange={(_, value) => setFoodSearch(value)}
                  renderInput={(params) => (
                    <TextField {...params} label="Food" size="small" />
                  )}
                  filterOptions={(x) => x}
                />
              )}
            />
            <TextField
              label="Amount"
              {...register("currentIngredient.amount", { valueAsNumber: true })}
              type="number"
              size="small"
            />
            <FormControl size="small">
              <InputLabel id="unit-label">Unit</InputLabel>
              <Controller
                name="currentIngredient.unitId"
                rules={{ required: "Ingredient unit" }}
                control={control}
                disabled={!currentIngredient.foodId}
                render={({ field }) => (
                  <Select {...field} labelId="unit-label" label="Unit">
                    {currentFood?.units?.map((unit) => (
                      <MenuItem key={unit.unit.name} value={unit.unit.id}>
                        {unit.unit.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
            <Button
              variant="outlined"
              onClick={addIngredient}
              sx={{ height: 40 }}
            >
              Add
            </Button>
          </Box>

          {ingredients.length > 0 && (
            <List dense disablePadding>
              {ingredients.map((ingredient, i) => {
                return (
                  <ListItem
                    key={i}
                    disablePadding
                    secondaryAction={
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() => removeIngredient(i)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    }
                    sx={{
                      py: 0.5,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <ListItemText
                      primary={ingredient.food.name}
                      secondary={`${ingredient.amount} ${ingredient.unit.name}`}
                    />
                  </ListItem>
                );
              })}
            </List>
          )}
          <Box sx={{ pt: 1 }}>
            <NutritionRow cal={900} prot={40} carbs={30} fat={30} />
          </Box>

          <Divider />
          <TextField
            label="Instructions"
            {...register("instructions")}
            multiline
            rows={4}
            fullWidth
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={onClose} sx={{ color: "text.secondary" }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Create Recipe
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
