import { Box, Dialog, DialogActions, DialogContent, Grid, Typography, styled, useTheme } from "@mui/material";
import { CloseButton } from "../CloseButton";

const StyleDialog = styled(Dialog)(({ theme, width, minHeight }) => ({
    "& .css-1t1j96h-MuiPaper-root-MuiDialog-paper": {},
    "& .css-hz1bth-MuiDialog-container": {
        transition: "transform 605ms cubic-bezier(0, 0, 0.2, 1) 0ms",
    },
    "& .MuiDialog-container": {
        "& .MuiPaper-root": {
            width: width ? width : "30rem",
            minHeight: minHeight ? minHeight : '22.875px',
            position: "relative",
            borderRadius: "1rem",
            [theme.breakpoints.down("md")]: {
                width: "100%",
                margin: "0 1rem",
                padding: "1rem",
                overflow: "hidden",
            },
        },
    }, "& .MuiBackdrop-root": {
        backdropFilter: "blur(5px)",
    },
}))


export const IdleModal = (props) => {
    const { setOpen, open, header, width, minHeight, children, handleClick, removeCloseButton, ...rest } = props;
    const theme = useTheme()

    const handleClose = () => {
        setOpen(!open)
    }

    return (
        <StyleDialog width={width} minHeight={minHeight} onClose={handleClose} open={open} onClick={handleClick}>
            <Box>
                {/* <Grid item xs={1}>
                    <Box sx={{ display: "flex", alignItems: "end", justifyContent: "end" }}>
                        <CloseButton onClick={handleClose} />
                    </Box>
                </Grid> */}
                <DialogActions>
                    <Grid container sx={{ justifyContent: !removeCloseButton ? "space-between" : "center", m: '0.9rem 1rem 0.5rem 0.8rem', textAlign: removeCloseButton ? 'center' : 'inherit' }} >
                        <Grid item xs={10}>
                            <Box>
                                {header}
                            </Box>
                        </Grid>

                    </Grid>
                </DialogActions>
                <DialogContent
                    sx={{
                        py: 0
                    }}
                    {...rest}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 6,
                            mb: 3,
                        }}
                    >
                        <Box>
                            <Typography
                                variant="h4"
                                sx={{
                                    display: "flex",
                                    fontSize: "18px",
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    lineHeight: "28px",
                                    letterSpacing: "0em",
                                    textAlign: "center",
                                    color: "#242629",
                                }}
                            >
                                You have been Idle for too long.
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    marginTop: '5px',
                                    color: "#5C6469",
                                    textAlign: 'center'
                                }}
                            >
                                You can now close the DoctusTech window
                            </Typography>

                        </Box>
                    </Box>
                </DialogContent>
            </Box>
        </StyleDialog >)
}