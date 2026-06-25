import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
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
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import type { MealPost } from "../../types";
import { useCreateMealPlan } from "@/hooks/mealPlans";

function SlotView({ slot }: { slot: MealSlot }) {
  const mealCalories = slot.nutrition.calories;
  return (
    <Box sx={{ py: 1, borderBottom: "1px solid", borderColor: "divider" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 0.5,
        }}
      >
        <Typography
          variant="overline"
          sx={{ fontSize: 10, color: "text.disabled" }}
        >
          {slot.label}
        </Typography>
        {mealCalories > 0 && (
          <Typography
            sx={{
              color: "primary.main",
              fontFamily: "'Barlow Condensed'",
              fontWeight: 800,
              fontSize: 13,
            }}
          >
            {mealCalories} kcal
          </Typography>
        )}
      </Box>
      {slot.items.length === 0 ? (
        <Typography
          variant="body2"
          sx={{ color: "text.disabled", fontSize: 12 }}
        >
          Empty slot
        </Typography>
      ) : (
        slot.items.map((item) => (
          <Box
            key={item.id}
            sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.25 }}
          >
            <Chip
              label={item.type.toUpperCase()}
              size="small"
              variant="outlined"
              sx={{
                height: 16,
                fontSize: 9,
                color: item.type === "recipe" ? "primary.main" : "#3db5f2",
                borderColor:
                  item.type === "recipe" ? "primary.main" : "#3db5f2",
              }}
            />
            <Typography
              variant="body2"
              sx={{ fontSize: 13, color: "text.primary" }}
            >
              {item.type === "recipe" ? item.recipe?.name : item.food?.name}
              {item.amount !== 1 && (
                <Box component="span" sx={{ color: "text.disabled" }}>
                  {" "}
                  ×{item.amount}
                </Box>
              )}
            </Typography>
          </Box>
        ))
      )}
    </Box>
  );
}

export function CreatePlanDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const createMealPlan = useCreateMealPlan();
  const [name, setName] = useState("");
  const [meals, setMeals] = useState<MealPlanMealPost[]>([
    { mealPlanIndex: 0, recipeItems: [], foodItems: [] },
  ]);
  const [description, setDescription] = useState("");
  const [targetCalories, setTargetCalories] = useState(0);

  const addMeal = () => {
    setMeals((prev) => [
      ...prev,
      { mealPlanIndex: prev.length, recipeItems: [], foodItems: [] },
    ]);
  };
  const addRecipeToMeal = (mealIndex: number) => {
    setMeals((prev) =>
      prev.map((m, i) =>
        i === mealIndex
          ? {
              ...m,
              recipeItems: [
                ...m.recipeItems,
                {
                  recipeId: recipes[0].id,
                  servings: 1,
                },
              ],
            }
          : m,
      ),
    );
  };
  /* For adding items to a slot
  const [addingToSlot, setAddingToSlot] = useState<string | null>(null);
  const [addType, setAddType] = useState<"recipe" | "food">("recipe");
  const [selId, setSelId] = useState(recipes[0]?.id ?? "");
  const [amount, setAmount] = useState("1");
  const [unit, setUnit] = useState("serving");

  const addSlot = () => {
    setDays((prev) =>
      prev.map((d) =>
        d.day === editDay
          ? {
              ...d,
              slots: [
                ...d.slots,
                {
                  id: `s_${d.day}_${d.slots.length + 1}`,
                  label: `Meal ${d.slots.length + 1}`,
                  items: [],
                },
              ],
            }
          : d,
      ),
    );
  };

  const removeSlot = (slotId: string) => {
    setDays((prev) =>
      prev.map((d) =>
        d.day === editDay
          ? { ...d, slots: d.slots.filter((s) => s.id !== slotId) }
          : d,
      ),
    );
  }; 

  const confirmAddItem = (slotId: string) => {
    const item: MealItem =
      addType === "recipe"
        ? {
            id: `mi_${Date.now()}`,
            type: "recipe",
            recipe: recipes.find((r) => r.id === selId),
            amount: +amount,
            unit,
          }
        : {
            id: `mi_${Date.now()}`,
            type: "food",
            food: foods.find((f) => f.id === selId),
            amount: +amount,
            unit,
          };
    setDays((prev) =>
      prev.map((d) =>
        d.day === editDay
          ? {
              ...d,
              slots: d.slots.map((s) =>
                s.id === slotId ? { ...s, items: [...s.items, item] } : s,
              ),
            }
          : d,
      ),
    );
    setAddingToSlot(null);
    setAmount("1");
  };

  const removeItem = (slotId: string, itemId: string) => {
    setDays((prev) =>
      prev.map((d) =>
        d.day === editDay
          ? {
              ...d,
              slots: d.slots.map((s) =>
                s.id === slotId
                  ? { ...s, items: s.items.filter((i) => i.id !== itemId) }
                  : s,
              ),
            }
          : d,
      ),
    );
  }; */

  const handleCreate = async () => {
    if (!name) return;

    const payload = {
      name,
      description,
      targetCalories,
      meals,
    };

    createMealPlan.mutate(payload, {
      onSuccess: () => onClose(),
    });
  };

  //const options = addType === "recipe" ? recipes : food;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5">CREATE MEAL PLAN</Typography>
      </DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
      >
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <TextField
            label="Plan Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            sx={{ gridColumn: "1/-1" }}
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            sx={{ gridColumn: "1/-1" }}
          />
          {/* <TextField label="Daily Calorie Target" value={targetCal} onChange={(e) => setTargetCal(e.target.value)} type="number" /> */}
        </Box>

        <Divider />
        <Typography variant="h6">PLAN MEALS</Typography>

        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1.5,
            }}
          >
            <Button size="small" startIcon={<AddIcon />} onClick={addSlot}>
              Add Meal
            </Button>
          </Box>

          <Card
            key={slot.id}
            variant="outlined"
            sx={{ mb: 1.5, bgcolor: "transparent" }}
          >
            <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography
                  variant="overline"
                  sx={{ fontSize: 11, color: "text.secondary" }}
                >
                  {slot.label}
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setAddingToSlot(slot.id);
                      setAddType("recipe");
                      setSelId(recipes[0]?.id);
                      setUnit("serving");
                    }}
                  >
                    Add
                  </Button>
                  <IconButton size="small" onClick={() => removeSlot(slot.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              {slot.items.length === 0 ? (
                <Typography variant="caption" sx={{ color: "text.disabled" }}>
                  No items yet
                </Typography>
              ) : (
                <List dense disablePadding>
                  {slot.items.map((item) => (
                    <ListItem
                      key={item.id}
                      disablePadding
                      secondaryAction={
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={() => removeItem(slot.id, item.id)}
                        >
                          <DeleteIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      }
                      sx={{ py: 0.25 }}
                    >
                      <ListItemText
                        primary={
                          item.type === "recipe"
                            ? item.recipe?.name
                            : item.food?.name
                        }
                        secondary={`${item.amount} ${item.unit}`}
                        primaryTypographyProps={{
                          variant: "body2",
                          color: "text.primary",
                          fontSize: 13,
                        }}
                        secondaryTypographyProps={{ variant: "caption" }}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
              {/* Inline add item form */}
              {addingToSlot === slot.id && (
                <Box
                  sx={{
                    mt: 1.5,
                    pt: 1.5,
                    borderTop: "1px solid",
                    borderColor: "divider",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {(["recipe", "food"] as const).map((t) => (
                      <Button
                        key={t}
                        variant={addType === t ? "contained" : "outlined"}
                        size="small"
                        onClick={() => {
                          setAddType(t);
                          setSelId(
                            t === "recipe" ? recipes[0]?.id : foods[0]?.id,
                          );
                          setUnit(t === "recipe" ? "serving" : "g");
                        }}
                        sx={{
                          color: addType === t ? "#0d0d0d" : "text.secondary",
                          borderColor: "divider",
                        }}
                      >
                        {t}
                      </Button>
                    ))}
                  </Box>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 80px 70px auto auto",
                      gap: 1,
                      alignItems: "center",
                    }}
                  >
                    <FormControl size="small">
                      <InputLabel>
                        {addType === "recipe" ? "Recipe" : "Food"}
                      </InputLabel>
                      <Select
                        value={selId}
                        label={addType === "recipe" ? "Recipe" : "Food"}
                        onChange={(e) => setSelId(e.target.value)}
                      >
                        {options.map((o) => (
                          <MenuItem key={o.id} value={o.id}>
                            {o.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      label="Qty"
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
                      variant="contained"
                      size="small"
                      onClick={() => confirmAddItem(slot.id)}
                      sx={{ height: 40 }}
                    >
                      Add
                    </Button>
                    <Button
                      size="small"
                      onClick={() => setAddingToSlot(null)}
                      sx={{ height: 40, color: "text.secondary" }}
                    >
                      ✕
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} sx={{ color: "text.secondary" }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleCreate} disabled={!name}>
          Create Plan
        </Button>
      </DialogActions>
    </Dialog>
  );
}
