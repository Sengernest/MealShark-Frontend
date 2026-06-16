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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import DeleteIcon from "@mui/icons-material/Delete";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";
import { useApp } from "../AppContext";
import type { RecipeFood, Recipe, RecipePost } from "../types";
import { useGetRecipes } from "@/hooks/recipes";

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
        { label: "PRO", value: `${Math.round(prot)}g`, color: "#3df2a8" },
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
  }

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
            label={recipe.category}
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
              {recipe.servings ?? 1} serving
              {(recipe.servings ?? 1) > 1 ? "s" : ""}
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
  }
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
              label={recipe.category}
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
            <Typography variant="body2">{recipe.servings}</Typography>
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

function CreateRecipeDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { foods, addRecipe } = useApp();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("High Protein");
  const [prepTime, setPrepTime] = useState("10");
  const [cookTime, setCookTime] = useState("20");
  const [servings, setServings] = useState("1");
  const [instructions, setInstructions] = useState("");
  const [ingredients, setIngredients] = useState<RecipeFood[]>([]);
  const [selFood, setSelFood] = useState(foods[0]?.id ?? "");
  const [amount, setAmount] = useState("100");
  const [unit, setUnit] = useState("g");

  const addIngredient = () => {
    const food = foods.find((f) => f.id === selFood);
    if (!food) return;
    setIngredients((prev) => [...prev, { food, amount: +amount, unit }]);
  };

  const removeIngredient = (i: number) =>
    setIngredients((prev) => prev.filter((_, j) => j !== i));

  let totCal = 0,
    totProt = 0,
    totCarbs = 0,
    totFat = 0;
  ingredients.forEach((ing) => {
    const g = ing.unit === "tbsp" ? ing.amount * 15 : ing.amount;
    totCal += (ing.food.caloriesPer100g * g) / 100;
    totProt += (ing.food.proteinPer100g * g) / 100;
    totCarbs += (ing.food.carbsPer100g * g) / 100;
    totFat += (ing.food.fatPer100g * g) / 100;
  });

  const handleCreate = () => {
    if (!name || ingredients.length === 0) return;
    const recipe: RecipePost = {
      name,
      description,
      category,
      prepTime: +prepTime,
      cookTime: +cookTime,
      servings: +servings,
      ingredients,
      instructions: instructions.split("\n").filter(Boolean),
      calories: Math.round(totCal),
      protein: Math.round(totProt * 10) / 10,
      carbs: Math.round(totCarbs * 10) / 10,
      fat: Math.round(totFat * 10) / 10,
      isProvided: false,
      isSaved: false,
      createdBy: "user",
    };
    addRecipe(recipe);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5">CREATE RECIPE</Typography>
      </DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
      >
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <TextField
            label="Recipe Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            sx={{ gridColumn: "1/-1" }}
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={2}
            fullWidth
            sx={{ gridColumn: "1/-1" }}
          />
          <FormControl size="small">
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.slice(1).map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Servings"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            type="number"
          />
          <TextField
            label="Prep Time (min)"
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
            type="number"
          />
          <TextField
            label="Cook Time (min)"
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value)}
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
          <FormControl size="small">
            <InputLabel>Food</InputLabel>
            <Select
              value={selFood}
              label="Food"
              onChange={(e) => setSelFood(e.target.value)}
            >
              {foods.map((f) => (
                <MenuItem key={f.id} value={f.id}>
                  {f.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            size="small"
          />
          <TextField
            label="Unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
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

        {ingredients.length > 0 && (
          <List dense disablePadding>
            {ingredients.map((ing, i) => (
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
                  primary={ing.food.name}
                  secondary={`${ing.amount} ${ing.unit}`}
                  primaryTypographyProps={{
                    variant: "body2",
                    color: "text.primary",
                  }}
                  secondaryTypographyProps={{ variant: "caption" }}
                />
              </ListItem>
            ))}
            <Box sx={{ pt: 1 }}>
              <NutritionRow
                cal={Math.round(totCal)}
                prot={totProt}
                carbs={totCarbs}
                fat={totFat}
              />
            </Box>
          </List>
        )}

        <Divider />
        <TextField
          label="Instructions (one step per line)"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          multiline
          rows={4}
          fullWidth
          placeholder={
            "Season chicken with salt and pepper.\nHeat oil in a pan over medium heat.\nCook 6 minutes per side."
          }
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} sx={{ color: "text.secondary" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleCreate}
          disabled={!name || ingredients.length === 0}
        >
          Create Recipe
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function Recipes() {
  const [tabVal, setTabVal] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [viewRecipe, setViewRecipe] = useState<Recipe | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const { data } = useGetRecipes();
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

      <Tabs value={tabVal} onChange={(_, v) => setTabVal(v)} sx={{ mb: 2.5 }}>
        <Tab label={`All (${recipes.length})`} />
        <Tab label="My Recipes" />
        <Tab label="Saved" />
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
