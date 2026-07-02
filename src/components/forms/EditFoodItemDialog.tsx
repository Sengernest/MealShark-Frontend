import { FoodItem } from "@/types";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

export type EditFoodItemFormData = {
  unitId: number;
  amount: number;
};

type EditRecipeItemDialogProps = {
  open: boolean;
  onClose: () => void;
  onSave: (foodItem: FoodItem) => void | Promise<void>;
  setSubmitState?: (state: boolean) => void;
  initialFoodItem: FoodItem;
};

export function EditFoodItemDialog({
  open,
  onClose,
  onSave,
  setSubmitState,
  initialFoodItem,
}: EditRecipeItemDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<EditFoodItemFormData>({
    defaultValues: {
      unitId: initialFoodItem.unit.id,
      amount: initialFoodItem.amount,
    },
  });

  const onSubmit: SubmitHandler<EditFoodItemFormData> = async (data) => {
    const unit = initialFoodItem.food.units.find(
      (foodUnit) => foodUnit.unitId === data.unitId,
    )!.unit;
    await onSave({
      food: initialFoodItem.food,
      unit,
      amount: data.amount,
    });
  };

  useEffect(() => {
    setSubmitState?.(isSubmitting);
  }, [isSubmitting, setSubmitState]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          <Typography variant="h6">EDIT FOOD ITEM</Typography>
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
        >
          <Typography>{initialFoodItem.food.name}</Typography>
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
                    {initialFoodItem.food.units.map((unit) => (
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
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={onClose} sx={{ color: "text.secondary" }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            SAVE
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
