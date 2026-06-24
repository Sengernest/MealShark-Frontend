import { useState } from "react";
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
import { useCurrentUser } from "@/hooks/auth";
import { useUpdateProfile } from "@/hooks/profile";

export function EditProfileDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { data: user } = useCurrentUser();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [birthDate, setBirthDate] = useState(user?.birthDate ?? "");
  const [height, setHeight] = useState(user?.height ?? "");
  const [gender, setGender] = useState<"male" | "female" | "">(
    user?.gender ?? "",
  );
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const updateProfile = useUpdateProfile();

  const handleSave = () => {
    if (!name.trim() || !email.trim()) return;
    const ageDiff = dayjs().diff(dayjs(birthDate), "year");

    if ((birthDate && ageDiff < 10) || ageDiff > 120) {
      setError("Enter a valid birth date (age must be between 10 and 120).");
      return;
    }

    if ((height && +height < 100) || +height > 250) {
      setError("Enter a valid height in cm (100–250).");
      return;
    }

    updateProfile.mutate({
      name: name.trim(),
      email: email.trim(),
      birthDate: birthDate === "" ? undefined : birthDate,
      height: height === "" ? undefined : Number(height),
      gender: gender === "" ? undefined : gender,
    });

    setError("");
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
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
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          autoFocus
          sx={{ mt: 1 }}
        />

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Birth Date (DD/MM/YYYY)"
            value={birthDate ? dayjs(birthDate) : null}
            format="DD/MM/YYYY"
            onChange={(newValue) => {
              setBirthDate(newValue ? newValue.format("YYYY-MM-DD") : "");
            }}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </LocalizationProvider>

        <TextField
          label="Height/cm"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          fullWidth
        />

        <FormControl sx={{ flex: 1 }} size="small">
          <InputLabel id="gender-label">Gender</InputLabel>

          <Select
            labelId="gender-label"
            id="gender"
            value={gender}
            label="Gender"
            onChange={(e) => {
              const value = e.target.value;

              if (value === "male" || value === "female" || value === "") {
                setGender(value);
              }
            }}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} sx={{ color: "text.secondary" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!name.trim() || !email.trim()}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}