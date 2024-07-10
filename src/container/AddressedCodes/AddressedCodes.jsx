import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTheme } from "@emotion/react";
import { Box, Divider, Grid, Typography, styled, Tooltip } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useDispatch, useSelector } from "react-redux";
import { patientAddressCode } from "../../redux/userSlice/patientInfoSlice";
import { patientClinicalDocument } from "../../redux/userSlice/petientClinicalSlice";

import "../../Screens/Codes/Codes.css";
import { TabsSlag } from "../TabsSlag/TabsSlag";
import { DocIcon, ArrowUpIcon } from "../../components";

import {
  StyleCode,
  StyledText,
  StyledHeader,
  StyledBox,
  StyledAccordingBox,
} from "../Common/StyledMuiComponents";

const StyledHead = styled(Typography)(({ theme }) => ({
  color: "#00000075",
  fontSize: "0.875rem",
  fontWeight: "400",
  lineHeight: "1.066",
  textTransform: "uppercase",
  padding: "0px",
  display: "block",
}));

export const AddressedCodes = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const tabs = TabsSlag();
  const [addressCodes, setAddressCodes] = useState([]);
  const [clinicalDoc, setClinicalDoc] = useState(null);
  const [open, setOpen] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const state = useSelector((state) => state?.user?.data?.adressCode);

  let array = [];

  const result =
    state &&
    Object.entries(state)?.map(([code, info]) => {
      const alternateCodes = Object.entries(info?.alternate_codes || {})?.map(
        ([altCode, altInfo]) => ({
          code: altCode,
          ...altInfo,
          isCollapse: false,
        })
      );

      return {
        code,
        info: {
          ...info,
          alternate_codes: alternateCodes,
          isCollapse: false,
        },
        collapse: false,
      };
    });

  result?.length !== addressCodes?.length && setAddressCodes(result);

  useEffect(() => {
    dispatch(patientAddressCode());
  }, []);

  const handleClinicalDoc = async (item) => {
    let data = await dispatch(
      patientClinicalDocument({
        code: item.code,
        code_type: "addressed-code",
      })
    );
    setClinicalDoc(data.payload);
    setOpen(true);
  };

  const handleClose1 = () => {
    setOpen(false);
  };

  const handleCollapse = (code) => {
    let changeData = addressCodes?.map((value) => {
      return value?.code === code
        ? ((value.collapse = !value?.collapse), value)
        : value;
    });
    setAddressCodes(changeData);
  };

  return (
    <Box className="ContentBox">
      <Box sx={{ ...flexAlignCenter, flexDirection: "column" }}>
        <StyledHeader>
          <Grid
            container
            spacing={0}
            className="ContentBody"
            sx={{ padding: "0px 10px 5px", backgroundColor: "#fff" }}
          >
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}
            >
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <StyledBox
                  sx={{
                    [theme.breakpoints.only("md")]: {
                      pl: 0,
                    },
                  }}
                  className="acc-content-header-items"
                >
                  <StyledText className="acc-content-header-item ct-code">
                    Code(s)
                  </StyledText>
                  <StyledText className="acc-content-header-item ct-desc">
                    Description
                  </StyledText>
                  {tabs && tabs["patient_dashboard_weights"]?.active && (
                    <StyledText className="acc-content-header-item ct-raf">
                      RAF
                    </StyledText>
                  )}
                </StyledBox>
              </Grid>
              {/* <Grid item xs={5.7} sm={5.2} md={6} lg={4.5} xl={4.5} >
                <Grid
                  container >
                </Grid>
              </Grid> */}
            </Grid>
          </Grid>
        </StyledHeader>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {addressCodes?.length > 0 &&
          addressCodes?.map((item, index) => {
            return (
              <Box key={index}>
                <StyledAccordingBox>
                  {/* Body content start */}
                  <Grid
                    container
                    spacing={0}
                    className="ContentBody"
                    sx={{
                      padding: "10px 10px 10px",
                      backgroundColor: "#fff",
                      borderRadius: index === 0 ? 0 : "10px",
                    }}
                  >
                    {/* Content - Code */}
                    <Grid item className="acc-content-header-item ct-code">
                      <StyleCode
                        sx={{
                          verticalAlign: "top",
                          ml: 0.5,
                          maxWidth: "100%",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          [theme.breakpoints.only("md")]: {
                            mr: 2,
                          },
                          [theme.breakpoints.down("md")]: {
                            mt: 0.5,
                          },
                          [theme.breakpoints.up("md")]: {
                            mr: 2,
                            mt: 1.5,
                          },
                        }}
                      >
                        {item?.code?.length > 11 ? (
                          <Tooltip title={item?.code}>{item?.code}</Tooltip>
                        ) : (
                          item?.code
                        )}
                      </StyleCode>
                    </Grid>

                    {/* Content - Description */}
                    <Grid item className="acc-content-header-item ct-desc">
                      {/* Collapsed view */}
                      {!item?.collapse ? (
                        <Box
                          sx={{
                            [theme.breakpoints.only("lg")]: {
                              width: "80%",
                            },

                            [theme.breakpoints.only("md")]: {
                              width: "95%",
                            },
                            width: "90%",
                          }}
                          className="acc-content-body-desc"
                        >
                          <StyledText
                            sx={{
                              fontWeight: 400,
                              padding: "0",
                              overflow: "hidden",
                              maxWidth: "100%",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              textTransform: "inherit",
                              display: "inline-block",
                              verticalAlign: "bottom",
                              [theme.breakpoints.up("md")]: {
                                fontSize: "90%",
                              },
                              [theme.breakpoints.down("md")]: {
                                ml: "8px",
                                fontSize: "85%",
                              },
                            }}
                          >
                            {item?.info?.value}
                          </StyledText>
                          <StyledText
                            sx={{
                              fontWeight: 500,
                              textDecorationLine: "underline",
                              color: theme.palette.secondary.main,
                              display: "inline-block",
                              cursor: "pointer",
                              flexShrink: 0,
                              fontSize: "85%",
                              [theme.breakpoints.up("md")]: {
                                ml: "20px",
                                fontSize: "90%",
                              },
                              [theme.breakpoints.down("md")]: {
                                ml: "8px",
                                fontSize: "85%",
                                display: "block",
                              },
                            }}
                            onClick={() => handleCollapse(item.code)}
                          >
                            See All
                          </StyledText>
                        </Box>
                      ) : (
                        <Grid container>
                          {/* Expanded view */}
                          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <StyledText
                              sx={{
                                fontWeight: 400,
                                width: "100%",
                                // maxWidth: "35rem",
                                padding: "0",
                                textTransform: "inherit",
                                display: "inline-block",
                                verticalAlign: "bottom",
                              }}
                            >
                              {item?.info?.value}
                            </StyledText>
                          </Grid>
                          <Grid item xs={6} sm={12} md={12} lg={6} xl={6}>
                            <Box
                              sx={{
                                my: 1,
                                fontSize: "14px",
                                fontWeight: 400,
                                lineHeight: "25px",
                                letterSpacing: "0em",
                                display: "inline-block",
                              }}
                            >
                              Noted by:
                              <Typography
                                sx={{
                                  fontSize: "14px",
                                  fontWeight: 700,
                                  lineHeight: "25px",
                                  letterSpacing: "0.02em",
                                  paddingLeft: "4px",
                                }}
                              >
                                {item?.info?.noted_by}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6} sm={12} md={12} lg={6} xl={6}>
                            <Box
                              sx={{
                                fontSize: "14px",
                                fontWeight: 500,
                                lineHeight: "25px",
                                letterSpacing: "0em",
                                display: "inline-block",
                                [theme.breakpoints.up("lg")]: {
                                  ml: 2,
                                  my: 1,
                                },
                              }}
                            >
                              Date:
                              <Typography
                                sx={{
                                  fontSize: "14px",
                                  fontWeight: 700,
                                  lineHeight: "25px",
                                  letterSpacing: "0.02em",
                                  paddingLeft: "4px",
                                }}
                              >
                                {item?.info?.noted_date}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Box
                              sx={{
                                my: 1,
                                fontSize: "14px",
                                fontWeight: 400,
                                lineHeight: "25px",
                                letterSpacing: "0em",
                                display: "inline-block",
                                color: "#00000099",
                              }}
                            >
                              Sources:
                              {item?.info?.sources?.map((source, index) => (
                                <Typography
                                  key={index}
                                  sx={{
                                    fontSize: "14px",
                                    fontWeight: 500,
                                    lineHeight: "24px",
                                    color: "#242424",
                                    pl: 1,
                                    background: "#DEE9FF",
                                    borderRadius: "2.5rem",
                                    height: "1.438rem",
                                    padding: "0.219rem 1.25rem",
                                    ml: 1,
                                  }}
                                >
                                  {source}
                                </Typography>
                              ))}
                            </Box>
                          </Grid>
                          {tabs &&
                            tabs["patient_dashboard_view_document"]?.active && (
                              <Box
                                onClick={() => handleClinicalDoc(item)}
                                className="acc-content-links-docview-cta"
                                sx={{
                                  textAlign: "end",
                                  [theme.breakpoints.only("md")]: {
                                    display: "none",
                                  },
                                  cursor: "pointer",
                                }}
                              >
                                <DocIcon className="acc-content-links-docview-icon" />
                                <Typography
                                  className="acc-content-links-docview-text"
                                  sx={{
                                    fontSize: "0.875rem",
                                    fontWeight: 500,
                                    lineHeight: "1.563rem",
                                    letterSpacing: "0.02em",
                                    color: "#17236D",
                                    textDecoration: "underline",
                                    verticalAlign: "bottom",
                                    pl: 0.5,
                                  }}
                                >
                                  View Documents
                                </Typography>
                              </Box>
                            )}
                          <StyledText
                            className="acc-content-collapse-see-less"
                            sx={{
                              fontWeight: 500,
                              textDecorationLine: "underline",
                              color: "#3D4A8F",
                              ml: 1,
                              letterSpacing: "0.02em",
                              m: 0,
                              cursor: "pointer",
                            }}
                            onClick={() => handleCollapse(item.code)}
                          >
                            See Less
                          </StyledText>
                        </Grid>
                      )}
                    </Grid>

                    {/* Content - RAF */}
                    {tabs && tabs["patient_dashboard_weights"]?.active && (
                      <Grid item className="acc-content-header-item ct-raf">
                        {tabs && tabs["patient_dashboard_weights"]?.active && (
                          <StyledText
                            sx={{
                              [theme.breakpoints.only("xl")]: {
                                pr: 1,
                              },
                              [theme.breakpoints.only("md")]: {
                                justifyContent: "start",
                              },
                            }}
                          >
                            {item?.info?.total_weight}
                          </StyledText>
                        )}
                      </Grid>
                    )}
                  </Grid>
                  {/* Body content end */}
                </StyledAccordingBox>
              </Box>
            );
          })}
      </Box>

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
                fontWeight: 300,
                lineHeight: "24.36px",
              }}
            >
              Clinical Documents ({clinicalDoc && clinicalDoc?.length})
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
              fontWeight: 300,
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
                  fontWeight: 300,
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
                        fontWeight: 500,
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
    </Box>
  );
};

const flexAlignCenter = {
  display: "flex",
  alignItems: "center",
};
