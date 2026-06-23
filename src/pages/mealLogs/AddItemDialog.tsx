import { Dialog, DialogTitle, Typography, DialogContent, FormControl, InputLabel, Select, MenuItem, TextField, DialogActions } from "@mui/material";
import { Box } from "lucide-react";
import { useState } from "react";
import { Button } from "react-day-picker";

type AddItemDialogProps = {
  open: boolean;
  onClose: () => void;
  onAdd: (item: MealItem) => void;
};

type AddMode = "recipe" | "food" | "plan";

export function AddItemDialog({
  open,
  onClose,
  onAdd,
  logDate,
}: AddItemDialogProps & { logDate: string }) {
  
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
        onAdd({ ...item, id: `li_${Date.now()}_${i}` }),
      );
    } else if (mode === "recipe") {
      const recipe = recipes.find((r) => r.id === selId);
      if (!recipe) return;
      onAdd({
        id: `li_${Date.now()}`,
        type: "recipe",
        recipe,
        amount: +amount,
        unit,
      });
    } else {
      const food = foods.find((f) => f.id === selId);
      if (!food) return;
      onAdd({
        id: `li_${Date.now()}`,
        type: "food",
        food,
        amount: +amount,
        unit,
      });
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">ADD TO MEAL SLOT</Typography>
      </DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
      >
        {/* Mode tabs */}
        <Box sx={{ display: "flex", gap: 1 }}>
          {[
            { id: "recipe" as AddMode, label: "Recipe" },
            { id: "food" as AddMode, label: "Food" },
            ...(todayPlanDay
              ? [{ id: "plan" as AddMode, label: "From Plan" }]
              : []),
          ].map(({ id, label }) => (
            <Button
              key={id}
              variant={mode === id ? "contained" : "outlined"}
              size="small"
              onClick={() => {
                setMode(id);
                if (id === "recipe") {
                  setSelId(recipes[0]?.id);
                  setUnit("serving");
                } else if (id === "food") {
                  setSelId(foods[0]?.id);
                  setUnit("g");
                } else if (id === "plan" && todayPlanDay?.slots[0])
                  setPlanSlotId(todayPlanDay.slots[0].id);
              }}
              sx={{
                color: mode === id ? "#0d0d0d" : "text.secondary",
                borderColor: "divider",
              }}
            >
              {label}
            </Button>
          ))}
        </Box>

        {mode === "plan" && todayPlanDay ? (
          <>
            <FormControl size="small" fullWidth>
              <InputLabel>Plan Slot</InputLabel>
              <Select
                value={planSlotId}
                label="Plan Slot"
                onChange={(e) => setPlanSlotId(e.target.value)}
              >
                {todayPlanDay.slots.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.label} —{" "}
                    {s.items
                      .map((i) =>
                        i.type === "recipe" ? i.recipe?.name : i.food?.name,
                      )
                      .join(", ") || "Empty"}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {planSlotId &&
              (() => {
                const slot = todayPlanDay.slots.find(
                  (s) => s.id === planSlotId,
                );
                return slot?.items.length ? (
                  <Box
                    sx={{
                      bgcolor: "rgba(255,255,255,0.03)",
                      borderRadius: 1,
                      p: 1.5,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: "text.disabled", display: "block", mb: 0.5 }}
                    >
                      Will import:
                    </Typography>
                    {slot.items.map((item) => (
                      <Typography
                        key={item.id}
                        variant="body2"
                        sx={{ fontSize: 13, color: "text.primary" }}
                      >
                        •{" "}
                        {item.type === "recipe"
                          ? item.recipe?.name
                          : item.food?.name}{" "}
                        × {item.amount} {item.unit}
                      </Typography>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="caption" sx={{ color: "text.disabled" }}>
                    This slot is empty.
                  </Typography>
                );
              })()}
          </>
        ) : (
          <>
            <FormControl size="small" fullWidth>
              <InputLabel>{mode === "recipe" ? "Recipe" : "Food"}</InputLabel>
              <Select
                value={selId}
                label={mode === "recipe" ? "Recipe" : "Food"}
                onChange={(e) => setSelId(e.target.value)}
              >
                {options.map((o) => (
                  <MenuItem key={o.id} value={o.id}>
                    {o.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
            >
              <TextField
                label="Quantity"
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
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} sx={{ color: "text.secondary" }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleAdd}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
