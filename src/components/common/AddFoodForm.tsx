import { useSearchFoods } from "@/hooks/foods";
import { FoodItemPost } from "@/types";
import {
  Autocomplete,
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

type AddFoodFormProps = {
  onAdd: (food: FoodItemPost) => void;
  initialValue?: FoodItemPost;
};

export function AddFoodForm({ onAdd, initialValue }: AddFoodFormProps) {
  const [foodSearch, setFoodSearch] = useState("");
  const { data: foods = [] } = useSearchFoods(foodSearch, 20);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FoodItemPost>();

  const onSubmit: SubmitHandler<FoodItemPost> = (data) => {
    onAdd(data);
  };

  const selectedFoodId = watch("foodId");
  const selectedFood = foods.find((f) => f.id === selectedFoodId) ?? null;

  return (
    <form id="food-form" onSubmit={handleSubmit(onSubmit)}>
      <FormControl size="small" fullWidth>
        <Controller
          name={"foodId"}
          control={control}
          rules={{
            required: "Required",
          }}
          render={({ field }) => {
            return (
              <Autocomplete
                options={foods.map((food) => food.id)}
                onChange={(_, value) => {
                  field.onChange(value);
                }}
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
                    error={!!errors.foodId}
                    helperText={errors.foodId?.message}
                    sx={{ mt: 1 }}
                  />
                )}
              />
            );
          }}
        />
      </FormControl>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 2,
          paddingTop: 2,
        }}
      >
        <TextField
          label="Amount"
          size="small"
          type="number"
          {...register("amount", {
            required: "Required",
            valueAsNumber: true,
            validate: (v) => (v && v > 0) || "Amount must be positive",
          })}
          error={!!errors.amount}
          helperText={errors.amount?.message}
        />

        <FormControl size="small" error={!!errors.unitId}>
          <InputLabel>Unit</InputLabel>

          <Controller
            name={"unitId"}
            control={control}
            rules={{ required: "Required" }}
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

          <FormHelperText>{errors.unitId?.message}</FormHelperText>
        </FormControl>
      </Box>
    </form>
  );
}
