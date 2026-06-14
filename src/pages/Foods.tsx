import { useState } from "react";
import {
  Box, Typography, Card, CardContent, TextField, Select, MenuItem,
  FormControl, InputLabel, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import { useApp } from "../AppContext";
import type { Food } from "../../types";

const CATEGORIES = ["All", "Protein", "Carbs", "Vegetables", "Fats", "Dairy", "Fruit", "Supplements", "Spices"];

function AddFoodDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addFood } = useApp();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Protein");
  const [cal, setCal] = useState("");
  const [prot, setProt] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  const handleAdd = () => {
    if (!name || !cal) return;
    const food: Food = {
      id: `f_${Date.now()}`,
      name,
      category,
      caloriesPer100g: +cal,
      proteinPer100g: +prot || 0,
      carbsPer100g: +carbs || 0,
      fatPer100g: +fat || 0,
      isCustom: true,
    };
    addFood(food);
    setName(""); setCal(""); setProt(""); setCarbs(""); setFat("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h5">ADD FOOD ITEM</Typography>
      </DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
        <TextField label="Food Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
        <FormControl fullWidth size="small">
          <InputLabel>Category</InputLabel>
          <Select value={category} label="Category" onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.slice(1).map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>
        </FormControl>
        <Typography variant="overline" sx={{ fontSize: 11, color: "text.secondary", mt: 1 }}>PER 100g</Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <TextField label="Calories (kcal)" value={cal} onChange={(e) => setCal(e.target.value)} type="number" />
          <TextField label="Protein (g)" value={prot} onChange={(e) => setProt(e.target.value)} type="number" />
          <TextField label="Carbs (g)" value={carbs} onChange={(e) => setCarbs(e.target.value)} type="number" />
          <TextField label="Fat (g)" value={fat} onChange={(e) => setFat(e.target.value)} type="number" />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} sx={{ color: "text.secondary" }}>Cancel</Button>
        <Button variant="contained" onClick={handleAdd} disabled={!name || !cal}>Add Food</Button>
      </DialogActions>
    </Dialog>
  );
}

export function Foods() {
  const { foods } = useApp();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [addOpen, setAddOpen] = useState(false);

  const filtered = foods.filter((f) => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || f.category === category;
    return matchSearch && matchCat;
  });

  return (
    <Box sx={{ p: { xs: 3, md: 4 }, maxWidth: 1100 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 4 }}>
        <Box>
          <Typography variant="overline" sx={{ color: "text.secondary" }}>DATABASE</Typography>
          <Typography variant="h2" sx={{ lineHeight: 1, mt: 0.5 }}>FOODS</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddOpen(true)}>
          Add Food
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 2.5 }}>
        <CardContent sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center", py: "12px !important" }}>
          <TextField
            placeholder="Search foods..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 260 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "text.disabled", fontSize: 18 }} /></InputAdornment>,
            }}
          />
          <FormControl sx={{ minWidth: 160 }} size="small">
            <InputLabel>Category</InputLabel>
            <Select value={category} label="Category" onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </Select>
          </FormControl>
          <Typography variant="caption" sx={{ ml: "auto" }}>{filtered.length} items</Typography>
        </CardContent>
      </Card>

      <TableContainer component={Card}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>FOOD</TableCell>
              <TableCell>CATEGORY</TableCell>
              <TableCell align="right">CALORIES</TableCell>
              <TableCell align="right">PROTEIN</TableCell>
              <TableCell align="right">CARBS</TableCell>
              <TableCell align="right">FAT</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((food) => (
              <TableRow key={food.id} hover sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.02)" } }}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 500 }}>{food.name}</Typography>
                    {food.isCustom && <Chip label="Custom" size="small" variant="outlined" sx={{ height: 18, fontSize: 10 }} />}
                  </Box>
                  <Typography variant="caption" sx={{ color: "text.disabled" }}>per 100g</Typography>
                </TableCell>
                <TableCell>
                  <Chip label={food.category} size="small" variant="outlined" sx={{ fontSize: 11 }} />
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" sx={{ color: "primary.main", fontWeight: 700, fontFamily: "'Barlow Condensed'" }}>{food.caloriesPer100g}</Typography>
                  <Typography variant="caption">kcal</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" sx={{ color: "#3df2a8", fontFamily: "'Barlow Condensed'" }}>{food.proteinPer100g}g</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" sx={{ color: "#3db5f2", fontFamily: "'Barlow Condensed'" }}>{food.carbsPer100g}g</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" sx={{ color: "#f2c93d", fontFamily: "'Barlow Condensed'" }}>{food.fatPer100g}g</Typography>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6, color: "text.disabled" }}>No foods found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <AddFoodDialog open={addOpen} onClose={() => setAddOpen(false)} />
    </Box>
  );
}
