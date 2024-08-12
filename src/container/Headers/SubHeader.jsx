import React, { useEffect, useState } from "react";
import moment from 'moment';
import {
  Box,
  Container,
  Divider,
  Typography,
  styled,
  useTheme,
  Grid,
} from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';

import {
  ArrowDropDownIcon,
  ArrowDropUpIcon
} from "../../components";
import { PrimaryButton } from "../../components/Button";
import Drawer from "@mui/material/Drawer";
import "./SubHeader.css";
import useAppContext from "../../hooks/useAppContext";
import { patientInfo, patientSummary } from '../../redux/userSlice/patientInfoSlice';

const StyledText = styled("span")(() => ({
  color: "#000000",
  fontSize: "14px",
  lineHeight: "1.3rem",
  fontWeight: 500,
  paddingLeft: "0px",
  fontWeight: "600"
}));
const StyledSubText = styled(Typography)(({ theme }) => ({
  color: "#00000099",
  fontSize: "0.875rem",
  lineHeight: "1.2rem",
  fontWeight: 500,
  paddingRight: "0px",

  [theme.breakpoints.down("md")]: {
    color: "#000",
  },
}));


export const SubHeader = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { state, setState } = useAppContext();
  const [patientAge, setPatientAge] = useState(0);
  const [patientGender, setPatientGender] = useState(null);

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const { summary } = useSelector(state => state?.user?.data);
  const { isLoading, user } = useSelector((state) => state);
  let obj = {};
  if (!isLoading) {
    const { userInfo } = user?.data;

    if (Object.keys(userInfo || {})?.length) {
      const { mrn, patient_first_name, patient_last_name, get_gender_display, dob } = userInfo;
      patientGender !== get_gender_display && setPatientGender(get_gender_display);
      const today = new Date();
      let age = dob ? moment(today).diff(dob, 'years') : null;
      age !== patientAge && setPatientAge(age);
      const patientDob = dob ? moment(dob).format('DD   MMMM YYYY') : null;
      obj = {
        Patient: patient_first_name + " " + patient_last_name,
        DoB: patientDob,
        MRN: mrn,
      }
    }
  }
  const params = window.location.pathname
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const slug = urlParams.get('slug');
  useEffect(() => {
    dispatch(patientInfo());
    if (slug) {
      dispatch(patientSummary());
    }
  }, []);


  return (
    <Box sx={{ flexGrow: 1 }} >
      <Box
        sx={{
          backgroundColor: "white",
          height: "50px",
          ...flexAlignCenter,

          [theme.breakpoints.down("md")]: {
            zIndex: state["top"] && 9999,
            position: state["top"] && "relative",
            background: state["top"] && "#fff",
          },
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            padding: "0px 50px !important",
            [theme.breakpoints.down("md")]: {
              padding: "10px !important",
            },
          }}
        >
          <Box sx={{ ...flexAlignCenter }}>
            <Box
              sx={{
                [theme.breakpoints.up("md")]: {
                  display: "flex",
                  marginLeft: "-0.5rem",
                },
                [theme.breakpoints.down('md')]: {

                }

              }}
            >
              {Object.entries(obj)?.map(([keys, value], index) => (
                <>
                  <Box sx={{ ...flexAlignCenter, gap: { md: 0.6 } }}>
                    <StyledSubText
                      sx={
                        keys !== "MRN"
                          ? {
                            // [theme.breakpoints.down("md")]: {
                            //   display: "none",
                            // },
                            [theme.breakpoints.down('md')]: {
                              fontSize: '0.675rem',
                            }
                          }
                          : {
                            paddingLeft: 0, [theme.breakpoints.down('md')]: {
                              fontSize: '0.675rem',
                              ml: "8px"
                            }
                          }
                      }
                    >
                      <Typography sx={{ p: 0.2, fontWeight: 'bold' }}>  {keys}:</Typography>
                    </StyledSubText>
                    <StyledText
                      sx={
                        keys === "Patient"
                          ? {
                            [theme.breakpoints.up("md")]: {
                              display: "flex",
                              alignItems: "center",
                              gap: 0.6,
                            },
                            [theme.breakpoints.down('md')]: {
                              fontSize: '0.675rem'
                            }
                          }
                          : (
                            keys === 'MRN' ? {
                              [theme.breakpoints.down("md")]: {
                                fontSize: '0.675rem',
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                maxWidth: 'rem'
                              },
                            } : keys === "DoB" && {
                              [theme.breakpoints.down("md")]: {
                                fontSize: '0.675rem',
                              },
                            }
                          )
                      }
                    >
                      {value}
                      {keys === 'DoB' && `(${patientAge} yrs)`}
                      {keys === "Patient" && (
                        <Box
                          sx={{
                            borderRadius: "100%",
                            height: "1.7rem",
                            width: "1.7rem",
                            ml: 2,
                            ...flexCenter,
                            [theme.breakpoints.down("md")]: {
                              display: "none",
                            },
                          }}
                        >
                          {(patientGender === 'Male') ? <Typography component='span' >
                            (Male)
                          </Typography> : <Typography component='span'>
                            (Female)
                          </Typography>
                          }
                        </Box>
                      )}
                    </StyledText>
                    {Object.entries(obj)?.length - 1 !== index && (
                      <Divider
                        orientation="vertical"
                        sx={{
                          [theme.breakpoints.down("md")]: {
                            display: "none",
                          },
                          mx: { sm: 1, md: 2, lg: 3 },
                        }}
                      />
                    )}
                  </Box>
                </>
              ))}
            </Box>
            <Box
              sx={{
                ...flexAlignCenter,
                [theme.breakpoints.up("md")]: {
                  display: "none",
                },
              }}
            >
              <Box
                sx={{
                  width: "0.0625rem",
                  height: "2.75rem",
                  background: "#D9D9D9",
                  ml: 2,
                  mr: 1,

                }}
              />
              <Box sx={{
                ...flexCenter, gap: "1.05rem", [theme.breakpoints.up("md")]: {
                  display: "none",
                },
              }}>
                <React.Fragment>
                  <StyledText
                    sx={{ ...flexCenter, gap: 1 }}
                    onClick={toggleDrawer("top", !state["top"])}
                  >
                    Pending actions
                    <Box
                      sx={{
                        borderRadius: " 1.875rem",
                        background: theme.palette.error.A200,
                        color: theme.palette.error.main,
                        width: "2.375rem",
                        height: "1.5625rem",
                        ...flexCenter,
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          textAlign: "center",
                          lineHeight: "160%",
                          fontWeight: 600,
                        }}
                      >

                        {(summary?.recapture_codes_count + summary?.suspect_conditions_count + summary?.existing_codes_count) || 0}
                      </Typography>
                    </Box>
                  </StyledText>
                  {state["top"] ? (
                    <ArrowDropUpIcon
                      onClick={toggleDrawer("top", false)}
                      width={" 0.75rem"}
                      height={"0.5rem"}
                      fill={"black"}
                    />
                  ) : (
                    <ArrowDropDownIcon
                      onClick={toggleDrawer("top", true)}
                      width={" 0.75rem"}
                      height={"0.5rem"}
                      fill={"black"}
                    />
                  )}

                  <Drawer
                    anchor={"top"}
                    open={state["top"]}
                    onClose={toggleDrawer("top", false)}
                    className="MuiDrawerTop"
                    sx={{
                      [theme.breakpoints.up("md")]: {
                        display: "none",
                      }
                    }}
                  >
                    <Box
                      sx={{
                        px: 2,
                        py: 2,
                      }}
                    >
                      <Grid container>
                        <Grid item lg={2} md={2} sm={1.5} xs={3}>
                          <PrimaryButton
                            sx={{
                              width: "2.375rem",
                              height: "1.5625rem",
                              backgroundColor: "#F200001A",
                              color: theme.palette.error.main,
                              ":hover": {
                                backgroundColor: "#F200001A",
                              },
                              fontWeight: 600,
                              minWidth: "inherit",
                              fontSize: "0.875rem",
                            }}
                          >
                            {summary?.existing_codes_count || 0}
                          </PrimaryButton>
                        </Grid>
                        <Grid
                          item
                          lg={10}
                          md={10}
                          sm={10.5}
                          xs={9}
                          sx={{ pl: 1 }}
                        >
                          <Typography
                            sx={{
                              fontSize: "1rem",
                              color: "rgba(0, 0, 0, 0.60);",
                              fontWeight: "600",
                              lineHeight: "1.375rem",
                              textTransform: "initial",
                            }}
                          >
                            You have { }
                            <Typography
                              sx={{
                                color: "#000;",
                              }}
                            >
                              {summary?.existing_codes_count || 0}
                            </Typography>
                            { } urgent existing conditions requiring recapturing.
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid container sx={{ my: 2 }}>
                        <Grid item lg={2} md={2} sm={1.5} xs={3}>
                          <PrimaryButton
                            sx={{
                              width: "2.375rem",
                              height: "1.5625rem",
                              backgroundColor: "#F200001A",
                              color: theme.palette.error.main,
                              ":hover": {
                                backgroundColor: "#F200001A",
                              },
                              fontWeight: 600,
                              minWidth: "inherit",
                              fontSize: "0.875rem",
                            }}
                          >
                            {summary?.suspect_conditions_count || 0}
                          </PrimaryButton>
                        </Grid>
                        <Grid
                          item
                          lg={10}
                          md={10}
                          sm={10.5}
                          xs={9}
                          sx={{ pl: 1 }}
                        >
                          <Typography
                            sx={{
                              fontSize: "1rem",
                              color: "rgba(0, 0, 0, 0.60);",
                              fontWeight: "600",
                              lineHeight: "1.375rem",
                              textTransform: "initial",
                            }}
                          >
                            You have { }
                            <Typography
                              sx={{
                                color: "#000;",
                              }}
                            >
                              {summary?.suspect_conditions_count || 0}
                            </Typography>
                            { }  urgent new suspects for review.
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid container sx={{ my: 2 }}>
                        <Grid item lg={2} md={2} sm={1.5} xs={3}>
                          <PrimaryButton
                            sx={{
                              width: "2.375rem",
                              height: "1.5625rem",
                              backgroundColor: "#F200001A",
                              color: theme.palette.error.main,
                              ":hover": {
                                backgroundColor: "#F200001A",
                              },
                              fontWeight: 600,
                              minWidth: "inherit",
                              fontSize: "0.875rem",
                            }}
                          >
                            {summary?.recapture_codes_count || 0}
                          </PrimaryButton>
                        </Grid>
                        <Grid
                          item
                          lg={10}
                          md={10}
                          sm={10.5}
                          xs={9}
                          sx={{ pl: 1 }}
                        >
                          <Typography
                            sx={{
                              fontSize: "1rem",
                              color: "rgba(0, 0, 0, 0.60);",
                              fontWeight: "600",
                              lineHeight: "1.375rem",
                              textTransform: "initial",
                            }}
                          >
                            You have { }
                            <Typography
                              sx={{
                                color: "#000;",
                                pr: 0.5,
                              }}
                            >
                              {summary?.recapture_codes_count || 0}
                            </Typography>
                            { } existing conditions that are not in the problem list.
                          </Typography>
                        </Grid>
                      </Grid>
                      {/* <Grid container >
                        <Grid item lg={2} md={2} sm={1.5} xs={3} >
                          <PrimaryButton

                            sx={{
                              width: "2.375rem",
                              height: "1.5625rem",
                              backgroundColor: "#F200001A",
                              color: theme.palette.error.main,
                              ":hover": {
                                backgroundColor: "#F200001A",
                              },
                              fontWeight: 600,
                              minWidth: "inherit",
                              fontSize: "0.875rem",
                            }}
                          >
                            {summary?.duplicate_codes_count || 0}
                          </PrimaryButton>
                        </Grid>
                        <Grid
                          item
                          lg={10}
                          md={10}
                          sm={10.5}
                          xs={9}
                          sx={{ pl: 1 }}
                        >
                          <Typography
                            sx={{
                              fontSize: "1rem",
                              color: "rgba(0, 0, 0, 0.60);",
                              fontWeight: "600",
                              lineHeight: "1.375rem",
                              textTransform: "initial",
                            }}
                          >
                            You have  { }
                            <Typography
                              sx={{
                                color: "#000;",
                              }}
                            >
                              {summary?.duplicate_codes_count || 0}
                            </Typography>
                            { } Duplicate Codes
                          </Typography>
                        </Grid>
                      </Grid> */}
                    </Box>
                  </Drawer>
                </React.Fragment>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box >
  );
};

const flexAlignCenter = {
  display: "flex",
  alignItems: "center",
};
const flexCenter = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};
