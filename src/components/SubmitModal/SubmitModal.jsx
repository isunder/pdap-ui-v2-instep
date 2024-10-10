import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  Grid,
  Typography,
  Box,
} from "@mui/material";
import { Card, CardContent, Stack, Tooltip } from "@mui/material";
import { CrossIcon2 } from "../../../src/components/Icons";
import { TabsSlag } from "../../container/TabsSlag/TabsSlag";
import { styled } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { convertDate, isSlugOrJwt } from "../../utils/helper";

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: "#101828",
  fontSize: 18,
  padding: 0,
  fontSize: 16,
  fontWeight: 700,
  lineHeight: "20px",
  textAlign: "left",
}));

const StyledCodeTypography = styled(Typography)(({ theme }) => ({
  fontSize: 16,
  fontWeight: 700,
  lineHeight: "20px",
  textAlign: "left",
  color: "#0D426A",
  display: "block",
  paddingLeft: "8px",
  color: "#0D426A",
}));

const StylePop = styled("Typography")(() => ({
  color: "#17236D",
  fontWeight: "600",

}));

const SubmitModal = ({
  handleAddEventData,
  openSubmitModal,
  setOpenSubmitModal,
  existingCode,
  duplicateCode,
  duplicateCodeReject,
  suspectCode,
  suspectCodeReject,
  recaptureCode,
  existingCodeReject,
  recaptureCodeReject,
  handleSubmit,
  switchModal,
  existingConditionNew,
  duplicateCodeNew,
  recaptureCodeNew,
  suspectCodeNew,
  isModalOpen,
}) => {
  // State variables for different matched values
  const [matchedValuesExisting, setMatchedValuesExisting] = useState([]);
  const [matchedValuesSuspect, setMatchedValuesSuspect] = useState([]);
  const [matchedValuesRecapture, setMatchedValuesRecapture] = useState([]);
  const [matchedValuesDuplicate, setMatchedValuesDuplicate] = useState([]);
  const tabs = TabsSlag();
  const { user } = useSelector((state) => state);
  const { doctorDetail } = useSelector((state) => state?.doctor?.data);
  const [combinedData, setCombinedData] = useState([]);
  const [combinedData2, setCombinedData2] = useState([]);
  const [inProblemList, setInProblemList] = useState([]);
  const [notInProblemList, setNotInProblemList] = useState([]);

  useEffect(() => {
    if (duplicateCode && duplicateCodeNew) {
      const updatedValues = [];
      duplicateCode.forEach((item) => {
        const code = item.code;
        if (duplicateCodeNew[code]) {
          updatedValues.push(duplicateCodeNew[code]);
        }
      });
      setMatchedValuesDuplicate(updatedValues);
    }

    if (recaptureCode && recaptureCodeNew) {
      const updatedValues = [];
      recaptureCode.forEach((item) => {
        const code = item.code;
        if (recaptureCodeNew[code]) {
          updatedValues.push(recaptureCodeNew[code]);
        }
      });
      setMatchedValuesRecapture(updatedValues);
    }

    if (suspectCode && suspectCodeNew) {
      const updatedValues = [];
      suspectCode.forEach((item) => {
        const code = item.code;
        if (suspectCodeNew[code]) {
          updatedValues.push(suspectCodeNew[code]);
        }
      });
      setMatchedValuesSuspect(updatedValues);
    }

    if (existingCode && existingConditionNew) {
      const updatedValues = [];
      existingCode.forEach((item) => {
        const code = item.code;
        if (existingConditionNew[code]) {
          updatedValues.push(existingConditionNew[code]);
        }
      });
      setMatchedValuesExisting(updatedValues);
    }
  }, [isModalOpen, suspectCode, existingCode, recaptureCode, duplicateCode, duplicateCodeNew]);


  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  useEffect(() => {
    const combined = [
      ...existingCode,
      ...suspectCode,
      ...duplicateCode,
      ...recaptureCode,
    ].filter((item) => item.value !== "");

    const combined2 = [
      ...existingCode,
      ...suspectCode,
      ...duplicateCode,
      ...recaptureCode,
    ].filter((item) => item.value == "");

    setCombinedData(combined);
    setCombinedData2(combined2)
  }, [existingCode, suspectCode, duplicateCode, recaptureCode]);


  useEffect(() => {
    const combined = [
      ...matchedValuesExisting.filter(items => items.code_in_problem_list === true),
      ...suspectCode.filter(items => items.value !== ''),
      ...matchedValuesDuplicate.filter(items => items.code_in_problem_list === true),
      ...matchedValuesRecapture.filter(items => items.code_in_problem_list === true)
    ];

    const combined2 = [
      ...matchedValuesExisting.filter(items => items.code_in_problem_list === false),
      ...matchedValuesDuplicate.filter(items => items.code_in_problem_list === false),
      ...matchedValuesRecapture.filter(items => items.code_in_problem_list === false)
    ];

    setInProblemList(combined);
    setNotInProblemList(combined2);
  }, [matchedValuesExisting, suspectCode, matchedValuesDuplicate, matchedValuesRecapture]);


  const setOpenSubmitModalFunc = (key) => {
    setOpenSubmitModal(false);

    if (key === "athena") {
      const exampleMetadata = {
        event_type: "SUMMARY_ATHENA_MODAL_CLOSE", metadata: {
          identifier: tabs?.["user"]?.value || "",
          provider_name: doctorDetail?.doctor_name || "",
          patient_id: user?.data?.userInfo?.mrn || "",
          event_datetime: convertDate(new Date().toISOString()),
          parentCodesCount: (suspectCode?.length)

        }
      };

      handleAddEventData(exampleMetadata)
    }
    else {
      const exampleMetadata = {
        event_type: "SUMMARY_EPIC_MODAL_CLOSE", metadata: {
          identifier: tabs?.["user"]?.value || "",
          provider_name: doctorDetail?.doctor_name || "",
          patient_id: user?.data?.userInfo?.mrn || "",
          event_datetime: convertDate(new Date().toISOString()),
          parentCodesCount: (suspectCode?.length)

        }
      };

      handleAddEventData(exampleMetadata)
    }
  }

  return (
    <Dialog
      open={openSubmitModal}
      aria-labelledby="responsive-dialog-title"
      className={switchModal ? "SubmitModal" : "SubmitModal2"}
    >
      {switchModal ? (
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
          }}
        >
          <DialogContentText>
            <Grid
              container
              spacing={2}
              display={"flex"}
              flexDirection={"column"}
              gap={'10px'}
            >
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <StyledTypography>Summary</StyledTypography>
                  <Button
                    sx={{ justifyContent: "end", width: "12px" }}
                    onClick={() => setOpenSubmitModalFunc("athena")}
                  >
                    <CrossIcon2 width="12px" height="12px" />
                  </Button>
                </Box>

                <Grid >
                  <Card >
                    <CardContent sx={{ paddingInline: "0px" }}>
                      <Box className="modalInner" sx={{ height: windowSize.height / 2, overflow: "auto" }}>
                        <Grid
                          container
                          sx={{
                            border: "1px solid #E8E8E8",
                            pt: 2,
                            pb: 2,
                            mb: 2,
                            borderRadius: "5px",
                            gap: "10px 0px !important"
                          }}
                        >
                          <Grid item lg={12} md={12} sm={12} xs={12}>
                            <StyledCodeTypography className="">
                              Codes/Conditions to be actioned in BPA
                            </StyledCodeTypography>
                          </Grid>

                          {combinedData.length == 0 ? (
                            <>
                              <div className="ItemsDivNew">
                                <p>No applicable codes/conditions.</p>
                              </div>
                            </>
                          ) :

                            combinedData.map((item, index) => (
                              <Stack
                                direction="row"
                                spacing={1}
                                sx={{
                                  px: 0,
                                  ml: 0.08,
                                  mt: 0.5,
                                  cursor: "pointer",
                                }}
                                key={index}
                              >
                                <Tooltip title={item?.code + " : " + item?.value}>
                                  <Typography>
                                    <StylePop className="ChipSpan">
                                      {item?.code?.slice(0, 20)} {item?.code.length > 20 ? "..." : ""}
                                      {": "}
                                      { item?.value?.slice(0, 30)} { item?.value?.length > 30 ? "..." : " "}
                                    </StylePop>
                                  </Typography>
                                </Tooltip>
                              </Stack>
                            ))

                          }

                        </Grid>

                        <Grid
                          container
                          sx={{
                            border: "1px solid #E8E8E8",
                            pt: 2,
                            pb: 2,
                            mb: 2,
                            borderRadius: "5px",
                            gap: "10px"
                          }}
                        >
                          <Grid item lg={12} md={12} sm={12} xs={12}>
                            <StyledCodeTypography className="">
                              Actions to be taken in EHR{" "}
                            </StyledCodeTypography>
                          </Grid>

                          {
                            combinedData2.length == 0 ? (
                              <>
                                <div className="ItemsDivNew">
                                  <p>No applicable codes/conditions.</p>
                                </div>
                              </>
                            ) :

                              combinedData2.map((item, index) => (
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  sx={{
                                    px: 0,
                                    ml: 0.08,
                                    mt: 0.5,
                                    cursor: "pointer",
                                  }}
                                  key={index}
                                >
                                  <Tooltip 
                                  title={item?.code + ((item?.value)? (" : " + item?.value) : null)}
                                  >
                                    <Typography>
                                      <StylePop className="ChipSpan">
                                        {item?.code?.slice(0, 30)} {item?.code.length > 30 ? "..." : ""}
                                        
                                      </StylePop>
                                    </Typography>
                                  </Tooltip>
                                </Stack>
                              ))

                          }
                        </Grid>

                        <Grid
                          container
                          sx={{
                            border: "1px solid #E8E8E8",
                            pt: 2,
                            pb: 2,
                            mb: 2,
                            borderRadius: "5px",
                            gap: "10px"
                          }}
                        >
                          <Grid item lg={12} md={12} sm={12} xs={12}>
                            <StyledCodeTypography className="">
                              Rejected codes/conditions from Doctustech{" "}
                            </StyledCodeTypography>
                          </Grid>

                          {
                            !(
                              existingCodeReject?.length || 0 + suspectCodeReject?.length || 0 + recaptureCodeReject?.length || 0 + duplicateCodeReject?.length || 0) > 0 ? (
                              <>
                                <div className="ItemsDivNew">
                                  <p>No applicable codes/conditions.</p>
                                </div>
                              </>
                            ) :

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
                                          ([Object.keys(item)].code) ? (item[Object.keys(item)].value) : null

                                        }
                                      >
                                        <Typography>
                                          <StylePop className="ChipSpan rejected">
                                            {Object.keys(item)
                                              .toString()
                                              .slice(0, 20)}{" "}
                                            {Object.keys(item).toString().length >
                                              20
                                              ? "..."
                                              : ""}
                                              {/* :
                                              {item[Object.keys(item)].value.slice(0, 20)} { item[Object.keys(item)].value.length > 20 ? "..." : ""} */}
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
                                        <Typography>
                                          <StylePop className="ChipSpan rejected">
                                            {Object.keys(item)
                                              .toString()
                                              .slice(0, 20)}{" "}
                                            {Object.keys(item).toString().length >
                                              20
                                              ? "..."
                                              : ""}  {": "} 
                                              {item[Object.keys(item)].value.slice(0, 30)} { item[Object.keys(item)].value.length > 30 ? "..." : ""}
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
                                        <Typography>
                                          <StylePop className="ChipSpan rejected">
                                            {Object.keys(item)
                                              .toString()
                                              .slice(0, 20)}{" "}
                                            {Object.keys(item).toString().length >
                                              20
                                              ? "..."
                                              : ""}
                                              {": "}
                                              {item[Object.keys(item)].value.slice(0, 30)} { item[Object.keys(item)].value.length > 30 ? "..." : ""}
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
                                        <Typography>
                                          <StylePop className="ChipSpan rejected">
                                            {Object.keys(item)
                                              .toString()
                                              .slice(0, 20)}{" "}
                                            {Object.keys(item).toString().length >
                                              20
                                              ? "..."
                                              : ""} {": "}
                                              {item[Object.keys(item)].value.slice(0, 30)} { item[Object.keys(item)].value.length > 30 ? "..." : ""}
                                          </StylePop>{" "}
                                        </Typography>
                                      </Tooltip>
                                    </Stack>
                                  ))}
                              </>
                          }

                        </Grid>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </DialogContentText>
          {existingCode?.length > 0 ||
            recaptureCode?.length > 0 ||
            duplicateCode?.length > 0 ||
            Object?.keys(suspectCode)?.length > 0 ||
            existingCodeReject?.length > 0 ||
            recaptureCodeReject?.length > 0 ||
            suspectCodeReject?.length > 0 ||
            duplicateCodeReject?.length > 0 ? (
            <button
              style={{ cursor: "pointer", width: "98%", margin: "0 auto" }}
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
        </DialogContent>
      ) : (
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
          }}
        >
          <DialogContentText>
            <Grid
              container
              spacing={2}
              display={"flex"}
              flexDirection={"column"}
              gap={"10px"}
            >
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <StyledTypography>Summary</StyledTypography>
                  <Button
                    sx={{ justifyContent: "end", width: "12px" }}
                    onClick={() => setOpenSubmitModalFunc("epic")}
                  >
                    <CrossIcon2 width="12px" height="12px" />
                  </Button>
                </Box>

                <Grid >
                  <Card>
                    <CardContent sx={{ paddingInline: "0px" }}>
                      <Box className="modalInner" sx={{ height: windowSize.height / 2, overflow: "auto" }} >
                        <Grid
                          container
                          sx={{
                            border: "1px solid #E8E8E8",
                            pt: 2,
                            pb: 2,
                            mb: 2,
                            borderRadius: "5px",
                            gap: "10px"
                          }}
                        >
                          <Grid item lg={12} md={12} sm={12} xs={12}>
                            <StyledCodeTypography className="">
                              
                              Codes/Conditions that would go in EHR
                            </StyledCodeTypography>
                          </Grid>

                          {
                            (
                              inProblemList.length) == 0 ? (
                              <>
                                <div className="ItemsDivNew">
                                  <p>No applicable codes/conditions.</p>
                                </div>
                              </>
                            ) :

                              <>
                                {inProblemList.length > 0 &&
                                  inProblemList.map((item, index) => (
                                    <Stack
                                      key={index}
                                      direction="row"
                                      spacing={1}
                                      sx={{
                                        px: 0,
                                        ml: 0.08,
                                        mt: 0.5,
                                        cursor: 'pointer',
                                      }}
                                    >
                                      <Tooltip title={`${item?.code} : ${item?.value}`}>
                                        <Typography>
                                          <StylePop className="ChipSpan">
                                            {item?.code?.slice(0, 20)}{' '} : {item?.value?.slice(0, 30)} {' '}
                                            {item?.code.length > 20 ? '...' : ''} {item?.value.length > 20 ? '...' : ''}
                                          </StylePop>{' '}
                                        </Typography>
                                      </Tooltip>
                                    </Stack>
                                  ))}
                              </>
                          }

                        </Grid>

                        <Grid
                          container
                          sx={{
                            border: "1px solid #E8E8E8",
                            pt: 2,
                            pb: 2,
                            mb: 2,
                            borderRadius: "5px",
                            gap: "10px 0px !important"
                          }}
                        >
                          <Grid item lg={12} md={12} sm={12} xs={12}>
                            <StyledCodeTypography className="">
                              Actions to be taken in EHR
                            </StyledCodeTypography>
                          </Grid>

                          <Grid item lg={12} md={12} sm={12} xs={12}>
                            <Typography>Potential Recaptures:</Typography>
                          </Grid>

                          {
                            notInProblemList.length == 0 ? (
                              <>
                                <div className="ItemsDivNew">
                                  <p>No applicable codes/conditions.</p>
                                </div>
                              </>
                            ) :
                              <>
                                {
                                  notInProblemList.map((item, index) => (
                                    <Stack
                                      key={index}
                                      direction="row"
                                      spacing={1}
                                      sx={{
                                        px: 0,
                                        ml: 0.08,
                                        mt: 0.5,
                                        cursor: 'pointer',
                                      }}
                                    >
                                      <Tooltip title={`${item?.code} : ${item?.value}`}>
                                        <Typography>
                                          <StylePop className="ChipSpan">
                                            {item?.code?.slice(0, 20)}{' '} : {item?.value?.slice(0, 30)} {' '}
                                            {item?.code.length > 20 ? '...' : ''} {item?.value.length > 20 ? '...' : ''}
                                          </StylePop>{' '}
                                        </Typography>
                                      </Tooltip>
                                    </Stack>
                                  ))}
                              </>
                          }


                          <Grid item lg={12} md={12} sm={12} xs={12}>
                            <Typography>Potential Actions:</Typography>
                          </Grid>

                          {
                            combinedData2.length == 0 ? (
                              <>
                                <div className="ItemsDivNew">
                                  <p>No applicable codes/conditions.</p>
                                </div>
                              </>
                            ) :

                              combinedData2.map((item, index) => (
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  sx={{
                                    px: 0,
                                    ml: 0.08,
                                    mt: 0.5,
                                    cursor: "pointer",
                                  }}
                                  key={index}
                                >
                                  <Tooltip 
                                  title={item?.code + ((item?.value)? (" : " + item?.value) : null)}
                                  >
                                    <Typography>
                                      <StylePop className="ChipSpan">
                                        {item?.code?.slice(0, 20)} {item?.code.length > 20 ? "..." : ""} 
                                      </StylePop>
                                    </Typography>
                                  </Tooltip>
                                </Stack>
                              ))

                          }

                        </Grid>

                        <Grid
                          container
                          sx={{
                            border: "1px solid #E8E8E8",
                            pt: 2,
                            pb: 2,
                            mb: 2,
                            borderRadius: "5px",
                            gap: "10px"
                          }}
                        >
                          <Grid item lg={12} md={12} sm={12} xs={12}>
                            <StyledCodeTypography className="">
                              Rejected codes/conditions from Doctustech{" "}
                            </StyledCodeTypography>
                          </Grid>

                          {
                            !(
                              existingCodeReject?.length || 0 + suspectCodeReject?.length || 0 + recaptureCodeReject?.length || 0 + duplicateCodeReject?.length || 0) > 0 ? (
                              <>
                                <div className="ItemsDivNew">
                                  <p>No applicable codes/conditions.</p>
                                </div>
                              </>
                            ) :

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
                                          ([Object.keys(item)].code) ? (item[Object.keys(item)].value) : null
                                          
                                        }
                                      >
                                        <Typography>
                                          <StylePop className="ChipSpan rejected">
                                            {Object.keys(item)
                                              .toString()
                                              .slice(0, 20)}{" "}
                                            {Object.keys(item).toString().length >
                                              20
                                              ? "..."
                                              : ""}
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
                                        <Typography>
                                          <StylePop className="ChipSpan rejected">
                                            {Object.keys(item)
                                              .toString()
                                              .slice(0, 20)}{" : "}

                                            {item[Object.keys(item)[0]].value
                                              .slice(0, 30)}{" "}

                                            {Object.keys(item).toString().length >
                                              20
                                              ? "..."
                                              : ""}
                                              

                                            {item[Object.keys(item)[0]].value.length >
                                              30
                                              ? "..."
                                              : ""}{" "}
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
                                        <Typography>
                                          <StylePop className="ChipSpan rejected">
                                            {Object.keys(item)
                                              .toString()
                                              .slice(0, 20)}{" : "}

                                            {item[Object.keys(item)[0]].value
                                              .slice(0, 30)}{" "}

                                            {Object.keys(item).toString().length >
                                              20
                                              ? "..."
                                              : ""}
:
                                            {item[Object.keys(item)[0]].value.length >
                                              30
                                              ? "..."
                                              : ""}{" "}
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
                                        <Typography>
                                          <StylePop className="ChipSpan rejected">
                                            {Object.keys(item)
                                              .toString()
                                              .slice(0, 20)}{" : "}

                                            {item[Object.keys(item)[0]].value
                                              .slice(0, 30)}{" "}
:
                                            {Object.keys(item).toString().length >
                                              20
                                              ? "..."
                                              : ""}

                                            {item[Object.keys(item)[0]].value.length >
                                              30
                                              ? "..."
                                              : ""}{" "}
                                          </StylePop>{" "}
                                        </Typography>
                                      </Tooltip>
                                    </Stack>
                                  ))}
                              </>
                          }



                        </Grid>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </DialogContentText>
          {existingCode?.length > 0 ||
            recaptureCode?.length > 0 ||
            duplicateCode?.length > 0 ||
            Object?.keys(suspectCode)?.length > 0 ||
            existingCodeReject?.length > 0 ||
            recaptureCodeReject?.length > 0 ||
            suspectCodeReject?.length > 0 ||
            duplicateCodeReject?.length > 0 ? (
            <button
              style={{ cursor: "pointer", width: "98%", margin: "0 auto", }}
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
        </DialogContent>
      )}
    </Dialog>
  );
};

export default SubmitModal;
