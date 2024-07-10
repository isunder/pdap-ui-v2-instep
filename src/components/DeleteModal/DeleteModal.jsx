import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { InputBoxText } from "../InputBoxText/InputBoxText";
import { useTheme } from "@emotion/react";

const Deletemodal = ({
  fullScreen,
  Deleteopen,
  handleClose,
  rejectReason,
  handleReseon,
  error,
  handleFunction,
  handleDeleteAll,
  handleDelete,
  handleOtherText,
}) => {
  const theme = useTheme();
  return (
    <Dialog
      fullScreen={fullScreen}
      open={Deleteopen}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
      className="PopupDelete"
    >
      <DialogActions>
        <Button
          autoFocus
          onClick={handleClose}
          sx={{
            color: "#17236D",
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: "19.49px",
            textTransform: "inherit",
            textDecoration: "underline",
            mt: 2,

            ":hover": {
              backgroundColor: "transparent",
              textDecoration: "underline",
            },

            [theme.breakpoints.down("md")]: {
              mt: 0,
            },
          }}
        >
          Close
        </Button>
      </DialogActions>

      <DialogContent
        sx={{
          padding: "20px 20px 20px",
          [theme.breakpoints.down("md")]: {
            padding: "10px",
            textAlign: "center",
          },
        }}
      >
        <DialogContentText
          sx={{
            fontWeight: 500,
            fontSize: "20px",
            lineHeight: "30.26px",
            color: "#000",
            textAlign: "center",
          }}
        >
          <Grid container spacing={2} display={"flex"} flexDirection={"column"}>
            <Grid item xs={10} sm={10} md={9.5} lg={9.5} xl={9.5}>
              <FormControl
                fullWidth
                sx={{
                  mr: "0%",
                  ml: "12%",
                }}
              >
                <InputLabel
                  id="demo-simple-select-label"
                  sx={{
                    textTransform: "initial",
                  }}
                >
                  Select a reason
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={rejectReason}
                  label="Select a reason"
                  onChange={(e) => handleReseon(e)}
                >
                  <MenuItem value="Insufficient Proof">
                    Insufficient Proof
                  </MenuItem>
                  <MenuItem value="Resolved">Resolved</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
                {rejectReason === "Other" && (
                  <>
                    <InputBoxText
                      handleChange={(e) => handleOtherText(e)}
                      label="Please mention the reason for Rejection"
                      style={{
                        mt: 2,
                      }}
                    />
                    <Typography
                      component="span"
                      sx={{
                        fontWeight: 200,
                        fontSize: "12px",
                        lineHeight: "30.26px",
                        color: "red",
                        textAlign: "left",
                      }}
                    >
                      {!error.isValid && error?.reason}
                    </Typography>
                  </>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={10} sm={10} md={12} lg={12} xl={12}>
              <Box
                sx={{
                  [theme.breakpoints.down("md")]: {
                    mt: "6%",
                    ml: "11%",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                }}
              >
                <Button
                  onClick={() =>
                    handleFunction ? handleDeleteAll() : handleDelete()
                  }
                  sx={{
                    color: "#FFFFFF",
                    fontWeight: 600,
                    fontSize: "16px",
                    lineHeight: "19.49px",
                    backgroundColor: "#242424",
                    borderRadius: "5px",
                    width: "245px",
                    height: "48px",
                    textTransform: "initial",
                    marginTop: "20px",
                    marginBottom: "21px",
                    [theme.breakpoints.down("md")]: {
                      mx: 0,
                      mt: 0,
                      mb: 0,
                      width: "100%",
                    },
                  }}
                >
                  Yes, Delete
                </Button>
                <Button
                  onClick={handleClose}
                  sx={{
                    color: "#FFFFFF",
                    fontWeight: 600,
                    fontSize: "16px",
                    lineHeight: "19.49px",
                    backgroundColor: "#17236D",
                    borderRadius: "5px",
                    width: "245px",
                    height: "48px",
                    textTransform: "initial",
                    mx: 2,

                    [theme.breakpoints.down("md")]: {
                      mx: 0,
                      mt: 2,
                      width: "100%",
                    },
                  }}
                >
                  No, Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default Deletemodal;
