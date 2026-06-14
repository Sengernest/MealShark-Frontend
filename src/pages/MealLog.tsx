import { useState } from "react";
import {
  Box, Typography, Card, CardContent, Button, IconButton, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Select, MenuItem, FormControl, InputLabel, LinearProgress,
  Divider, Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TodayIcon from "@mui/icons-material/Today";
import { useApp } from "../AppContext";
import type { MealLogEntry, MealLogSlot, MealItem } from "../types";

function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
}

function MacroBar({ label, value, target, color }: { label: string; value: number; target: number; color: string }) {
  const pct = target > 0 ? Math.min(100, (value / target) * 100) : 0;
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
        <Typography variant="overline" sx={{ fontSize: 10, color: "text.secondary" }}>{label}</Typography>
        <Typography variant="caption">
          <Box component="span" sx={{ color, fontWeight: 700 }}>{Math.round(value)}g</Box>
          {target > 0 && <Box component="span" sx={{ color: "text.disabled" }}> / {target}g</Box>}
        </Typography>
      </Box>
      <LinearProgress variant="determinate" value={pct} sx={{ bgcolor: "#222", "& .MuiLinearProgress-bar": { bgcolor: color } }} />
    </Box>
  );
}

type AddItemDialogProps = {
  open: boolean;
  onClose: () => void;
  onAdd: (item: MealItem) => void;
};

type AddMode = "recipe" | "food" | "plan";

function AddItemDialog({ open, onClose, onAdd, logDate }: AddItemDialogProps & { logDate: string }) {
  const { recipes, foods, mealPlans, activePlanId } = useApp();
  const [mode, setMode] = useState<AddMode>("recipe");
  const [selId, setSelId] = useState(recipes[0]?.id ?? "");
  const [amount, setAmount] = useState("1");
  const [unit, setUnit] = useState("serving");
  // For plan import mode
  const [planSlotId, setPlanSlotId] = useState<string>("");

  const activePlan = mealPlans.find((p) => p.id === activePlanId);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const todayDay = dayNames[new Date(logDate + "T12:00:00").getDay()];
  const todayPlanDay = activePlan?.days.find((d) => d.day === todayDay);

  const options = mode === "recipe" ? recipes : foods;

  const handleAdd = () => {
    if (mode === "plan") {
      // Import all items from the selected plan slot
      const slot = todayPlanDay?.slots.find((s) => s.id === planSlotId);
      if (!slot) return;
      slot.items.forEach((item, i) =>
        onAdd({ ...item, id: `li_${Date.now()}_${i}` })
      );
    } else if (mode === "recipe") {
      const recipe = recipes.find((r) => r.id === selId);
      if (!recipe) return;
      onAdd({ id: `li_${Date.now()}`, type: "recipe", recipe, amount: +amount, unit });
    } else {
      const food = foods.find((f) => f.id === selId);
      if (!food) return;
      onAdd({ id: `li_${Date.now()}`, type: "food", food, amount: +amount, unit });
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle><Typography variant="h6">ADD TO MEAL SLOT</Typography></DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
        {/* Mode tabs */}
        <Box sx={{ display: "flex", gap: 1 }}>
          {([
            { id: "recipe" as AddMode, label: "Recipe" },
            { id: "food" as AddMode, label: "Food" },
            ...(todayPlanDay ? [{ id: "plan" as AddMode, label: "From Plan" }] : []),
          ]).map(({ id, label }) => (
            <Button
              key={id}
              variant={mode === id ? "contained" : "outlined"}
              size="small"
              onClick={() => {
                setMode(id);
                if (id === "recipe") { setSelId(recipes[0]?.id); setUnit("serving"); }
                else if (id === "food") { setSelId(foods[0]?.id); setUnit("g"); }
                else if (id === "plan" && todayPlanDay?.slots[0]) setPlanSlotId(todayPlanDay.slots[0].id);
              }}
              sx={{ color: mode === id ? "#0d0d0d" : "text.secondary", borderColor: "divider" }}
            >
              {label}
            </Button>
          ))}
        </Box>

        {mode === "plan" && todayPlanDay ? (
          <>
            <FormControl size="small" fullWidth>
              <InputLabel>Plan Slot</InputLabel>
              <Select value={planSlotId} label="Plan Slot" onChange={(e) => setPlanSlotId(e.target.value)}>
                {todayPlanDay.slots.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.label} — {s.items.map((i) => i.type === "recipe" ? i.recipe?.name : i.food?.name).join(", ") || "Empty"}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {planSlotId && (() => {
              const slot = todayPlanDay.slots.find((s) => s.id === planSlotId);
              return slot?.items.length ? (
                <Box sx={{ bgcolor: "rgba(255,255,255,0.03)", borderRadius: 1, p: 1.5 }}>
                  <Typography variant="caption" sx={{ color: "text.disabled", display: "block", mb: 0.5 }}>Will import:</Typography>
                  {slot.items.map((item) => (
                    <Typography key={item.id} variant="body2" sx={{ fontSize: 13, color: "text.primary" }}>
                      • {item.type === "recipe" ? item.recipe?.name : item.food?.name} × {item.amount} {item.unit}
                    </Typography>
                  ))}
                </Box>
              ) : <Typography variant="caption" sx={{ color: "text.disabled" }}>This slot is empty.</Typography>;
            })()}
          </>
        ) : (
          <>
            <FormControl size="small" fullWidth>
              <InputLabel>{mode === "recipe" ? "Recipe" : "Food"}</InputLabel>
              <Select value={selId} label={mode === "recipe" ? "Recipe" : "Food"} onChange={(e) => setSelId(e.target.value)}>
                {options.map((o) => <MenuItem key={o.id} value={o.id}>{o.name}</MenuItem>)}
              </Select>
            </FormControl>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <TextField label="Quantity" value={amount} onChange={(e) => setAmount(e.target.value)} type="number" size="small" />
              <TextField label="Unit" value={unit} onChange={(e) => setUnit(e.target.value)} size="small" />
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} sx={{ color: "text.secondary" }}>Cancel</Button>
        <Button variant="contained" onClick={handleAdd}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}

function SlotCard({ slot, onAddItem, onRemoveItem, onRemoveSlot }: {
  slot: MealLogSlot;
  onAddItem: () => void;
  onRemoveItem: (itemId: string) => void;
  onRemoveSlot: () => void;
}) {
  let slotCal = 0;
  slot.items.forEach((item) => {
    if (item.type === "recipe" && item.recipe) slotCal += item.recipe.calories * item.amount;
    else if (item.type === "food" && item.food) slotCal += (item.food.caloriesPer100g * item.amount) / 100;
  });

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
          <Typography variant="h6" sx={{ fontSize: 16 }}>{slot.label}</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {slotCal > 0 && (
              <Typography sx={{ color: "primary.main", fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 16 }}>
                {Math.round(slotCal)} kcal
              </Typography>
            )}
            <Tooltip title="Remove slot">
              <IconButton size="small" onClick={onRemoveSlot} sx={{ color: "error.main", opacity: 0.6, "&:hover": { opacity: 1 } }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {slot.items.length === 0 ? (
          <Typography variant="body2" sx={{ color: "text.disabled", mb: 1.5, fontSize: 13 }}>No items logged.</Typography>
        ) : (
          slot.items.map((item) => {
            const name = item.type === "recipe" ? item.recipe?.name : item.food?.name;
            const cal = item.type === "recipe"
              ? Math.round((item.recipe?.calories ?? 0) * item.amount)
              : Math.round(((item.food?.caloriesPer100g ?? 0) * item.amount) / 100);
            return (
              <Box
                key={item.id}
                sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 0.75, borderBottom: "1px solid", borderColor: "divider" }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip
                    label={item.type.toUpperCase()}
                    size="small"
                    variant="outlined"
                    sx={{ height: 18, fontSize: 10, color: item.type === "recipe" ? "primary.main" : "#3db5f2", borderColor: item.type === "recipe" ? "primary.main" : "#3db5f2" }}
                  />
                  <Typography variant="body2" sx={{ color: "text.primary", fontSize: 13 }}>{name}</Typography>
                  <Typography variant="caption" sx={{ color: "text.disabled" }}>× {item.amount} {item.unit}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="caption" sx={{ color: "#888" }}>{cal} kcal</Typography>
                  <IconButton size="small" onClick={() => onRemoveItem(item.id)} sx={{ color: "text.disabled", "&:hover": { color: "error.main" } }}>
                    <DeleteIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Box>
              </Box>
            );
          })
        )}

        <Button size="small" startIcon={<AddIcon />} onClick={onAddItem} sx={{ mt: 1.5, color: "primary.main" }}>
          Add item
        </Button>
      </CardContent>
    </Card>
  );
}

export function MealLog() {
  const { user, getLogEntry, upsertLogEntry } = useApp();
  const goal = user?.nutritionGoal;
  const TODAY = "2026-06-14";
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [addSlotFor, setAddSlotFor] = useState<string | null>(null); // slot id
  const [addItemOpen, setAddItemOpen] = useState(false);

  const logEntry = getLogEntry(selectedDate);
  const slots: MealLogSlot[] = logEntry?.slots ?? [];

  const getOrCreateEntry = (): MealLogEntry => ({
    id: logEntry?.id ?? `log_${selectedDate}`,
    date: selectedDate,
    userId: user?.id ?? "u1",
    slots: [...slots],
  });

  const addSlot = () => {
    const entry = getOrCreateEntry();
    const label = `Meal ${entry.slots.length + 1}`;
    entry.slots.push({ id: `ls_${Date.now()}`, label, items: [] });
    upsertLogEntry(entry);
  };

  const removeSlot = (slotId: string) => {
    const entry = getOrCreateEntry();
    entry.slots = entry.slots.filter((s) => s.id !== slotId);
    upsertLogEntry(entry);
  };

  const addItemToSlot = (slotId: string, item: MealItem) => {
    const entry = getOrCreateEntry();
    entry.slots = entry.slots.map((s) =>
      s.id === slotId ? { ...s, items: [...s.items, item] } : s
    );
    upsertLogEntry(entry);
  };

  const removeItemFromSlot = (slotId: string, itemId: string) => {
    const entry = getOrCreateEntry();
    entry.slots = entry.slots.map((s) =>
      s.id === slotId ? { ...s, items: s.items.filter((i) => i.id !== itemId) } : s
    );
    upsertLogEntry(entry);
  };

  // Day totals
  let totCal = 0, totProt = 0, totCarbs = 0, totFat = 0;
  slots.forEach((slot) => {
    slot.items.forEach((item) => {
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
  });
  totCal = Math.round(totCal);

  const calPct = goal ? Math.min(100, (totCal / goal.dailyCalories) * 100) : 0;
  const remaining = goal ? Math.max(0, goal.dailyCalories - totCal) : null;

  return (
    <Box sx={{ p: { xs: 3, md: 4 }, maxWidth: 1000 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 4 }}>
        <Box>
          <Typography variant="overline" sx={{ color: "text.secondary" }}>INTAKE TRACKING</Typography>
          <Typography variant="h2" sx={{ lineHeight: 1, mt: 0.5 }}>MEAL LOG</Typography>
        </Box>
      </Box>

      {/* Date picker */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, py: "12px !important" }}>
          <IconButton size="small" onClick={() => setSelectedDate(addDays(selectedDate, -1))} sx={{ color: "text.secondary" }}>
            <ChevronLeftIcon />
          </IconButton>
          <TodayIcon sx={{ color: "text.disabled", fontSize: 18 }} />
          <Typography variant="body1" sx={{ fontWeight: 600, flex: 1, textAlign: "center" }}>
            {formatDate(selectedDate)}
            {selectedDate === TODAY && (
              <Chip label="Today" size="small" color="primary" sx={{ ml: 1.5, height: 20, fontSize: 11 }} />
            )}
          </Typography>
          <IconButton size="small" onClick={() => setSelectedDate(addDays(selectedDate, 1))} sx={{ color: "text.secondary" }}>
            <ChevronRightIcon />
          </IconButton>
          <Divider orientation="vertical" flexItem />
          <Button size="small" onClick={() => setSelectedDate(TODAY)} sx={{ color: "text.secondary", fontSize: 12 }}>Today</Button>
        </CardContent>
      </Card>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 320px" }, gap: 3, alignItems: "start" }}>
        {/* Meal slots */}
        <Box>
          {slots.length === 0 && (
            <Card sx={{ mb: 2 }}>
              <CardContent sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="body2" sx={{ color: "text.disabled", mb: 2 }}>No meal slots for this day. Add one to start logging.</Typography>
              </CardContent>
            </Card>
          )}

          {slots.map((slot) => (
            <SlotCard
              key={slot.id}
              slot={slot}
              onAddItem={() => { setAddSlotFor(slot.id); setAddItemOpen(true); }}
              onRemoveItem={(itemId) => removeItemFromSlot(slot.id, itemId)}
              onRemoveSlot={() => removeSlot(slot.id)}
            />
          ))}

          <Button variant="outlined" startIcon={<AddIcon />} onClick={addSlot} fullWidth sx={{ borderStyle: "dashed", color: "text.secondary" }}>
            Add Meal Slot
          </Button>
        </Box>

        {/* Day summary */}
        <Box sx={{ position: "sticky", top: 24 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>DAY SUMMARY</Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5 }}>
                <Box sx={{ position: "relative", width: 76, height: 76, flexShrink: 0 }}>
                  <svg viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}>
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#222" strokeWidth="12" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#60c8f5" strokeWidth="12"
                      strokeDasharray={`${(calPct / 100) * 251.2} 251.2`} strokeLinecap="round" />
                  </svg>
                  <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Typography sx={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 16, color: "text.primary" }}>
                      {Math.round(calPct)}%
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography sx={{ color: "primary.main", fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 32, lineHeight: 1 }}>
                    {totCal}
                  </Typography>
                  <Typography variant="caption">kcal consumed</Typography>
                  {remaining !== null && (
                    <Typography variant="body2" sx={{ fontSize: 12, color: "text.secondary", mt: 0.5 }}>
                      {remaining} kcal remaining
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <MacroBar label="Protein" value={totProt} target={goal?.protein ?? 0} color="#3df2a8" />
                <MacroBar label="Carbohydrates" value={totCarbs} target={goal?.carbs ?? 0} color="#3db5f2" />
                <MacroBar label="Fat" value={totFat} target={goal?.fat ?? 0} color="#f2c93d" />
              </Box>

              {slots.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="overline" sx={{ fontSize: 11, color: "text.secondary", display: "block", mb: 1 }}>MEALS</Typography>
                  {slots.map((slot) => {
                    const cal = slot.items.reduce((s, item) => {
                      if (item.type === "recipe" && item.recipe) return s + item.recipe.calories * item.amount;
                      if (item.type === "food" && item.food) return s + (item.food.caloriesPer100g * item.amount) / 100;
                      return s;
                    }, 0);
                    return (
                      <Box key={slot.id} sx={{ display: "flex", justifyContent: "space-between", py: 0.75, borderBottom: "1px solid", borderColor: "divider" }}>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>{slot.label}</Typography>
                        <Typography variant="caption" sx={{ color: cal > 0 ? "text.primary" : "text.disabled" }}>
                          {cal > 0 ? `${Math.round(cal)} kcal` : "Empty"}
                        </Typography>
                      </Box>
                    );
                  })}
                </>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>

      {addItemOpen && addSlotFor && (
        <AddItemDialog
          open
          logDate={selectedDate}
          onClose={() => { setAddItemOpen(false); setAddSlotFor(null); }}
          onAdd={(item) => { addItemToSlot(addSlotFor, item); }}
        />
      )}
    </Box>
  );
}
