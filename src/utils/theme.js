import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#242424",
    },
    secondary: {
      main: "#17236D",
      A400: "#3D4A8F",
    },
    error: {
      main: "#F20000",
      active1: "#EA3939",
      A200: "rgb(242 0 0 / 20%)",
    },
    success: {
      main: "#008F53",
      A200: "rgb(0 143 83 / 20%)",
    },
    black: {
      main: "#000000",
    },
  },
  typography: {
    fontFamily: `"Proxima-nova", sans-serif`,
  },
  components: {
    MuiTypography: {
      defaultProps: {
        sx: {
          px: 1,
        },
        variant: "suntilte2",
        // textTransform: "capitalize",
        fontFamily: `"Proxima-nova", sans-serif`,
      },
    },
    MuiStack: {
      defaultProps: {
        sx: {
          px: 2,
          py: 1,
        },
        spacing: 2,
        direction: "row",
        fontFamily: `"Proxima-nova", sans-serif`,
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      fontFamily: `"Proxima-nova", sans-serif`,
    },
    MuiLink: {
      defaultProps: {
        sx: {
          color: (theme) => theme.palette.primary.main,
        },
        underline: "none",
        fontFamily: `"Proxima-nova", sans-serif`,
      },
    },
    MuiButton: {
      defaultProps: {
        size: "small",
        p: 0,
        disableRipple: true,
      },
      variant: "text",
      fontFamily: `"Proxima-nova", sans-serif`,
    },
    MuiTab: {
      defaultProps: {
        disableRipple: true,
      },
      fontFamily: `"Proxima-nova", sans-serif`,
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 375,
      md: 969,
      lg: 1280,
      xl: 1440,
    },
  },
});

export default theme;
