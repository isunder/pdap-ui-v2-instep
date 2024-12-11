import * as React from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import { Select, Typography, styled } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const SelectBox = styled(Select)(({ theme }) => ({
    borderRadius: "0.5rem",
    color: '#344054',
    outline: "none",
    height: "2.375rem",
    minWidth: "9.75rem",
    fontWeight: 500,
    fontSize: "0.9rem",
    lineHeight: '1.25rem',
    border: `1px solid #D0D5DD`,
    "& fieldset": { border: "none" },
    "& .css-hfutr2-MuiSvgIcon-root-MuiSelect-icon": {
        color: theme.palette.secondary.main,
    },
    "& .MuiSelect-icon": {
        top: "calc(50% - 12px)",
    },
    "& #select-option": {
        paddingRight: 0,
    },
    "& .mui-style-a9jmv2-MuiPaper-root-MuiPopover-paper-MuiMenu-paper": {
        boxShadow: "none",
    },
}));

export const SelectField = (props) => {
    const { children, labelText, isRequired, labelCss, helperText, errorWidth, ...rest } = props;
    const [isOpen, setIsOpen] = React.useState(false);

    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <Box
            sx={{
                minWidth: "auto",
                gap: "8px",
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {labelText && (
                <Label sx={{ ...labelCss }}>
                    {labelText}
                    {isRequired && <ErrorText sx={{ fontSize: '0.8125rem', lineHeight: '1rem', p: 0 }}>*</ErrorText>}
                </Label>
            )}
            <FormControl
                sx={{
                    width: "100%",
                }}
            >
                <SelectBox
                    open={isOpen}
                    onOpen={handleOpen}
                    onClose={handleClose}
                    labelId="option-label"
                    id="select-option"
                    sx={{
                        gap: "10px",
                        "& div": {
                            width: "100%",
                        },
                    }}
                    MenuProps={{
                        disableScrollLock: true,
                        sx: {
                            "& .Mui-selected": {
                                fontWeight: 500,
                                fontSize: '1rem'
                            },
                        },
                        PaperProps: {
                            sx: {
                                borderRadius: "0.5rem",
                                marginTop: "0.63rem",
                                boxShadow: "0px 4px 12px 0px rgba(29, 33, 50, 0.12)",
                            },
                        },
                    }}
                    IconComponent={() => (
                        <>
                            {!isOpen ? (

                                <KeyboardArrowDownIcon
                                    onClick={handleOpen}
                                    style={{
                                        width: 18,
                                        height: 18,
                                        marginRight: "1rem",
                                        cursor: "pointer",
                                    }}
                                />
                            ) : (
                                <KeyboardArrowDownIcon
                                    onClick={handleOpen}
                                    style={{
                                        width: 18,
                                        height: 18,
                                        marginRight: "1rem",
                                        cursor: "pointer",
                                    }}
                                />
                            )}
                        </>
                    )}
                    {...rest}
                >
                    {children}
                </SelectBox>

                {helperText && (
                    <ErrorText
                        sx={{
                            display: "flex",
                            width: errorWidth ? errorWidth : "100%",
                            flexWrap: "wrap",
                            marginTop: "0.2rem",
                        }}
                    >
                        {helperText && helperText}
                    </ErrorText>
                )}
            </FormControl>
        </Box>
    );
};

const Label = styled(Typography)(({ theme }) => ({
    fontSize: '0.8125rem', lineHeight: '1rem',
    fontWeight: 600,
    textTransform: "capitalize",
    color: '#344054',
    padding: 0,
}));

const ErrorText = styled(Typography)(({ theme }) => ({
    fontWeight: 500,
    color: theme.palette.error.main,
    fontSize: "0.75rem",
    lineHeight: '1.25rem',
}));