
import React, { useEffect, useState, useRef } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import { Container, Grid, Typography, styled, useTheme } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useDispatch, useSelector } from "react-redux";
import "./Header.css";
import useAppContext from "../../hooks/useAppContext";
import { TabsSlag } from "../TabsSlag/TabsSlag";
import { doctorInfo } from "../../redux/userSlice/doctorInfoSlice";
import { DTLogo, FlagIcon } from "../../components";
import { DialogModal } from "../../components/Modal/DialogModal";
import { patientTabFlag } from "../../redux/userSlice/patientInfoSlice";
import { isSlugOrJwt } from "../../utils/helper";

const StyleText = styled(Typography)(() => ({
  fontSize: "13px",
  fontWeight: "500",
  lineHeight: "20.8px",
  letterSpacing: "0.01em",
  width: "100%",
  color: "#131E5E",
}));

const StyleLogo = styled("div")(({ theme }) => ({
  width: 71,
  height: 47,
  [theme.breakpoints.down("md")]: {
    width: 71,
    height: 47,
  },
  [theme.breakpoints.down("xs")]: {
    width: 71,
    height: 47,
  },
}));

const StyleTabText = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  lineHeight: "22.4px",
  letterSpacing: "1%",
  fontWight: 600,
  textTransform: "capitalize",
  color: theme.palette.secondary.main,
}));

const StyleNumber = styled(Typography)(({ theme }) => ({
  color: "#475467",
  fontWeight: 700,
  fontSize: "14px",
  lineHeight: "20px",
  padding: "0px",
}));

const tabStyle = {
  default_tab: {
    fontSize: "14px",
    lineHeight: "22px",
    fontWeight: "400px",
    color: "#7C85AB",
  },
  active_tab: {
    color: "#17236D",
    fontSize: "14px",
    lineHeight: "22px",
    fontWeight: 600,
  },
};

const StyleButton = styled(Button)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "2.5rem",
  fontSize: "1rem",
  fontWeight: 600,
  borderRadius: "0.5rem",
  textTransform: "capitalize",
}));

const slug = isSlugOrJwt();

export const Header = ({ sessionObject }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tabs = TabsSlag();
  const theme = useTheme();
  const [showheader, setShowHeader] = useState(false);

  const [sessionObjLoaded, setSessionObjLoaded] = useState(false);
  const [value, setValue] = useState(0);
  const { doctorDetail } = useSelector((state) => state?.doctor?.data);
  const getActiveTab = (i) => {
    setValue(i);
  };
  const userDetail = useSelector((state) => state?.user?.data?.userInfo);

  const { state } = useAppContext();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [open2, setOpen2] = useState(false);
  // Initialize sessionLength with useRef
  const sessionLength = useRef(0);

  useEffect(() => {
    if (
      sessionObject &&
      !sessionObjLoaded &&
      Object.keys(sessionObject).length > 0
    ) {
      sessionLength.current =
        sessionObject?.existingCode?.length +
        sessionObject?.existingCodeReject?.length +
        sessionObject?.suspectCode?.length +
        sessionObject?.suspectCodeReject?.length +
        sessionObject?.recaptureCode?.length +
        sessionObject?.recaptureCodeReject?.length +
        sessionObject?.duplicateCode?.length +
        sessionObject?.duplicateCodeReject?.length;
    }
  }, [sessionObject]);

  const handleCloseOpen2 = () => {
    setOpen2(false);
  };

  const checkResp = async () => {
    if (!slug) {
      return navigate(`/404`);
    } else {
      dispatch(patientTabFlag()).then(() => {
        setShowHeader(true);
      });
      let result = await dispatch(doctorInfo());
      if (result?.payload?.response?.status === 404) {
        return navigate(`/404`);
      } else {
        sessionLength.current > 0 && setOpen2(true);
      }
    }
  };

  useEffect(() => {
    let activeKey = 0;
    let key = routes.filter((item, index) => {
      if (item?.routesPath === location?.pathname) {
        activeKey = index;
        return index;
      }
    });

    getActiveTab(activeKey);
    checkResp();
  }, []);

  return (
    <>
      <Box
      className="header"
      sx={{backgroundColor:"white"}}
      >
        <AppBar
          position="static"
          sx={{
            backgroundColor: "transparent",
            boxShadow: "none",
            borderBottom: "1px solid #dddddd",
            color: "black",
          }}
        >
          <Container
            maxWidth="xl"
            sx={{
              padding: "0px 50px ",
              [theme.breakpoints.down("md")]: {
                padding: "0px 10px",
              },
            }}
          >
            <>
              <Grid container className="header__container" spacing={{ md: 2 }}>
                <Grid className="header__container_child1" item xs={12} md={5} sm={12} sx={{
                  alignItems: "center",
                }} >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: { xs: 3, md: 7, lg: 5 },
                      height: "3.75rem",
                      width: "100%",
                      [theme.breakpoints.down("sm")]: {
                        justifyContent: "space-between",
                      },


                    }}
                  >
                    <StyleLogo
                      onClick={() => {
                        getActiveTab(0);
                        navigate(`/`);
                      }}
                    >
                      <DTLogo width="100%" height="100%" />
                    </StyleLogo>
                    <Box sx={{ ...flexCenter, gap: { xs: 1, md: 1, lg: 4 } }}>
                      {routes?.length > 0 &&
                        routes?.map((item, i) => {
                          return item.name === "History" ? (
                            tabs &&
                            tabs["patient_dashboard_history_tab"]?.active && (
                              <Box
                                key={i}
                                onClick={() => {
                                  getActiveTab(i);
                                  navigate(item.path);
                                }}
                                sx={
                                  value === i
                                    ? {
                                      ...activeBorder,
                                      borderColor: "#E6682D",
                                    }
                                    : {
                                      ...activeBorder,
                                      borderColor: "transparent",
                                    }
                                }
                              >
                                <StyleTabText
                                  label={item?.name}
                                  sx={
                                    value === i
                                      ? {
                                        ...tabStyle?.active_tab,
                                      }
                                      : {
                                        ...tabStyle.default_tab,
                                      }
                                  }
                                >
                                  {item?.name}
                                </StyleTabText>
                              </Box>
                            )
                          ) : item.name === "My Profile" ? (
                            tabs &&
                            tabs["patient_dashboard_view_profile"]?.active && (
                              <Box
                                key={i}
                                onClick={() => {
                                  getActiveTab(i);
                                  navigate(item?.path);
                                }}
                                sx={
                                  value === i
                                    ? {
                                      ...activeBorder,
                                      borderColor: "#E6682D",
                                    }
                                    : {
                                      ...activeBorder,
                                      borderColor: "transparent",
                                    }
                                }
                              >
                                <StyleTabText
                                  label={item?.name}
                                  sx={
                                    value === i
                                      ? {
                                        ...tabStyle?.active_tab,
                                      }
                                      : {
                                        ...tabStyle.default_tab,
                                      }
                                  }
                                >
                                  {item?.name}
                                </StyleTabText>
                              </Box>
                            )
                          ) : (
                            <Box
                              key={i}
                              onClick={() => {
                                getActiveTab(i);
                                navigate(item?.path);
                              }}
                              sx={
                                value === i
                                  ? { ...activeBorder, borderColor: "#E6682D" }
                                  : {
                                    ...activeBorder,
                                    borderColor: "transparent",
                                  }
                              }
                            >
                              <StyleTabText
                                label={item?.name}
                                sx={
                                  value === i
                                    ? {
                                      ...tabStyle?.active_tab,
                                    }
                                    : {
                                      ...tabStyle.default_tab,
                                    }
                                }
                              >
                                {item?.name}
                              </StyleTabText>
                            </Box>
                          );
                        })}
                    </Box>
                  </Box>
                </Grid>

                {
                  tabs && (tabs?.patient_dashboard_recapture_percentage?.active || tabs?.patient_dashboard_suspect_percentage?.active) && doctorDetail?.doctor_name && ((doctorDetail?.recapture_percentage !== "-") || (doctorDetail?.suspects_addressed_percentage !== "-")) ?
                    <Grid item md={7} sm={12} className="suspect_recapture_header"
                      sx={(theme) => ({
                        ...(tabs &&
                          (tabs?.patient_dashboard_recapture_percentage?.active ||
                            tabs?.patient_dashboard_suspect_percentage?.active) &&
                          doctorDetail?.doctor_name
                          ? {
                            
                          }
                          : null)
                      })}

                    >
                      <Box
                        className="panel_metric_header"
                        sx={{
                          ...flexCenter,
                          // gap: { sm: 2, md: 0.9, lg: 1, xl: 1 },
                          width: "100%",
                          height: "3.75rem",
                          // justifyContent: "flex-end",
                          // [theme.breakpoints.down("sm")]: {
                          //   justifyContent: 'flex-start'
                          // },
                          [theme.breakpoints.down("lg")]: {},
                        }}
                      >

                        <Box sx={{ ...flexCenter, gap: 0.2, flexDirection: "column" }}>
                          <StyleText
                            sx={{
                              fontWeight: 600,
                              fontSize: "0.875rem",
                              color: "#000",

                              [theme.breakpoints.down("md")]: {
                                p: 0,
                              },
                            }}
                          >
                            Panel

                          </StyleText>

                          <StyleText
                            sx={{
                              fontWeight: 600,
                              fontSize: "0.875rem",
                              color: "#000",

                              [theme.breakpoints.down("md")]: {
                                p: 0,
                              },
                            }}
                          >

                            Metrics:
                          </StyleText>
                        </Box>

                        {tabs &&
                          (tabs["patient_dashboard_recapture_percentage"] || tabs["patient_dashboard_recapture_percentage"].active)
                          && (
                            <Box sx={{ ...flexCenter, gap: 0.4, flexDirection: "column" }}>
                              <StyleText
                                sx={{
                                  fontWeight: 600,

                                  fontSize: "12px",
                                  color: "#000",
                                  [theme.breakpoints.only("md")]: {
                                    p: 0,
                                  },
                                }}
                              >
                                Recapture
                              </StyleText>

                              <StyleText
                                sx={{
                                  fontFamily: "Proxima nova",
                                  color: theme.palette.success.main,
                                  fontWeight: 600,
                                  fontSize: "0.875rem",
                                  marginTop: "3px"
                                }}
                              >
                                {doctorDetail?.recapture_percentage || " - "}
                              </StyleText>
                            </Box>
                          )}

                        {tabs &&
                          (tabs["patient_dashboard_suspect_percentage"] || tabs["patient_dashboard_suspect_percentage"].active)

                          && (
                            <Box sx={{ ...flexCenter, gap: 0.4, flexDirection: "column" }}>
                              <StyleText
                                sx={{
                                  fontWeight: 600,
                                  fontSize: "12px",
                                  color: "#000",

                                }}
                              >
                                Suspects
                              </StyleText>
                              <StyleText
                                sx={{
                                  color: theme.palette.success.main,
                                  fontFamily: "Proxima nova",
                                  fontWeight: 600,
                                  fontSize: "0.875rem",
                                  marginTop: "3px"
                                }}
                              >
                                {doctorDetail?.suspects_addressed_percentage || " - "}
                              </StyleText>
                            </Box>
                          )}
                        <Box className="header_patient_name" sx={{ whiteSpace: "nowrap" }}>
                          <StyleText
                            sx={{
                              fontWeight: 600,
                              [theme.breakpoints.up(967)]: {
                                marginLeft: "50px"
                              },
                            }}
                          >
                            {doctorDetail?.doctor_name && doctorDetail?.doctor_name || " - "}
                          </StyleText>
                        </Box>
                      </Box>
                    </Grid> :
                    (doctorDetail?.doctor_name) ?
                      <Grid item md={7} sm={12} className="suspect_recapture_header"
                        sx={(theme) => ({
                          ...(tabs &&
                            (tabs?.patient_dashboard_recapture_percentage?.active ||
                              tabs?.patient_dashboard_suspect_percentage?.active) &&
                            doctorDetail?.doctor_name
                            ? {
                              [theme.breakpoints.down("sm")]: {
                                display: "none"
                              }
                            }
                            : null)
                        })}

                      >
                        <Box
                          className="panel_metric_header"
                          sx={{
                            ...flexCenter,
                            // gap: { sm: 2, md: 0.9, lg: 1, xl: 1 },
                            width: "100%",
                            height: "3.75rem",
                            // justifyContent: "flex-end",
                            // [theme.breakpoints.down("sm")]: {
                            //   justifyContent: 'flex-start'
                            // },
                            [theme.breakpoints.down("lg")]: {},
                          }}
                        >
                          <Box className="header_patient_name" sx={{ whiteSpace: "nowrap" }}>
                            <StyleText
                              sx={{
                                fontWeight: 600,
                                // [theme.breakpoints.down("lg")]: {
                                //   width: "10rem",
                                // },
                              }}
                            >
                              {doctorDetail?.doctor_name && doctorDetail?.doctor_name || " - "}
                            </StyleText>
                          </Box>
                        </Box>
                      </Grid>
                      : null}

              </Grid>
            </>
          </Container>
        </AppBar>

        <DialogModal
          open={open2}
          setOpen={setOpen2}
          header={<FlagIcon style={{ width: 55, height: 55 }} />}
          width="25rem"
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              mb: 3,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  display: "flex",
                  width: "90%",
                  fontSize: "18px",
                  fontWeight: 700,
                  lineHeight: "28px",
                  letterSpacing: "0em",
                  textAlign: "left",
                  color: "#101828",
                }}
              >
                Welcome back,{" "}
                {doctorDetail?.doctor_name && doctorDetail?.doctor_name}!
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#475467",
                }}
              >
                Your submissions are ready:
              </Typography>
            </Box>
            <Box>

              {/* Existing Code count */}
              {sessionObject?.existingCode?.length +
                sessionObject?.existingCodeReject?.length >
                0 && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#475467",
                    }}
                  >
                    <StyleNumber>
                      {sessionObject?.existingCode?.length +
                        sessionObject?.existingCodeReject?.length}
                    </StyleNumber>
                    {` urgent recaptures,`}
                  </Typography>
                )}

              {/* Duplicate code count */}
              {sessionObject?.duplicateCode?.length +
                sessionObject?.duplicateCodeReject?.length >
                0 && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#475467",
                    }}
                  >
                    <StyleNumber>
                      {sessionObject?.duplicateCode?.length +
                        sessionObject?.duplicateCodeReject?.length}
                    </StyleNumber>
                    {` Additional diagnoses,`}
                  </Typography>
                )}

              {/* Suspects count */}
              <Box
                sx={{
                  display: "flex",
                  gap: "0.4rem",
                }}
              >
                {sessionObject?.suspectCode?.length +
                  sessionObject?.suspectCodeReject?.length >
                  0 && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#475467",
                      }}
                    >
                      <StyleNumber>
                        {sessionObject?.suspectCode?.length +
                          sessionObject?.suspectCodeReject?.length}
                      </StyleNumber>
                      {` suspects`}
                    </Typography>
                  )}
                {sessionObject?.suspectCode?.length +
                  sessionObject?.suspectCodeReject?.length >
                  0 &&
                  sessionObject?.recaptureCode?.length +
                  sessionObject?.recaptureCodeReject?.length >
                  0 && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#475467",
                      }}
                    >
                      and
                    </Typography>
                  )}
                {sessionObject?.recaptureCode?.length +
                  sessionObject?.recaptureCodeReject?.length >
                  0 && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#475467",
                      }}
                    >
                      <StyleNumber>
                        {sessionObject?.recaptureCode?.length +
                          sessionObject?.recaptureCodeReject?.length}
                      </StyleNumber>
                      {` code not in your problem list.`}
                    </Typography>
                  )}
              </Box>
            </Box>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: "#475467",
                }}
              >
                Don’t forget to Submit the codes when ready.
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                mt: 2,
              }}
            >
              <StyleButton variant="outlined" onClick={handleCloseOpen2}>
                Close
              </StyleButton>
            </Box>
          </Box>
        </DialogModal>
      </Box>
    </>
  );
};
const routes = [
  { name: "Codes", routesPath: "/", path: `/` },
  { name: "History", routesPath: "/history", path: `/history` },
  {
    name: "My Profile",
    routesPath: "/my-profile",
    path: `/my-profile`,
  },
];


const flexCenter = {
  display: "flex",
  alignItems: "center",
};
const activeBorder = {
  display: "flex",
  alignItems: "center",
  height: "3.75rem",
  borderBottom: "3px solid",
  cursor: "pointer",
};
