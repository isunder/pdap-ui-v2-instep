import styled from "@emotion/styled";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpIcon } from "../Icons";
import { useTheme } from "@emotion/react";

const StyledHead = styled(Typography)(({ theme }) => ({
  color: "#00000075",
  fontSize: "0.875rem",
  fontWeight: "400",
  lineHeight: "1.066",
  textTransform: "uppercase",
  padding: "0px",
  display: "block",
}));

const StyledBox = styled(Box)(() => ({
  width: "100%",
  display: "flex",
  height: "2.4375rem",
  alignItems: "center",
  padding: "0 0.5rem",
}));

const Documentmodal = ({ fullScreen, open, handleClose1, clinicalDoc }) => {
  const theme = useTheme();
  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose1}
      aria-labelledby="responsive-dialog-title"
    >
      <Grid
        container
        sx={{
          borderBottom: "1px solid #000",
        }}
      >
        <Grid item xs={9} sm={9} md={8} lg={8} xl={8}>
          <DialogTitle
            id="responsive-dialog-title"
            sx={{
              color: "#242424",
              fontSize: "20px",
              fontWeight: 400,
              lineHeight: "24.36px",
            }}
          >
            Clinical Documents ({clinicalDoc && clinicalDoc.length})
          </DialogTitle>
        </Grid>
        <Grid
          item
          xs={3}
          sm={3}
          md={4}
          lg={4}
          xl={4}
          sx={{
            color: "#17236D",
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: "19.49px",
            textTransform: "inherit",
            textDecoration: "underline",

            ":hover": {
              backgroundColor: "transparent",
              textDecoration: "underline",
            },

            [theme.breakpoints.down("md")]: {
              lineHeight: "14.36px",
            },
          }}
        >
          <DialogActions>
            <Button
              autoFocus
              onClick={handleClose1}
              sx={{
                color: "#17236D",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "19.49px",
                textTransform: "inherit",
                textDecoration: "underline",

                ":hover": {
                  backgroundColor: "transparent",
                  textDecoration: "underline",
                },
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Grid>
      </Grid>
      {clinicalDoc &&
        clinicalDoc?.map((data, index) => (
          <DialogContent
            key={index}
            sx={{
              padding: "0px 10px 0px 0px",
              margin: "20px 20px 20px 0px",
              overflowX: "hidden",
            }}
          >
            <DialogContentText
              sx={{
                padding: "0px",
              }}
            >
              <Box
                sx={{
                  mb: 2,
                  pl: 3,
                  pt: 2,
                  pb: 2,
                  [theme.breakpoints.down("md")]: {
                    pt: 0,
                  },
                }}
              >
                <Box sx={{ mb: 2 }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: "16px",
                      lineHeight: "27.23px",
                      color: "#000",
                      padding: "0px",
                      textTransform: "initial",
                    }}
                  >
                    {data?.description}
                  </Typography>
                </Box>
                <Grid container>
                  <Grid item xs={6} sm={6} md={3} lg={3} xl={3}>
                    <StyledBox
                      sx={{
                        padding: "0px",
                      }}
                    >
                      <Box>
                        <StyledHead>Source</StyledHead>
                        <Typography
                          sx={{
                            display: "block",
                            color: "#242424",
                            fontWeight: 600,
                            fontSize: "1rem",
                            lineHeight: "1.218rem",
                            width: "100%",
                            pt: 1,
                          }}
                        >
                          {data?.source}
                        </Typography>
                      </Box>
                    </StyledBox>
                  </Grid>

                  <Grid item xs={6} sm={6} md={3} lg={3} xl={3}>
                    <StyledBox>
                      <Divider
                        orientation="vertical"
                        sx={{
                          height: "2.125rem",
                          mx: { sm: 1, md: 2, lg: 3 },

                          [theme.breakpoints.down("md")]: {
                            mr: 2,
                          },
                        }}
                      />
                      <Box>
                        <StyledHead>Section</StyledHead>
                        <Typography
                          sx={{
                            display: "block",
                            color: "#242424",
                            fontWeight: 600,
                            fontSize: "1rem",
                            lineHeight: "1.218rem",
                            pt: 1,
                          }}
                        >
                          {data?.Section}
                        </Typography>
                      </Box>
                    </StyledBox>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    sm={6}
                    md={3}
                    lg={3}
                    xl={3}
                    sx={{
                      [theme.breakpoints.down("md")]: {
                        mt: 2,
                      },
                    }}
                  >
                    <StyledBox
                      sx={{
                        [theme.breakpoints.down("md")]: {
                          justifyContent: "left",
                          padding: "0px",
                        },
                      }}
                    >
                      <Divider
                        orientation="vertical"
                        sx={{
                          height: "2.125rem",
                          mr: { sm: 1, md: 2, lg: 3 },

                          [theme.breakpoints.down("md")]: {
                            display: "none",
                          },
                        }}
                      />
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",

                          [theme.breakpoints.down("md")]: {
                            justifyContent: "left",
                          },
                        }}
                      >
                        <Box>
                          <StyledHead>Date</StyledHead>
                          <Typography
                            sx={{
                              display: "block",
                              color: "#242424",
                              fontWeight: 600,
                              fontSize: "1rem",
                              lineHeight: "1.218rem",
                              pt: 1,
                            }}
                          >
                            {data?.date}
                          </Typography>
                        </Box>
                      </Box>
                    </StyledBox>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    sm={6}
                    md={3}
                    lg={3}
                    xl={3}
                    sx={{
                      textAlign: "end",

                      [theme.breakpoints.down("md")]: {
                        mt: 2,
                      },
                    }}
                  >
                    <Link to={data?.view_ccda_url}>
                      <Button
                        sx={{
                          backgroundColor: "#17236D",
                          borderRadius: "5px",
                          width: "130px",
                          fontWeight: 500,
                          fontSize: "0.875rem",
                          color: "#fff",
                          textTransform: "initial",

                          ":hover": {
                            backgroundColor: "#17236D",
                          },
                        }}
                      >
                        View C-CDA
                        <Typography sx={{ pl: 1 }}>
                          <ArrowUpIcon />
                        </Typography>
                      </Button>
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </DialogContentText>
          </DialogContent>
        ))}
    </Dialog>
  );
};

export default Documentmodal;
