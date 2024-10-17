import { Box, Button, Typography, styled } from "@mui/material";

import { PrimaryButton } from "../../components";

export const StyleCircle = styled(Box)(() => ({
  width: "1.25rem",
  height: "1.25rem",
  marginRight: "0px",
  lineHeight: "20px",
}));

export const StyleButton = styled(Button)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "2.5rem",
  fontSize: "1rem",
  fontWeight: 600,
  borderRadius: "0.5rem",
}));

export const StyleCode = styled(Box)(({ theme }) => ({
  color: "#131E5E",
  fontWeight: 600,
  borderRadius: "2.125rem",
  background: "#D5DDED",
  padding: "0.225rem 0.875rem",
  width: "auto",
  display: "inline-block",
  [theme.breakpoints.up("lg")]: {
    fontSize: "85%",
  },
  [theme.breakpoints.down("lg")]: {
    fontSize: "80%",
  },
}));


export const StyleCode2 = styled(Box)(({ theme }) => ({
  color: "#131E5E",
  fontWeight: 600,

  padding: "0.225rem 0.875rem",
  width: "auto",
  display: "inline-block",
  [theme.breakpoints.up("lg")]: {
    fontSize: "85%",
  },
  [theme.breakpoints.down("lg")]: {
    fontSize: "80%",
  },
}));


export const StyledText = styled(Typography)(({ theme }) => ({
  color: theme.palette.black.main,
  fontSize: "0.875rem",
  fontWeight: "600",
  lineHeight: "175%",
  letterSpacing: "0.0175rem",
  padding: "0px",
  textTransform: "inherit",

  [theme.breakpoints.down("md")]: {
    marginTop: "0px",
  },
}));

export const StyledHead = styled(Typography)(({ theme }) => ({
  color: "#00000075",
  fontSize: "0.875rem",
  fontWeight: "400",
  lineHeight: "1.066",
  textTransform: "uppercase",
  padding: "0px",
  display: "block",
}));

export const StyledHeader = styled(Box)(() => ({
  height: "2.4375rem",
  width: "100%",
  borderBottom: "1px solid #E3EAF6",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  paddingBottom: "0px",
}));

export const StyledBox = styled(Box)(() => ({
  width: "100%",
  display: "flex",
  height: "2.4375rem",
  alignItems: "center",
 
}));

export const StyledAccordingBox = styled(Box)(() => ({
  height: "100%",
  width: "100%",
  minHeight: "3.1875rem",
  borderTop: "1px solid #E3EAF6",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
}));

export const StyledButton = styled(PrimaryButton)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: "#fff",
  ":hover": {
    backgroundColor: theme.palette.secondary.main,
  },
  fontSize: "0.875rem",
  fontWeight: 600,
  textTransform: "inherit",
  borderRadius: "0.3125rem",
  width: "6.125rem",
  height: "2rem",
}));

export const StyledButton2 = styled(PrimaryButton)(({ theme }) => ({
  backgroundColor: "transparent",
  color: "#17236D",
  ":hover": {
    backgroundColor: "transparent",
  },
  fontSize: "0.875rem",
  fontWeight: 600,
  fontSIze: "14px",
  textTransform: "inherit",
  border: "1px solid #C5CCF8",
  borderRadius: "0.3125rem",
  width: "7.125rem",
  height: "2rem",
}));

export const StyledButton1 = styled(PrimaryButton)(({ theme }) => ({
  backgroundColor: "#008F53",
  color: "white",
  ":hover": {
    backgroundColor: "#008F53",
  },
  fontSize: "0.875rem",
  fontWeight: 600,
  fontSIze: "14px",
  textTransform: "inherit",
  border: "1px solid #C5CCF8",
  borderRadius: "0.3125rem",
  width: "98px !important",
  height: "32px",
}));
