import { Card, CardContent, Typography, IconButton, Chip } from "@mui/material";
import { Box, DeleteIcon } from "lucide-react";
import { Button } from "react-day-picker";
import { Tooltip } from "recharts";

export function MealEntryCard({
  slot,

  onRemoveSlot,
}: {
  slot: MealLogSlot;

  onRemoveSlot: () => void;
}) {
  let slotCal = 0;
  slot.items.forEach((item) => {
    if (item.type === "recipe" && item.recipe)
      slotCal += item.recipe.calories * item.amount;
    else if (item.type === "food" && item.food)
      slotCal += (item.food.caloriesPer100g * item.amount) / 100;
  });

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1.5,
          }}
        >
          <Typography variant="h6" sx={{ fontSize: 16 }}>
            {slot.label}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {slotCal > 0 && (
              <Typography
                sx={{
                  color: "primary.main",
                  fontFamily: "'Barlow Condensed'",
                  fontWeight: 800,
                  fontSize: 16,
                }}
              >
                {Math.round(slotCal)} kcal
              </Typography>
            )}
            <Tooltip title="Remove slot">
              <IconButton
                size="small"
                onClick={onRemoveSlot}
                sx={{
                  color: "error.main",
                  opacity: 0.6,
                  "&:hover": { opacity: 1 },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {slot.items.length === 0 ? (
          <Typography
            variant="body2"
            sx={{ color: "text.disabled", mb: 1.5, fontSize: 13 }}
          >
            No items logged.
          </Typography>
        ) : (
          slot.items.map((item) => {
            const name =
              item.type === "recipe" ? item.recipe?.name : item.food?.name;
            const cal =
              item.type === "recipe"
                ? Math.round((item.recipe?.calories ?? 0) * item.amount)
                : Math.round(
                    ((item.food?.caloriesPer100g ?? 0) * item.amount) / 100,
                  );
            return (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 0.75,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip
                    label={item.type.toUpperCase()}
                    size="small"
                    variant="outlined"
                    sx={{
                      height: 18,
                      fontSize: 10,
                      color:
                        item.type === "recipe" ? "primary.main" : "#3db5f2",
                      borderColor:
                        item.type === "recipe" ? "primary.main" : "#3db5f2",
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ color: "text.primary", fontSize: 13 }}
                  >
                    {name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.disabled" }}>
                    × {item.amount} {item.unit}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="caption" sx={{ color: "#888" }}>
                    {cal} kcal
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => onRemoveItem(item.id)}
                    sx={{
                      color: "text.disabled",
                      "&:hover": { color: "error.main" },
                    }}
                  >
                    <DeleteIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Box>
              </Box>
            );
          })
        )}

        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={onAddItem}
          sx={{ mt: 1.5, color: "primary.main" }}
        >
          Add item
        </Button>
      </CardContent>
    </Card>
  );
}
