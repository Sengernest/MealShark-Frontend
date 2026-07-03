import {
  useDeleteRecipe,
  useGetAllRecipes,
  useGetMyRecipes,
  useGetSampleRecipes,
  useGetSavedRecipes,
} from "@/hooks/recipes";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useSearchParams } from "react-router";
import type { Recipe } from "../../types";
import { CreateRecipeDialog } from "./CreateRecipeDialog";
import { RecipeCard } from "./RecipeCard";
import { RecipeDetailDialog } from "./RecipeDetailDialog";
import { SearchBar } from "@/components/common/SearchBar";
import { toast } from "react-toastify";

export const RECIPE_CATEGORIES = [
  "All",
  "High Protein",
  "Breakfast",
  "Carbs",
  "Low Carb",
  "Vegetarian",
];

export function Recipes() {
  const [urlSearchParams, setUrlSearchParams] = useSearchParams({ tab: "all" });
  const tab = urlSearchParams.get("tab");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [createOpen, setCreateOpen] = useState(false);

  const { data: recipes = [] } =
    tab === "samples"
      ? useGetSampleRecipes()
      : tab === "me"
        ? useGetMyRecipes()
        : tab === "saved"
          ? useGetSavedRecipes()
          : useGetAllRecipes();

  const deleteRecipe = useDeleteRecipe();

  const filteredRecipes = recipes.filter((r) => {
    const matchesCategory = category === "All" || r.category === category;
    const matchesSearch =
      search.trim() === "" ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const [viewRecipeId, setViewRecipeId] = useState<number | null>(null);
  const viewRecipe = filteredRecipes.find(
    (recipe) => recipe.id === viewRecipeId,
  )!;

  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

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
          onClick={() => {
            setEditingRecipe(null);
            setCreateOpen(true);
          }}
        >
          Create Recipe
        </Button>
      </Box>

      <Tabs
        value={tab}
        onChange={(_, v) => setUrlSearchParams({ tab: v })}
        sx={{ mb: 2.5 }}
      >
        <Tab label={"All"} value={"all"} />
        <Tab label="Saved" value={"saved"} />
        <Tab label="My Recipes" value={"me"} />
        <Tab label="Sample Recipes" value={"samples"} />
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
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search recipes..."
          />
          <FormControl sx={{ minWidth: 160 }} size="small">
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              {RECIPE_CATEGORIES.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="caption" sx={{ ml: "auto" }}>
            {filteredRecipes.length} recipes
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
        {filteredRecipes.map((r) => (
          <RecipeCard
            key={r.id}
            recipe={r}
            onView={() => setViewRecipeId(r.id)}
            onEdit={(recipe) => {
              setEditingRecipe(recipe);
              setCreateOpen(true);
            }}
          />
        ))}

        {filteredRecipes.length === 0 && (
          <Box sx={{ gridColumn: "1/-1", textAlign: "center", py: 8 }}>
            <Typography variant="body1" sx={{ color: "text.disabled" }}>
              No recipes found.
            </Typography>
          </Box>
        )}
      </Box>

      {viewRecipeId && (
        <RecipeDetailDialog
          recipe={viewRecipe}
          onClose={() => setViewRecipeId(null)}
          onEdit={(recipe) => {
            setEditingRecipe(recipe);
            setViewRecipeId(null);
            setCreateOpen(true);
          }}
          onDelete={(id) => {
            deleteRecipe.mutate(id, {
              onSuccess: () => {
                toast.success("Recipe deleted successfully!");
              },
            });
          }}
        />
      )}

      {createOpen && (
        <CreateRecipeDialog
          open
          recipe={editingRecipe}
          onClose={() => {
            setCreateOpen(false);
            setEditingRecipe(null);
          }}
        />
      )}
    </Box>
  );
}
