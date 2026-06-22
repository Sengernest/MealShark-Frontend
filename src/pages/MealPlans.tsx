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
  Tabs,
  Tab,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import type { MealPlan, MealPlanPost, MealPost, MealWithNutrition } from "../types";
import { useCreateMealPlan, useGetMyMealPlans } from "@/hooks/mealPlans";
import { useCurrentUser } from "@/hooks/auth";
import { recipes } from "@/mock/data";
import { Foods } from "./Foods";

function mealCalories(meal: MealWithNutrition["meal"], nutrition: any) {
  return nutrition?.calories ?? 0;
}

function SlotView({ slot }: { slot: MealSlot }) {
  const cal = Math.round(mealCalories(slot));
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
        {cal > 0 && (
          <Typography
            sx={{
              color: "primary.main",
              fontFamily: "'Barlow Condensed'",
              fontWeight: 800,
              fontSize: 13,
            }}
          >
            {cal} kcal
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

function PlanDetailDialog({
  plan,
  onClose,
}: {
  plan: MealPlan;
  onClose: () => void;
}) {
  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Chip
              label={plan.isProvided ? "Provided" : "My Plan"}
              size="small"
              variant="outlined"
              sx={{ mb: 1 }}
            />
            <Typography variant="h4">{plan.name}</Typography>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", mt: 0.5 }}
            >
              {plan.description}
            </Typography> 
          </Box>
          {/* <Chip
            label={`${plan.targetCalories} kcal target`}
            color="primary"
            variant="outlined"
          /> */}
        </Box>
      </DialogTitle>
      {/* <DialogContent>
        <Box sx={{ display: "flex", gap: 1, mb: 2.5, flexWrap: "wrap" }}>
          {DAYS.map((day) => {
            const d = plan.days.find((d) => d.day === day);
            const hasContent =
              d?.slots.some((s) => s.items.length > 0) ?? false;
            return (
              <Button
                key={day}
                variant={selectedDay === day ? "contained" : "outlined"}
                size="small"
                onClick={() => setSelectedDay(day)}
                sx={{
                  position: "relative",
                  color:
                    selectedDay === day
                      ? "#0d0d0d"
                      : hasContent
                        ? "text.primary"
                        : "text.disabled",
                  borderColor:
                    selectedDay === day
                      ? "primary.main"
                      : hasContent
                        ? "rgba(255,255,255,0.15)"
                        : "divider",
                  minWidth: 52,
                }}
              >
                {day}
                {hasContent && selectedDay !== day && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: -3,
                      right: -3,
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                    }}
                  />
                )}
              </Button>
            );
          })}
        </Box>

        {dayData ? (
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1.5,
              }}
            >
              <Typography variant="h6">{DAY_FULL[selectedDay]}</Typography>
              {dayTotal > 0 && (
                <Typography
                  sx={{
                    color: "primary.main",
                    fontFamily: "'Barlow Condensed'",
                    fontWeight: 800,
                  }}
                >
                  {dayTotal} kcal
                </Typography>
              )}
            </Box>
            {dayData.slots.map((slot) => (
              <SlotView key={slot.id} slot={slot} />
            ))}
          </Box>
        ) : (
          <Typography
            variant="body2"
            sx={{ color: "text.disabled", textAlign: "center", py: 4 }}
          >
            No meals planned for {DAY_FULL[selectedDay]}.
          </Typography>
        )}
      </DialogContent> */}
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

function CreatePlanDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  //const { recipes, foods, addMealPlan } = useApp();
  const createMealPlan = useCreateMealPlan();
  const [name, setName] = useState("");
  const [meals, setMeals] = useState<MealPost[]>([
    { mealPlanIndex: 0, recipeItems: [], foodItems: [] },
  ]);
  //const [description, setDescription] = useState("");

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

    const payload: MealPlanPost = {
      name,
      meals,
    };

    createMealPlan.mutate(payload);
    onClose();
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

function PlanCard({
  plan,
  isActive,
  onView,
  onSetActive,
}: {
  plan: MealPlan;
  isActive: boolean;
  onView: () => void;
  onSetActive: () => void;
}) {
  const avgCal = plan.days.length
    ? Math.round(
        plan.days.reduce(
          (s, d) => s + d.slots.reduce((ss, sl) => ss + slotCalories(sl), 0),
          0,
        ) / plan.days.length,
      )
    : 0;

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        borderColor: isActive ? "rgba(96,200,245,0.4)" : undefined,
        transition: "border-color 0.15s",
        "&:hover": {
          borderColor: isActive
            ? "rgba(96,200,245,0.4)"
            : "rgba(96,200,245,0.2)",
        },
      }}
    >
      <CardContent sx={{ flex: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1.5,
          }}
        >
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Chip
              label={plan.isProvided ? "Provided" : "My Plan"}
              size="small"
              variant="outlined"
              sx={{ fontSize: 11 }}
            />
            {isActive && (
              <Chip
                label="Active"
                size="small"
                color="primary"
                icon={<CheckCircleIcon />}
                sx={{ fontSize: 11 }}
              />
            )}
          </Box>
        </Box>
        <Typography
          variant="h5"
          sx={{ fontSize: 18, mb: 0.5, lineHeight: 1.2 }}
        >
          {plan.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontSize: 12,
            mb: 2,
            height: 32,
            overflow: "hidden",
          }}
        >
          {plan.description}
        </Typography>
        <Box sx={{ display: "flex", gap: 3 }}>
          <Box>
            <Typography
              sx={{
                color: "primary.main",
                fontFamily: "'Barlow Condensed'",
                fontWeight: 900,
                fontSize: 22,
                lineHeight: 1,
              }}
            >
              {avgCal}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "text.disabled", fontSize: 10 }}
            >
              AVG KCAL/DAY
            </Typography>
          </Box>
          <Box>
            <Typography
              sx={{
                color: "#3db5f2",
                fontFamily: "'Barlow Condensed'",
                fontWeight: 800,
                fontSize: 22,
                lineHeight: 1,
              }}
            >
              {plan.targetCalories}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "text.disabled", fontSize: 10 }}
            >
              TARGET
            </Typography>
          </Box>
          <Box sx={{ ml: "auto" }}>
            <Typography
              sx={{
                fontFamily: "'Barlow Condensed'",
                fontWeight: 700,
                fontSize: 16,
                lineHeight: 1,
                color: "text.primary",
              }}
            >
              {plan.days.length}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "text.disabled", fontSize: 10 }}
            >
              DAYS
            </Typography>
          </Box>
        </Box>
      </CardContent>
      <CardActions sx={{ pt: 0, px: 2, pb: 2, gap: 1 }}>
        <Button
          size="small"
          variant="outlined"
          onClick={onView}
          sx={{ flex: 1 }}
        >
          View
        </Button>
        {!isActive && (
          <Button
            size="small"
            variant="contained"
            onClick={onSetActive}
            sx={{ flex: 1 }}
          >
            Set Active
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

export function MealPlans() {
  //const { mealPlans, activePlanId, setActivePlan } = useApp();
  const { data: mealPlans = [] } = useGetMyMealPlans();
  const { data: user } = useCurrentUser();
  const [tab, setTab] = useState(0);
  const [viewPlan, setViewPlan] = useState<MealPlan | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = mealPlans.filter((p) =>
    tab === 0 ? true : tab === 1 ? p.creatorId === user?.id : true,
  );

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
            WEEKLY NUTRITION
          </Typography>
          <Typography variant="h2" sx={{ lineHeight: 1, mt: 0.5 }}>
            MEAL PLANS
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateOpen(true)}
        >
          Create Plan
        </Button>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2.5 }}>
        <Tab label={`All (${mealPlans.length})`} />
        <Tab label="My Plans" />
        <Tab label="Provided" />
      </Tabs>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 2,
        }}
      >
        {filtered.map((p) => (
          <PlanCard
            key={p.id}
            plan={p}
            isActive={p.id === activePlanId}
            onView={() => setViewPlan(p)}
            onSetActive={() => setActivePlan(p.id)}
          />
        ))}
        {filtered.length === 0 && (
          <Box sx={{ gridColumn: "1/-1", textAlign: "center", py: 8 }}>
            <Typography variant="body1" sx={{ color: "text.disabled" }}>
              No meal plans found.
            </Typography>
          </Box>
        )}
      </Box>

      {viewPlan && (
        <PlanDetailDialog plan={viewPlan} onClose={() => setViewPlan(null)} />
      )}
      {createOpen && (
        <CreatePlanDialog open onClose={() => setCreateOpen(false)} />
      )}
    </Box>
  );
}
