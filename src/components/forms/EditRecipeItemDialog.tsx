import { Box, TextField, Typography } from "@mui/material";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type EditRecipeItemFormData = {
  servings: number;
};

type EditRecipeItemDialogProps = {
  recipeName: string;
  initialServings: number;
  onSave: (servings: number) => void | Promise<void>;
  setSubmitState?: (state: boolean) => void;
};

export function EditRecipeItemDialog({
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
    <form id="recipe-form" onSubmit={handleSubmit(onSubmit)}>
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
    </form>
  );
}
