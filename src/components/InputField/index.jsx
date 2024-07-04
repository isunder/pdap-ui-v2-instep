import React from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material";

const Label = styled(Typography)(({ theme }) => ({
    fontSize: '0.8125rem', lineHeight: '1rem',
    fontWeight: 600,
    textTransform: "capitalize",
    color: '#344054',
    padding: 0,
}));

const StyledInput = styled(OutlinedInput)(({ theme, iserror }) => ({
    fontWeight: 500,
    fontSize: "0.813rem",
    lineHeight: "1.75rem",
    letterSpacing: "0.02em",
    borderRadius: "0.5rem",
    background: "white",
    color: theme.palette.secondary.main,
    border: `${iserror ? "1px" : "2px"} solid ${iserror ? "#D0D5DD" : theme.palette.error.main}`,
    height: "2.375rem",
    paddingLeft: "0.5rem",
    width: "100%",
    "& .css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input": {
        "::placeholder": {
            color: theme.palette.gray,
        },
    },
    "& .css-nxo287-MuiInputBase-input-MuiOutlinedInput-input": {
        "::placeholder": {
            color: theme.palette.gray,
        },
    },
    "& .MuiInputBase-input": {
        ":-webkit-autofill": {
            boxSizing: "border-box",
            border: "0",
            WebkitBoxShadow: "0 0 0 1000px white inset",
            backgroundColor: "transparent !important",
        },
    },
    "& fieldset": { border: "none" },
    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
        WebkitAppearance: "none",
        margin: 0,
    },
    "& input[type=number]": {
        MozAppearance: "textfield",
    },
}));

const ErrorText = styled("span")(({ theme }) => ({
    fontWeight: 500,
    fontSize: "0.75rem",
    lineHeight: '1.25rem',
    color: theme.palette.error.main,
}));

export const InputField = (props) => {
    const { labelText, onChange, error, helperText, startIcon, endIcon, isRequired, errorWidth, startIconCss, labelCss, errorCss, mainBoxCss, ...rest } = props;

    return (
        <Box sx={{ display: 'flex', flexDirection: "column", width: "100%", gap: "0.25rem", ...mainBoxCss }}>
            {labelText && (
                <Label sx={{ ...labelCss }}>
                    {labelText}
                    {isRequired && <ErrorText sx={{ fontSize: '0.8125rem', lineHeight: '1rem', p: 0 }}>*</ErrorText>}
                </Label>
            )}
            <FormControl fullWidth>
                <StyledInput
                    onChange={onChange}
                    iserror={helperText ? "true" : "false"}
                    error={error}
                    endAdornment={<InputAdornment position="end">{endIcon}</InputAdornment>}
                    autoComplete="off"
                    startAdornment={
                        <InputAdornment
                            position="start"
                            sx={{
                                cursor: "pointer",
                                ...startIconCss,
                            }}
                        >
                            {startIcon}
                        </InputAdornment>
                    }
                    autoFocus={false}
                    {...rest}
                />
                {helperText && (
                    <ErrorText
                        sx={{
                            display: "flex",
                            width: errorWidth ? errorWidth : "100%",
                            flexWrap: "wrap",
                            marginTop: "0.2rem",
                            ...errorCss,
                        }}
                    >
                        {helperText && helperText}
                    </ErrorText>
                )}
            </FormControl>
        </Box>
    );
};