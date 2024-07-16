import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Grid,
    Typography,
    Box,
    Paper
} from "@mui/material";
import { Card, CardContent, Stack, Tooltip } from '@mui/material';
import { ArrowDropDownIcon, CrossIcon, CrossIcon2 } from "../../../src/components/Icons";

import { styled } from "@mui/system";
import React, { useEffect, useState } from "react";

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: 10,
    borderRadius: 5,
    border: "1px solid #ccc",
    marginBottom: 10
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
    color: '#101828',
    fontSize: 18,
    padding: 0,
    fontSize: 16,
    fontWeight: 700,
    lineHeight: "20px",
    textAlign: "left"
}));

const StyledCodeTypography = styled(Typography)(({ theme }) => ({
    fontSize: 16,
    fontWeight: 700,
    lineHeight: "20px",
    textAlign: "left",
    color: '#0D426A',
    display: 'block',
    paddingLeft: '8px',
    color: "#0D426A"

}));

const StyledCloseButton = styled(Button)(({ theme }) => ({
    padding: 0,
    minWidth: 0,
    minHeight: 0,
    fontSize: 16,
    fontWeight: 400,
    lineHeight: "24px",
    textAlign: "left",
    textTransform: "none",
    color: "#333",
    "&:hover": {
        backgroundColor: "transparent"
    }
}));

const StyledSubmitButton = styled(Button)(({ theme }) => ({
    border: "1px solid #E6682D"
}));

const StyleSheetNumber = styled("Span")(({ theme }) => ({
    color: "#FFF",
    fontSize: "0.75rem",
    fontWeight: 600,
    lineHeight: "1.4rem",
    backgroundColor: "#17236D",
    width: "1.3125rem",
    height: "1.3125rem",
    display: "inline-block",
    borderRadius: "1.3125rem",
    textAlign: "center",

    [theme.breakpoints.down("md")]: {
        backgroundColor: "#16236C14",
        color: "#000",
    },
}));

const StylePop = styled("Typography")(() => ({
    color: "#17236D",
    fontWeight: "600",
}));


const SubmitModal = ({ openSubmitModal, setOpenSubmitModal,
    existingCode,
    duplicateCode,
    duplicateCodeReject,
    suspectCode,
    suspectCodeReject,
    recaptureCode,
    existingCodeReject,
    handleDelete,
    recaptureCodeReject,
    handleSubmit,
    switchModal,
    summary,
    existingConditionnew,
    duplicateCodeNew,
    recaptureCodeNew,
    suspectCodeNew,
    isModalOpen
}) => {

    // State variables for different matched values
    const [matchedValuesExisting, setMatchedValuesExisting] = useState([]);
    const [matchedValuesSuspect, setMatchedValuesSuspect] = useState([]);
    const [matchedValuesRecapture, setMatchedValuesRecapture] = useState([]);
    const [matchedValuesDuplicate, setMatchedValuesDuplicate] = useState([]);

    // useEffect(() => {
    //     if (existingCode.length > 0 && existingConditionnew) {
    //         const updatedValues = [];
    //         existingCode.forEach(item => {
    //             const code = item.code;
    //             if (existingConditionnew[code]) {
    //                 updatedValues.push(existingConditionnew[code]);
    //             }
    //         });
    //         setMatchedValuesExisting(updatedValues);
    //     }
    // }, [existingCode, existingConditionnew, matchedValuesExisting]);

    // useEffect(() => {
    //     if (suspectCode.length > 0) {
    //         const updatedValues = [];
    //         suspectCode.forEach(item => {
    //             const code = item.code;
    //             if (suspectCodeNew[code]) {
    //                 updatedValues.push(suspectCodeNew[code]);
    //             }
    //         });
    //         setMatchedValuesSuspect(updatedValues);
    //     }
    // }, [suspectCode, matchedValuesSuspect]);

    // useEffect(() => {
    //     if (recaptureCode.length > 0) {
    //         const updatedValues = [];
    //         recaptureCode.forEach(item => {
    //             const code = item.code;
    //             if (recaptureCodeNew[code]) {
    //                 updatedValues.push(recaptureCodeNew[code]);
    //             }
    //         });
    //         setMatchedValuesRecapture(updatedValues);
    //     }
    // }, [recaptureCode, matchedValuesRecapture]);

    // useEffect(() => {
    //     if (duplicateCode.length > 0) {
    //         const updatedValues = [];
    //         duplicateCode.forEach(item => {
    //             const code = item.code;
    //             if (duplicateCodeNew[code]) {
    //                 updatedValues.push(duplicateCodeNew[code]);
    //             }
    //         });
    //         setMatchedValuesDuplicate(updatedValues);
    //     }
    // }, [duplicateCode, matchedValuesDuplicate]);

    useEffect(() => {
        if (isModalOpen) {
            if (duplicateCode.length > 0) {
                const updatedValues = [];
                duplicateCode.forEach(item => {
                    const code = item.code;
                    if (duplicateCodeNew[code]) {
                        updatedValues.push(duplicateCodeNew[code]);
                    }
                });
                setMatchedValuesDuplicate(updatedValues);
            }
        }

        if (recaptureCode.length > 0) {
            const updatedValues = [];
            recaptureCode.forEach(item => {
                const code = item.code;
                if (recaptureCodeNew[code]) {
                    updatedValues.push(recaptureCodeNew[code]);
                }
            });
            setMatchedValuesRecapture(updatedValues);
        }

        if (suspectCode.length > 0) {
            const updatedValues = [];
            suspectCode.forEach(item => {
                const code = item.code;
                if (suspectCodeNew[code]) {
                    updatedValues.push(suspectCodeNew[code]);
                }
            });
            setMatchedValuesSuspect(updatedValues);
        }

        if (existingCode.length > 0 && existingConditionnew) {
            const updatedValues = [];
            existingCode.forEach(item => {
                const code = item.code;
                if (existingConditionnew[code]) {
                    updatedValues.push(existingConditionnew[code]);
                }
            });
            setMatchedValuesExisting(updatedValues);
        }
    }, [isModalOpen])


    const removeFromExisting = (item, key, index) => {
        handleDelete(item, "existing")
        const updatedValues = [...matchedValuesExisting];
        updatedValues.splice(index, 1); // Remove one element at index
        setMatchedValuesExisting(updatedValues);
    };

    // Function to remove item by index from matchedValuesSuspect
    const removeFromSuspect = (item, index) => {
        handleDelete(item, "suspect")
        const updatedValues = [...matchedValuesSuspect];
        updatedValues.splice(index, 1); // Remove one element at index
        setMatchedValuesSuspect(updatedValues);
    };

    // Function to remove item by index from matchedValuesRecapture
    const removeFromRecapture = (item, index) => {
        handleDelete(item, "recapture")
        const updatedValues = [...matchedValuesRecapture];
        updatedValues.splice(index, 1); // Remove one element at index
        setMatchedValuesRecapture(updatedValues);
    };

    // Function to remove item by index from matchedValuesDuplicate
    const removeFromDuplicate = (item, index) => {
        handleDelete(item, "duplicate")
        const updatedValues = [...matchedValuesDuplicate];
        updatedValues.splice(index, 1); // Remove one element at index
        setMatchedValuesDuplicate(updatedValues);
    };


    return (
        <Dialog
            open={openSubmitModal}
            aria-labelledby="responsive-dialog-title"
            className={switchModal ? "SubmitModal" : "SubmitModal2"}
        >
            {
                switchModal ? <DialogContent sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
                    <DialogContentText>
                        <Grid container spacing={2} display={"flex"} flexDirection={"column"}>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <StyledTypography>
                                        Summary
                                    </StyledTypography>
                                    <Button sx={{ justifyContent: "end", width: '12px' }} onClick={() => setOpenSubmitModal(false)}><CrossIcon2 width='12px' height='12px' /></Button>
                                </Box>

                                <Grid>
                                    <Card>
                                        <CardContent sx={{ paddingInline: '0px' }}>
                                            <Box>
                                                <Grid
                                                    container
                                                    sx={{
                                                        border: "1px solid #E8E8E8",
                                                        pt: 2,
                                                        pb: 2,
                                                        mb: 2,
                                                        borderRadius: "5px",
                                                    }}
                                                >
                                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                                        <StyledCodeTypography className="">
                                                            Codes that would go in EHR
                                                        </StyledCodeTypography>
                                                    </Grid>

                                                    {!(
                                                        existingCode?.length || 0 + suspectCode?.length || 0 + recaptureCode?.length || 0 + duplicateCode?.length || 0) > 0 ? (
                                                        <>
                                                            <Grid
                                                                item
                                                                lg={3}
                                                                md={2}
                                                                sm={12}
                                                                xs={12}
                                                                sx={{ textAlign: "end" }}
                                                            >
                                                                <div className="ItemsDivNew">
                                                                    <p>0 item</p>
                                                                </div>

                                                            </Grid>


                                                        </>
                                                    ) : (
                                                        <>
                                                            {existingCode?.length > 0 &&
                                                                existingCode?.filter((items) => items.value !== "").map((item, index) => (
                                                                    <Stack
                                                                        direction="row"
                                                                        spacing={1}
                                                                        sx={{
                                                                            px: 0,
                                                                            ml: 0.08,
                                                                            mt: 0.5,
                                                                            cursor: "pointer",
                                                                        }}
                                                                    >
                                                                        <Tooltip
                                                                            title={item?.code + " : " + item?.value}
                                                                        >
                                                                            <Typography
                                                                            // onClick={() =>
                                                                            //     handleDelete(item, "existing")
                                                                            // }
                                                                            >
                                                                                <StylePop className="ChipSpan">
                                                                                    {item?.code?.slice(0, 20)}{" "}
                                                                                    {item?.code.length > 20 ? "..." : ""}
                                                                                    <Typography sx={{ ml: "10px" }}>
                                                                                        {/* <CrossIcon />{" "} */}
                                                                                    </Typography>
                                                                                </StylePop>{" "}
                                                                            </Typography>
                                                                        </Tooltip>
                                                                    </Stack>
                                                                ))}
                                                            {suspectCode?.length > 0 &&
                                                                suspectCode?.filter((items) => items.value !== "").map((item, index) => (
                                                                    <Stack
                                                                        direction="row"
                                                                        spacing={1}
                                                                        sx={{
                                                                            px: 0,
                                                                            ml: 0.08,
                                                                            mt: 0.5,
                                                                            cursor: "pointer",
                                                                        }}
                                                                    >
                                                                        <Tooltip
                                                                            title={item?.code + " : " + item?.value}
                                                                        >
                                                                            <Typography
                                                                            // onClick={() =>
                                                                            //     handleDelete(item, "suspect")
                                                                            // }
                                                                            >
                                                                                <StylePop className="ChipSpan">
                                                                                    {item?.code?.slice(0, 20)}{" "}
                                                                                    {item?.code.length > 20 ? "..." : ""}
                                                                                    <Typography sx={{ ml: "10px" }}>
                                                                                        {/* <CrossIcon />{" "} */}
                                                                                    </Typography>
                                                                                </StylePop>{" "}
                                                                            </Typography>
                                                                        </Tooltip>
                                                                    </Stack>
                                                                ))}

                                                            {duplicateCode?.length > 0 &&
                                                                duplicateCode?.filter((items) => items.value !== "").map((item, index) => (
                                                                    <Stack
                                                                        direction="row"
                                                                        spacing={1}
                                                                        sx={{
                                                                            px: 0,
                                                                            ml: 0.08,
                                                                            mt: 0.5,
                                                                            cursor: "pointer",
                                                                        }}
                                                                    >
                                                                        <Tooltip
                                                                            title={item?.code + " : " + item?.value}
                                                                        >
                                                                            <Typography
                                                                            // onClick={() =>
                                                                            //     handleDelete(item, "duplicate")
                                                                            // }
                                                                            >
                                                                                <StylePop className="ChipSpan">
                                                                                    {item?.code?.slice(0, 20)}{" "}
                                                                                    {item?.code.length > 20 ? "..." : ""}
                                                                                    <Typography sx={{ ml: "10px" }}>
                                                                                        {/* <CrossIcon state="" />{" "} */}
                                                                                    </Typography>
                                                                                </StylePop>{" "}
                                                                            </Typography>
                                                                        </Tooltip>
                                                                    </Stack>
                                                                ))}

                                                            {recaptureCode?.length > 0 &&
                                                                recaptureCode?.filter((items) => items.value !== "").map((item, index) => (
                                                                    <Stack
                                                                        direction="row"
                                                                        spacing={1}
                                                                        sx={{
                                                                            px: 0,
                                                                            ml: 0.08,
                                                                            mt: 0.5,
                                                                            cursor: "pointer",
                                                                        }}
                                                                    >
                                                                        <Tooltip
                                                                            title={item?.code + " : " + item?.value}
                                                                        >
                                                                            <Typography
                                                                            // onClick={() =>
                                                                            //     handleDelete(item, "recapture")
                                                                            // }
                                                                            >
                                                                                <StylePop className="ChipSpan">
                                                                                    {item?.code?.slice(0, 20)}{" "}
                                                                                    {item?.code.length > 20 ? "..." : ""}
                                                                                    <Typography sx={{ ml: "10px" }}>
                                                                                        {/* <CrossIcon state="" />{" "} */}
                                                                                    </Typography>
                                                                                </StylePop>{" "}
                                                                            </Typography>
                                                                        </Tooltip>
                                                                    </Stack>
                                                                ))}
                                                        </>
                                                    )}
                                                </Grid>


                                                <Grid
                                                    container
                                                    sx={{
                                                        border: "1px solid #E8E8E8",
                                                        pt: 2,
                                                        pb: 2,
                                                        mb: 2,
                                                        borderRadius: "5px",
                                                    }}
                                                >
                                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                                        <StyledCodeTypography className="">
                                                            Actions to be taken in EHR                                                     </StyledCodeTypography>
                                                    </Grid>

                                                    {!(
                                                        existingCode?.length || 0 + suspectCode?.length || 0 + recaptureCode?.length || 0 + duplicateCode?.length || 0) > 0 ? (
                                                        <>
                                                            <Grid
                                                                item
                                                                lg={3}
                                                                md={2}
                                                                sm={2}
                                                                xs={12}
                                                                sx={{ textAlign: "end" }}
                                                            >
                                                                <div className="ItemsDivNew">
                                                                    <p>0 item</p>
                                                                </div>

                                                            </Grid>



                                                        </>
                                                    ) : (
                                                        <>
                                                            {existingCode?.length > 0 &&
                                                                existingCode?.filter((items) => items.value == "").map((item, index) => (
                                                                    <Stack
                                                                        direction="row"
                                                                        spacing={1}
                                                                        sx={{
                                                                            px: 0,
                                                                            ml: 0.08,
                                                                            mt: 0.5,
                                                                            cursor: "pointer",
                                                                        }}
                                                                    >
                                                                        <Tooltip
                                                                            title={item?.code + " : " + item?.value}
                                                                        >
                                                                            <Typography
                                                                            // onClick={() =>
                                                                            //     handleDelete(item, "existing")
                                                                            // }
                                                                            >
                                                                                <StylePop className="ChipSpan">
                                                                                    {item?.code?.slice(0, 20)}{" "}
                                                                                    {item?.code.length > 20 ? "..." : ""}
                                                                                    <Typography sx={{ ml: "10px" }}>
                                                                                        {/* <CrossIcon />{" "} */}
                                                                                    </Typography>
                                                                                </StylePop>{" "}
                                                                            </Typography>
                                                                        </Tooltip>
                                                                    </Stack>
                                                                ))}
                                                            {suspectCode?.length > 0 &&
                                                                suspectCode?.filter((items) => items.value == "").map((item, index) => (
                                                                    <Stack
                                                                        direction="row"
                                                                        spacing={1}
                                                                        sx={{
                                                                            px: 0,
                                                                            ml: 0.08,
                                                                            mt: 0.5,
                                                                            cursor: "pointer",
                                                                        }}
                                                                    >
                                                                        <Tooltip
                                                                            title={item?.code + " : " + item?.value}
                                                                        >
                                                                            <Typography
                                                                            // onClick={() =>
                                                                            //     handleDelete(item, "suspect")
                                                                            // }
                                                                            >
                                                                                <StylePop className="ChipSpan">
                                                                                    {item?.code?.slice(0, 20)}{" "}
                                                                                    {item?.code.length > 20 ? "..." : ""}
                                                                                    <Typography sx={{ ml: "10px" }}>
                                                                                        {/* <CrossIcon />{" "} */}
                                                                                    </Typography>
                                                                                </StylePop>{" "}
                                                                            </Typography>
                                                                        </Tooltip>
                                                                    </Stack>
                                                                ))}

                                                            {duplicateCode?.length > 0 &&
                                                                duplicateCode?.filter((items) => items.value == "").map((item, index) => (
                                                                    <Stack
                                                                        direction="row"
                                                                        spacing={1}
                                                                        sx={{
                                                                            px: 0,
                                                                            ml: 0.08,
                                                                            mt: 0.5,
                                                                            cursor: "pointer",
                                                                        }}
                                                                    >
                                                                        <Tooltip
                                                                            title={item?.code + " : " + item?.value}
                                                                        >
                                                                            <Typography
                                                                            // onClick={() =>
                                                                            //     handleDelete(item, "duplicate")
                                                                            // }
                                                                            >
                                                                                <StylePop className="ChipSpan">
                                                                                    {item?.code?.slice(0, 20)}{" "}
                                                                                    {item?.code.length > 20 ? "..." : ""}
                                                                                    <Typography sx={{ ml: "10px" }}>
                                                                                        {/* <CrossIcon state="" />{" "} */}
                                                                                    </Typography>
                                                                                </StylePop>{" "}
                                                                            </Typography>
                                                                        </Tooltip>
                                                                    </Stack>
                                                                ))}

                                                            {recaptureCode?.length > 0 &&
                                                                recaptureCode?.filter((items) => items.value == "").map((item, index) => (
                                                                    <Stack
                                                                        direction="row"
                                                                        spacing={1}
                                                                        sx={{
                                                                            px: 0,
                                                                            ml: 0.08,
                                                                            mt: 0.5,
                                                                            cursor: "pointer",
                                                                        }}
                                                                    >
                                                                        <Tooltip
                                                                            title={item?.code + " : " + item?.value}
                                                                        >
                                                                            <Typography
                                                                            // onClick={() =>
                                                                            //     handleDelete(item, "recapture")
                                                                            // }
                                                                            >
                                                                                <StylePop className="ChipSpan">
                                                                                    {item?.code?.slice(0, 20)}{" "}
                                                                                    {item?.code.length > 20 ? "..." : ""}
                                                                                    <Typography sx={{ ml: "10px" }}>
                                                                                        {/* <CrossIcon state="" />{" "} */}
                                                                                    </Typography>
                                                                                </StylePop>{" "}
                                                                            </Typography>
                                                                        </Tooltip>
                                                                    </Stack>
                                                                ))}
                                                        </>
                                                    )}


                                                </Grid>

                                                <Grid
                                                    container
                                                    sx={{
                                                        border: "1px solid #E8E8E8",
                                                        pt: 2,
                                                        pb: 2,
                                                        mb: 2,
                                                        borderRadius: "5px",
                                                    }}
                                                >
                                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                                        <StyledCodeTypography className="">
                                                            Rejected codes/conditions from Doctustech                                                     </StyledCodeTypography>
                                                    </Grid>

                                                    {!(
                                                        Object?.keys(suspectCodeReject)?.length || 0 + existingCodeReject?.length || 0 + duplicateCodeReject?.length || 0 + recaptureCodeReject?.length || 0) > 0 ? (
                                                        <>
                                                            <Grid
                                                                item
                                                                lg={3}
                                                                md={2}
                                                                sm={2}
                                                                xs={12}
                                                                sx={{ textAlign: "end" }}
                                                            >
                                                                <div className="ItemsDivNew">
                                                                    <p>0 item</p>
                                                                </div>
                                                            </Grid>
                                                        </>
                                                    ) : (
                                                        <>

                                                            {suspectCodeReject?.length > 0 &&
                                                                suspectCodeReject?.map((item, index) => (
                                                                    <Stack
                                                                        direction="row"
                                                                        spacing={1}
                                                                        sx={{
                                                                            px: 0,
                                                                            ml: 0.08,
                                                                            mt: 0.5,
                                                                            cursor: "pointer",
                                                                        }}
                                                                    >
                                                                        <Tooltip
                                                                            title={
                                                                                Object.keys(item) +
                                                                                " : " +
                                                                                item[Object.keys(item)].value
                                                                            }
                                                                        >
                                                                            <Typography
                                                                            // onClick={() =>
                                                                            //     handleDelete(item, "suspect")
                                                                            // }
                                                                            >
                                                                                <StylePop className="ChipSpan rejected">
                                                                                    {Object.keys(item)
                                                                                        .toString()
                                                                                        .slice(0, 20)}{" "}
                                                                                    {Object.keys(item).toString().length >
                                                                                        20
                                                                                        ? "..."
                                                                                        : ""}
                                                                                    <Typography sx={{ ml: "10px" }}>
                                                                                        {/* <CrossIcon state="rejected" />{" "} */}
                                                                                    </Typography>
                                                                                </StylePop>{" "}
                                                                            </Typography>
                                                                        </Tooltip>
                                                                    </Stack>
                                                                ))}

                                                            {existingCodeReject?.length > 0 &&
                                                                existingCodeReject?.map((item, index) => (
                                                                    <Stack
                                                                        direction="row"
                                                                        spacing={1}
                                                                        sx={{
                                                                            px: 0,
                                                                            ml: 0.08,
                                                                            mt: 0.5,
                                                                            cursor: "pointer",
                                                                        }}
                                                                    >
                                                                        <Tooltip
                                                                            title={
                                                                                Object.keys(item) +
                                                                                " : " +
                                                                                item[Object.keys(item)].value
                                                                            }
                                                                        >
                                                                            <Typography
                                                                            // onClick={() =>
                                                                            //     handleDelete(item, "existing")
                                                                            // }
                                                                            >
                                                                                <StylePop className="ChipSpan rejected">
                                                                                    {Object.keys(item)
                                                                                        .toString()
                                                                                        .slice(0, 20)}{" "}
                                                                                    {Object.keys(item).toString().length >
                                                                                        20
                                                                                        ? "..."
                                                                                        : ""}
                                                                                    <Typography sx={{ ml: "10px" }}>
                                                                                        {/* <CrossIcon state="rejected" />{" "} */}
                                                                                    </Typography>
                                                                                </StylePop>{" "}
                                                                            </Typography>
                                                                        </Tooltip>
                                                                    </Stack>
                                                                ))}


                                                            {recaptureCodeReject?.length > 0 &&
                                                                recaptureCodeReject?.map((item, index) => (
                                                                    <Stack
                                                                        direction="row"
                                                                        spacing={1}
                                                                        sx={{
                                                                            px: 0,
                                                                            ml: 0.08,
                                                                            mt: 0.5,
                                                                            cursor: "pointer",
                                                                        }}
                                                                    >
                                                                        <Tooltip
                                                                            title={
                                                                                Object.keys(item) +
                                                                                " : " +
                                                                                item[Object.keys(item)].value
                                                                            }
                                                                        >
                                                                            <Typography
                                                                            // onClick={() =>
                                                                            //     handleDelete(item, "recapture")
                                                                            // }
                                                                            >
                                                                                <StylePop className="ChipSpan rejected">
                                                                                    {Object.keys(item)
                                                                                        .toString()
                                                                                        .slice(0, 20)}{" "}
                                                                                    {Object.keys(item).toString().length >
                                                                                        20
                                                                                        ? "..."
                                                                                        : ""}
                                                                                    <Typography sx={{ ml: "10px" }}>
                                                                                        {/* <CrossIcon state="rejected" />{" "} */}
                                                                                    </Typography>
                                                                                </StylePop>{" "}
                                                                            </Typography>
                                                                        </Tooltip>
                                                                    </Stack>
                                                                ))}

                                                            {duplicateCodeReject?.length > 0 &&
                                                                duplicateCodeReject?.map((item, index) => (
                                                                    <Stack
                                                                        direction="row"
                                                                        spacing={1}
                                                                        sx={{
                                                                            px: 0,
                                                                            ml: 0.08,
                                                                            mt: 0.5,
                                                                            cursor: "pointer",
                                                                        }}
                                                                    >
                                                                        <Tooltip
                                                                            title={
                                                                                Object.keys(item) +
                                                                                " : " +
                                                                                item[Object.keys(item)].value
                                                                            }
                                                                        >
                                                                            <Typography
                                                                            // onClick={() =>
                                                                            //     handleDelete(item, "duplicate")
                                                                            // }
                                                                            >
                                                                                <StylePop className="ChipSpan rejected">
                                                                                    {Object.keys(item)
                                                                                        .toString()
                                                                                        .slice(0, 20)}{" "}
                                                                                    {Object.keys(item).toString().length >
                                                                                        20
                                                                                        ? "..."
                                                                                        : ""}
                                                                                    <Typography sx={{ ml: "10px" }}>
                                                                                        {/* <CrossIcon state="rejected" />{" "} */}
                                                                                    </Typography>
                                                                                </StylePop>{" "}
                                                                            </Typography>
                                                                        </Tooltip>
                                                                    </Stack>
                                                                ))}
                                                        </>
                                                    )}
                                                </Grid>
                                            </Box>

                                        </CardContent>

                                    </Card>
                                </Grid>

                            </Grid>

                        </Grid>
                    </DialogContentText >
                    {existingCode?.length > 0 ||
                        recaptureCode?.length > 0 ||
                        duplicateCode?.length > 0 ||
                        Object?.keys(suspectCode)?.length > 0 ||
                        existingCodeReject?.length > 0 ||
                        recaptureCodeReject?.length > 0 ||
                        suspectCodeReject?.length > 0 ||
                        duplicateCodeReject?.length > 0 ? (
                        <button
                            style={{ cursor: "pointer", width: '98%', margin: '0 auto' }}
                            className="SubmitBtn"
                            onClick={() => handleSubmit()}
                        >
                            Submit & Close
                        </button>
                    ) : (
                        <button
                            style={{
                                cursor: "pointer",
                                backgroundColor: "#D3D3D3",
                            }}
                            className="SubmitBtn"
                            disabled
                        >
                            Submit & Close
                        </button>
                    )}

                </DialogContent >
                    :


                    <DialogContent sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
                        <DialogContentText>
                            <Grid container spacing={2} display={"flex"} flexDirection={"column"}>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <StyledTypography>
                                            Summary
                                        </StyledTypography>
                                        <Button sx={{ justifyContent: "end", width: '12px' }} onClick={() => setOpenSubmitModal(false)}><CrossIcon2 width='12px' height='12px' /></Button>
                                    </Box>

                                    <Grid>
                                        <Card>
                                            <CardContent sx={{ paddingInline: '0px' }}>
                                                <Box>
                                                    <Grid
                                                        container
                                                        sx={{
                                                            border: "1px solid #E8E8E8",
                                                            pt: 2,
                                                            pb: 2,
                                                            mb: 2,
                                                            borderRadius: "5px",
                                                        }}
                                                    >
                                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                                            <StyledCodeTypography className="">
                                                                Codes to be actioned in Care Everywhere
                                                            </StyledCodeTypography>
                                                        </Grid>

                                                        {!(
                                                            matchedValuesExisting?.length || 0 + suspectCode?.length || 0 + matchedValuesRecapture?.length || 0 + matchedValuesDuplicate?.length || 0) > 0 ? (<>
                                                                <Grid
                                                                    item
                                                                    lg={3}
                                                                    md={2}
                                                                    sm={12}
                                                                    xs={12}
                                                                    sx={{ textAlign: "end" }}
                                                                >
                                                                    <div className="ItemsDivNew">
                                                                        <p>0 item</p>
                                                                    </div>

                                                                </Grid>


                                                            </>
                                                        ) : (
                                                            <>

                                                                {matchedValuesExisting?.length > 0 &&
                                                                    matchedValuesExisting?.filter((items) => items.code_in_problem_list === true).map((item, index) => (
                                                                        <Stack
                                                                            direction="row"
                                                                            spacing={1}
                                                                            sx={{
                                                                                px: 0,
                                                                                ml: 0.08,
                                                                                mt: 0.5,
                                                                                cursor: "pointer",
                                                                            }}
                                                                        >
                                                                            <Tooltip
                                                                                title={item?.code + " : " + item?.value}
                                                                            >
                                                                                <Typography
                                                                                // onClick={() => removeFromExisting(item, index)}
                                                                                >
                                                                                    <StylePop className="ChipSpan">
                                                                                        {item?.code?.slice(0, 20)}{" "}
                                                                                        {item?.code.length > 20 ? "..." : ""}
                                                                                        <Typography sx={{ ml: "10px" }}>
                                                                                            {/* <CrossIcon />{" "} */}
                                                                                        </Typography>
                                                                                    </StylePop>{" "}
                                                                                </Typography>
                                                                            </Tooltip>
                                                                        </Stack>
                                                                    ))}
                                                                {suspectCode?.length > 0 &&
                                                                    suspectCode?.filter((items) => items.value !== "").map((item, index) => (
                                                                        <Stack
                                                                            direction="row"
                                                                            spacing={1}
                                                                            sx={{
                                                                                px: 0,
                                                                                ml: 0.08,
                                                                                mt: 0.5,
                                                                                cursor: "pointer",
                                                                            }}
                                                                        >
                                                                            <Tooltip
                                                                                title={item?.code + " : " + item?.value}
                                                                            >
                                                                                <Typography
                                                                                // onClick={() =>
                                                                                //     removeFromSuspect(item, index)
                                                                                // }
                                                                                >
                                                                                    <StylePop className="ChipSpan">
                                                                                        {item?.code?.slice(0, 20)}{" "}
                                                                                        {item?.code.length > 20 ? "..." : ""}
                                                                                        <Typography sx={{ ml: "10px" }}>
                                                                                            {/* <CrossIcon />{" "} */}
                                                                                        </Typography>
                                                                                    </StylePop>{" "}
                                                                                </Typography>
                                                                            </Tooltip>
                                                                        </Stack>
                                                                    ))}

                                                                {matchedValuesDuplicate?.length > 0 &&
                                                                    matchedValuesDuplicate?.filter((items) => items.code_in_problem_list === true).map((item, index) => (
                                                                        <Stack
                                                                            direction="row"
                                                                            spacing={1}
                                                                            sx={{
                                                                                px: 0,
                                                                                ml: 0.08,
                                                                                mt: 0.5,
                                                                                cursor: "pointer",
                                                                            }}
                                                                        >
                                                                            <Tooltip
                                                                                title={item?.code + " : " + item?.value}
                                                                            >
                                                                                <Typography
                                                                                // onClick={() =>
                                                                                //     removeFromDuplicate(item, index)
                                                                                // }
                                                                                >
                                                                                    <StylePop className="ChipSpan">
                                                                                        {item?.code?.slice(0, 20)}{" "}
                                                                                        {item?.code.length > 20 ? "..." : ""}
                                                                                        <Typography sx={{ ml: "10px" }}>
                                                                                            {/* <CrossIcon state="" />{" "} */}
                                                                                        </Typography>
                                                                                    </StylePop>{" "}
                                                                                </Typography>
                                                                            </Tooltip>
                                                                        </Stack>
                                                                    ))}

                                                                {matchedValuesRecapture?.length > 0 &&
                                                                    matchedValuesRecapture?.filter((items) => items.code_in_problem_list === true).map((item, index) => (
                                                                        <Stack
                                                                            direction="row"
                                                                            spacing={1}
                                                                            sx={{
                                                                                px: 0,
                                                                                ml: 0.08,
                                                                                mt: 0.5,
                                                                                cursor: "pointer",
                                                                            }}
                                                                        >
                                                                            <Tooltip
                                                                                title={item?.code + " : " + item?.value}
                                                                            >
                                                                                <Typography
                                                                                // onClick={() =>
                                                                                //     removeFromRecapture(item, index)
                                                                                // }
                                                                                >
                                                                                    <StylePop className="ChipSpan">
                                                                                        {item?.code?.slice(0, 20)}{" "}
                                                                                        {item?.code.length > 20 ? "..." : ""}
                                                                                        <Typography sx={{ ml: "10px" }}>
                                                                                            {/* <CrossIcon state="" />{" "} */}
                                                                                        </Typography>
                                                                                    </StylePop>{" "}
                                                                                </Typography>
                                                                            </Tooltip>
                                                                        </Stack>
                                                                    ))}
                                                            </>
                                                        )}
                                                    </Grid>


                                                    <Grid
                                                        container
                                                        sx={{
                                                            border: "1px solid #E8E8E8",
                                                            pt: 2,
                                                            pb: 2,
                                                            mb: 2,
                                                            borderRadius: "5px",
                                                        }}
                                                    >
                                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                                            <StyledCodeTypography className="">
                                                                Codes to be actioned in EHR
                                                            </StyledCodeTypography>
                                                        </Grid>


                                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                                            <Typography>
                                                                Potential Recaptures:
                                                            </Typography>
                                                        </Grid>

                                                        {!(
                                                            matchedValuesExisting?.length || 0 + matchedValuesSuspect?.length || 0 + matchedValuesRecapture?.length || 0 + matchedValuesDuplicate?.length || 0) > 0 ? (
                                                            <>
                                                                <Grid
                                                                    item
                                                                    lg={3}
                                                                    md={3}
                                                                    sm={3}
                                                                    xs={3}
                                                                    sx={{ textAlign: "end" }}
                                                                >

                                                                    <div className="ItemsDivNew">
                                                                        <p>0 item</p>
                                                                    </div>
                                                                </Grid>
                                                            </>
                                                        ) : (
                                                            <>

                                                                {matchedValuesExisting?.length > 0 &&
                                                                    matchedValuesExisting?.filter((items) => items.code_in_problem_list === false).map((item, index) => (
                                                                        <Stack
                                                                            direction="row"
                                                                            spacing={1}
                                                                            sx={{
                                                                                px: 0,
                                                                                ml: 0.08,
                                                                                mt: 0.5,
                                                                                cursor: "pointer",
                                                                            }}
                                                                        >
                                                                            <Tooltip
                                                                                title={item?.code + " : " + item?.value}
                                                                            >
                                                                                <Typography
                                                                                // onClick={() =>
                                                                                //     removeFromExisting(item, index)
                                                                                // }
                                                                                >
                                                                                    <StylePop className="ChipSpan">
                                                                                        {item?.code?.slice(0, 20)}{" "}
                                                                                        {item?.code.length > 20 ? "..." : ""}
                                                                                        <Typography sx={{ ml: "10px" }}>
                                                                                            {/* <CrossIcon />{" "} */}
                                                                                        </Typography>
                                                                                    </StylePop>{" "}
                                                                                </Typography>
                                                                            </Tooltip>
                                                                        </Stack>
                                                                    ))}

                                                                {matchedValuesDuplicate?.length > 0 &&
                                                                    matchedValuesDuplicate?.filter((items) => items.code_in_problem_list === false).map((item, index) => (
                                                                        <Stack
                                                                            direction="row"
                                                                            spacing={1}
                                                                            sx={{
                                                                                px: 0,
                                                                                ml: 0.08,
                                                                                mt: 0.5,
                                                                                cursor: "pointer",
                                                                            }}
                                                                        >
                                                                            <Tooltip
                                                                                title={item?.code + " : " + item?.value}
                                                                            >
                                                                                <Typography
                                                                                // onClick={() =>
                                                                                //     removeFromDuplicate(item, index)
                                                                                // }
                                                                                >
                                                                                    <StylePop className="ChipSpan">
                                                                                        {item?.code?.slice(0, 20)}{" "}
                                                                                        {item?.code.length > 20 ? "..." : ""}
                                                                                        <Typography sx={{ ml: "10px" }}>
                                                                                            {/* <CrossIcon state="" />{" "} */}
                                                                                        </Typography>
                                                                                    </StylePop>{" "}
                                                                                </Typography>
                                                                            </Tooltip>
                                                                        </Stack>
                                                                    ))}

                                                                {matchedValuesRecapture?.length > 0 &&
                                                                    matchedValuesRecapture?.filter((items) => items.code_in_problem_list === false).map((item, index) => (
                                                                        <Stack
                                                                            direction="row"
                                                                            spacing={1}
                                                                            sx={{
                                                                                px: 0,
                                                                                ml: 0.08,
                                                                                mt: 0.5,
                                                                                cursor: "pointer",
                                                                            }}
                                                                        >
                                                                            <Tooltip
                                                                                title={item?.code + " : " + item?.value}
                                                                            >
                                                                                <Typography
                                                                                // onClick={() => removeFromRecapture(item, index)}

                                                                                >
                                                                                    <StylePop className="ChipSpan">
                                                                                        {item?.code?.slice(0, 20)}{" "}
                                                                                        {item?.code.length > 20 ? "..." : ""}
                                                                                        <Typography sx={{ ml: "10px" }}>
                                                                                            {/* <CrossIcon state="" />{" "} */}
                                                                                        </Typography>
                                                                                    </StylePop>{" "}
                                                                                </Typography>
                                                                            </Tooltip>
                                                                        </Stack>
                                                                    ))}
                                                            </>
                                                        )}

                                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                                            <Typography>
                                                                Potential Actions:
                                                            </Typography>
                                                        </Grid>

                                                        {!(
                                                            existingCode?.length || 0 + suspectCode?.length || 0 + recaptureCode?.length || 0 + duplicateCode?.length || 0) > 0 ? (
                                                            <>
                                                                <Grid
                                                                    item
                                                                    lg={3}
                                                                    md={2}
                                                                    sm={2}
                                                                    xs={12}
                                                                    sx={{ textAlign: "end" }}
                                                                >
                                                                    <div className="ItemsDivNew">
                                                                        <p>0 item</p>
                                                                    </div>

                                                                </Grid>



                                                            </>
                                                        ) : (
                                                            <>

                                                                {existingCode?.length > 0 &&
                                                                    existingCode?.filter((items) => items.value == "").map((item, index) => (
                                                                        <Stack
                                                                            direction="row"
                                                                            spacing={1}
                                                                            sx={{
                                                                                px: 0,
                                                                                ml: 0.08,
                                                                                mt: 0.5,
                                                                                cursor: "pointer",
                                                                            }}
                                                                        >
                                                                            <Tooltip
                                                                                title={item?.code + " : " + item?.value}
                                                                            >
                                                                                <Typography
                                                                                // onClick={() =>
                                                                                //     handleDelete(item, "existing")
                                                                                // }
                                                                                >
                                                                                    <StylePop className="ChipSpan">
                                                                                        {item?.code?.slice(0, 20)}{" "}
                                                                                        {item?.code.length > 20 ? "..." : ""}
                                                                                        <Typography sx={{ ml: "10px" }}>
                                                                                            {/* <CrossIcon />{" "} */}
                                                                                        </Typography>
                                                                                    </StylePop>{" "}
                                                                                </Typography>
                                                                            </Tooltip>
                                                                        </Stack>
                                                                    ))}
                                                                {suspectCode?.length > 0 &&
                                                                    suspectCode?.filter((items) => items.value == "").map((item, index) => (
                                                                        <Stack
                                                                            direction="row"
                                                                            spacing={1}
                                                                            sx={{
                                                                                px: 0,
                                                                                ml: 0.08,
                                                                                mt: 0.5,
                                                                                cursor: "pointer",
                                                                            }}
                                                                        >
                                                                            <Tooltip
                                                                                title={item?.code + " : " + item?.value}
                                                                            >
                                                                                <Typography
                                                                                // onClick={() =>
                                                                                //     handleDelete(item, "suspect")
                                                                                // }
                                                                                >
                                                                                    <StylePop className="ChipSpan">
                                                                                        {item?.code?.slice(0, 20)}{" "}
                                                                                        {item?.code.length > 20 ? "..." : ""}
                                                                                        <Typography sx={{ ml: "10px" }}>
                                                                                            {/* <CrossIcon />{" "} */}
                                                                                        </Typography>
                                                                                    </StylePop>{" "}
                                                                                </Typography>
                                                                            </Tooltip>
                                                                        </Stack>
                                                                    ))}

                                                                {duplicateCode?.length > 0 &&
                                                                    duplicateCode?.filter((items) => items.value == "").map((item, index) => (
                                                                        <Stack
                                                                            direction="row"
                                                                            spacing={1}
                                                                            sx={{
                                                                                px: 0,
                                                                                ml: 0.08,
                                                                                mt: 0.5,
                                                                                cursor: "pointer",
                                                                            }}
                                                                        >
                                                                            <Tooltip
                                                                                title={item?.code + " : " + item?.value}
                                                                            >
                                                                                <Typography
                                                                                // onClick={() =>
                                                                                //     handleDelete(item, "duplicate")
                                                                                // }
                                                                                >
                                                                                    <StylePop className="ChipSpan">
                                                                                        {item?.code?.slice(0, 20)}{" "}
                                                                                        {item?.code.length > 20 ? "..." : ""}
                                                                                        <Typography sx={{ ml: "10px" }}>
                                                                                            {/* <CrossIcon state="" />{" "} */}
                                                                                        </Typography>
                                                                                    </StylePop>{" "}
                                                                                </Typography>
                                                                            </Tooltip>
                                                                        </Stack>
                                                                    ))}

                                                                {recaptureCode?.length > 0 &&
                                                                    recaptureCode?.filter((items) => items.value == "").map((item, index) => (
                                                                        <Stack
                                                                            direction="row"
                                                                            spacing={1}
                                                                            sx={{
                                                                                px: 0,
                                                                                ml: 0.08,
                                                                                mt: 0.5,
                                                                                cursor: "pointer",
                                                                            }}
                                                                        >
                                                                            <Tooltip
                                                                                title={item?.code + " : " + item?.value}
                                                                            >
                                                                                <Typography
                                                                                // onClick={() =>
                                                                                //     handleDelete(item, "recapture")
                                                                                // }
                                                                                >
                                                                                    <StylePop className="ChipSpan">
                                                                                        {item?.code?.slice(0, 20)}{" "}
                                                                                        {item?.code.length > 20 ? "..." : ""}
                                                                                        <Typography sx={{ ml: "10px" }}>
                                                                                            {/* <CrossIcon state="" />{" "} */}
                                                                                        </Typography>
                                                                                    </StylePop>{" "}
                                                                                </Typography>
                                                                            </Tooltip>
                                                                        </Stack>
                                                                    ))}
                                                            </>
                                                        )}


                                                    </Grid>

                                                    <Grid
                                                        container
                                                        sx={{
                                                            border: "1px solid #E8E8E8",
                                                            pt: 2,
                                                            pb: 2,
                                                            mb: 2,
                                                            borderRadius: "5px",
                                                        }}
                                                    >
                                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                                            <StyledCodeTypography className="">
                                                                Rejected codes/conditions from Doctustech                                                     </StyledCodeTypography>
                                                        </Grid>

                                                        {!(
                                                            Object?.keys(suspectCodeReject)?.length || 0 + existingCodeReject?.length || 0 + duplicateCodeReject?.length || 0 + recaptureCodeReject?.length || 0) > 0 ? (
                                                            <>
                                                                <Grid
                                                                    item
                                                                    lg={3}
                                                                    md={2}
                                                                    sm={2}
                                                                    xs={12}
                                                                    sx={{ textAlign: "end" }}
                                                                >
                                                                    <div className="ItemsDivNew">
                                                                        <p>0 item</p>
                                                                    </div>


                                                                </Grid>



                                                            </>
                                                        ) : (
                                                            <>

                                                                {suspectCodeReject?.length > 0 &&
                                                                    suspectCodeReject?.map((item, index) => (
                                                                        <Stack
                                                                            direction="row"
                                                                            spacing={1}
                                                                            sx={{
                                                                                px: 0,
                                                                                ml: 0.08,
                                                                                mt: 0.5,
                                                                                cursor: "pointer",
                                                                            }}
                                                                        >
                                                                            <Tooltip
                                                                                title={
                                                                                    Object.keys(item) +
                                                                                    " : " +
                                                                                    item[Object.keys(item)].value
                                                                                }
                                                                            >
                                                                                <Typography
                                                                                // onClick={() =>
                                                                                //     handleDelete(item, "suspect")
                                                                                // }
                                                                                >
                                                                                    <StylePop className="ChipSpan rejected">
                                                                                        {Object.keys(item)
                                                                                            .toString()
                                                                                            .slice(0, 20)}{" "}
                                                                                        {Object.keys(item).toString().length >
                                                                                            20
                                                                                            ? "..."
                                                                                            : ""}
                                                                                        <Typography sx={{ ml: "10px" }}>
                                                                                            {/* <CrossIcon state="rejected" />{" "} */}
                                                                                        </Typography>
                                                                                    </StylePop>{" "}
                                                                                </Typography>
                                                                            </Tooltip>
                                                                        </Stack>
                                                                    ))}

                                                                {existingCodeReject?.length > 0 &&
                                                                    existingCodeReject?.map((item, index) => (
                                                                        <Stack
                                                                            direction="row"
                                                                            spacing={1}
                                                                            sx={{
                                                                                px: 0,
                                                                                ml: 0.08,
                                                                                mt: 0.5,
                                                                                cursor: "pointer",
                                                                            }}
                                                                        >
                                                                            <Tooltip
                                                                                title={
                                                                                    Object.keys(item) +
                                                                                    " : " +
                                                                                    item[Object.keys(item)].value
                                                                                }
                                                                            >
                                                                                <Typography
                                                                                // onClick={() =>
                                                                                //     handleDelete(item, "existing")
                                                                                // }
                                                                                >
                                                                                    <StylePop className="ChipSpan rejected">
                                                                                        {Object.keys(item)
                                                                                            .toString()
                                                                                            .slice(0, 20)}{" "}
                                                                                        {Object.keys(item).toString().length >
                                                                                            20
                                                                                            ? "..."
                                                                                            : ""}
                                                                                        <Typography sx={{ ml: "10px" }}>
                                                                                            {/* <CrossIcon state="rejected" />{" "} */}
                                                                                        </Typography>
                                                                                    </StylePop>{" "}
                                                                                </Typography>
                                                                            </Tooltip>
                                                                        </Stack>
                                                                    ))}


                                                                {recaptureCodeReject?.length > 0 &&
                                                                    recaptureCodeReject?.map((item, index) => (
                                                                        <Stack
                                                                            direction="row"
                                                                            spacing={1}
                                                                            sx={{
                                                                                px: 0,
                                                                                ml: 0.08,
                                                                                mt: 0.5,
                                                                                cursor: "pointer",
                                                                            }}
                                                                        >
                                                                            <Tooltip
                                                                                title={
                                                                                    Object.keys(item) +
                                                                                    " : " +
                                                                                    item[Object.keys(item)].value
                                                                                }
                                                                            >
                                                                                <Typography
                                                                                // onClick={() =>
                                                                                //     handleDelete(item, "recapture")
                                                                                // }
                                                                                >
                                                                                    <StylePop className="ChipSpan rejected">
                                                                                        {Object.keys(item)
                                                                                            .toString()
                                                                                            .slice(0, 20)}{" "}
                                                                                        {Object.keys(item).toString().length >
                                                                                            20
                                                                                            ? "..."
                                                                                            : ""}
                                                                                        <Typography sx={{ ml: "10px" }}>
                                                                                            {/* <CrossIcon state="rejected" />{" "} */}
                                                                                        </Typography>
                                                                                    </StylePop>{" "}
                                                                                </Typography>
                                                                            </Tooltip>
                                                                        </Stack>
                                                                    ))}

                                                                {duplicateCodeReject?.length > 0 &&
                                                                    duplicateCodeReject?.map((item, index) => (
                                                                        <Stack
                                                                            direction="row"
                                                                            spacing={1}
                                                                            sx={{
                                                                                px: 0,
                                                                                ml: 0.08,
                                                                                mt: 0.5,
                                                                                cursor: "pointer",
                                                                            }}
                                                                        >
                                                                            <Tooltip
                                                                                title={
                                                                                    Object.keys(item) +
                                                                                    " : " +
                                                                                    item[Object.keys(item)].value
                                                                                }
                                                                            >
                                                                                <Typography
                                                                                // onClick={() =>
                                                                                //     handleDelete(item, "duplicate")
                                                                                // }
                                                                                >
                                                                                    <StylePop className="ChipSpan rejected">
                                                                                        {Object.keys(item)
                                                                                            .toString()
                                                                                            .slice(0, 20)}{" "}
                                                                                        {Object.keys(item).toString().length >
                                                                                            20
                                                                                            ? "..."
                                                                                            : ""}
                                                                                        <Typography sx={{ ml: "10px" }}>
                                                                                            {/* <CrossIcon state="rejected" />{" "} */}
                                                                                        </Typography>
                                                                                    </StylePop>{" "}
                                                                                </Typography>
                                                                            </Tooltip>
                                                                        </Stack>
                                                                    ))}
                                                            </>
                                                        )}
                                                    </Grid>
                                                </Box>

                                            </CardContent>

                                        </Card>
                                    </Grid>

                                </Grid>

                            </Grid>
                        </DialogContentText >
                        {existingCode?.length > 0 ||
                            recaptureCode?.length > 0 ||
                            duplicateCode?.length > 0 ||
                            Object?.keys(suspectCode)?.length > 0 ||
                            existingCodeReject?.length > 0 ||
                            recaptureCodeReject?.length > 0 ||
                            suspectCodeReject?.length > 0 ||
                            duplicateCodeReject?.length > 0 ? (
                            <button
                                style={{ cursor: "pointer", width: '98%', margin: '0 auto' }}
                                className="SubmitBtn"
                                onClick={() => handleSubmit()}
                            >
                                Submit & Close
                            </button>
                        ) : (
                            <button
                                style={{
                                    cursor: "pointer",
                                    backgroundColor: "#D3D3D3",
                                }}
                                className="SubmitBtn"
                                disabled
                            >
                                Submit & Close
                            </button>
                        )}

                    </DialogContent >
            }
        </Dialog >
    );
};

export default SubmitModal;