import { useEffect, useState } from "react";
import {
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import { useForm } from "react-hook-form";

import { useChangePassword } from "@/hooks/auth";
import { toast } from "react-toastify";

type FormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export function ChangePasswordDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [error, setError] = useState("");

  const changePassword = useChangePassword();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  useEffect(() => {
    if (!open) {
      reset();
      setError("");
    }
  }, [open, reset]);

  const onSubmit = (data: FormValues) => {
    setError("");

    changePassword.mutate(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => {
          toast.success("Password changed successfully!");
          reset();
          onClose();
        },
        onError: (err: any) => {
          setError(err?.response?.data?.error ?? "Failed to change password.");
        },
      },
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          <Typography variant="h5">CHANGE PASSWORD</Typography>
        </DialogTitle>

        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 2 }}
        >
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Current Password"
            type="password"
            fullWidth
            error={!!errors.currentPassword}
            helperText={errors.currentPassword?.message}
            {...register("currentPassword", {
              required: "Current password is required",
            })}
            sx={{ mt: 1 }}
          />

          <TextField
            label="New Password"
            type="password"
            fullWidth
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
            {...register("newPassword", {
              required: "New password is required",
              minLength: {
                value: 6,
                message: "New password must be at least 6 characters",
              },
            })}
          />

          <TextField
            label="Confirm New Password"
            type="password"
            fullWidth
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === newPassword ||
                "New and Confirm New Passwords do not match",
            })}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={onClose}>Cancel</Button>

          <Button variant="contained" type="submit" disabled={isSubmitting}>
            { isSubmitting ? "Changing password...": "Change Password" } 
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
