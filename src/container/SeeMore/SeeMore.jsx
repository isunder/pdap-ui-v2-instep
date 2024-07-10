import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Grid,
  Typography,
  styled,
} from "@mui/material";
import React from "react";
import {
  ArrowDropDownIcon,
  CorrectIcon,
  CrossWhite,
  MuiAccordions,
  PrimaryButton,
  ArrowUpIcon,
  DocIcon,
} from "../../components";
import { useTheme } from "@emotion/react";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";

const StyleCircle = styled(Box)(() => ({
  width: "1.25rem",
  height: "1.25rem",
  marginRight: "0px",
  lineHeight: "20px",
}));

const StyleCode = styled(Box)(() => ({
  color: "#131E5E",
  fontSize: "1rem",
  fontWeight: 600,
  lineHeight: "normal",
  borderRadius: "2.125rem",
  background: "#D5DDED",
  padding: "0.125rem 0.875rem",
  width: "auto",
  display: "inline-block",
}));

const StyledText = styled(Typography)(({ theme }) => ({
  color: theme.palette.black.main,
  fontSize: "0.875rem",
  fontWeight: "600",
  lineHeight: "175%",
  letterSpacing: "0.0175rem",
  padding: "0px",
  marginTop: "10px",
  textTransform: "inherit",

  [theme.breakpoints.down("md")]: {
    marginTop: "0px",
  },
}));

const StyledHead = styled(Typography)(({ theme }) => ({
  color: "#00000075",
  fontSize: "0.875rem",
  fontWeight: "400",
  lineHeight: "1.066",
  textTransform: "uppercase",
  padding: "0px",
  display: "block",
}));

const StyledHeader = styled(Box)(() => ({
  height: "2.4375rem",
  width: "100%",
  borderBottom: "1px solid #E3EAF6",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  paddingBottom: "0px",
}));

const StyledBox = styled(Box)(() => ({
  width: "100%",
  display: "flex",
  height: "2.4375rem",
  alignItems: "center",
  padding: "0 0.5rem",
}));

const StyledAccordingBox = styled(Box)(() => ({
  height: "100%",
  width: "100%",
  minHeight: "6.1875rem",
  borderTop: "1px solid #E3EAF6",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
}));

const StyledButton = styled(PrimaryButton)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: "#fff",
  ":hover": {
    backgroundColor: theme.palette.secondary.main,
  },
  fontSize: "0.875rem",
  fontWeight: 600,
  textTransform: "inherit",
  borderRadius: "0.3125rem",
  width: "6.125rem",
  height: "2rem",
}));

const StyledButton1 = styled(PrimaryButton)(({ theme }) => ({
  backgroundColor: "transparent",
  color: "#17236D",
  ":hover": {
    backgroundColor: "transparent",
  },
  fontSize: "0.875rem",
  fontWeight: 600,
  fontSIze: "14px",
  textTransform: "inherit",
  border: "1px solid #C5CCF8",
  borderRadius: "0.3125rem",
  width: "7.125rem",
  height: "2rem",
}));

export const SeeMore = () => {
  const theme = useTheme();
  const [expanded, setExpanded] = React.useState(false);

  const [open, setOpen] = React.useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen1 = () => {
    setOpen(true);
  };

  const handleClose1 = () => {
    setOpen(false);
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
              <Grid item xs={7} sm={7} md={7} lg={8.4} xl={8.4}>
                <StyledBox>
                  <StyledText
                    sx={{
                      [theme.breakpoints.down("lg")]: {
                        mt: 0,
                      },
                    }}
                  >
                    Code(s)
                  </StyledText>
                  <Divider
                    orientation="vertical"
                    sx={{
                      height: "1.125rem",
                      mx: { sm: 1, md: 2, lg: 3 },
                    }}
                  />
                  <StyledText
                    sx={{
                      [theme.breakpoints.down("lg")]: {
                        mt: 0,
                      },
                    }}
                  >
                    Description
                  </StyledText>
                </StyledBox>
              </Grid>
              <Grid item xs={5} sm={5} md={5} lg={3.6} xl={3.6}>
                <StyledBox>
                  <Divider
                    orientation="vertical"
                    sx={{
                      height: "1.125rem",
                      mr: { sm: 1, md: 2, lg: 3, xl: 0 },

                      [theme.breakpoints.only("xl")]: {
                        ml: 3,
                      },
                    }}
                  />
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "left",

                      [theme.breakpoints.down("md")]: {
                        justifyContent: "left",
                      },
                    }}
                  >
                    <StyledText
                      sx={{
                        [theme.breakpoints.down("lg")]: {
                          mt: 0,
                        },
                      }}
                    >
                      Actions
                    </StyledText>
                  </Box>
                </StyledBox>
              </Grid>
            </Grid>
          </Grid>
        </StyledHeader>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {[1, 2]?.map((items, index) => {
          return (
            <Box key={index}>
              <StyledAccordingBox>
                <Grid
                  container
                  spacing={0}
                  className="ContentBody"
                  sx={{
                    padding: "10px 10px 10px",
                    backgroundColor: "#fff",
                    borderRadius: index === 0 ? 0 : "10px 10px 0 0",

                    [theme.breakpoints.down("md")]: {
                      borderRadius: "0px",
                      display: "none",
                    },
                  }}
                >
                  <Grid item xs={12} sm={12} md={12} lg={8} xl={8.5}>
                    <StyleCode
                      sx={{
                        mr: 4,
                        ml: 1,
                        verticalAlign: "top",
                        mt: 1.5,
                        [theme.breakpoints.only("md")]: {
                          mr: 2,
                        },
                      }}
                    >
                      D89.9
                    </StyleCode>

                    <Box
                      sx={{
                        [theme.breakpoints.only("lg")]: {
                          width: "75%",
                        },

                        [theme.breakpoints.only("md")]: {
                          width: "calc(100% - 110px)",
                        },

                        display: "inline-block",
                        alignItems: "center",
                        width: "83%",
                      }}
                    >
                      <StyledText
                        sx={{
                          fontWeight: 400,
                          width: "100%",
                          maxWidth: "32rem",
                          padding: "0",
                          textTransform: "inherit",
                          display: "inline-block",
                          verticalAlign: "bottom",
                        }}
                      >
                        Disorder involving the immune mechanism, unspecified but
                        could be this long. Lorem ipsum dolor sit amet,
                        consectetur adipiscing elit. Praesent sem purus,
                        vulputate in magna in, sollicitudin auctor ante.
                        Suspendisse pulvinar nisi sit amet dignissim ornare.
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      </StyledText>
                      <Box sx={{ display: "block" }}>
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
                              fontWeight: 500,
                              lineHeight: "25px",
                              letterSpacing: "0.02em",
                            }}
                          >
                            Dr. Robert Jones
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            my: 1,
                            fontSize: "14px",
                            fontWeight: 400,
                            lineHeight: "25px",
                            letterSpacing: "0em",
                            display: "inline-block",
                            ml: 2,
                          }}
                        >
                          Date:
                          <Typography
                            sx={{
                              fontSize: "14px",
                              fontWeight: 500,
                              lineHeight: "25px",
                              letterSpacing: "0.02em",
                              pl: 1,
                            }}
                          >
                            09.25.2022
                          </Typography>
                        </Box>
                      </Box>

                      <Box>
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
                          <Typography
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
                            CLAIMS
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "14px",
                              fontWeight: 500,
                              lineHeight: "24px",
                              color: "#242424",
                              pl: 1,
                              background: "#DEE9FF",
                              borderRadius: "2.5rem",
                              height: "1.438rem",
                              padding: "0.219rem 0.8rem",
                              ml: 1,
                            }}
                          >
                            EHR
                          </Typography>
                        </Box>
                      </Box>

                      <StyledText
                        sx={{
                          fontWeight: 500,
                          textDecorationLine: "underline",
                          color: "#3D4A8F",
                          ml: 1,
                          letterSpacing: "0.02em",
                          m: 0,

                          [theme.breakpoints.only("md")]: {
                            display: "none",
                          },
                        }}
                      >
                        See Less
                      </StyledText>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={12} md={12} lg={4} xl={3.5}>
                    <Box
                      sx={{
                        ...flexAlignCenter,
                        mt: 1,
                        justifyContent: "end",
                        [theme.breakpoints.only("md")]: {
                          justifyContent: "start",
                          ml: 12,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          textAlign: "start",
                          mt: 2,
                          [theme.breakpoints.up("md")]: {
                            display: "none",
                          },
                          [theme.breakpoints.only("md")]: {
                            display: "block",
                            mr: 3,
                            mt: 0,
                          },
                        }}
                      >
                        <DocIcon />
                        <Typography
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
                      <StyledText
                        sx={{
                          pr: 4,
                          mt: 0,
                          [theme.breakpoints.only("xl")]: {
                            pr: 3.5,
                          },
                          [theme.breakpoints.only("md")]: {
                            pr: 3,
                          },
                        }}
                      >
                        +0.12
                      </StyledText>

                      {/* this is not the exact location of dialog Clinical Documents */}
                      <StyledButton1
                        onClick={handleClickOpen1}
                        sx={{ mr: 2 }}
                        startIcon={
                          <StyleCircle
                            sx={{
                              background: "#008F53",
                              ...flexAlignCenter,
                              justifyContent: "center",
                              borderRadius: "100px",
                            }}
                          >
                            <CorrectIcon />
                          </StyleCircle>
                        }
                      >
                        Accepted
                      </StyledButton1>
                      <StyledButton
                        onClick={handleClickOpen}
                        sx={{
                          backgroundColor: theme.palette.primary.main,
                          color: "#fff",
                          ":hover": {
                            backgroundColor: theme.palette.primary.main,
                          },
                        }}
                        startIcon={
                          <StyleCircle
                            sx={{
                              background: "#434343",
                              ...flexAlignCenter,
                              justifyContent: "center",
                              borderRadius: "100px",
                            }}
                          >
                            <CrossWhite />
                          </StyleCircle>
                        }
                      >
                        Reject
                      </StyledButton>
                    </Box>
                    <Box
                      sx={{
                        textAlign: "end",
                        mt: 2,
                        [theme.breakpoints.only("md")]: {
                          display: "none",
                        },
                      }}
                    >
                      <DocIcon />
                      <Typography
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
                  </Grid>

                  <Grid item xs={12} sm={12} md={12} lg={4} xl={3.5}>
                    <StyledText
                      sx={{
                        fontWeight: 500,
                        textDecorationLine: "underline",
                        color: "#3D4A8F",
                        letterSpacing: "0.02em",

                        [theme.breakpoints.up("md")]: {
                          display: "none",
                        },

                        [theme.breakpoints.only("md")]: {
                          display: "block",
                          ml: 12,
                          mb: 3,
                        },
                      }}
                    >
                      See Less
                    </StyledText>
                  </Grid>
                </Grid>

                <Grid
                  container
                  spacing={0}
                  className="ContentBody"
                  sx={{
                    padding: "10px 10px 10px",
                    backgroundColor: "#fff",
                    borderRadius: index === 0 ? 0 : "10px 10px 0 0",

                    [theme.breakpoints.up("md")]: {
                      borderRadius: "0px",
                      display: "none",
                    },
                  }}
                >
                  <Grid item xs={7} sm={7} md={5} lg={3} xl={3}>
                    <StyleCode sx={{ mr: 4, ml: 0 }}>D89.9</StyleCode>
                  </Grid>

                  <Grid
                    item
                    xs={5}
                    sm={5}
                    md={5}
                    lg={3}
                    xl={3}
                    sx={{
                      textAlign: "left",
                    }}
                  >
                    <Box
                      sx={{
                        display: "inline-block",
                        alignItems: "center",
                      }}
                    >
                      <StyledText sx={{ pr: 3, ml: 0, mt: 0 }}>
                        +0.12
                      </StyledText>
                      <StyledText
                        sx={{
                          fontWeight: 500,
                          textDecorationLine: "underline",
                          color: theme.palette.secondary.main,
                          ml: 1,
                        }}
                      >
                        See Less
                      </StyledText>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={12} md={5} lg={3} xl={3}>
                    <StyledText
                      sx={{
                        [theme.breakpoints.down("md")]: {
                          width: "99%",
                        },

                        fontWeight: 400,
                        width: "100%",
                        maxWidth: "32rem",
                        padding: "0",
                        textTransform: "inherit",
                        display: "inline-block",
                        verticalAlign: "bottom",
                        pt: 1,
                        pb: 1,
                      }}
                    >
                      Disorder involving the immune mechanism, unspecified but
                      could be this long. Lorem ipsum dolor sit amet,
                      consectetur adipiscing elit. Praesent sem purus, vulputate
                      in magna in, sollicitudin auctor ante. Suspendisse
                      pulvinar nisi sit amet dignissim ornare. Lorem ipsum dolor
                      sit amet, consectetur adipiscing elit. Lorem ipsum dolor
                      sit amet, consectetur adipiscing elit.
                    </StyledText>

                    <Box sx={{ display: "block" }}>
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
                            fontWeight: 500,
                            lineHeight: "25px",
                            letterSpacing: "0.02em",
                          }}
                        >
                          Dr. Robert Jones
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          my: 1,
                          fontSize: "14px",
                          fontWeight: 400,
                          lineHeight: "25px",
                          letterSpacing: "0em",
                          display: "inline-block",
                          ml: 2,
                        }}
                      >
                        Date:
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: 500,
                            lineHeight: "25px",
                            letterSpacing: "0.02em",
                            pl: 1,
                          }}
                        >
                          09.25.2022
                        </Typography>
                      </Box>
                    </Box>

                    <Box>
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
                        <Typography
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
                          CLAIMS
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: 500,
                            lineHeight: "24px",
                            color: "#242424",
                            pl: 1,
                            background: "#DEE9FF",
                            borderRadius: "2.5rem",
                            height: "1.438rem",
                            padding: "0.219rem 0.8rem",
                            ml: 1,
                          }}
                        >
                          EHR
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        textAlign: "start",
                        mt: 2,
                        mb: 2,
                      }}
                    >
                      <DocIcon />
                      <Typography
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
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={5}
                    lg={3}
                    xl={3}
                    sx={{ textAlign: "center" }}
                  >
                    {/* this is not the exact location of dialog Clinical Documents */}
                    <StyledButton1
                      onClick={handleClickOpen1}
                      sx={{ mr: 2, width: "47%" }}
                      startIcon={
                        <StyleCircle
                          sx={{
                            background: "#008F53",
                            ...flexAlignCenter,
                            justifyContent: "center",
                            borderRadius: "100px",
                          }}
                        >
                          <CorrectIcon />
                        </StyleCircle>
                      }
                    >
                      Accepted
                    </StyledButton1>
                    <StyledButton
                      onClick={handleClickOpen}
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: "#fff",
                        ":hover": {
                          backgroundColor: theme.palette.primary.main,
                        },
                        width: "47%",
                      }}
                      startIcon={
                        <StyleCircle
                          sx={{
                            background: "#434343",
                            ...flexAlignCenter,
                            justifyContent: "center",
                            borderRadius: "100px",
                          }}
                        >
                          <CrossWhite />
                        </StyleCircle>
                      }
                    >
                      Reject
                    </StyledButton>
                  </Grid>
                </Grid>
                <MuiAccordions
                  panel={items}
                  expanded={expanded}
                  setExpanded={setExpanded}
                  sx={{
                    background:
                      expanded === items
                        ? theme.palette.secondary.main
                        : theme.palette.secondary.A400,
                    color:
                      expanded === items ? "white" : theme.palette.black.main,
                    borderRadius:
                      expanded === items ? 0 : "0 0 0.625rem 0.625rem",
                    "& .MuiAccordionSummary-content": {
                      flexGrow: "initial",
                      fontSize: "14px",
                      fontWeight: "600",
                      lineHeight: "21px",
                      letterSpacing: "0em",
                      textAlign: "left",
                      color: "#fff",
                      paddingRight: "10px",
                    },
                  }}
                  expandIcon={<ArrowDropDownIcon width={12} height={12} />}
                  header="Show Alternate Codes (5)"
                >
                  <Grid
                    container
                    spacing={0}
                    className="ContentBody"
                    sx={{
                      padding: "10px 10px 10px",
                      backgroundColor: "#fff",
                      marginBottom: "2px",

                      [theme.breakpoints.only("sm")]: {
                        display: "none",
                      },
                    }}
                  >
                    <Grid item xs={2.5} sm={5} md={7} lg={9} xl={9}>
                      <StyleCode
                        sx={{
                          mr: 4,
                          ml: 1,

                          [theme.breakpoints.only("md")]: {
                            mr: 2,
                          },
                        }}
                      >
                        D89.9
                      </StyleCode>

                      <Box
                        sx={{
                          [theme.breakpoints.only("md")]: {
                            width: "62%",
                          },

                          display: "inline-block",
                          alignItems: "center",
                          width: "75%",
                        }}
                      >
                        <StyledText
                          sx={{
                            [theme.breakpoints.only("lg")]: {
                              width: "calc(100% - 130px)",
                            },

                            [theme.breakpoints.only("md")]: {
                              width: "calc(100% - 70px)",
                            },

                            fontWeight: 400,
                            width: "100%",
                            maxWidth: "32rem",
                            padding: "0",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            textTransform: "inherit",
                            display: "inline-block",
                            verticalAlign: "bottom",
                          }}
                        >
                          Disorder involving the immune mechanism, unspecified
                          but could be this long.
                        </StyledText>
                        <StyledText
                          sx={{
                            fontWeight: 500,
                            textDecorationLine: "underline",
                            color: theme.palette.secondary.main,
                            ml: 1,
                          }}
                        >
                          See All
                        </StyledText>
                      </Box>
                    </Grid>

                    <Grid item xs={1.5} sm={7} md={5} lg={3} xl={3}>
                      <Box sx={{ ...flexAlignCenter, mt: 1 }}>
                        <StyledText sx={{ pr: 3, ml: -4, mt: 0 }}>
                          +0.12
                        </StyledText>
                        <StyledButton
                          sx={{ mr: 2 }}
                          startIcon={
                            <StyleCircle
                              sx={{
                                background: "#3D4A8F",
                                ...flexAlignCenter,
                                justifyContent: "center",
                                borderRadius: "100px",
                              }}
                            >
                              <CorrectIcon />
                            </StyleCircle>
                          }
                        >
                          Accept
                        </StyledButton>
                        <StyledButton
                          sx={{
                            backgroundColor: theme.palette.primary.main,
                            color: "#fff",
                            ":hover": {
                              backgroundColor: theme.palette.primary.main,
                            },
                          }}
                          startIcon={
                            <StyleCircle
                              sx={{
                                background: "#434343",
                                ...flexAlignCenter,
                                justifyContent: "center",
                                borderRadius: "100px",
                              }}
                            >
                              <CrossWhite />
                            </StyleCircle>
                          }
                        >
                          Reject
                        </StyledButton>
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={0}
                    className="ContentBody"
                    sx={{
                      padding: "10px 10px 10px",
                      backgroundColor: "#fff",
                      borderRadius: "0px 0px 0px 0px",
                      marginBottom: "2px",
                      [theme.breakpoints.only("sm")]: {
                        display: "none",
                      },
                    }}
                  >
                    <Grid item xs={2.5} sm={5} md={7} lg={9} xl={9}>
                      <StyleCode
                        sx={{
                          mr: 4,
                          ml: 1,
                          [theme.breakpoints.only("md")]: {
                            mr: 2,
                          },
                        }}
                      >
                        D89.9
                      </StyleCode>

                      <Box
                        sx={{
                          [theme.breakpoints.only("md")]: {
                            width: "62%",
                          },

                          display: "inline-block",
                          alignItems: "center",
                          width: "75%",
                        }}
                      >
                        <StyledText
                          sx={{
                            [theme.breakpoints.only("lg")]: {
                              width: "calc(100% - 130px)",
                            },

                            [theme.breakpoints.only("md")]: {
                              width: "calc(100% - 70px)",
                            },

                            fontWeight: 400,
                            width: "100%",
                            maxWidth: "32rem",
                            padding: "0",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            textTransform: "inherit",
                            display: "inline-block",
                            verticalAlign: "bottom",
                          }}
                        >
                          Disorder involving the immune mechanism, unspecified
                          but could be this long.
                        </StyledText>
                        <StyledText
                          sx={{
                            fontWeight: 500,
                            textDecorationLine: "underline",
                            color: theme.palette.secondary.main,
                            ml: 1,
                          }}
                        >
                          See All
                        </StyledText>
                      </Box>
                    </Grid>

                    <Grid item xs={1.5} sm={7} md={5} lg={3} xl={3}>
                      <Box sx={{ ...flexAlignCenter, mt: 1 }}>
                        <StyledText sx={{ pr: 3, ml: -4, mt: 0 }}>
                          +0.12
                        </StyledText>
                        <StyledButton
                          sx={{ mr: 2 }}
                          startIcon={
                            <StyleCircle
                              sx={{
                                background: "#3D4A8F",
                                ...flexAlignCenter,
                                justifyContent: "center",
                                borderRadius: "100px",
                              }}
                            >
                              <CorrectIcon />
                            </StyleCircle>
                          }
                        >
                          Accept
                        </StyledButton>
                        <StyledButton
                          sx={{
                            backgroundColor: theme.palette.primary.main,
                            color: "#fff",
                            ":hover": {
                              backgroundColor: theme.palette.primary.main,
                            },
                          }}
                          startIcon={
                            <StyleCircle
                              sx={{
                                background: "#434343",
                                ...flexAlignCenter,
                                justifyContent: "center",
                                borderRadius: "100px",
                              }}
                            >
                              <CrossWhite />
                            </StyleCircle>
                          }
                        >
                          Reject
                        </StyledButton>
                      </Box>
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    spacing={0}
                    className="ContentBody"
                    sx={{
                      padding: "10px 10px 10px",
                      backgroundColor: "#fff",
                      borderRadius: "0px 0px 10px 10px",
                      marginBottom: "2px",
                      justifyContent: "center",
                      textAlign: "center",
                      [theme.breakpoints.down("md")]: {
                        display: "none",
                      },
                    }}
                  >
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <StyledButton
                        sx={{ mr: 2, width: "9.75rem", height: "2rem" }}
                        startIcon={
                          <StyleCircle
                            sx={{
                              background: "#3D4A8F",
                              ...flexAlignCenter,
                              justifyContent: "center",
                              borderRadius: "100px",
                            }}
                          >
                            <CorrectIcon />
                          </StyleCircle>
                        }
                      >
                        Accept All (6)
                      </StyledButton>
                      <StyledButton
                        sx={{
                          backgroundColor: theme.palette.primary.main,
                          color: "#fff",
                          ":hover": {
                            backgroundColor: theme.palette.primary.main,
                          },
                          width: "9.75rem",
                          height: "2rem",
                        }}
                        startIcon={
                          <StyleCircle
                            sx={{
                              background: "#434343",
                              ...flexAlignCenter,
                              justifyContent: "center",
                              borderRadius: "100px",
                            }}
                          >
                            <CrossWhite />
                          </StyleCircle>
                        }
                      >
                        Reject All (6)
                      </StyledButton>
                    </Grid>
                  </Grid>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      "& > *": {
                        m: 1,
                      },
                      backgroundColor: "#F0F0F0",

                      [theme.breakpoints.up("md")]: {
                        display: "none",
                      },
                    }}
                  >
                    <ButtonGroup
                      variant="outlined"
                      aria-label="outlined button group"
                    >
                      <Button
                        sx={{
                          borderRadius: "10px",
                          height: "37px",
                          backgroundColor: "#fff",
                          color: "#17236D",
                          fontSize: "14px",
                          fontWeight: 600,
                          textTransform: "inherit",
                          padding: "5px 25px",
                        }}
                        startIcon={
                          <StyleCircle
                            sx={{
                              background: "#3D4A8F",
                              ...flexAlignCenter,
                              justifyContent: "center",
                              borderRadius: "100px",
                            }}
                          >
                            <CorrectIcon />
                          </StyleCircle>
                        }
                      >
                        Accept All (6)
                      </Button>
                      <Button
                        sx={{
                          borderRadius: "10px",
                          height: "37px",
                          backgroundColor: "#fff",
                          color: "#000000",
                          fontSize: "14px",
                          fontWeight: 600,
                          textTransform: "inherit",
                          padding: "5px 25px",
                        }}
                        startIcon={
                          <StyleCircle
                            sx={{
                              background: "#434343",
                              ...flexAlignCenter,
                              justifyContent: "center",
                              borderRadius: "100px",
                            }}
                          >
                            <CrossWhite />
                          </StyleCircle>
                        }
                      >
                        Reject All (6)
                      </Button>
                    </ButtonGroup>
                  </Box>

                  <Grid
                    container
                    spacing={0}
                    className="ContentBody"
                    sx={{
                      padding: "10px 10px 10px",
                      backgroundColor: "#fff",
                      borderRadius: "0px 0px 10px 10px",

                      [theme.breakpoints.up("md")]: {
                        borderRadius: "0px",
                        display: "none",
                      },
                    }}
                  >
                    <Grid item xs={3} sm={3} md={5} lg={3} xl={3}>
                      <StyleCode sx={{ mr: 4, ml: 0 }}>D89.9</StyleCode>
                    </Grid>

                    <Grid
                      item
                      xs={9}
                      sm={9}
                      md={5}
                      lg={3}
                      xl={3}
                      sx={{
                        textAlign: "end",
                      }}
                    >
                      <Box
                        sx={{
                          display: "inline-block",
                          alignItems: "center",
                        }}
                      >
                        <StyledText sx={{ pr: 3, ml: 0, mt: 0 }}>
                          +0.12
                        </StyledText>
                        <StyledText
                          sx={{
                            fontWeight: 500,
                            textDecorationLine: "underline",
                            color: theme.palette.secondary.main,
                            ml: 1,
                          }}
                        >
                          See All
                        </StyledText>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={5} lg={3} xl={3}>
                      <StyledText
                        sx={{
                          [theme.breakpoints.down("md")]: {
                            width: "99%",
                          },

                          fontWeight: 400,
                          width: "100%",
                          maxWidth: "32rem",
                          padding: "0",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          textTransform: "inherit",
                          display: "inline-block",
                          verticalAlign: "bottom",
                        }}
                      >
                        Disorder involving the immune mechanism, unspecified but
                        could be this long.
                      </StyledText>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={5}
                      lg={3}
                      xl={3}
                      sx={{ textAlign: "center" }}
                    >
                      <StyledButton
                        sx={{ mr: 2, width: "47%" }}
                        startIcon={
                          <StyleCircle
                            sx={{
                              background: "#3D4A8F",
                              ...flexAlignCenter,
                              justifyContent: "center",
                              borderRadius: "100px",
                            }}
                          >
                            <CorrectIcon />
                          </StyleCircle>
                        }
                      >
                        Accept
                      </StyledButton>
                      <StyledButton
                        sx={{
                          backgroundColor: theme.palette.primary.main,
                          color: "#fff",
                          ":hover": {
                            backgroundColor: theme.palette.primary.main,
                          },
                          width: "47%",
                        }}
                        startIcon={
                          <StyleCircle
                            sx={{
                              background: "#434343",
                              ...flexAlignCenter,
                              justifyContent: "center",
                              borderRadius: "100px",
                            }}
                          >
                            <CrossWhite />
                          </StyleCircle>
                        }
                      >
                        Reject
                      </StyledButton>
                    </Grid>
                  </Grid>
                </MuiAccordions>
              </StyledAccordingBox>
            </Box>
          );
        })}
      </Box>

      {/* Delete Modal */}

      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
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
            }}
          >
            Are you sure you want to delete this problem from DoctusTech?
            <Button
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
                marginBottom: "20px",

                [theme.breakpoints.down("md")]: {
                  display: "none",
                },
              }}
            >
              Yes, Delete
            </Button>
            <Button
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
            <Button
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
                marginBottom: "20px",

                [theme.breakpoints.up("md")]: {
                  display: "none",
                },
                [theme.breakpoints.down("md")]: {
                  mx: 0,
                  mt: 2,
                  width: "100%",
                },
              }}
            >
              Yes, Delete
            </Button>
          </DialogContentText>
        </DialogContent>
      </Dialog>

      {/* Clinical Documents Modal */}
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
              Clinical Documents (5)
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
                onClick={handleClose}
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

        <DialogContent
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
                  Disorder involving the immune mechanism, unspecified but this
                  may fit onto two lines with a longer description
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
                        CCDA Documents
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
                        Problem List
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
                          6.13.2022
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
                  <Button
                    sx={{
                      backgroundColor: "#17236D",
                      borderRadius: "5px",
                      width: "130px",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      color: "#fff",

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
                </Grid>
              </Grid>
            </Box>

            <Box
              sx={{ mb: 2, backgroundColor: "#FAFAFA", pl: 3, pt: 2, pb: 2 }}
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
                  Disorder involving the immune mechanism, unspecified but this
                  may fit onto two lines with a longer description
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
                        CCDA Documents
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
                        Problem List
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
                          6.13.2022
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
                  <Button
                    sx={{
                      backgroundColor: "#17236D",
                      borderRadius: "5px",
                      width: "130px",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      color: "#fff",

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
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ mb: 2, pl: 3, pt: 2, pb: 2 }}>
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
                  Disorder involving the immune mechanism, unspecified but this
                  may fit onto two lines with a longer description
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
                        CCDA Documents
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
                        Problem List
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
                          6.13.2022
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
                  <Button
                    sx={{
                      backgroundColor: "#17236D",
                      borderRadius: "5px",
                      width: "130px",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      color: "#fff",

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
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ mb: 2, pl: 3, pt: 2, pb: 2 }}>
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
                  Disorder involving the immune mechanism, unspecified but this
                  may fit onto two lines with a longer description
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
                        CCDA Documents
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
                        Problem List
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
                          6.13.2022
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
                  <Button
                    sx={{
                      backgroundColor: "#17236D",
                      borderRadius: "5px",
                      width: "130px",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      color: "#fff",

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
                </Grid>
              </Grid>
            </Box>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
const flexAlignCenter = {
  display: "flex",
  alignItems: "center",
};
