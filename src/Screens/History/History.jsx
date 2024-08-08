import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Grid,
  Typography,
  Popover,
  styled,
  useTheme,
  Card,
} from "@mui/material";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CircularProgress from '@mui/material/CircularProgress';
import moment from 'moment';

import { PrimaryButton } from "../../components/Button";
import {
  HistoryIcon,
  InfoIcon,
  DateIcon,
  ArrowDropDownIcon,
} from "../../../src/components/Icons";

import "./History.css";


import { MuiAccordions } from "../../components";
import { patientHistory } from "../../redux/userSlice/patientInfoSlice";
import { patientSummaryBarSlice } from "../../redux/userSlice/patientSummaryBarSlice";
import { TabsSlag } from "../../container/TabsSlag/TabsSlag";

const StyleDiv = styled("div")(() => ({
  padding: "40px 0px",
}));

const StyleHead = styled("h1")(({ theme }) => ({
  fontSize: "24px",
  fontWeight: 600,
  marginBottom: "10px",
  lineHeight: "29.23px",
  color: theme.palette.primary.main,
  display: "flex",
  alignItems: "center",
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

const StyleIcon = styled("Div")(() => ({
  display: "inline-block",
  margin: "-13px 0px 0px -5px",
}));

const BoxBg = {
  background: "#FAFAFA",
  borderRadius: "10px",
  padding: "20px",
};

const StylePoint = styled("Typography")(() => ({
  background: "#D5DDED",
  borderRadius: "34px",
  padding: "4px 14px 4px 14px",
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: "19.49px",
}));

const StyleText = styled("Typography")(() => ({
  color: "#000",
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "24px",
  display: "block",
  marginLeft: "10px"
}));

const StyleCode = styled("Typography")(() => ({
  fontWeight: 600,
}));

export const History = () => {
  const dispatch = useDispatch();
  const tabs = TabsSlag();
  const theme = useTheme();
  const { isLoading, data } = useSelector(state => state?.summaryBar);
  const [history, setHistory] = React.useState([])
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [expanded, setExpanded] = React.useState(false);
  const state = useSelector(state => state.user.data.history)
  let array = [];

  let sortkeys = state && Object.keys(state).sort((a, b) =>
    moment(a, "MM/YYYY").diff(moment(b, "MM/YYYY"))
  ).reverse();

  state && sortkeys.forEach((key) => {
    let oneDate = moment(key, "MM/YYYY");
    let monthYear = oneDate.format("MMMM yyyy");
    let keyOfObject = Object.keys(state[key]).sort().reverse();
    let arr = [];
    keyOfObject.forEach((key2) => {
      let date = moment(key2, "YYYY/MM/DD");
      let monthDayYear = date.format("MMMM DD, yyyy");
      arr.push({
        date: monthDayYear,
        other: state[key][key2],
      });
    });
    array.push({
      month: monthYear,
      info: arr,

    });
  });

  array?.length !== history?.length && setHistory(array);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const [open1, setOpen] = React.useState(true);
  const params = window.location.pathname
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const slug = urlParams.get('jwt');

  useEffect(() => {
    if (slug) {
      dispatch(patientHistory());
      dispatch(patientSummaryBarSlice());
    }
  }, []);



  return (
    <div>
      {isLoading ?
        <StyleDiv sx={{
          height: '86vh',
          background: "#FAFAFA",
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          < CircularProgress variant="indeterminate" sx={{
            color: '#0079ff',
          }}
            size='100px' />
        </StyleDiv> :
        <StyleDiv>
          <Container
            sx={{
              [theme.breakpoints.down("md")]: {
                padding: "0px 10px",
              },
            }}
            maxWidth="xl"
          >
            <StyleHead
              sx={{
                [theme.breakpoints.down("md")]: {
                  padding: "0px 5px",
                },
              }}
            >
              <HistoryIcon width="18.75px" height="18.75px" />{" "}
              <Typography>History</Typography>
              <StyleIcon className="CursorIcon">
                <Typography
                  aria-owns={open ? "mouse-over-popover" : undefined}
                  aria-haspopup="true"
                  onMouseEnter={handlePopoverOpen}
                  onMouseLeave={handlePopoverClose}
                  sx={{
                    [theme.breakpoints.down("md")]: {
                      padding: "0px 0px",
                    },
                  }}
                >
                  <InfoIcon width="18.75px" height="18.75px" />
                </Typography>

                <Popover
                  id="mouse-over-popover"
                  sx={{
                    pointerEvents: "none",
                    ml: 3.5,
                  }}
                  open={open}
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  onClose={handlePopoverClose}
                  disableRestoreFocus
                  className="PopBox"
                >
                  <Typography sx={{ p: 1 }}>
                    On this page you’ll find a historical record of each action
                    made on the site.
                  </Typography>
                </Popover>
              </StyleIcon>
            </StyleHead>
            <StylePara
              sx={{
                [theme.breakpoints.down("md")]: {
                  padding: "0px 5px",
                },
              }}
            >
              Last updated 1 hour ago.
            </StylePara>
            {Object.keys(data).length > 0 && <Box sx={{ width: "100%" }}>
              <Collapse in={open1}>
                <Alert
                  variant="filled"
                  icon={false}
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 400,
                          fontSize: "16px",
                          lineHeight: "19.49px",
                          color: "#fff",
                          textDecoration: "underline",
                        }}
                      >
                        Close
                      </Typography>
                    </IconButton>
                  }
                  sx={{
                    background: "#17236D",
                    borderRadius: "8px",
                    position: "relative",
                  }}
                >
                  <Grid container spacing={0}>
                    <Grid item xs={12} sm={12} md={1.4} lg={1} xl={1}>
                      <Typography
                        sx={{
                          px: 0,
                          fontWeight: 600,
                          fontSize: "20px",
                          lineHeight: "24.36px",
                          color: "#fff",
                        }}
                      >
                        Summary:
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={12} md={8} lg={11} xl={11}>
                      <Box
                        sx={{
                          display: "inline-block",
                          pl: 2,
                          fontWeight: 400,
                          fontSize: "16px",
                          lineHeight: "19.49px",
                          color: "#fff",
                          paddingTop: "3px",

                          [theme.breakpoints.down("md")]: {
                            paddingLeft: "0px",
                          },
                        }}
                      >
                        In {`${data?.summary_month} ${data?.summary_year}`} you actioned
                        <StyleCode> </StyleCode>
                        <StyleCode>{data?.total_codes} codes.</StyleCode> These include:
                        <StyleCode> </StyleCode>
                        <StyleCode>{data?.EHR_codes} </StyleCode> codes sent to the EHR,
                        <StyleCode> </StyleCode>
                        <StyleCode>{data?.problem_list_codes} </StyleCode>codes sent to the problem list and rejected
                        <StyleCode> </StyleCode>
                        <StyleCode> {data?.rejected_codes} </StyleCode>codes.
                      </Box>
                    </Grid>
                  </Grid>
                </Alert>
              </Collapse>
            </Box>
            }

            {history?.length ? (history?.map((value, index1) => (
              <Card key={index1} sx={{ backgroundColor: "transparent" }}>
                <Box
                  sx={{
                    color: "#242424",
                    fontWeight: 600,
                    fontSize: "18px",
                    lineHeight: "21.92px",
                    marginBottom: "20px",
                  }}
                >
                  {value?.month}
                </Box>


                {value?.info?.map((item, i) => {
                  return (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        backgroundColor: "#fff",
                        borderRadius: "10px",
                        px: 2,
                        mb: '10px',

                        [theme.breakpoints.down("md")]: {
                          px: 0,
                        },
                      }}
                    >
                      <MuiAccordions
                        panel={item.date}
                        expanded={expanded}
                        setExpanded={setExpanded}
                        sx={{
                          background: "white",
                          color: "black",
                        }}
                        expandIcon={
                          <ArrowDropDownIcon
                            width={12}
                            height={12}
                            fill={theme.palette.secondary.A400}
                          />
                        }
                        header={
                          <>
                            <div className="AccordHead">
                              <DateIcon width="18.75px" height="18.75px" />
                              <p> {item.date} </p>
                              <span>{item?.other?.deleted_codes?.length || 0 + item?.other?.take_credit_data?.length || 0 + item?.other?.patient_problems_data?.length || 0} actions</span>
                            </div>
                          </>
                        }
                      >
                        {item?.other?.patient_problems_data?.length && <Box className="ContentAccord" sx={{ mt: 2 }}>
                          <p>
                            You sent the following codes to the
                            <span> problem list </span>:
                          </p>
                          {item?.other?.patient_problems_data?.map((data, index) => (
                            <Box
                              sx={{
                                ...BoxBg,
                                marginBottom: "20px",
                                [theme.breakpoints.down("md")]: {
                                  display: "none",
                                },
                              }}
                            >
                              <Grid container spacing={0} sx={{
                                flexWrap: 'nowrap'
                              }} >
                                <Grid item xl='auto' lg='auto' md='auto' sm='auto' xs='auto'>
                                  <StylePoint>{data.icd_code}</StylePoint>
                                </Grid>

                                <Grid item xl={5} lg={6} md={5.6} sm={12} xs={12}>
                                  <StyleText>
                                    {data.icd_code_description}
                                  </StyleText>
                                </Grid>

                                <Grid
                                  item
                                  xl={1}
                                  lg={1}
                                  md={1}
                                  sm={12}
                                  xs={12}
                                  sx={{
                                    pr: 0,
                                  }}
                                >
                                  <div className="BorderLeft"></div>
                                </Grid>

                                <Grid item xl={3} lg={2} md={1.5} sm={12} xs={12}>
                                  <StyleText>Sent {moment(data?.start_date).format("hh:mma")}</StyleText>
                                </Grid>

                                <Grid
                                  item
                                  xl={2}
                                  lg={2}
                                  md={2.3}
                                  sm={12}
                                  xs={12}
                                  sx={{ pl: "0px !important", textAlign: "end" }}
                                >
                                  <PrimaryButton
                                    sx={{
                                      color: theme.palette.secondary.main,
                                      ":hover": {
                                        backgroundColor: "#FAFAFA",
                                      },
                                      fontWeight: 600,
                                      fontSize: "14px",
                                      width: "auto",
                                      border: "1px solid #17236D",
                                      borderRadius: "5px",
                                      padding: "10px 7px",
                                      height: "32px",
                                    }}
                                  >
                                    More Details
                                    <ArrowDropDownIcon
                                      width={12}
                                      height={12}
                                      fill={"#17236D"}
                                      className="DropIcon"
                                    />
                                  </PrimaryButton>
                                </Grid>
                              </Grid>
                            </Box>
                          ))}

                        </Box>}
                        {item?.other?.take_credit_data?.length && <Box
                          className="ContentAccord"
                          sx={{
                            mt: 2,
                            [theme.breakpoints.down("md")]: {
                              display: "none",
                            },
                          }}
                        >
                          <p>
                            You<span> accepted </span>the following codes:
                          </p>
                          {item?.other?.take_credit_data?.map((data, index) => (
                            <Box
                              key={index}
                              sx={{
                                ...BoxBg,
                                marginBottom: "20px",
                              }}
                            >
                              <Grid container spacing={0}>
                                <Grid item xl={1} lg={1} md={1.5} sm={2} xs={12}>
                                  <StylePoint>{data.code} </StylePoint>
                                </Grid>

                                <Grid item xl={5} lg={6} md={5.6} sm={12} xs={12}>
                                  <StyleText>
                                    {data.condition_name}
                                  </StyleText>
                                </Grid>

                                <Grid
                                  item
                                  xl={1}
                                  lg={1}
                                  md={1}
                                  sm={12}
                                  xs={12}
                                  sx={{
                                    pr: 0,
                                  }}
                                >
                                  <div className="BorderLeft"></div>
                                </Grid>

                                <Grid item xl={3} lg={2} md={1.5} sm={12} xs={12}>
                                  <StyleText>Sent {moment(data?.created_at).format("hh:mma")}</StyleText>
                                </Grid>

                                <Grid
                                  item
                                  xl={2}
                                  lg={2}
                                  md={2.3}
                                  sm={12}
                                  xs={12}
                                  sx={{ pl: "0px !important", textAlign: "end" }}
                                >
                                  <PrimaryButton
                                    sx={{
                                      color: theme.palette.secondary.main,
                                      ":hover": {
                                        backgroundColor: "#FAFAFA",
                                      },
                                      fontWeight: 600,
                                      fontSize: "14px",
                                      width: "auto",
                                      border: "1px solid #17236D",
                                      borderRadius: "5px",
                                      padding: "10px 7px",
                                      height: "32px",
                                    }}
                                  >
                                    More Details
                                    <ArrowDropDownIcon
                                      width={12}
                                      height={12}
                                      fill={"#17236D"}
                                      className="DropIcon"
                                    />
                                  </PrimaryButton>
                                </Grid>
                              </Grid>
                            </Box>
                          ))}

                        </Box>}
                        {item?.other?.deleted_codes?.length && <Box
                          className="ContentAccord"
                          sx={{
                            mt: 2,
                            [theme.breakpoints.down("md")]: {
                              display: "none",
                            },
                          }}
                        >
                          <p>
                            You<span> deleted </span>the following codes:
                          </p>
                          {
                            item?.other?.deleted_codes?.map((data, index) => (
                              <Box
                                sx={{
                                  ...BoxBg,
                                  marginBottom: "20px",
                                }}
                              >
                                <Grid container spacing={0}>
                                  <Grid item xl={1} lg={1} md={1.5} sm={2} xs={12}>
                                    <StylePoint>{data.icd_code.slice(0, 11) + (data.icd_code?.length > 11 ? "..." : "")}</StylePoint>
                                  </Grid>

                                  <Grid item xl={5} lg={6} md={5.6} sm={12} xs={12}>
                                    <StyleText>
                                      {data.icd_code_description}
                                    </StyleText>
                                  </Grid>

                                  <Grid
                                    item
                                    xl={1}
                                    lg={1}
                                    md={1}
                                    sm={12}
                                    xs={12}
                                    sx={{
                                      pr: 0,
                                    }}
                                  >
                                    <div className="BorderLeft"></div>
                                  </Grid>

                                  <Grid item xl={3} lg={2} md={1.5} sm={12} xs={12}>
                                    <StyleText>Sent {moment(data?.deleted_on).format("hh:mma")}</StyleText>
                                  </Grid>

                                  <Grid
                                    item
                                    xl={2}
                                    lg={2}
                                    md={2.3}
                                    sm={12}
                                    xs={12}
                                    sx={{ pl: "0px !important", textAlign: "end" }}
                                  >
                                    <PrimaryButton
                                      sx={{
                                        color: theme.palette.secondary.main,
                                        ":hover": {
                                          backgroundColor: "#FAFAFA",
                                        },
                                        fontWeight: 600,
                                        fontSize: "14px",
                                        width: "auto",
                                        border: "1px solid #17236D",
                                        borderRadius: "5px",
                                        padding: "10px 7px",
                                        height: "32px",
                                      }}
                                    >
                                      More Details
                                      <ArrowDropDownIcon
                                        width={12}
                                        height={12}
                                        fill={"#17236D"}
                                        className="DropIcon"
                                      />
                                    </PrimaryButton>
                                  </Grid>
                                </Grid>
                              </Box>
                            ))
                          }
                        </Box>}

                      </MuiAccordions>
                    </Box>
                  );
                })}
              </Card>
            ))) : <>
              {isLoading && <Box
                className="HistoryBox"
                sx={{
                  marginBottom: "20px",
                }}
              >
                <p>You have no history to show</p>
                <span>
                  Any actions you take in the
                  <StyleCode> </StyleCode>
                  <span className="HistoryCode"> Codes </span> page will appear
                  here.
                </span>
              </Box>}
            </>
            }
          </Container>
        </StyleDiv>}



    </div >
  );
};

const codesData = [
  { key: 1, code: "January 20, 2023", codeCount: "4 actions" },
];
