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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Controller, useForm } from "react-hook-form";

import { useCurrentUser } from "@/hooks/auth";
import { useUpdateProfile } from "@/hooks/profile";

type FormValues = {
  name: string;
  email: string;
  birthDate: string;
  height: string;
  gender: "" | "male" | "female";
};

export function EditProfileDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { data: user } = useCurrentUser();

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const updateProfile = useUpdateProfile();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      birthDate: "",
      height: "",
      gender: "",
    },
  });

  useEffect(() => {
    if (!user) return;

    reset({
      name: user.name ?? "",
      email: user.email ?? "",
      birthDate: user.birthDate ?? "",
      height: user.height?.toString() ?? "",
      gender: user.gender ?? "",
    });
  }, [user, reset]);

  const onSubmit = (data: FormValues) => {
    setError("");

    updateProfile.mutate(
      {
        name: data.name.trim(),
        email: data.email.trim(),
        birthDate: data.birthDate || undefined,
        height: data.height ? Number(data.height) : undefined,
        gender: data.gender || undefined,
      },
      {
        onSuccess: () => {
          setSaved(true);

          setTimeout(() => {
            setSaved(false);
            onClose();
          }, 1200);
        },
        onError: (err: any) => {
          setError(err?.response?.data?.error ?? "Failed to update profile");
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      disableRestoreFocus
    >
      <DialogTitle>
        <Typography variant="h5" component="div">
          EDIT PROFILE
        </Typography>
      </DialogTitle>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
      >
        {saved && (
          <Alert
            icon={<CheckCircleIcon />}
            severity="success"
            sx={{ fontSize: 13 }}
          >
            Profile updated!
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ fontSize: 13 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Full Name"
          fullWidth
          autoFocus
          sx={{ mt: 1 }}
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register("name", {
            required: "Name is required",
          })}
        />

        <TextField
          label="Email"
          type="email"
          fullWidth
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Invalid email address",
            },
          })}
        />

        <Controller
          name="birthDate"
          control={control}
          rules={{
            validate: (value) => {
              if (!value) return true;

              const age = dayjs().diff(dayjs(value), "year");

              return (
                (age >= 10 && age <= 120) ||
                "Age must be between 10 and 120"
              );
            },
          }}
          render={({ field }) => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Birth Date (DD/MM/YYYY)"
                value={field.value ? dayjs(field.value) : null}
                format="DD/MM/YYYY"
                onChange={(date) =>
                  field.onChange(
                    date ? date.format("YYYY-MM-DD") : "",
                  )
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.birthDate,
                    helperText: errors.birthDate?.message,
                  },
                }}
              />
            </LocalizationProvider>
          )}
        />

        <TextField
          label="Height/cm"
          fullWidth
          type="number"
          error={!!errors.height}
          helperText={errors.height?.message}
          {...register("height", {
            validate: (value) => {
              if (!value) return true;

              const height = Number(value);

              return (
                (height >= 100 && height <= 250) ||
                "Height must be between 100 and 250 cm"
              );
            },
          })}
        />

        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <FormControl sx={{ flex: 1 }} size="small">
              <InputLabel id="gender-label">Gender</InputLabel>

              <Select
                {...field}
                labelId="gender-label"
                id="gender"
                label="Gender"
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
          )}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} sx={{ color: "text.secondary" }}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={updateProfile.isPending}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}