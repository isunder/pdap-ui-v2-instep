import React, { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Typography,
    Tooltip,
    styled,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import {
    ArrowDropDownIcon,
    MuiAccordions,
} from "../../components";
import "../../Screens/Codes/Codes.css";
import { MorDataInsight, patientDeletedCode } from "../../redux/userSlice/patientInfoSlice";
import { TabsSlag } from "../TabsSlag/TabsSlag";
import {
    StyleCode,
    StyledText,
    StyledHeader,
    StyledBox,
    StyledAccordingBox,
    StyleCode2,
} from "../Common/StyledMuiComponents";
import { Button } from "bootstrap";

export const MorData = ({ sessionObject }) => {

    const dispatch = useDispatch();
    const theme = useTheme();
    const tabs = TabsSlag();
    const [expanded, setExpanded] = React.useState(false);
    const [morInsightData, setMorInsightData] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [checkedAcceptAll, setCheckedAcceptAll] = useState([]);
    const [deletedCondition, setDeletedCondition] = useState([]);
    const deletedCodes = useSelector((state) => state?.summary);
    const [selecteddeletedCodes, setSelecteddeletedCodes] = useState([]);
    const [sessionObjLoaded, setSessionObjLoaded] = useState(false);
    const [rejectdeletedCodes, setRejectdeletedCodes] = useState([]);
    const state = useSelector((state) => state.user.data.MorDataInsight);
    const [showmore, setshowmore] = useState(false)

    useEffect(() => {
        dispatch(MorDataInsight());
    }, []);

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
    result?.length !== morInsightData?.length && setMorInsightData(result);

    function checkCodesAvailability(input1, input2) {
        const result = input1?.map((item) => {
            const mainCode = item.code;
            const alternateCodes = item.info.alternate_codes || [];

            const isMainCodeAvailable = input2?.some((obj) => obj.code === mainCode);
            const areAlternateCodesAvailable = alternateCodes.every((alternateCode) =>
                input2?.some((obj) => obj.code === alternateCode.code)
            );

            return {
                mainCode,
                isMainCodeAvailable,
                areAlternateCodesAvailable,
            };
        });
        setCheckedAcceptAll(result);
        return result;
    }



    useEffect(() => {
        if (
            sessionObject &&
            !sessionObjLoaded &&
            Object.keys(sessionObject).length > 0
        ) {
            let newDuplicate =
                deletedCodes?.length > 0 && sessionObject?.deletedCodes?.length > 0
                    ? [...sessionObject?.deletedCodes, ...deletedCodes]
                    : deletedCodes?.length > 0
                        ? deletedCodes
                        : sessionObject?.deletedCodes || [];
            selecteddeletedCodes?.length === 0 &&
                setSelecteddeletedCodes([...newDuplicate]);

            let newDuplicateReject =
                rejectdeletedCodes?.length > 0 &&
                    sessionObject?.deletedCodesReject?.length > 0
                    ? [...sessionObject?.deletedCodesReject, ...rejectdeletedCodes]
                    : rejectdeletedCodes?.length > 0
                        ? rejectdeletedCodes
                        : sessionObject?.deletedCodesReject || [];
            rejectdeletedCodes?.length === 0 &&
                setRejectdeletedCodes([...newDuplicateReject]);

            checkCodesAvailability(deletedCondition, deletedCodes);
            setSessionObjLoaded(true);
        }
    }, [sessionObject]);

    const handleCollapse = (code) => {
        let changeData = morInsightData.map((value) => {
            return value?.code === code
                ? ((value.collapse = !value?.collapse), value)
                : value;
        });
        setDeletedCondition(changeData);
    };

    const handleIsCollapse = (data) => {
        let code = data?.value;
        let changeData = morInsightData?.map((value) => {
            const isValid = value?.info?.alternate_codes?.find(
                (obj) => obj.code === code.code
            );
            if (isValid) {
                return (isValid.isCollapse = !isValid?.isCollapse), value;
            }
            return value;
        });

        setDeletedCondition(changeData);
    };
    const showMoreData = () => {
        setshowmore(!showmore)
    }
    const CustomTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .MuiTooltip-tooltip`]: {
            borderRadius: '4px 0px 0px 0px',
            opacity: 0,
            boxShadow: '0px 3px 15px 0px #00000026',
            backgroundColor: '#FFFFFF',
            width: '275px',
            maxHeight: '219px',
            overflowX: 'auto',
        },
    }));

    const TooltipComponent = ({ info }) => {
        return (
            <div className="custom-tooltip-design">
                <h3 style={{color:'#000000'}}>HCC code(s)</h3>
                <Box sx={{ display: 'flex', marginBottom: "12px" }}>
                    <StyleCode className="stylecode-button insight-col-hcc-code-stylecode"
                        sx={{
                            ml: 0.5,
                            maxWidth: "100%",
                            flexShrink: '0',
                            textOverflow: "ellipsis",
                            height: 'fit-content',
                            [theme.breakpoints.only("md")]: {
                                mr: 2,
                            },

                            [theme.breakpoints.up("md")]: {
                                mr: 2,

                            },
                        }}
                    >
                        <Tooltip >{info?.[0][0][0]}</Tooltip>
                    </StyleCode>
                    <Typography sx={{ color: '#000', }} component={'p'}>{info?.[0][0][1]}</Typography>
                </Box>

            </div>
        );
    };
    console.log(morInsightData, state, "morInsightData")
    return (
        <Box className="ContentBox">
            {/* Header for accordion body */}
            <Box sx={{ ...flexAlignCenter, flexDirection: "column" }}>
                <StyledHeader>
                    <Grid
                        container
                        spacing={0}
                        className="ContentBody"
                        sx={{ backgroundColor: "#fff" }}
                    >
                        <Grid
                            container
                            spacing={{ xs: 2, md: 3 }}
                            columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}
                        >
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <StyledBox
                                    className="mor_insight_datas more-data-table"
                                >

                                    <StyledText className="mor_insight_data insight-col-decs">
                                        Description
                                    </StyledText>

                                    <StyledText className="mor_insight_data insight-col-hcc-code more-table-sm-none">
                                        HCC Code(s)
                                    </StyledText>

                                    <StyledText className="mor_insight_data insight-col-hcc  more-table-sm-none">
                                        HCC
                                    </StyledText>



                                    {tabs && tabs["patient_dashboard_weights"]?.active && (
                                        <StyledText className="mor_insight_data  insight-col-raf">
                                            RAF
                                        </StyledText>
                                    )}

                                    <StyledText className="mor_insight_data insight-col-recived  more-table-sm-none">
                                        Received On
                                    </StyledText>

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
            {/* Header end for accordion body */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: "0rem" }}>
                {morInsightData &&
                    morInsightData?.slice(0, 3)?.map((item, index) => {
                        return (
                            <Box key={index}>
                                <StyledAccordingBox>
                                    {/* Body content start */}
                                    <Grid
                                        container
                                        spacing={0}
                                        className="ContentBody more-data-table-body"
                                        sx={{
                                            padding: "10px 10px 10px",
                                            backgroundColor: "#fff",
                                            borderBottomLeftRadius: index === (morInsightData.length - 1) ? "10px" : 0,
                                            borderBottomRightRadius: index === (morInsightData.length - 1) ? "10px" : 0,
                                        }}
                                    >


                                        {/* Content - Description */}
                                        <Grid sx={{

                                        }} item className="mor_insight_data insight-col-decs">

                                            <Box
                                                // sx={{
                                                //     [theme.breakpoints.only("lg")]: {
                                                //         width: "50%",
                                                //     },

                                                //     [theme.breakpoints.only("md")]: {
                                                //         width: "95%",
                                                //     },
                                                //     width: "90%",
                                                // }}
                                                className="acc-content-body-desc"
                                            >
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '12px',
                                                }}>
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
                                                            '@media (max-width:600px)': {
                                                                fontSize: "14px",
                                                                lineHeight: '17px'
                                                            }

                                                        }}
                                                    >
                                                        {item?.code}
                                                    </StyledText>
                                                    <StyledText className="display-see-more-see-less"
                                                        sx={{
                                                            fontWeight: 600,
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
                                                        onClick={() => showMoreData()}
                                                    >
                                                        {!showmore ? "See All" : "See Less"}
                                                    </StyledText>
                                                </Box>
                                                {/* mobile screen-code */}

                                                {showmore && (
                                                    <Box sx={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                        <Box sx={{ display: 'flex', gap: '12px', alignItems: "center", width: "100%" }}>
                                                            <Typography component={'span'} className="dark-text-typo">HCC code(s):</Typography>
                                                            <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                                <StyleCode className="stylecode-button insight-col-hcc-code-stylecode"
                                                                    sx={{
                                                                        ml: 0.5,
                                                                        maxWidth: "100%",
                                                                        textOverflow: "ellipsis",
                                                                        [theme.breakpoints.only("md")]: {
                                                                            mr: 2,
                                                                        },

                                                                        [theme.breakpoints.up("md")]: {
                                                                            mr: 2,

                                                                        },
                                                                    }}
                                                                >
                                                                    <Tooltip title={item?.info?.[0][0][1]}>{item?.info?.[0][0][0]}</Tooltip>

                                                                </StyleCode>

                                                                <StyleCode className="stylecode-button"
                                                                    sx={{
                                                                        ml: 0.5,
                                                                        maxWidth: "100%",
                                                                        textOverflow: "ellipsis",
                                                                        [theme.breakpoints.only("md")]: {
                                                                            mr: 2,
                                                                        },

                                                                        [theme.breakpoints.up("md")]: {
                                                                            mr: 2,

                                                                        },
                                                                    }}
                                                                >
                                                                    <Tooltip title={item?.info?.[0][0][1]}>+1</Tooltip>

                                                                </StyleCode>
                                                            </Box>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', gap: '12px', alignItems: "center", width: "100%" }}>
                                                            <Typography className="dark-text-typo">HCC:</Typography>
                                                            <StyleCode2 className="insight-col-hcc-stylecode"
                                                                sx={{
                                                                    verticalAlign: "top",
                                                                    ml: 0,
                                                                    maxWidth: "100%",
                                                                    textOverflow: "ellipsis",
                                                                    overflow: "hidden",
                                                                    color: "black !important",
                                                                    padding: '0px',
                                                                }}
                                                            >

                                                                {item?.info?.[1]}
                                                            </StyleCode2>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', gap: '12px', alignItems: "center", width: "100%" }}>
                                                            <Typography className="dark-text-typo">Received on:</Typography>
                                                            <StyleCode2 className="recived-stylecode"
                                                                sx={{
                                                                    color: "black !important",
                                                                    verticalAlign: "top",
                                                                    ml: 0,
                                                                    maxWidth: "100%",
                                                                    textOverflow: "ellipsis",
                                                                    overflow: "hidden",
                                                                    padding: '0',
                                                                }}
                                                            >

                                                                {item?.info?.[3]}

                                                            </StyleCode2>
                                                        </Box>
                                                    </Box>
                                                )}


                                            </Box>

                                        </Grid>


                                        {/* Content - HCC Code */}
                                        <Grid item className="mor_insight_data insight-col-hcc-code modile-display-none" sx={{ display: "flex" }}>


                                            <StyleCode className="stylecode-button insight-col-hcc-code-stylecode"
                                                sx={{
                                                    ml: 0.5,
                                                    maxWidth: "100%",
                                                    textOverflow: "ellipsis",
                                                    [theme.breakpoints.only("md")]: {
                                                        mr: 2,
                                                    },

                                                    [theme.breakpoints.up("md")]: {
                                                        mr: 2,

                                                    },
                                                }}
                                            >
                                                <Tooltip title={item?.info?.[0][0][1]}>{item?.info?.[0][0][0]}</Tooltip>

                                            </StyleCode>
                                            <StyleCode className="stylecode-button insight-col-hcc-code-stylecode"
                                                sx={{
                                                    ml: 0.5,
                                                    maxWidth: "100%",
                                                    textOverflow: "ellipsis",
                                                    [theme.breakpoints.only("md")]: {
                                                        mr: 2,
                                                    },

                                                    [theme.breakpoints.up("md")]: {
                                                        mr: 2,

                                                    },
                                                }}
                                            >
                                                <Tooltip title={item?.info?.[0][0][1]}>{item?.info?.[0][1][0]}</Tooltip>

                                            </StyleCode>

                                            <StyleCode className="stylecode-button"
                                                sx={{
                                                    ml: 0.5,
                                                    maxWidth: "100%",
                                                    textOverflow: "ellipsis",
                                                    [theme.breakpoints.only("md")]: {
                                                        mr: 2,
                                                    },

                                                    [theme.breakpoints.up("md")]: {
                                                        mr: 2,

                                                    },
                                                }}
                                            >
                                                    {console.log(item.info[0],'867676r54')}
                                                <CustomTooltip title={<div className={"abcd"}><TooltipComponent info={item.info} /></div>} >+{item.info[0].slice(1).length}</CustomTooltip>

                                            </StyleCode>


                                        </Grid>

                                        {/* Content - Code */}
                                        <Grid item className="mor_insight_data insight-col-hcc modile-display-none">

                                            <StyleCode2 className="insight-col-hcc-stylecode"
                                                sx={{
                                                    verticalAlign: "top",
                                                    ml: 0.5,
                                                    maxWidth: "100%",
                                                    textOverflow: "ellipsis",
                                                    overflow: "hidden",
                                                    color: "black !important",
                                                    [theme.breakpoints.only("md")]: {
                                                        mr: 2,
                                                    },
                                                    [theme.breakpoints.down("md")]: {
                                                        mt: 0.5,
                                                    },
                                                    [theme.breakpoints.up("md")]: {
                                                        mr: 2,

                                                    },
                                                }}
                                            >

                                                {item?.info?.[1]}
                                            </StyleCode2>

                                        </Grid>

                                        {/* Content - RAF */}
                                        {tabs && tabs["patient_dashboard_weights"]?.active && (
                                            <Grid item className="mor_insight_data insight-col-raf">
                                                {tabs && tabs["patient_dashboard_weights"]?.active && (
                                                    <StyledText className="insight-col-raf-stylecode"
                                                        sx={{
                                                            color: "black !important",
                                                            [theme.breakpoints.only("xl")]: {
                                                                pr: 1,
                                                            },
                                                            [theme.breakpoints.only("md")]: {
                                                                justifyContent: "start",
                                                            },

                                                            [theme.breakpoints.only("sm")]: {
                                                                pl: "10px",
                                                            },
                                                            [theme.breakpoints.only("md")]: {
                                                                pl: "12px",
                                                            },

                                                            [theme.breakpoints.only("lg")]: {
                                                                pl: "12px",
                                                            }

                                                        }}
                                                    >
                                                        {item?.info?.[2]}
                                                    </StyledText>
                                                )}
                                            </Grid>
                                        )}

                                        {/* Content - Code */}
                                        <Grid item className="mor_insight_data insight-col-recived modile-display-none">


                                            <StyleCode2 className="recived-stylecode"
                                                sx={{
                                                    color: "black !important",
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

                                                    },
                                                }}
                                            >

                                                {item?.info?.[3]}

                                            </StyleCode2>

                                        </Grid>


                                    </Grid>
                                    {/* Body content end */}
                                </StyledAccordingBox>

                                {Object.keys(item?.info?.alternate_codes).length > 0 && (
                                    <MuiAccordions
                                        tabs={tabs}
                                        panel={item}
                                        code={item?.code}
                                        name="Show-Alternet-Codes"
                                        expanded={expanded}
                                        setExpanded={setExpanded}
                                        sx={{
                                            mb: expanded ? 0 : 0.5,
                                            background:
                                                expanded === item
                                                    ? theme.palette.secondary.main
                                                    : theme.palette.secondary.A400,
                                            color:
                                                expanded === item ? "white" : theme.palette.black.main,
                                            borderRadius:
                                                expanded === item ? 0 : "0 0 0.625rem 0.625rem",
                                            "& .MuiAccordionSummary-content": {
                                                flexGrow: "initial",
                                                fontSize: "14px",
                                                fontWeight: "700",
                                                lineHeight: "21px",
                                                letterSpacing: "0em",
                                                textAlign: "left",
                                                color: "#fff",
                                                paddingRight: "10px",
                                            },
                                        }}
                                        expandIcon={<ArrowDropDownIcon width={12} height={12} />}
                                        header={`Show Alternate Codes (${Object.keys(item?.info?.alternate_codes).length
                                            })`}
                                    >
                                        {item?.info?.alternate_codes &&
                                            item?.info?.alternate_codes?.map((value, i) => (
                                                <Box key={i}>
                                                    {!value?.isCollapse ? (
                                                        <StyledAccordingBox>
                                                            <Grid
                                                                container
                                                                spacing={0}
                                                                className="ContentBody"
                                                                sx={{
                                                                    padding: "10px 10px 10px",
                                                                    backgroundColor: "#fff",
                                                                    borderRadius:
                                                                        index === 0 ? 0 : "10px 10px 0 0",

                                                                    [theme.breakpoints.down("md")]: {
                                                                        borderRadius: "0px",
                                                                        display: "none",
                                                                    },
                                                                }}
                                                            >
                                                                <Grid item md={2.5} lg={2} xl={2}>
                                                                    <StyleCode
                                                                        sx={{
                                                                            verticalAlign: "top",
                                                                            mt: 1.5,
                                                                            ml: 1,
                                                                            maxWidth: "8.5rem",
                                                                            textOverflow: "ellipsis",
                                                                            overflow: "hidden",
                                                                            [theme.breakpoints.only("md")]: {
                                                                                mr: 2,
                                                                            },
                                                                        }}
                                                                    >
                                                                        {value?.code?.length > 11 ? (
                                                                            <Tooltip title={value?.code}>
                                                                                {value?.code}
                                                                            </Tooltip>
                                                                        ) : (
                                                                            value?.code
                                                                        )}
                                                                    </StyleCode>
                                                                </Grid>
                                                                <Grid item md={2.5} lg={5} xl={5}>
                                                                    <Box
                                                                        sx={{
                                                                            [theme.breakpoints.only("lg")]: {
                                                                                width: "80%",
                                                                            },

                                                                            [theme.breakpoints.only("md")]: {
                                                                                width: "95%",
                                                                            },
                                                                            display: "inline-block",
                                                                            alignItems: "center",
                                                                            width: "90%",
                                                                        }}
                                                                    >
                                                                        <StyledText
                                                                            sx={{
                                                                                [theme.breakpoints.only("lg")]: {
                                                                                    width: "calc(100% - 144px)",
                                                                                },
                                                                                fontWeight: 400,
                                                                                width: "100%",
                                                                                padding: "0",
                                                                                overflow: "hidden",
                                                                                textOverflow: "ellipsis",
                                                                                whiteSpace: "nowrap",
                                                                                textTransform: "inherit",
                                                                                display: "inline-block",
                                                                                verticalAlign: "bottom",
                                                                            }}
                                                                        >
                                                                            {value?.value}
                                                                        </StyledText>
                                                                    </Box>
                                                                </Grid>
                                                                <Grid item md={1.5} lg={1.3} xl={1.5}>
                                                                    <StyledText
                                                                        sx={{
                                                                            fontWeight: 600,
                                                                            textDecorationLine: "underline",
                                                                            color: theme.palette.secondary.main,
                                                                            display: "inline-block",
                                                                            cursor: "pointer",
                                                                            [theme.breakpoints.only("xl")]: {
                                                                                ml: 0.3,
                                                                            },
                                                                        }}
                                                                        onClick={() => handleIsCollapse({ value })}
                                                                    >
                                                                        See All
                                                                    </StyledText>
                                                                </Grid>
                                                                <Grid item md={5.5} lg={3.7} xl={3.5}>
                                                                    <Grid container>
                                                                        <Grid
                                                                            item
                                                                            md={2}
                                                                            lg={3}
                                                                            xl={3}
                                                                            sx={{ mt: 1 }}
                                                                        >
                                                                            {tabs &&
                                                                                tabs["patient_dashboard_weights"]
                                                                                    ?.active && (
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
                                                                                        {value?.total_weight}
                                                                                    </StyledText>
                                                                                )}
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid
                                                                container
                                                                spacing={0}
                                                                className="ContentBody"
                                                                sx={{
                                                                    padding: "10px 10px 10px",
                                                                    backgroundColor: "#fff",
                                                                    borderRadius:
                                                                        [1, 4, 5, 6].length - 1 === index &&
                                                                        "0px 0px 10px 10px",

                                                                    [theme.breakpoints.up("md")]: {
                                                                        borderRadius: "0px",
                                                                        display: "none",
                                                                    },
                                                                }}
                                                            >
                                                                <Grid
                                                                    container
                                                                    xs={12}
                                                                    sm={12}
                                                                    md={5}
                                                                    lg={3}
                                                                    xl={3}
                                                                >
                                                                    <Grid item xs={7} sm={7} md={5} lg={3} xl={3}>
                                                                        <StyleCode
                                                                            sx={{
                                                                                verticalAlign: "top",
                                                                                mt: 1.5,
                                                                                ml: 1,
                                                                                maxWidth: "8.5rem",
                                                                                textOverflow: "ellipsis",
                                                                                overflow: "hidden",
                                                                                [theme.breakpoints.only("md")]: {
                                                                                    mr: 2,
                                                                                },
                                                                            }}
                                                                        >
                                                                            {value?.code?.length > 11 ? (
                                                                                <Tooltip title={value?.code}>
                                                                                    {value?.code}
                                                                                </Tooltip>
                                                                            ) : (
                                                                                value?.code
                                                                            )}
                                                                        </StyleCode>
                                                                    </Grid>
                                                                    <Grid item xs={5} sm={5} md={5} lg={3} xl={3}>
                                                                        <Grid container>
                                                                            <Grid
                                                                                item
                                                                                xs={6}
                                                                                sm={6}
                                                                                md={5}
                                                                                lg={3}
                                                                                xl={3}
                                                                            >
                                                                                {tabs &&
                                                                                    tabs["patient_dashboard_weights"]
                                                                                        ?.active && (
                                                                                        <StyledText
                                                                                            sx={{ pr: 3, ml: 0, mt: 0 }}
                                                                                        >
                                                                                            {value?.total_weight}
                                                                                        </StyledText>
                                                                                    )}
                                                                            </Grid>
                                                                            <Grid
                                                                                item
                                                                                xs={6}
                                                                                sm={6}
                                                                                md={5}
                                                                                lg={3}
                                                                                xl={3}
                                                                            >
                                                                                <StyledText
                                                                                    onClick={() =>
                                                                                        handleIsCollapse({ value })
                                                                                    }
                                                                                    sx={{
                                                                                        fontWeight: 600,
                                                                                        textDecorationLine: "underline",
                                                                                        color: theme.palette.secondary.main,
                                                                                        ml: 1,
                                                                                        cursor: "pointer",
                                                                                    }}
                                                                                >
                                                                                    See All
                                                                                </StyledText>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        </StyledAccordingBox>
                                                    ) : null}
                                                </Box>
                                            ))}
                                    </MuiAccordions>
                                )}
                            </Box>
                        );
                    })}

            </Box>
        </Box >
    );
};
const flexAlignCenter = {
    display: "flex",
    alignItems: "center",
};
