import { FoodItemPost } from "@/types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { AddFoodForm } from "../../components/common/AddFoodForm";

type AddIngredientDialogProps = {
  open: boolean;
  onClose: () => void;
  onAdd: (item: FoodItemPost) => void;
  title?: string;
  button?: string;
  initialValue?: FoodItemPost;
};

export function AddIngredientDialog({
  open,
  onClose,
  onAdd,
  title,
  button,
  initialValue
}: AddIngredientDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6"> {title ?? "ADD INGREDIENT"}</Typography>
      </DialogTitle>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
      >
        <AddFoodForm initialValue={initialValue} onAdd={onAdd} />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} sx={{ color: "text.secondary" }}>
          Cancel
        </Button>

        <Button type="submit" variant="contained" form="food-form">
          {button ?? "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
