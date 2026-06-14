import { useState } from "react";
import {
  Box, Typography, Card, CardContent, CardActions, Button, TextField,
  Chip, Dialog, DialogTitle, DialogContent, DialogActions, Select,
  MenuItem, FormControl, InputLabel, InputAdornment, Tabs, Tab,
  Divider, IconButton, List, ListItem, ListItemText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import { useApp } from "./AppContext";
import type { Meal, MealItem } from "./types";

function NutritionPills({ cal, prot, carbs, fat }: { cal: number; prot: number; carbs: number; fat: number }) {
  return (
    <Box sx={{ display: "flex", gap: 2, mt: 1.5 }}>
      {[
        { label: "KCAL", value: cal, color: "#60c8f5" },
        { label: "PRO", value: `${Math.round(prot)}g`, color: "#3df2a8" },
        { label: "CARB", value: `${Math.round(carbs)}g`, color: "#3db5f2" },
        { label: "FAT", value: `${Math.round(fat)}g`, color: "#f2c93d" },
      ].map(({ label, value, color }) => (
        <Box key={label} sx={{ textAlign: "center" }}>
          <Typography sx={{ color, fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 16, lineHeight: 1 }}>{value}</Typography>
          <Typography variant="caption" sx={{ fontSize: 10, color: "text.disabled" }}>{label}</Typography>
        </Box>
      ))}
    </Box>
  );
}

function MealDetailDialog({ meal, onClose }: { meal: Meal; onClose: () => void }) {
  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box>
          <Chip label={meal.isProvided ? "Provided" : "My Meal"} size="small" variant="outlined" sx={{ mb: 1 }} />
          <Typography variant="h4">{meal.name}</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <NutritionPills cal={meal.calories} prot={meal.protein} carbs={meal.carbs} fat={meal.fat} />
        <Divider sx={{ my: 2.5 }} />
        <Typography variant="h6" sx={{ mb: 1.5 }}>CONTENTS</Typography>
        <List dense disablePadding>
          {meal.items.map((item, i) => (
            <ListItem key={i} disablePadding sx={{ py: 1, borderBottom: "1px solid", borderColor: "divider" }}>
              <ListItemText
                primary={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      label={item.type.toUpperCase()}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: 10, height: 18, color: item.type === "recipe" ? "primary.main" : "#3db5f2", borderColor: item.type === "recipe" ? "primary.main" : "#3db5f2" }}
                    />
                    <Typography variant="body2" sx={{ color: "text.primary" }}>
                      {item.type === "recipe" ? item.recipe?.name : item.food?.name}
                    </Typography>
                  </Box>
                }
                secondary={`${item.amount} ${item.unit} — ${item.type === "recipe" ? item.recipe?.calories : Math.round(((item.food?.caloriesPer100g ?? 0) * item.amount) / 100)} kcal`}
                secondaryTypographyProps={{ variant: "caption" }}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

function CreateMealDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { recipes, foods, addMeal } = useApp();
  const [name, setName] = useState("");
  const [items, setItems] = useState<MealItem[]>([]);
  const [addType, setAddType] = useState<"recipe" | "food">("recipe");
  const [selId, setSelId] = useState(recipes[0]?.id ?? "");
  const [amount, setAmount] = useState("1");
  const [unit, setUnit] = useState("serving");

  const addItem = () => {
    if (addType === "recipe") {
      const recipe = recipes.find((r) => r.id === selId);
      if (!recipe) return;
      setItems((prev) => [...prev, { id: `mi_${Date.now()}`, type: "recipe", recipe, amount: +amount, unit }]);
    } else {
      const food = foods.find((f) => f.id === selId);
      if (!food) return;
      setItems((prev) => [...prev, { id: `mi_${Date.now()}`, type: "food", food, amount: +amount, unit }]);
    }
  };

  let totCal = 0, totProt = 0, totCarbs = 0, totFat = 0;
  items.forEach((item) => {
    if (item.type === "recipe" && item.recipe) {
      totCal += item.recipe.calories * item.amount;
      totProt += item.recipe.protein * item.amount;
      totCarbs += item.recipe.carbs * item.amount;
      totFat += item.recipe.fat * item.amount;
    } else if (item.type === "food" && item.food) {
      const g = item.unit === "tbsp" ? item.amount * 15 : item.amount;
      totCal += (item.food.caloriesPer100g * g) / 100;
      totProt += (item.food.proteinPer100g * g) / 100;
      totCarbs += (item.food.carbsPer100g * g) / 100;
      totFat += (item.food.fatPer100g * g) / 100;
    }
  });

  const handleCreate = () => {
    if (!name || items.length === 0) return;
    const meal: Meal = {
      id: `m_${Date.now()}`,
      name,
      items,
      calories: Math.round(totCal),
      protein: Math.round(totProt * 10) / 10,
      carbs: Math.round(totCarbs * 10) / 10,
      fat: Math.round(totFat * 10) / 10,
      isProvided: false,
      createdBy: "user",
    };
    addMeal(meal);
    onClose();
  };

  const options = addType === "recipe" ? recipes : foods;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle><Typography variant="h5">CREATE MEAL</Typography></DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
        <TextField label="Meal Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
        <Divider />
        <Typography variant="h6">ADD ITEMS</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          {(["recipe", "food"] as const).map((t) => (
            <Button
              key={t}
              variant={addType === t ? "contained" : "outlined"}
              size="small"
              onClick={() => { setAddType(t); setSelId(t === "recipe" ? recipes[0]?.id : foods[0]?.id); setUnit(t === "recipe" ? "serving" : "g"); }}
              sx={{ color: addType === t ? "#0d0d0d" : "text.secondary", borderColor: "divider" }}
            >
              {t === "recipe" ? "Recipe" : "Food"}
            </Button>
          ))}
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 80px 70px auto", gap: 1.5, alignItems: "center" }}>
          <FormControl size="small">
            <InputLabel>{addType === "recipe" ? "Recipe" : "Food"}</InputLabel>
            <Select value={selId} label={addType === "recipe" ? "Recipe" : "Food"} onChange={(e) => setSelId(e.target.value)}>
              {options.map((o) => <MenuItem key={o.id} value={o.id}>{o.name}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label="Qty" value={amount} onChange={(e) => setAmount(e.target.value)} type="number" size="small" />
          <TextField label="Unit" value={unit} onChange={(e) => setUnit(e.target.value)} size="small" />
          <Button variant="outlined" onClick={addItem} sx={{ height: 40 }}>Add</Button>
        </Box>

        {items.length > 0 && (
          <>
            <List dense disablePadding>
              {items.map((item, i) => (
                <ListItem
                  key={i}
                  disablePadding
                  secondaryAction={<IconButton edge="end" size="small" onClick={() => setItems((p) => p.filter((_, j) => j !== i))}><DeleteIcon fontSize="small" /></IconButton>}
                  sx={{ py: 0.5, borderBottom: "1px solid", borderColor: "divider" }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Chip label={item.type.toUpperCase()} size="small" sx={{ height: 18, fontSize: 10 }} />
                        <Typography variant="body2">{item.type === "recipe" ? item.recipe?.name : item.food?.name}</Typography>
                      </Box>
                    }
                    secondary={`${item.amount} ${item.unit}`}
                    secondaryTypographyProps={{ variant: "caption" }}
                  />
                </ListItem>
              ))}
            </List>
            <NutritionPills cal={Math.round(totCal)} prot={totProt} carbs={totCarbs} fat={totFat} />
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} sx={{ color: "text.secondary" }}>Cancel</Button>
        <Button variant="contained" onClick={handleCreate} disabled={!name || items.length === 0}>Create Meal</Button>
      </DialogActions>
    </Dialog>
  );
}

function MealCard({ meal, onView }: { meal: Meal; onView: () => void }) {
  return (
    <Card sx={{ display: "flex", flexDirection: "column", transition: "border-color 0.15s", "&:hover": { borderColor: "rgba(181,242,61,0.3)" } }}>
      <CardContent sx={{ flex: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
          <Chip label={meal.isProvided ? "Provided" : "My Meal"} size="small" variant="outlined" sx={{ fontSize: 11 }} />
        </Box>
        <Typography variant="h5" sx={{ fontSize: 17, mb: 0.5, lineHeight: 1.2 }}>{meal.name}</Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {meal.items.length} item{meal.items.length !== 1 ? "s" : ""}
        </Typography>
        <NutritionPills cal={meal.calories} prot={meal.protein} carbs={meal.carbs} fat={meal.fat} />
      </CardContent>
      <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
        <Button size="small" variant="outlined" fullWidth onClick={onView}>View Meal</Button>
      </CardActions>
    </Card>
  );
}

export function Meals() {
  const { meals } = useApp();
  const [tabVal, setTabVal] = useState(0);
  const [search, setSearch] = useState("");
  const [viewMeal, setViewMeal] = useState<Meal | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = meals.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchTab = tabVal === 0 || (tabVal === 1 && m.createdBy === "user") || (tabVal === 2 && m.isProvided);
    return matchSearch && matchTab;
  });

  return (
    <Box sx={{ p: { xs: 3, md: 4 }, maxWidth: 1200 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 4 }}>
        <Box>
          <Typography variant="overline" sx={{ color: "text.secondary" }}>COMBINATIONS</Typography>
          <Typography variant="h2" sx={{ lineHeight: 1, mt: 0.5 }}>MEALS</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
          Create Meal
        </Button>
      </Box>

      <Tabs value={tabVal} onChange={(_, v) => setTabVal(v)} sx={{ mb: 2.5 }}>
        <Tab label={`All (${meals.length})`} />
        <Tab label="My Meals" />
        <Tab label="Provided" />
      </Tabs>

      <Card sx={{ mb: 2.5 }}>
        <CardContent sx={{ py: "12px !important" }}>
          <TextField
            placeholder="Search meals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 260 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "text.disabled", fontSize: 18 }} /></InputAdornment>,
            }}
          />
        </CardContent>
      </Card>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 2 }}>
        {filtered.map((m) => <MealCard key={m.id} meal={m} onView={() => setViewMeal(m)} />)}
        {filtered.length === 0 && (
          <Box sx={{ gridColumn: "1/-1", textAlign: "center", py: 8 }}>
            <Typography variant="body1" sx={{ color: "text.disabled" }}>No meals found.</Typography>
          </Box>
        )}
      </Box>

      {viewMeal && <MealDetailDialog meal={viewMeal} onClose={() => setViewMeal(null)} />}
      {createOpen && <CreateMealDialog open onClose={() => setCreateOpen(false)} />}
    </Box>
  );
}
