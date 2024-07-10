import React, { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Typography,
    ButtonGroup,
    Tooltip,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
    ArrowDropDownIcon,
    MuiAccordions,
    DocIcon,
    CorrectIcon,
    CrossWhite,
} from "../../components";
import "../../Screens/Codes/Codes.css";
import { patientDeletedCode } from "../../redux/userSlice/patientInfoSlice";
import { patientClinicalDocument } from "../../redux/userSlice/petientClinicalSlice";

import { TabsSlag } from "../TabsSlag/TabsSlag";
import {
    StyleCircle,
    StyleCode,
    StyledText,
    StyledHeader,
    StyledBox,
    StyledAccordingBox,
    StyledButton,
    StyledButton2,
} from "../Common/StyledMuiComponents";

export const DeletedCodes = ({ sessionObject }) => {

    const dispatch = useDispatch();
    const theme = useTheme();
    const tabs = TabsSlag();
    const [expanded, setExpanded] = React.useState(false);
    const [deletedCodess, setDeletedCodes] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [Deleteopen, setDeleteOpen] = React.useState(false);
    const [clinicalDoc, setClinicalDoc] = useState(null);
    const [checkedAcceptAll, setCheckedAcceptAll] = useState([]);
    const [handleFunction, setHandleFunction] = useState(false);
    const [selectedRejectData, setSelectedRejectData] = useState();
    const [selectedMainCode, setSelectedMainCode] = useState("");
    const [deletedCondition, setDeletedCondition] = useState([]);
    const deletedCodes = useSelector((state) => state?.summary?.duplicate);
    const [selecteddeletedCodes, setSelecteddeletedCodes] = useState([]);
    const [sessionObjLoaded, setSessionObjLoaded] = useState(false);
   
    const [rejectdeletedCodes, setRejectdeletedCodes] = useState([]);

    const duplicateRejectCode = useSelector(
        (state) => state?.summary?.duplicateRejectCode
    );
    const [rejectDuplicateData, setDuplicateRejectData] =
        useState(duplicateRejectCode);

    const handleClickOpen = (item, code) => {
        if (!isNaN(item)) {
            let code = result[item];
            setHandleFunction(true);
            setSelectedRejectData(code);
        } else {
            setSelectedRejectData(item);
        }
        setSelectedMainCode(code);
        setDeleteOpen(true);
    };
    const handleClose = () => {
        setDeleteOpen(false);
    };


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
        setCheckedAcceptAll(result);
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

    const handleClinicalDoc = async (item) => {
        let data = await dispatch(
            patientClinicalDocument({
                code: item.code,
                code_type: "recapture-codes",
            })
        );
        setClinicalDoc(data.payload);
        setOpen(true);
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
                                                    item?.info?.icd_code
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
                                                        {item?.info?.icd_code_description}
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
                                                            {item?.info?.icd_code_description}
                                                        </StyledText>
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
                                                            }}
                                                        >
                                                            Deleted by:
                                                            <Typography
                                                                sx={{
                                                                    fontSize: "14px",
                                                                    fontWeight: 700,
                                                                    lineHeight: "25px",
                                                                    letterSpacing: "0.02em",
                                                                    paddingLeft: "4px",
                                                                }}
                                                            >
                                                                {item?.info?.deleted_by}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                                        <Box
                                                            sx={{
                                                                fontSize: "14px",
                                                                fontWeight: 500,
                                                                lineHeight: "25px",
                                                                letterSpacing: "0em",
                                                                display: "inline-block",
                                                                [theme.breakpoints.up("lg")]: {

                                                                    my: 1,
                                                                },
                                                            }}
                                                        >
                                                            Deleted On:
                                                            <Typography
                                                                sx={{
                                                                    fontSize: "14px",
                                                                    fontWeight: 700,
                                                                    lineHeight: "25px",
                                                                    letterSpacing: "0.02em",
                                                                    paddingLeft: "4px",
                                                                }}
                                                            >
                                                                {item?.info?.deleted_on}
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
                                                            }}
                                                        >
                                                            Type of Code/Condition:
                                                            <Typography
                                                                sx={{
                                                                    fontSize: "14px",
                                                                    fontWeight: 700,
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
                                                            }}
                                                        >
                                                            Reason
                                                            <Typography
                                                                sx={{
                                                                    fontSize: "14px",
                                                                    fontWeight: 700,
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
                                                                            fontWeight: 500,
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
                                                                                        fontWeight: 500,
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
                                                                <Grid item xs={12} sm={12} md={5} lg={3} xl={3}>
                                                                    <StyledText
                                                                        sx={{
                                                                            [theme.breakpoints.down("md")]: {
                                                                                width: "99%",
                                                                                py: 1,
                                                                            },

                                                                            fontWeight: 400,
                                                                            width: "100%",
                                                                            maxWidth: "28rem",
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
                                                                </Grid>
                                                            </Grid>
                                                        </StyledAccordingBox>
                                                    ) : (
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
                                                                <Grid
                                                                    item
                                                                    xs={12}
                                                                    sm={12}
                                                                    md={2.5}
                                                                    lg={2}
                                                                    xl={2}
                                                                >
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
                                                                <Grid
                                                                    item
                                                                    xs={12}
                                                                    sm={12}
                                                                    md={9.5}
                                                                    lg={6.3}
                                                                    xl={6.5}
                                                                >
                                                                    <Grid container>
                                                                        <Grid
                                                                            item
                                                                            xs={12}
                                                                            sm={12}
                                                                            md={12}
                                                                            lg={12}
                                                                            xl={12}
                                                                        >
                                                                            <StyledText
                                                                                sx={{
                                                                                    fontWeight: 400,
                                                                                    width: "100%",
                                                                                    // maxWidth: "28rem",
                                                                                    padding: "0",
                                                                                    textTransform: "inherit",
                                                                                    display: "inline-block",
                                                                                    verticalAlign: "bottom",
                                                                                }}
                                                                            >
                                                                                {value?.value}
                                                                            </StyledText>
                                                                        </Grid>
                                                                        <Grid
                                                                            item
                                                                            xs={6}
                                                                            sm={6}
                                                                            md={6}
                                                                            lg={6}
                                                                            xl={6}
                                                                        >
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
                                                                                    {value?.noted_by}
                                                                                </Typography>
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid
                                                                            item
                                                                            xs={6}
                                                                            sm={6}
                                                                            md={6}
                                                                            lg={6}
                                                                            xl={6}
                                                                        >
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
                                                                                    {value?.noted_date}
                                                                                </Typography>
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid
                                                                            item
                                                                            xs={12}
                                                                            sm={12}
                                                                            md={12}
                                                                            lg={12}
                                                                            xl={12}
                                                                        >
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
                                                                                Remarks:
                                                                                <Typography
                                                                                    sx={{
                                                                                        fontSize: "14px",
                                                                                        fontWeight: 700,
                                                                                        lineHeight: "25px",
                                                                                        letterSpacing: "0.02em",
                                                                                        paddingLeft: "4px",
                                                                                    }}
                                                                                >
                                                                                    {item?.info?.remarks}
                                                                                </Typography>
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid
                                                                            item
                                                                            xs={12}
                                                                            sm={12}
                                                                            md={12}
                                                                            lg={12}
                                                                            xl={12}
                                                                        >
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
                                                                                {value?.sources?.map(
                                                                                    (source, index) => (
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
                                                                                    )
                                                                                )}
                                                                            </Box>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                                <Grid
                                                                    item
                                                                    xs={12}
                                                                    sm={12}
                                                                    md={12}
                                                                    lg={3.7}
                                                                    xl={3.5}
                                                                >
                                                                    <Grid container>
                                                                        <Grid
                                                                            item
                                                                            md={5.2}
                                                                            display={{ xl: "none", lg: "none" }}
                                                                        >
                                                                            {tabs &&
                                                                                tabs["patient_dashboard_view_document"]
                                                                                    ?.active && (
                                                                                    <Box
                                                                                        onClick={() =>
                                                                                            handleClinicalDoc(item)
                                                                                        }
                                                                                        sx={{
                                                                                            textAlign: "end",
                                                                                            [theme.breakpoints.up("md")]: {
                                                                                                mt: 1,
                                                                                            },
                                                                                            cursor: "pointer",
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
                                                                                )}
                                                                        </Grid>
                                                                        <Grid
                                                                            item
                                                                            md={1.9}
                                                                            lg={3}
                                                                            xl={2}
                                                                            sx={{
                                                                                mt: 1,
                                                                                [theme.breakpoints.only("md")]: {
                                                                                    textAlign: "end",
                                                                                },
                                                                            }}
                                                                        >
                                                                            {tabs &&
                                                                                tabs["patient_dashboard_weights"]
                                                                                    ?.active && (
                                                                                    <StyledText
                                                                                        sx={{
                                                                                            [theme.breakpoints.only("md")]: {
                                                                                                pl: 1.5,
                                                                                                justifyContent: "center",
                                                                                            },
                                                                                        }}
                                                                                    >
                                                                                        {value?.total_weight}
                                                                                    </StyledText>
                                                                                )}
                                                                        </Grid>
                                                                    </Grid>

                                                                    {tabs &&
                                                                        tabs["patient_dashboard_view_document"]
                                                                            ?.active && (
                                                                            <Box
                                                                                onClick={() => handleClinicalDoc(value)}
                                                                                sx={{
                                                                                    textAlign: "end",
                                                                                    mt: 2,
                                                                                    [theme.breakpoints.only("md")]: {
                                                                                        display: "none",
                                                                                    },
                                                                                    cursor: "pointer",
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
                                                                        )}
                                                                </Grid>
                                                                <Grid
                                                                    item
                                                                    xs={12}
                                                                    sm={12}
                                                                    md={3.7}
                                                                    lg={2.8}
                                                                    xl={2.8}
                                                                >
                                                                    <Box
                                                                        sx={{
                                                                            textAlign: "end",
                                                                        }}
                                                                    >
                                                                        <StyledText
                                                                            sx={{
                                                                                fontWeight: 500,
                                                                                textDecorationLine: "underline",
                                                                                color: "#3D4A8F",
                                                                                ml: 1,
                                                                                letterSpacing: "0.02em",
                                                                                m: 0,
                                                                                cursor: "pointer",
                                                                            }}
                                                                            onClick={() =>
                                                                                handleIsCollapse({ value })
                                                                            }
                                                                        >
                                                                            See Less
                                                                        </StyledText>
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
                                                                    borderRadius:
                                                                        [1, 4, 5, 6].length - 1 === index &&
                                                                        "0px 0px 10px 10px",

                                                                    [theme.breakpoints.up("md")]: {
                                                                        borderRadius: "0px",
                                                                        display: "none",
                                                                    },
                                                                }}
                                                            >
                                                                <Grid item xs={12} sm={12}>
                                                                    <Grid container>
                                                                        <Grid item xs={7} sm={7}>
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
                                                                        <Grid item xs={2.5} sm={2.5}>
                                                                            {tabs &&
                                                                                tabs["patient_dashboard_weights"]
                                                                                    ?.active && (
                                                                                    <StyledText
                                                                                        sx={{
                                                                                            pr: 1.6,
                                                                                            mt: 0,
                                                                                            [theme.breakpoints.only("xl")]: {
                                                                                                pr: 3.5,
                                                                                            },
                                                                                            [theme.breakpoints.only("md")]: {
                                                                                                pr: 3,
                                                                                            },
                                                                                        }}
                                                                                    >
                                                                                        {value?.total_weight}0.25
                                                                                    </StyledText>
                                                                                )}
                                                                        </Grid>
                                                                        <Grid item xs={2.5} sm={2.5}>
                                                                            <StyledText
                                                                                sx={{
                                                                                    display: "inline-block",
                                                                                    fontWeight: 500,
                                                                                    textDecorationLine: "underline",
                                                                                    color: theme.palette.secondary.main,
                                                                                    ml: 1,
                                                                                    letterSpacing: "0.02em",
                                                                                    m: 0,
                                                                                    cursor: "pointer",

                                                                                    [theme.breakpoints.only("md")]: {
                                                                                        display: "none",
                                                                                    },
                                                                                }}
                                                                                onClick={() =>
                                                                                    handleIsCollapse({ value })
                                                                                }
                                                                            >
                                                                                See Less
                                                                            </StyledText>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                                <Grid item xs={12} sm={12}>
                                                                    <Grid container>
                                                                        <Grid item xs={12} sm={12}>
                                                                            <StyledText
                                                                                sx={{
                                                                                    fontWeight: 400,
                                                                                    width: "100%",
                                                                                    // maxWidth: "28rem",
                                                                                    padding: "0",
                                                                                    textTransform: "inherit",
                                                                                    display: "inline-block",
                                                                                    verticalAlign: "bottom",
                                                                                }}
                                                                            >
                                                                                {value?.value}
                                                                            </StyledText>
                                                                        </Grid>
                                                                        <Grid item xs={8} sm={8}>
                                                                            <Grid container>
                                                                                <Grid item xs={6} sm={6}>
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
                                                                                            {value?.noted_by}
                                                                                        </Typography>
                                                                                    </Box>
                                                                                </Grid>
                                                                                <Grid item xs={5} sm={5}>
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
                                                                                            {value?.noted_date}
                                                                                        </Typography>
                                                                                    </Box>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                                <Grid
                                                                    item
                                                                    xs={12}
                                                                    sm={12}
                                                                    md={12}
                                                                    lg={12}
                                                                    xl={12}
                                                                >
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
                                                                        Remarks:
                                                                        <Typography
                                                                            sx={{
                                                                                fontSize: "14px",
                                                                                fontWeight: 700,
                                                                                lineHeight: "25px",
                                                                                letterSpacing: "0.02em",
                                                                                paddingLeft: "4px",
                                                                            }}
                                                                        >
                                                                            {item?.info?.remarks}
                                                                        </Typography>
                                                                    </Box>
                                                                </Grid>
                                                                <Grid item xs={12} sm={12}>
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
                                                                        {value?.sources?.map((source, index) => (
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
                                                                <Grid
                                                                    item
                                                                    xs={12}
                                                                    sm={12}
                                                                    md={12}
                                                                    lg={4}
                                                                    xl={3.5}
                                                                >
                                                                    {tabs &&
                                                                        tabs["patient_dashboard_view_document"]
                                                                            ?.active && (
                                                                            <Box
                                                                                onClick={() => handleClinicalDoc(value)}
                                                                                sx={{
                                                                                    textAlign: "start",
                                                                                    mt: 2,
                                                                                    [theme.breakpoints.only("md")]: {
                                                                                        display: "none",
                                                                                    },
                                                                                    cursor: "pointer",
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
                                                                        )}

                                                                </Grid>
                                                            </Grid>
                                                        </StyledAccordingBox>
                                                    )}
                                                </Box>
                                            ))}

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
                                            {!(
                                                checkedAcceptAll[index]?.isMainCodeAvailable &&
                                                checkedAcceptAll[index]?.areAlternateCodesAvailable
                                            ) ? (
                                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                                    {tabs &&
                                                        tabs["patient_dashboard_accept_all"]?.active &&
                                                        (rejectDuplicateData &&
                                                            rejectDuplicateData?.some((value) => {
                                                                if (Object.keys(value)[0] === item.code) {
                                                                    if (
                                                                        item?.info?.alternate_codes?.length ===
                                                                        value[Object.keys(value)[0]]
                                                                            ?.alternate_codes?.length &&
                                                                        value[Object.keys(value)[0]].delete_code ===
                                                                        true
                                                                    ) {
                                                                        return true;
                                                                    }
                                                                }
                                                                return false;
                                                            }) ? (
                                                            <StyledButton
                                                                sx={{
                                                                    backgroundColor: theme.palette.error.active1,
                                                                    color: "#fff",
                                                                    ":hover": {
                                                                        backgroundColor: theme.palette.error.main,
                                                                    },
                                                                    width: "9.75rem",
                                                                    height: "2rem",
                                                                }}
                                                                startIcon={
                                                                    <StyleCircle
                                                                        sx={{
                                                                            background: "red",
                                                                            ...flexAlignCenter,
                                                                            justifyContent: "center",
                                                                            borderRadius: "100px",
                                                                        }}
                                                                    >
                                                                        <CrossWhite />
                                                                    </StyleCircle>
                                                                }
                                                            >
                                                                Rejected (
                                                                {Object.keys(item?.info?.alternate_codes)
                                                                    ?.length + 1}
                                                                )
                                                            </StyledButton>
                                                        ) : (
                                                            <>
                                                                <StyledButton
                                                                    onClick={() =>
                                                                        handleClickOpen(index, item?.code)
                                                                    }
                                                                    sx={{
                                                                        backgroundColor: theme.palette.primary.main,
                                                                        color: "#fff",
                                                                        ":hover": {
                                                                            backgroundColor:
                                                                                theme.palette.primary.main,
                                                                        },
                                                                        width: "9.75rem",
                                                                        height: "2rem",
                                                                        background:
                                                                            tabs?.read_only?.active && "grey ",
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
                                                                    disabled={tabs?.read_only?.active}
                                                                >
                                                                    Reject All (
                                                                    {Object.keys(item?.info?.alternate_codes)
                                                                        ?.length + 1}
                                                                    )
                                                                </StyledButton>
                                                            </>
                                                        ))}
                                                </Grid>
                                            ) : (
                                                <StyledButton2
                                                    sx={{ mr: 2, width: "9.75rem", height: "2rem" }}
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
                                                    Accepted All
                                                </StyledButton2>
                                            )}
                                        </Grid>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "row",
                                                justifyContent: "center",
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
                                                {!(
                                                    checkedAcceptAll[index]?.isMainCodeAvailable &&
                                                    checkedAcceptAll[index]?.areAlternateCodesAvailable
                                                ) ? (
                                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                                        {tabs &&
                                                            tabs["patient_dashboard_accept_all"]?.active &&
                                                            (rejectDuplicateData &&
                                                                rejectDuplicateData?.some((value) => {
                                                                    if (Object.keys(value)[0] === item.code) {
                                                                        if (
                                                                            item?.info?.alternate_codes?.length ===
                                                                            value[Object.keys(value)[0]]
                                                                                ?.alternate_codes?.length &&
                                                                            value[Object.keys(value)[0]].delete_code ===
                                                                            true
                                                                        ) {
                                                                            return true;
                                                                        }
                                                                    }
                                                                    return false;
                                                                }) ? (
                                                                <Button
                                                                    sx={{
                                                                        borderRadius: "10px",
                                                                        height: "37px",
                                                                        fontSize: "14px",
                                                                        fontWeight: 600,
                                                                        textTransform: "inherit",
                                                                        padding: "5px 25px",
                                                                        backgroundColor:
                                                                            theme.palette.error.active1,
                                                                        color: "#fff",
                                                                        ":hover": {
                                                                            backgroundColor: theme.palette.error.main,
                                                                        },
                                                                    }}
                                                                    startIcon={
                                                                        <StyleCircle
                                                                            sx={{
                                                                                background: "red",
                                                                                ...flexAlignCenter,
                                                                                justifyContent: "center",
                                                                                borderRadius: "100px",
                                                                            }}
                                                                        >
                                                                            <CrossWhite />
                                                                        </StyleCircle>
                                                                    }
                                                                >
                                                                    Rejected (
                                                                    {Object.keys(item?.info?.alternate_codes)
                                                                        ?.length + 1}
                                                                    )
                                                                </Button>
                                                            ) : (
                                                                <>
                                                                    <Button
                                                                        onClick={() =>
                                                                            handleClickOpen(index, item?.code)
                                                                        }
                                                                        sx={{
                                                                            borderRadius: "10px",
                                                                            height: "37px",
                                                                            backgroundColor: "#fff",
                                                                            color: "#000000",
                                                                            fontSize: "14px",
                                                                            fontWeight: 600,
                                                                            textTransform: "inherit",
                                                                            padding: "5px 25px",
                                                                            background:
                                                                                tabs?.read_only?.active && "grey ",
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
                                                                        disabled={tabs?.read_only?.active}
                                                                    >
                                                                        Reject All ({" "}
                                                                        {Object.keys(item?.info?.alternate_codes)
                                                                            ?.length + 1}
                                                                        )
                                                                    </Button>
                                                                </>
                                                            ))}
                                                    </Grid>
                                                ) : (
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
                                                            ":hover": {
                                                                backgroundColor: "#fff",
                                                            },
                                                        }}
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
                                                        Accepted All
                                                    </Button>
                                                )}
                                            </ButtonGroup>
                                        </Box>
                                    </MuiAccordions>
                                )}
                            </Box>
                        );
                    })}
            </Box>
        </Box>
    );
};
const flexAlignCenter = {
    display: "flex",
    alignItems: "center",
};
