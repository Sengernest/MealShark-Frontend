import { useSearchFoods } from "@/hooks/foods";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { useState } from "react";

const CATEGORIES = [
  "All",
  "Protein",
  "Carbs",
  "Vegetables",
  "Fats",
  "Dairy",
  "Fruit",
  "Supplements",
  "Spices",
];

export function Foods() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const PAGE_LIMIT = 20;
  const { data, isLoading, isError } = useSearchFoods(searchQuery, PAGE_LIMIT);
  const foods = data ?? [];

  return (
    <Box sx={{ p: { xs: 3, md: 4 }, maxWidth: 1100 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="overline" sx={{ color: "text.secondary" }}>
            DATABASE
          </Typography>
          <Typography variant="h2" sx={{ lineHeight: 1, mt: 0.5 }}>
            FOODS
          </Typography>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 2.5 }}>
        <CardContent
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
            py: "12px !important",
          }}
        >
          <TextField
            placeholder="Search foods..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: 260 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.disabled", fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
          />
          <FormControl sx={{ minWidth: 160 }} size="small">
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="caption" sx={{ ml: "auto" }}>
            {foods.length} items
          </Typography>
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
            {foods.map((food) => (
              <TableRow
                key={food.id}
                hover
                sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.02)" } }}
              >
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.primary", fontWeight: 500 }}
                    >
                      {food.name}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: "text.disabled" }}>
                    per 100g
                  </Typography>
                </TableCell>
                <TableCell>
                  {food.category ? (
                    <Chip
                      label={food.category}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: 11 }}
                    />
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="body2"
                    sx={{
                      color: "primary.main",
                      fontWeight: 700,
                      fontFamily: "'Barlow Condensed'",
                    }}
                  >
                    {food.calories}
                  </Typography>
                  <Typography variant="caption">kcal</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="body2"
                    sx={{ color: "#3df2a8", fontFamily: "'Barlow Condensed'" }}
                  >
                    {food.protein}g
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="body2"
                    sx={{ color: "#3db5f2", fontFamily: "'Barlow Condensed'" }}
                  >
                    {food.carbs}g
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="body2"
                    sx={{ color: "#f2c93d", fontFamily: "'Barlow Condensed'" }}
                  >
                    {food.fat}g
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
            {foods.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                  sx={{ py: 6, color: "text.disabled" }}
                >
                  {isLoading ? "Loading..." : "No foods found"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
