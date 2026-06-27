import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, TextField } from "@mui/material";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  width?: number | string;
};

export function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  width = 260,
}: SearchBarProps) {
  return (
    <TextField
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={{ width }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: "text.disabled", fontSize: 18 }} />
          </InputAdornment>
        ),
      }}
    />
  );
}