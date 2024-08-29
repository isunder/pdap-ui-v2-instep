import React from "react";
import { Container, Grid, Typography, styled, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import { PrimaryButton } from "../../components/Button";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { doctorInfo } from "../../redux/userSlice/doctorInfoSlice";
import { TabsSlag } from "../../container/TabsSlag/TabsSlag";
import { isSlugOrJwt } from "../../utils/helper";

const StyleDiv = styled("div")(() => ({
  padding: "40px 0px",
}));

const StyleHead = styled("h1")(({ theme }) => ({
  fontSize: "24px",
  fontWeight: 600,
  marginBottom: "10px",
  lineHeight: "29.23px",
  color: theme.palette.primary.main,
}));

const StylePara = styled("Typography")(() => ({
  fontSize: "14px",
  fontWeight: 400,
  lineHeight: "17.05px",
  color: "#000",
  padding: "0px",
  opacity: 0.7,
  marginBottom: "20px",
  display: "flex",
}));

const StyleText = styled(Typography)(() => ({
  fontSize: "13px",
  fontWeight: "500",
  lineHeight: "20.8px",
  letterSpacing: "1%",
  width: "100%",
  color: "#131E5E",
  padding: "0px",
}));

const flexCenter = {
  display: "flex",
  alignItems: "center",
  width: "100%",
};

const CardDiv = styled("div")(() => ({
  display: "flex",
  width: "100%",
  background: "#fff",
  borderRadius: "10px",
  height: "50px",
  justifyContent: "space-between",
  padding: "0px 15px",
  alignItems: "center",
}));

export const MyProfile = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const queryString = window.location.search;
  const slug = isSlugOrJwt();
  const tabs = TabsSlag();
  const { doctorDetail } = useSelector(state => state.doctor.data);

  useEffect(() => {
    if (slug) {
      dispatch(doctorInfo());
    }
  }, []);

  return (
    <div>
      <StyleDiv>
        <Container
          sx={{
            [theme.breakpoints.down("md")]: {
              padding: "0px",
            },
          }}
          maxWidth="xl"
        >
          <StyleHead
            sx={{
              [theme.breakpoints.down("md")]: {
                padding: "0px 14px",
              },
            }}
          >
            My Profile
          </StyleHead>
          <StylePara
            sx={{
              [theme.breakpoints.down("md")]: {
                padding: "0px 14px",
              },
            }}
          >
            Last updated 1 hour ago.
          </StylePara>

          <Grid container spacing={2}>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              {tabs && tabs["patient_dashboard_recapture_percentage"]?.active &&
                <Box
                  sx={{
                    ...flexCenter,
                    gap: { sm: 2, md: 1 },
                    width: "100%",

                    [theme.breakpoints.down("lg")]: {},
                  }}
                >
                  <Box sx={{ ...flexCenter, gap: 0.7 }}>
                    <CardDiv
                      sx={{
                        [theme.breakpoints.down("md")]: {
                          borderRadius: "0px",
                        },
                      }}
                    >
                      <StyleText>Recapture:</StyleText>
                      <PrimaryButton
                        sx={{
                          backgroundColor: theme.palette.error.A200,
                          color: theme.palette.error.main,
                          ":hover": {
                            backgroundColor: theme.palette.error.A200,
                          },
                          fontWeight: 600,
                        }}
                      >
                        {doctorDetail?.recapture_percentage}
                      </PrimaryButton>
                    </CardDiv>
                  </Box>
                </Box>
              }
            </Grid>
            <Grid
              item
              lg={6}
              md={6}
              sm={12}
              xs={12}
              sx={{
                [theme.breakpoints.down("md")]: {
                  paddingTop: "3px !important",
                },
              }}
            >
              {tabs && tabs["patient_dashboard_suspect_percentage"]?.active &&
                <Box sx={{ ...flexCenter, gap: 0.7 }}>
                  <CardDiv
                    sx={{
                      [theme.breakpoints.down("md")]: {
                        borderRadius: "0px",
                      },
                    }}
                  >
                    <StyleText
                      sx={{
                        [theme.breakpoints.down("lg")]: {
                          width: "9rem",
                        },
                      }}
                    >
                      Suspects Addressed:
                    </StyleText>
                    <PrimaryButton
                      sx={{
                        backgroundColor: theme.palette.success.A200,
                        color: theme.palette.success.main,
                        ":hover": {
                          backgroundColor: theme.palette.success.A200,
                        },
                        fontWeight: 600,
                      }}
                    >
                      {doctorDetail?.suspects_addressed_percentage}
                    </PrimaryButton>
                  </CardDiv>
                </Box>
              }

            </Grid>
          </Grid>
        </Container>
      </StyleDiv>
    </div>
  );
};
