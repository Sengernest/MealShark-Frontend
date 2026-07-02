import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type EditRecipeItemFormData = {
  servings: number;
};

type EditRecipeItemDialogProps = {
  open: boolean;
  onClose: () => void;
  recipeName: string;
  initialServings: number;
  onSave: (servings: number) => void | Promise<void>;
  setSubmitState?: (state: boolean) => void;
};

export function EditRecipeItemDialog({
  open,
  onClose,
  recipeName,
  initialServings,
  onSave,
  setSubmitState,
}: EditRecipeItemDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<EditRecipeItemFormData>({
    defaultValues: {
      servings: initialServings,
    },
  });

  const onSubmit: SubmitHandler<EditRecipeItemFormData> = async (data) => {
    await onSave(data.servings);
  };

  useEffect(() => {
    setSubmitState?.(isSubmitting);
  }, [isSubmitting, setSubmitState]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          <Typography variant="h6">EDIT RECIPE ITEM</Typography>
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
        >
          <Box sx={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: 2 }}>
            <Typography>{recipeName}</Typography>
            <TextField
              label="Servings"
              {...register("servings", {
                required: "Required",
                valueAsNumber: true,
                min: { value: 1, message: "Servings must be at least 1" },
                validate: (v) =>
                  Number.isInteger(v) || "Servings must be an integer",
              })}
              type="number"
              size="small"
              error={!!errors.servings}
              helperText={errors.servings?.message}
            />
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
