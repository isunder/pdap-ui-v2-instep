import React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

const StyledPrimary = styled(Button)(() => ({
  borderRadius: "6rem",
  height: "1.375rem",
  width: "2.5rem",
  padding: "0.95rem",
}));

export const PrimaryButton = ({ children, ...rest }) => {
  return <StyledPrimary {...rest}>{children}</StyledPrimary>;
};
