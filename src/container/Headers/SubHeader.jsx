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
import { isSlugOrJwt } from "../../utils/helper";

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
  const newPatientInfo = localStorage.getItem("patientInfo") || {};

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

  const [genderDisp, setGenderDisp] = useState(false);

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
  const params = window.location.pathname;

  const slug = isSlugOrJwt();

  useEffect(() => {
    dispatch(patientInfo()).then((res) => {
      if (res?.payload?.patient_first_name !== "" && res?.payload?.patient_last_name !== "") {
        setGenderDisp(true)
      }
    });
  }, []);


  return (
    <Box sx={{ flexGrow: 1 }} >
      <Box

        className="subTop__header"
        sx={{
          backgroundColor: "white",
          height: "50px",
          ...flexAlignCenter,

          [theme.breakpoints.down('sm')]: {
            padding: "10px 0"
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

            [theme.breakpoints.down("md")]: {
              display: "none",
            },

            [theme.breakpoints.down("sm")]: {
              padding: "5px !important",
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
                            [theme.breakpoints.down("md")]: {
                              display: "none",
                            },
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
                      <Typography sx={(keys === "MRN") ? {
                        p: 0.2, fontWeight: 'bold',
                      } : {
                        [theme.breakpoints.down("md")]: {
                          display: "none",
                        },
                      }}>
                        {keys}:
                      </Typography>
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
                              fontSize: '13px'
                            }
                          }
                          : (
                            keys === 'MRN' ? {
                              [theme.breakpoints.down("md")]: {
                                fontSize: '13px',
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                maxWidth: 'rem'
                              },

                              [theme.breakpoints.down("sm")]: {
                                display: "-webkit-box",
                                overflow: "hidden",
                                WebkitLineClamp: 3, // Capitalized as per CSS property standards
                                WebkitBoxOrient: "vertical",
                              },

                            } : keys === "DoB" && {
                              [theme.breakpoints.down("md")]: {
                                fontSize: '13px',
                              },
                              [theme.breakpoints.down("md")]: {
                                display: "none",
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

                          }}
                        >
                          {
                            genderDisp && patientGender && (
                              (patientGender === 'Male') ? (
                                <Typography component='span'>
                                  (Male)
                                </Typography>
                              ) : (
                                <Typography component='span'>
                                  (Female)
                                </Typography>
                              )
                            )
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
          </Box>
        </Container>


        <Container
          maxWidth="xl"
          sx={{
            padding: "0px 50px !important",
            [theme.breakpoints.down("md")]: {
              padding: "10px !important",
            },

            [theme.breakpoints.up("md")]: {
              display: "none",
            },

            [theme.breakpoints.down("sm")]: {
              padding: "5px !important",
            },

          }}
        >

          {Object.entries(obj)?.map(([keys, value], index) => (
            <>
              <Box sx={{ ...flexAlignCenter, gap: { md: 0.6 }, marginBottom: "2px" }}>

                <Typography sx={keys !== "Patient" ? { display: "none" } : { fontSize: "13px", color: " #00000099", fontWeight: "600" }} >
                  {keys}:
                </Typography>
                <Typography sx={keys !== "Patient" ? { display: "none", color: " #000000" } : { fontSize: "13px", color: " #000000", marginLeft: "10px", fontWeight: "600" }} >
                  {value}
                </Typography>
                {keys === "Patient" && (
                  <Box
                    sx={{
                      borderRadius: "100%",
                      height: "1.7rem",
                      width: "1.7rem",
                      ml: 2,
                      ...flexCenter,

                    }}
                  >
                    {
                      genderDisp && patientGender && (
                        (patientGender === 'Male') ? (
                          <Typography sx={{ fontSize: "13px", color: " #000000", marginLeft: "8px", fontWeight: "600" }} component='span'>
                            (Male)
                          </Typography>
                        ) : (
                          <Typography sx={{ fontSize: "13px", color: " #000000", marginLeft: "8px", fontWeight: "600" }} component='span'>
                            (Female)
                          </Typography>
                        )
                      )
                    }
                  </Box>
                )}
              </Box>
            </>
          ))}

          <Box sx={{ ...flexAlignCenter }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row-reverse",


              }}
            >
              {Object.entries(obj)?.map(([keys, value], index) => (
                <>
                  <Box sx={{ ...flexAlignCenter }}>

                    <Typography sx={(keys === "MRN") ? {
                      fontSize: "13px", color: " #00000099", fontWeight: "600"
                    } : (keys === "DoB") ? {
                      [theme.breakpoints.down("md")]: {
                        fontSize: "13px", color: " #00000099", fontWeight: "600", marginLeft: "10px"
                      },
                    } : {
                      [theme.breakpoints.down("md")]: {
                        display: "none",
                      }
                    }}>
                      {keys}:
                    </Typography>
                    <Typography sx={(keys === "MRN") ? {
                      fontSize: "13px", color: " #000000", fontWeight: "600", marginLeft: "10px"
                    } : (keys === "DoB") ? {
                      [theme.breakpoints.down("md")]: {
                        fontSize: "13px", color: " #000000", fontWeight: "600", marginLeft: "10px"
                      },
                    } : {
                      [theme.breakpoints.down("md")]: {
                        display: "none",
                      }
                    }}>
                      {keys === "MRN" ?
                        (value ? value.toString().substr(0, 8) : '') :
                        (keys === 'DoB' ?
                          (value ? `${value.toString()} (${patientAge || 'N/A'} yrs)` : '') :
                          (value || ''))
                      }

                    </Typography>



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
