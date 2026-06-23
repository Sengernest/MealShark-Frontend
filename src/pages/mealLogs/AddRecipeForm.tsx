import { MealRecipePost } from "@/types";
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";

type AddRecipeFormProps = {
  onAdd: (recipe: MealRecipePost) => void;
};

export function AddRecipeForm({ onAdd }: AddRecipeFormProps) {
  return (
    <>
      <FormControl size="small" fullWidth>
        <InputLabel>{"Recipe"}</InputLabel>
        <Select
          value={selId}
          label={"Recipe"}
          onChange={(e) => setSelId(e.target.value)}
        >
          {options.map((o) => (
            <MenuItem key={o.id} value={o.id}>
              {o.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
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
  );
}
