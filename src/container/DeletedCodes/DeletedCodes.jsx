import React, { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Typography,
    Tooltip,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import {
    ArrowDropDownIcon,
    MuiAccordions,
} from "../../components";
import "../../Screens/Codes/Codes.css";
import { patientDeletedCode } from "../../redux/userSlice/patientInfoSlice";
import { TabsSlag } from "../TabsSlag/TabsSlag";
import {
    StyleCode,
    StyledText,
    StyledHeader,
    StyledBox,
    StyledAccordingBox,
    StyleCode2,
} from "../Common/StyledMuiComponents";

export const DeletedCodes = ({ sessionObject }) => {

    const dispatch = useDispatch();
    const theme = useTheme();
    const tabs = TabsSlag();
    const [expanded, setExpanded] = React.useState(false);
    const [deletedCodess, setDeletedCodes] = React.useState([]);
    const [deletedCondition, setDeletedCondition] = useState([]);
    const deletedCodes = useSelector((state) => state?.summary?.duplicate);
    const [selecteddeletedCodes, setSelecteddeletedCodes] = useState([]);
    const [sessionObjLoaded, setSessionObjLoaded] = useState(false);
    const [rejectdeletedCodes, setRejectdeletedCodes] = useState([]);
    const state = useSelector((state) => state.user.data.deletedCodes);

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
    result?.length !== deletedCodess?.length && setDeletedCodes(result);

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
        return result;
    }

    useEffect(() => {
        dispatch(patientDeletedCode());
    }, []);

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
        let changeData = deletedCodess.map((value) => {
            return value?.code === code
                ? ((value.collapse = !value?.collapse), value)
                : value;
        });
        setDeletedCondition(changeData);
    };

    const handleIsCollapse = (data) => {
        let code = data?.value;
        let changeData = deletedCodess?.map((value) => {
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
                                    sx={{
                                        [theme.breakpoints.only("md")]: {
                                            pl: "10px",
                                        },
                                    }}
                                    className="acc-content-header-items"
                                >
                                    <StyledText sx={{
                                        paddingLeft: "6px !important",
                                        [theme.breakpoints.down("md")]: {
                                            borderRight: "2px solid rgba(0, 0, 0, 0.12) !important",
                                        },
                                    }} className="acc-content-header-item ct-code">
                                        Code(s)
                                    </StyledText>
                                    <StyledText sx={{
                                        [theme.breakpoints.down("967")]: {
                                            borderRight:  tabs && tabs["patient_dashboard_weights"]?.active ? "2px solid rgba(0, 0, 0, 0.12) !important" : "0px !important",
                                        },

                                        width: {
                                            md: "68% !important",
                                            lg: "80% !important",  // width for large screens
                                            xl: "80% !important",
                                        }
                                    }} className="acc-content-header-item ct-desc">
                                        Description
                                    </StyledText>
                                    {tabs && tabs["patient_dashboard_weights"]?.active && (
                                        <StyledText className="acc-content-header-item ct-raf">
                                            RAF
                                        </StyledText>
                                    )}

                                </StyledBox>
                            </Grid>
                       
                        </Grid>
                    </Grid>
                </StyledHeader>
            </Box>
            {/* Header end for accordion body */}

            <Box sx={{ display: "flex", flexDirection: "column", gap: "0rem" }}>
                {deletedCodess &&
                    deletedCodess?.map((item, index) => {
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
                                            borderBottomLeftRadius: index === (deletedCodess.length - 1) ? "10px" : 0,
                                            borderBottomRightRadius: index === (deletedCodess.length - 1) ? "10px" : 0,
                                        }}
                                    >
                                        {/* Content - Code */}
                                        <Grid item className="acc-content-header-item ct-code">
                                            {
                                                item?.info?.icd_code_description === "" ?

                                                    <StyleCode2
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
                                                        {item?.code?.length > 11 ? (
                                                            <Tooltip title={item?.code}>{item?.code}</Tooltip>
                                                        ) : (
                                                            "--"
                                                        )}
                                                    </StyleCode2>
                                                    :
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
                                                                
                                                            },
                                                        }}
                                                    >
                                                        {item?.code?.length > 11 ? (
                                                            <Tooltip title={item?.code}>{item?.code}</Tooltip>
                                                        ) : (
                                                            item?.info?.icd_code
                                                        )}
                                                    </StyleCode>
                                            }
                                        </Grid>

                                        {/* Content - Description */}
                                        <Grid sx={{
                                            width: {
                                                md: "68% !important",
                                                lg: "80% !important",  // width for large screens
                                                xl: "80% !important",  // width for extra-large screens
                                            }
                                        }} item className="acc-content-header-item ct-desc">
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

                                                        }}
                                                    >
                                                        {item?.info?.icd_code_description === "" ? item?.info?.icd_code : item?.info?.icd_code_description}
                                                    </StyledText>
                                                    <StyledText
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
                                                        onClick={() => handleCollapse(item.code)}
                                                    >
                                                        See All
                                                    </StyledText>
                                                </Box>
                                            ) : (
                                                <Grid sx={{ gap: '10px' }} container>
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
                                                                margin: 0
                                                            }}
                                                        >
                                                            {item?.info?.icd_code_description === "" ? item?.info?.icd_code : item?.info?.icd_code_description}
                                                        </StyledText>
                                                    </Grid>
                                                   
                                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                                        <Box
                                                            sx={{
                                                                fontSize: "14px",
                                                                fontWeight: 500,
                                                                lineHeight: "25px",
                                                                letterSpacing: "0em",
                                                                display: "inline-block",
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    opacity: 0.6
                                                                }}
                                                            >
                                                                Deleted On:
                                                            </Typography>
                                                            
                                                            <Typography
                                                                sx={{
                                                                    fontSize: "14px",
                                                                    fontWeight: 500,
                                                                    lineHeight: "25px",
                                                                    letterSpacing: "0.02em",
                                                                    paddingLeft: "4px",
                                                                }}
                                                            >
                                                                {item?.info?.deleted_on.substring(0, 10).replace(/-/g, '/')}
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
                                                                margin: "0px !important"
                                                            }}
                                                        >

                                                            <Typography
                                                                sx={{
                                                                    opacity: 0.6
                                                                }}
                                                            >
                                                                Deleted by: 
                                                            </Typography>

                                                            <Typography
                                                                sx={{
                                                                    fontSize: "14px",
                                                                    fontWeight: 500,
                                                                    lineHeight: "25px",
                                                                    letterSpacing: "0.02em",
                                                                    paddingLeft: "4px"
                                                                }}
                                                            >
                                                                {item?.info?.deleted_by}
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
                                                                margin: "0px !important"
                                                            }}
                                                        >
                                                             <Typography
                                                                sx={{
                                                                    opacity: 0.6
                                                                }}
                                                            >
                                                                Type of Code/Condition:
                                                            </Typography>
                                                            
                                                            <Typography
                                                                sx={{
                                                                    fontSize: "14px",
                                                                    fontWeight: 500,
                                                                    lineHeight: "25px",
                                                                    letterSpacing: "0.02em",
                                                                    paddingLeft: "4px",

                                                                }}
                                                            >
                                                                {item?.info?.deleted_code_type}
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
                                                                margin: "0px !important"
                                                            }}
                                                        >

<Typography
                                                                sx={{
                                                                    opacity: 0.6
                                                                }}
                                                            >
                                                              Reason:
                                                            </Typography>
                                                            
                                                            
                                                            <Typography
                                                                sx={{
                                                                    fontSize: "14px",
                                                                    fontWeight: 500,
                                                                    lineHeight: "25px",
                                                                    letterSpacing: "0.02em",
                                                                    paddingLeft: "4px",
                                                                }}
                                                            >
                                                                {item?.info?.deleted_reason}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>



                                                    <StyledText
                                                        className="acc-content-collapse-see-less"
                                                        sx={{
                                                            fontWeight: 600,
                                                            textDecorationLine: "underline",
                                                            color: "#3D4A8F",
                                                            ml: 1,
                                                            letterSpacing: "0.02em",
                                                            m: 0,
                                                            cursor: "pointer",
                                                            margin: "0px !important"
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
                                                        {item?.info?.weight}
                                                    </StyledText>
                                                )}
                                            </Grid>
                                        )}


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
