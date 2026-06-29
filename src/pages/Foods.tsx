import { SearchBar } from "@/components/common/SearchBar";
import { useGetFoods, useSearchFoods } from "@/hooks/foods";
import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

export function Foods() {
  const PAGE_LIMIT = 20;
  const [searchText, setSearchText] = useState("");

  const isSearching = searchText.trim() !== "";

  const { data: allFoods, isLoading: isLoadingFoods } = useGetFoods();

  const { data: searchedFoods, isLoading: isSearchingFoods } = useSearchFoods(
    searchText,
    PAGE_LIMIT,
  );

  const foods = isSearching ? (searchedFoods ?? []) : (allFoods ?? []);

  const isLoading = isSearching ? isSearchingFoods : isLoadingFoods;

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
          <SearchBar
            value={searchText}
            onChange={setSearchText}
            placeholder="Search foods..."
          />

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
