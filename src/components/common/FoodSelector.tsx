import { useSearchFoods } from "@/hooks/foods";
import {
  Autocomplete,
  Box,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
  useWatch,
} from "react-hook-form";

type FoodSelectorProps<T extends FieldValues> = {
  control: Control<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;

  foodName: Path<T>;
  amountName: Path<T>;
  unitName: Path<T>;

  foodRules?: RegisterOptions<T, Path<T>>;
  amountRules?: RegisterOptions<T, Path<T>>;
  unitRules?: RegisterOptions<T, Path<T>>;

  onRemove?: () => void;
};

export function FoodSelector<T extends FieldValues>({
  control,
  register,
  errors,
  foodName,
  amountName,
  unitName,
  foodRules,
  amountRules,
  unitRules,
  onRemove,
}: FoodSelectorProps<T>) {
  const [foodSearch, setFoodSearch] = useState("");

  const { data: foods = [] } = useSearchFoods(foodSearch, 20);

  const selectedFoodId = useWatch({
    control,
    name: foodName,
  });

  const selectedFood = foods.find((f) => f.id === selectedFoodId) ?? null;

  const getError = (name: string) => {
    return name.split(".").reduce<any>((obj, key) => obj?.[key], errors);
  };

  const foodError = getError(foodName);
  const amountError = getError(amountName);
  const unitError = getError(unitName);

  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
      }}
    >
      {/* Top row */}
      <Controller
        name={foodName}
        control={control}
        rules={foodRules}
        render={({ field }) => (
          <Autocomplete
            options={foods.map((food) => food.id)}
            onChange={(_, value) => field.onChange(value)}
            value={field.value}
            inputValue={foodSearch}
            onInputChange={(_, value) => setFoodSearch(value)}
            getOptionLabel={(foodId) =>
              foods.find((food) => food.id === foodId)?.name ?? ""
            }
            isOptionEqualToValue={(option, value) => option === value}
            filterOptions={(x) => x}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Food"
                size="small"
                error={!!foodError}
                helperText={foodError?.message}
              />
            )}
          />
        )}
      />

      {/* Bottom row */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: onRemove ? "1fr 1fr auto" : "1fr 1fr",
          gap: 2,
          alignItems: "start",
        }}
      >
        <TextField
          label="Amount"
          size="small"
          type="number"
          {...register(amountName, amountRules)}
          error={!!amountError}
          helperText={amountError?.message}
        />

        <FormControl size="small" error={!!unitError}>
          <InputLabel>Unit</InputLabel>

          <Controller
            name={unitName}
            control={control}
            rules={unitRules}
            render={({ field }) => (
              <Select {...field} label="Unit">
                {selectedFood?.units?.map((unit) => (
                  <MenuItem key={unit.unit.id} value={unit.unit.id}>
                    {unit.unit.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />

          <FormHelperText>{unitError?.message}</FormHelperText>
        </FormControl>

        {onRemove && (
          <IconButton size="small" onClick={onRemove}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}
