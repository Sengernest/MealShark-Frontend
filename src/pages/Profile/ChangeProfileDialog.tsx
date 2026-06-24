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
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { useChangePassword, useCurrentUser } from "@/hooks/auth";

export function ChangePasswordDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const { data: user } = useCurrentUser();
  const changePassword = useChangePassword();

  const handleSave = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New and Confirm New Passwords do not match.");
      return;
    }

    changePassword.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setError("");
          setSaved(true);

          setTimeout(() => {
            setSaved(false);
            onClose();
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
          }, 1200);
        },

        onError: (err: any) => {
          setError(err?.response?.data?.error);
        },
      },
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Typography variant="h5">CHANGE PASSWORD</Typography>
      </DialogTitle>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 2 }}
      >
        {saved && (
          <Alert severity="success" icon={<CheckCircleIcon />}>
            Password updated!
          </Alert>
        )}

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Current Password"
          type="password"
          value={currentPassword}
          sx={{ mt: 0.5 }}
          onChange={(e) => setCurrentPassword(e.target.value)}
          fullWidth
        />

        <TextField
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          fullWidth
        />

        <TextField
          label="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} sx={{ color: "text.secondary" }}>
          Cancel
        </Button>

        <Button variant="contained" onClick={handleSave}>
          Change Password
        </Button>
      </DialogActions>
    </Dialog>
  );
}
