import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Tabs,
  Tab,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Alert,
  Stack,
  Autocomplete,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import DeleteIcon from "@mui/icons-material/Delete";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";
import { useApp } from "../AppContext";
import type {
  RecipeFood,
  Recipe,
  RecipePost,
  RecipeFoodPost,
  FoodUnit,
} from "../types";
import {
  useCreateRecipe,
  useGetAllRecipes,
  useGetMyRecipes,
  useGetSampleRecipes,
} from "@/hooks/recipes";
import { useSearchParams } from "react-router";
import { useGetFoods, useSearchFoods } from "@/hooks/foods";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";

const CATEGORIES = [
  "All",
  "High Protein",
  "Breakfast",
  "Carbs",
  "Low Carb",
  "Vegetarian",
];

function NutritionRow({
  cal,
  prot,
  carbs,
  fat,
}: {
  cal: number;
  prot: number;
  carbs: number;
  fat: number;
}) {
  return (
    <Box sx={{ display: "flex", gap: 2.5, mt: 1.5 }}>
      {[
        { label: "KCAL", value: cal, color: "#60c8f5" },
        { label: "PROTEIN", value: `${Math.round(prot)}g`, color: "#3df2a8" },
        { label: "CARB", value: `${Math.round(carbs)}g`, color: "#3db5f2" },
        { label: "FAT", value: `${Math.round(fat)}g`, color: "#f2c93d" },
      ].map(({ label, value, color }) => (
        <Box key={label} sx={{ textAlign: "center" }}>
          <Typography
            sx={{
              color,
              fontFamily: "'Barlow Condensed'",
              fontWeight: 800,
              fontSize: 17,
              lineHeight: 1,
            }}
          >
            {value}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontSize: 10,
              letterSpacing: "0.08em",
              color: "text.disabled",
            }}
          >
            {label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

function RecipeCard({
  recipe,
  onView,
}: {
  recipe: Recipe;
  onView: () => void;
}) {
  const toggleSaveRecipe = (recipeId: number) => {
    // TODO:
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.15s",
        "&:hover": { borderColor: "rgba(181,242,61,0.3)" },
      }}
    >
      <CardContent sx={{ flex: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1,
          }}
        >
          <Chip
            label={recipe.category ?? "No category"}
            size="small"
            variant="outlined"
            sx={{ fontSize: 11 }}
          />
          <Tooltip title={recipe.isSaved ? "Unsave" : "Save recipe"}>
            <IconButton
              size="small"
              onClick={() => toggleSaveRecipe(recipe.id)}
              sx={{ color: recipe.isSaved ? "primary.main" : "text.disabled" }}
            >
              {recipe.isSaved ? (
                <BookmarkIcon fontSize="small" />
              ) : (
                <BookmarkBorderIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Box>
        <Typography
          variant="h5"
          sx={{ fontSize: 18, mb: 0.5, lineHeight: 1.2 }}
        >
          {recipe.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontSize: 12,
            mb: 1.5,
            height: 36,
            overflow: "hidden",
          }}
        >
          {recipe.description}
        </Typography>
        <Box sx={{ display: "flex", gap: 2, color: "text.disabled" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <AccessTimeIcon sx={{ fontSize: 13 }} />
            <Typography variant="caption">
              {recipe.prepTime && recipe.cookTime
                ? recipe.prepTime + recipe.cookTime
                : "-"}
              m
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <PeopleIcon sx={{ fontSize: 13 }} />
            <Typography variant="caption">
              {recipe.servings ?? 1} serving(s)
            </Typography>
          </Box>
        </Box>
        <NutritionRow
          cal={recipe.nutrition.calories}
          prot={recipe.nutrition.macros.protein}
          carbs={recipe.nutrition.macros.carbs}
          fat={recipe.nutrition.macros.fat}
        />
      </CardContent>
      <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
        <Button size="small" variant="outlined" fullWidth onClick={onView}>
          View Recipe
        </Button>
      </CardActions>
    </Card>
  );
}

function RecipeDetailDialog({
  recipe,
  onClose,
}: {
  recipe: Recipe;
  onClose: () => void;
}) {
  const toggleSaveRecipe = (recipeId: number) => {
    // TODO:
  };
  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Chip
              label={recipe.category ?? "No category"}
              size="small"
              variant="outlined"
              sx={{ mb: 1 }}
            />
            <Typography variant="h4">{recipe.name}</Typography>
          </Box>
          <Tooltip title={recipe.isSaved ? "Unsave" : "Save"}>
            <IconButton
              onClick={() => toggleSaveRecipe(recipe.id)}
              sx={{ color: recipe.isSaved ? "primary.main" : "text.disabled" }}
            >
              {recipe.isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
          {recipe.description}
        </Typography>

        <Box sx={{ display: "flex", gap: 3, mb: 2.5 }}>
          <Box>
            <Typography variant="caption" sx={{ color: "text.disabled" }}>
              Prep
            </Typography>
            <Typography variant="body2">{recipe.prepTime} min</Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: "text.disabled" }}>
              Cook
            </Typography>
            <Typography variant="body2">{recipe.cookTime} min</Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: "text.disabled" }}>
              Servings
            </Typography>
            <Typography variant="body2">{recipe.servings ?? 1}</Typography>
          </Box>
        </Box>

        <NutritionRow
          cal={recipe.nutrition.calories}
          prot={recipe.nutrition.macros.protein}
          carbs={recipe.nutrition.macros.carbs}
          fat={recipe.nutrition.macros.fat}
        />
        <Divider sx={{ my: 2.5 }} />

        <Typography variant="h6" sx={{ mb: 1.5 }}>
          INGREDIENTS
        </Typography>
        <List dense disablePadding>
          {recipe.ingredients.map((ingredient, i) => (
            <ListItem
              key={i}
              disablePadding
              sx={{
                py: 0.75,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <ListItemText
                primary={ingredient.food.name}
                secondary={`${ingredient.amount} ${ingredient.unit}`}
                primaryTypographyProps={{
                  variant: "body2",
                  color: "text.primary",
                }}
                secondaryTypographyProps={{ variant: "caption" }}
              />
            </ListItem>
          ))}
        </List>

        {recipe.instructions && recipe.instructions.length > 0 && (
          <>
            <Divider sx={{ my: 2.5 }} />
            <Typography variant="h6" sx={{ mb: 1.5 }}>
              INSTRUCTIONS
            </Typography>
            {recipe.instructions.map((step, i) => (
              <Box key={i} sx={{ display: "flex", gap: 2, mb: 1.5 }}>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    mt: 0.25,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#0d0d0d",
                      fontSize: 12,
                      fontWeight: 800,
                      fontFamily: "'Barlow Condensed'",
                    }}
                  >
                    {i + 1}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", lineHeight: 1.6 }}
                >
                  {step}
                </Typography>
              </Box>
            ))}
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

type CreateRecipeFormData = RecipePost & {
  currentIngredient: RecipeFoodPost;
};

function CreateRecipeDialog({
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
    formState: { errors },
    control,
    getValues,
  } = useForm<CreateRecipeFormData>({
    defaultValues: {
      currentIngredient: {
        foodId: 0,
        amount: 0,
        unit: "g",
      },
    },
  });

  const ingredientsFieldArray = useFieldArray<CreateRecipeFormData>({
    control,
    name: "ingredients",
  });

  const addIngredient = () => {
    const currentIngredient = getValues("currentIngredient");
    ingredientsFieldArray.append(currentIngredient);
  };

  const removeIngredient = (i: number) => {
    ingredientsFieldArray.remove(i);
  };

  const onSubmit: SubmitHandler<CreateRecipeFormData> = async (data) => {
    await createRecipe.mutateAsync(data);
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
            {Object.entries(errors).map(([field, error], i) => (
              <Alert key={i} severity="error">
                {error.message}
              </Alert>
            ))}
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
                {CATEGORIES.slice(1).map((c) => (
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
              })}
              type="number"
            />
            <TextField
              label="Cook Time (min)"
              {...register("cookTime", {
                min: { value: 0, message: "Cook time cannot be negative" },
              })}
              type="number"
            />
          </Box>
          <Divider />
          <Typography variant="h6">INGREDIENTS</Typography>
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
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={foods}
                  getOptionLabel={(food) => food.name}
                  value={foods.find((f) => f.id === field.value) ?? null}
                  onChange={(_, food) => field.onChange(food?.id ?? 0)}
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
              {...register("currentIngredient.amount", {
                required: "Ingredient amount is required",
                valueAsNumber: true,
              })}
              type="number"
              size="small"
            />
            <TextField
              label="Unit"
              {...register("currentIngredient.unit", {
                required: "Ingredient unit is required",
              })}
              size="small"
            />
            <Button
              variant="outlined"
              onClick={addIngredient}
              sx={{ height: 40 }}
            >
              Add
            </Button>
          </Box>

          {ingredientsFieldArray.fields.length > 0 && (
            <List dense disablePadding>
              {ingredientsFieldArray.fields.map((ingredient, i) => (
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
                    primary={
                      foods.find((food) => food.id === ingredient.foodId)
                        ?.name ?? ""
                    }
                    secondary={`${ingredient.amount} ${ingredient.unit || ""}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
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
          <Button type="submit" variant="contained">
            Create Recipe
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export function Recipes() {
  const [urlSearchParams, setUrlSearchParams] = useSearchParams({ tab: "all" });
  const tab = urlSearchParams.get("tab");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [viewRecipe, setViewRecipe] = useState<Recipe | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const { data } =
    tab === "samples"
      ? useGetSampleRecipes()
      : tab === "me"
        ? useGetMyRecipes()
        : useGetAllRecipes();
  const recipes = data ?? [];

  return (
    <Box sx={{ p: { xs: 3, md: 4 }, maxWidth: 1200 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="overline" sx={{ color: "text.secondary" }}>
            FUEL LIBRARY
          </Typography>
          <Typography variant="h2" sx={{ lineHeight: 1, mt: 0.5 }}>
            RECIPES
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateOpen(true)}
        >
          Create Recipe
        </Button>
      </Box>

      <Tabs
        value={tab}
        onChange={(_, v) => setUrlSearchParams({ tab: v })}
        sx={{ mb: 2.5 }}
      >
        <Tab label={`All (${recipes.length})`} value={"all"} />
        <Tab label="Sample Recipes" value={"samples"} />
        <Tab label="My Recipes" value={"me"} />
        <Tab label="Saved" value={"saved"} />
      </Tabs>

      <Card sx={{ mb: 2.5 }}>
        <CardContent
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            py: "12px !important",
            alignItems: "center",
          }}
        >
          <TextField
            placeholder="Search recipes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 260 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.disabled", fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
          />
          <FormControl sx={{ minWidth: 160 }} size="small">
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="caption" sx={{ ml: "auto" }}>
            {recipes.length} recipes
          </Typography>
        </CardContent>
      </Card>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 2,
        }}
      >
        {recipes.map((r) => (
          <RecipeCard key={r.id} recipe={r} onView={() => setViewRecipe(r)} />
        ))}
        {recipes.length === 0 && (
          <Box sx={{ gridColumn: "1/-1", textAlign: "center", py: 8 }}>
            <Typography variant="body1" sx={{ color: "text.disabled" }}>
              No recipes found.
            </Typography>
          </Box>
        )}
      </Box>

      {viewRecipe && (
        <RecipeDetailDialog
          recipe={viewRecipe}
          onClose={() => setViewRecipe(null)}
        />
      )}
      {createOpen && (
        <CreateRecipeDialog open onClose={() => setCreateOpen(false)} />
      )}
    </Box>
  );
}
