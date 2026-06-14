import { createTheme } from "@mui/material/styles";

export const muiTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#60c8f5",
      contrastText: "#0d0d0d",
    },
    secondary: {
      main: "#3df2a8",
      contrastText: "#0d0d0d",
    },
    error: { main: "#ff3b5c" },
    background: {
      default: "#0d0d0d",
      paper: "#161616",
    },
    text: {
      primary: "#f0f0f0",
      secondary: "#888888",
    },
    divider: "rgba(255,255,255,0.08)",
  },
  typography: {
    fontFamily: "'Barlow', sans-serif",
    h1: { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900 },
    h2: { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800 },
    h3: { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800 },
    h4: { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 },
    h5: { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 },
    h6: { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 },
    button: { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: "0.08em" },
    overline: { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: "0.12em" },
    caption: { color: "#888" },
  },
  shape: { borderRadius: 4 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "html, body, #root": { height: "100%", margin: 0, padding: 0 },
        body: { backgroundColor: "#0d0d0d", color: "#f0f0f0" },
        "*::-webkit-scrollbar": { width: 4, height: 4 },
        "*::-webkit-scrollbar-track": { background: "transparent" },
        "*::-webkit-scrollbar-thumb": { background: "#2a2a2a", borderRadius: 2 },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "uppercase", borderRadius: 4, fontWeight: 700 },
        containedPrimary: { color: "#0d0d0d", fontWeight: 800 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "#161616",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: "none" } },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: "0.06em" },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: { color: "#888", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: "0.08em", fontSize: 12, borderColor: "rgba(255,255,255,0.06)" },
        body: { borderColor: "rgba(255,255,255,0.05)", fontSize: 13 },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" },
      },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined", size: "small" },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
            "&:hover fieldset": { borderColor: "rgba(255,255,255,0.3)" },
          },
        },
      },
    },
    MuiSelect: {
      defaultProps: { size: "small" },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { background: "#111111", borderRight: "1px solid rgba(255,255,255,0.06)" },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          marginBottom: 2,
          "&.Mui-selected": {
            background: "rgba(181,242,61,0.12)",
            color: "#60c8f5",
            "&:hover": { background: "rgba(181,242,61,0.16)" },
          },
          "&:hover": { background: "rgba(255,255,255,0.05)" },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 4, background: "#222", height: 6 },
      },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: "rgba(255,255,255,0.08)" } },
    },
    MuiDialog: {
      styleOverrides: { paper: { background: "#161616", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10 } },
    },
  },
});
