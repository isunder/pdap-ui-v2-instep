import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Grid, styled, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";
import MenuItem from "@mui/material/MenuItem";
import "../ExistingConditions/ExistingConditions.css"
import {
  CrossWhite,
  PlusIcon,
  CorrectIcon,
  DeleteIcon,
} from "../../components";
import { patientSuspectedCode } from "../../redux/userSlice/patientInfoSlice";
import { ReadMore } from "../ReadMore/ReadMore";
import { suspectReject } from "../../redux/userSlice/rejectCodesSlice";
import { suspectValue } from "../../redux/userSlice/acceptCodesSlice";
import { ReasonTextVal } from "../../components/Validation/ReasonTextVal";
import { TabsSlag } from "../TabsSlag/TabsSlag";
import { DialogModal } from "../../components/Modal/DialogModal";
import { InputField } from "../../components/InputField";
import { SelectField } from "../../components/SelectField";
import {
  StyleCircle,
  StyleButton,
  StyleCode,
  StyledText,
  StyledHeader,
  StyledBox,
  StyledButton,
} from "../Common/StyledMuiComponents";
import { convertDate, isSlugOrJwt } from "../../utils/helper";

const StyleHead = styled("h2")(() => ({
  fontSize: "16px",
  fontWeight: 600,
  lineHeight: "21px",
  color: "#000",
}));

export const Suspects = ({ sessionObject, handleAddEventData }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const tabs = TabsSlag();
  const userDetail = useSelector((state) => state?.user?.data?.userInfo);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { doctorDetail } = useSelector((state) => state?.doctor?.data);
  const [suspectCode, setSuspectCode] = useState([]);
  const [rejectReason, setRejectReason] = useState("Insufficient Proof");
  const [otherText, setOtherText] = useState(null);
  const [error, setError] = useState({});
  const [selectedRejectData, setSelectedRejectData] = useState({});

  const rejectedData = useSelector((state) => state?.reject?.suspectReject);
  const [rejectSuspectCode, setRejectSuspectCode] = useState([]);

  const suspectedCode = useSelector((state) => state?.summary?.suspect);
  const [selectedSuspectcode, setSelectedSuspectcode] = useState([]);
  const { user } = useSelector((state) => state);

  const state = useSelector((state) => state.user.data.suspectedCode);
  const [sessionObjLoaded, setSessionObjLoaded] = useState(false);

  let array = [];
  state &&
    Object.keys(state).forEach((key) => {
      array.push({
        SuspectedCondition: key,
        data: state[key].data,
        reason: state[key].reason,
        remarks: state[key].remarks,
        definition: state[key].definition,
        total_weight: state[key].total_weight,
        dataValue: state[key].data.value
      });
    });
  array?.length !== suspectCode?.length && setSuspectCode(array);

  const handleClose = () => {
    rejectReason !== "Insufficient Proof" &&
      setRejectReason("Insufficient Proof");
    otherText?.length > 0 && setOtherText(null);
    setError({});
    setDeleteOpen(false);
    const exampleMetadata = {
      event_type: "SUSPECT_REJECTION_REASON_CANCEL", metadata: {
        identifier: tabs?.["user"]?.value || "",
        provider_name: doctorDetail?.doctor_name || "",
        patient_id: user?.data?.userInfo?.mrn || "",
        event_datetime: convertDate(new Date().toISOString()),
        parentCodesCount: (suspectCode?.length)

      }
    };

    handleAddEventData(exampleMetadata)
  };

  const handleRemoveDeletedCode = (item) => {


    setButtonDisable(false)
    if (userDetail?.mrn) {
      sessionObject = JSON.parse(
        localStorage.getItem(`sessionObject_${userDetail.mrn}`)
      );
      let codeList;

      codeList = sessionObject?.suspectCodeReject?.filter(
        (value) => Object.keys(value)[0] !== item
      );
      let sessionExisting = sessionObject?.existingCode;
      let sessionExistingReject = sessionObject?.existingCodeReject;
      let sessionSuspect = sessionObject?.suspectCode;
      let sessionRecapture = sessionObject?.recaptureCode;
      let sessionRecaptureReject = sessionObject?.recaptureCodeReject;
      let sessionDuplicate = sessionObject?.duplicateCode;
      let sessionDuplicateReject = sessionObject?.duplicateCodeReject;
      let expirationDate = sessionObject?.expiresAt;

      sessionObject = {
        mrn: userDetail?.mrn,
        expiresAt: expirationDate,
        existingCode: sessionExisting,
        existingCodeReject: sessionExistingReject,
        suspectCode: sessionSuspect,
        suspectCodeReject: codeList,
        recaptureCode: sessionRecapture,
        recaptureCodeReject: sessionRecaptureReject,
        duplicateCode: sessionDuplicate,
        duplicateCodeReject: sessionDuplicateReject,
      };
      localStorage.setItem(
        `sessionObject_${userDetail.mrn}`,
        JSON.stringify(sessionObject)
      );
      setRejectSuspectCode(codeList);
    }

    const exampleMetadata = {
      event_type: "SUSPECT_REJECT_CONDITION",
      metadata: {
        identifier: tabs?.["user"]?.value || "",
        provider_name: doctorDetail?.doctor_name || "",
        patient_id: user?.data?.userInfo?.mrn || "",
        event_datetime: convertDate(new Date().toISOString()),
        code: item,
        description: item,
        reasonForRejection: rejectSuspectCode[0]?.[item].reason,
        raf: item?.info?.total_weight,
        alternateCodes: item?.info?.alternate_codes,
        parentCodesCount: (suspectCode?.length)
      }
    };

    handleAddEventData(exampleMetadata);

  };

  const [buttonDisable, setButtonDisable] = useState(false)

  const handleClickOpen = (item) => {


    setButtonDisable(false)
    setDeleteOpen(true);
    setSelectedRejectData(item);

    const exampleMetadata = {
      event_type: "SUSPECT_REJECTION_REASON_SELECTION", metadata: {
        identifier: tabs?.["user"]?.value || "",
        provider_name: doctorDetail?.doctor_name || "",
        patient_id: user?.data?.userInfo?.mrn || "",
        event_datetime: convertDate(new Date().toISOString()),
        code: item?.code,
        description: item?.definition,
        reasonForRejection: rejectReason,
        raf: item?.total_weight,
        alternateCodes: "",
        parentCodesCount: (suspectCode?.length)
      }
    };

    handleAddEventData(exampleMetadata);
  };



  const handleDelete = () => {
    if (userDetail?.mrn) {
      sessionObject = JSON.parse(
        localStorage.getItem(`sessionObject_${userDetail.mrn}`)
      );
      let reason = rejectReason === "Other" ? otherText : rejectReason;
      let val = {
        isValid: true,
      };
      if (rejectReason === "Other") {
        val = ReasonTextVal(otherText);
        setError(val);

      }
      if (!val.isValid) {
        setError(val);
        return;
      } else {
        let newObj = selectedRejectData.data;
        let codeValue = [];

        for (let x in newObj) {
          codeValue.push(`${x}  ${newObj[x]?.value}`);
        }
        let code = rejectedData?.some((value, index) => {
          let key = Object.keys(value)[0];
          if (selectedRejectData?.SuspectedCondition === key) {
            return true;
          }
        });

        let codeList,
          updatedVal = [];
        let sessionExisting = sessionObject?.existingCode;
        let sessionExistingReject = sessionObject?.existingCodeReject;
        let sessionSuspect = sessionObject?.suspectCode;
        let sessionRecapture = sessionObject?.recaptureCode;
        let sessionRecaptureReject = sessionObject?.recaptureCodeReject;
        let sessionDuplicate = sessionObject?.duplicateCode;
        let sessionDuplicateReject = sessionObject?.duplicateCodeReject;
        let expirationDate = sessionObject?.expiresAt;

        if (code) {
          codeList = rejectedData?.filter(
            (value) =>
              Object?.keys(value)[0] !== selectedRejectData?.SuspectedCondition
          );
          updatedVal = codeList;
        } else {
          codeList = {
            [selectedRejectData.SuspectedCondition]: {
              value: selectedRejectData.SuspectedCondition,
              code: " ",
              reason: reason,
            },
          };
          updatedVal = [...rejectedData, codeList];
        }
        setRejectSuspectCode(updatedVal);
        sessionObject = {
          mrn: userDetail?.mrn,
          expiresAt: expirationDate,
          existingCode: sessionExisting,
          existingCodeReject: sessionExistingReject,
          suspectCode: sessionSuspect,
          suspectCodeReject: codeList,
          recaptureCode: sessionRecapture,
          recaptureCodeReject: sessionRecaptureReject,
          duplicateCode: sessionDuplicate,
          duplicateCodeReject: sessionDuplicateReject,
        };
        localStorage.setItem(
          `sessionObject_${userDetail.mrn}`,
          JSON.stringify(sessionObject)
        );

        reason !== "Insufficient Proof" &&
          setRejectReason("Insufficient Proof");
        otherText?.length > 0 && setOtherText(null);
        setDeleteOpen(false);


        const exampleMetadata = {
          event_type: "SUSPECT_REJECTION_REASON_DELETION", metadata: {
            identifier: tabs?.["user"]?.value || "",
            provider_name: doctorDetail?.doctor_name || "",
            patient_id: user?.data?.userInfo?.mrn || "",
            event_datetime: convertDate(new Date().toISOString()),
            code: code,
            description: selectedRejectData.definition,
            reasonForRejection: rejectReason,
            raf: selectedRejectData.total_weight,
            alternateCodes: "",
            parentCodesCount: (suspectCode?.length)
          }
        };

        handleAddEventData(exampleMetadata);
      }
    }
    setButtonDisable(true);
  };

  const handleReseon = (event) => {
    const value = event.target.value;
    if (value !== "Other") {
      setError({});
      setOtherText("");
    }
    setRejectReason(value);
  };

  const handleOtherText = (e) => {
    let value = e.target.value;
    let val = ReasonTextVal(value);
    setError(val);
    setOtherText(e.target.value);
  };

  const handleClickOpen1 = (key, item, allData) => {


    if (userDetail?.mrn) {
      sessionObject = JSON.parse(
        localStorage.getItem(`sessionObject_${userDetail.mrn}`)
      );
      let itemCode = key;
      let value = item?.value;
      let additional_info = item?.remarks?.reason;
      let suspectedCondition = allData?.SuspectedCondition
      let code = sessionObject?.suspectCode?.some((value, index) => {
        if (key === value.code) {
          return true;
        }
      });
      let codeList,
        updateVal = [];
      let sessionExisting = sessionObject?.existingCode;
      let sessionExistingReject = sessionObject?.existingCodeReject;
      let sessionSuspectReject = sessionObject?.suspectCodeReject;
      let sessionRecapture = sessionObject?.recaptureCode;
      let sessionRecaptureReject = sessionObject?.recaptureCodeReject;
      let sessionDuplicate = sessionObject?.duplicateCode;
      let sessionDuplicateReject = sessionObject?.duplicateCodeReject;
      let expirationDate = sessionObject?.expiresAt;
      if (code) {
        codeList = sessionObject?.suspectCode?.filter(
          (value) => value?.code !== key
        );
        updateVal = codeList;

        const exampleMetadata = {
          event_type: "SUSPECT_ACCEPT_CODE", metadata: {
            identifier: tabs?.["user"]?.value || "",
            provider_name: doctorDetail?.doctor_name || "",
            patient_id: user?.data?.userInfo?.mrn || "",
            event_datetime: convertDate(new Date().toISOString()),
            code: allData.SuspectedCondition,
            description: allData.definition,
            reasonForRejection: rejectReason,
            raf: allData.total_weight,
            alternateCodes: "",
            parentCodesCount: (suspectCode?.length)
          }
        };

        handleAddEventData(exampleMetadata);


      } else {
        codeList = {
          code: itemCode,
          value: value,
          additional_info: additional_info,
          suspectedCondition: suspectedCondition,
        };
        updateVal =
          selectedSuspectcode?.length > 0
            ? [...selectedSuspectcode, codeList]
            : [codeList];

        const exampleMetadata = {
          event_type: "SUSPECT_ACCEPT_CODE", metadata: {
            identifier: tabs?.["user"]?.value || "",
            provider_name: doctorDetail?.doctor_name || "",
            patient_id: user?.data?.userInfo?.mrn || "",
            event_datetime: convertDate(new Date().toISOString()),
            code: allData.SuspectedCondition,
            description: allData.definition,
            reasonForRejection: rejectReason,
            raf: allData.total_weight,
            alternateCodes: "",
            parentCodesCount: (suspectCode?.length)
          }
        };

        handleAddEventData(exampleMetadata);


      }
      sessionObject = {
        mrn: userDetail?.mrn,
        expiresAt: expirationDate,
        existingCode: sessionExisting,
        existingCodeReject: sessionExistingReject,
        suspectCode: updateVal,
        suspectCodeReject: sessionSuspectReject,
        recaptureCode: sessionRecapture,
        recaptureCodeReject: sessionRecaptureReject,
        duplicateCode: sessionDuplicate,
        duplicateCodeReject: sessionDuplicateReject,
      };
      localStorage.setItem(
        `sessionObject_${userDetail.mrn}`,
        JSON.stringify(sessionObject)
      );
      setSelectedSuspectcode(updateVal);
    }
  };

  // Function to check if the condition is rejected
  const isConditionRejected = (item) => {
    return keyOfRejectedData?.some(
      (value) => item?.SuspectedCondition === value
    );
  };

  // Function to check if the condition is rejected
  const isConditionRejected2 = (item) => {
    const newKey = keyOfRejectedData?.map(
      (value) => item?.SuspectedCondition === value
    );

    isConditionRejected2();
  };

  // Function to check if the code is not selected
  const isCodeSelected = (dataValue) => {
    return selectedSuspectcode?.some((ele) => ele.code === dataValue);
  };

  const slug = isSlugOrJwt();
  useEffect(() => {
    if (slug) dispatch(patientSuspectedCode());
  }, []);

  useEffect(() => {
    if (
      sessionObject &&
      !sessionObjLoaded &&
      Object.keys(sessionObject).length > 0
    ) {
      let newSuspect =
        suspectedCode?.length > 0 && sessionObject?.suspectCode?.length > 0
          ? [...sessionObject?.suspectCode, ...suspectedCode]
          : suspectedCode?.length > 0
            ? suspectedCode
            : sessionObject?.suspectCode || [];
      selectedSuspectcode?.length === 0 &&
        setSelectedSuspectcode([...newSuspect]);

      let newSuspectReject =
        rejectSuspectCode?.length > 0 &&
          sessionObject?.suspectCodeReject?.length > 0
          ? [...sessionObject?.suspectCodeReject, ...rejectSuspectCode]
          : rejectSuspectCode?.length > 0
            ? rejectSuspectCode
            : sessionObject?.suspectCodeReject || [];
      rejectSuspectCode?.length === 0 &&
        setRejectSuspectCode([...newSuspectReject]);
      setSessionObjLoaded(true);
    }
  }, [sessionObject]);

  useEffect(() => {
    dispatch(suspectValue(selectedSuspectcode));
    dispatch(suspectReject(rejectSuspectCode));
  }, [rejectSuspectCode, selectedSuspectcode]);

  useEffect(() => {
    let sessionSuspect = suspectedCode?.length > 0 ? suspectedCode : [];
    selectedSuspectcode?.length !== sessionSuspect?.length &&
      setSelectedSuspectcode([...sessionSuspect]);

    let newSuspectReject = rejectedData?.length > 0 ? rejectedData : [];
    rejectSuspectCode?.length !== newSuspectReject?.length &&
      setRejectSuspectCode([...newSuspectReject]);
  }, [suspectedCode.length, rejectedData.length]);

  const keyOfRejectedData = rejectedData?.map((value) => Object.keys(value)[0]);

  return (
    <div>
      <Box
        sx={{
          padding: "10px 15px 10px",
          backgroundColor: "#fff",
          borderRadius: "0px 0px 10px 10px",
        }}
      >
        {/* Header for accordion body */}
        <Box sx={{ ...flexAlignCenter, flexDirection: "column" }}>
          <StyledHeader>
            <Grid
              container
              spacing={0}
              className="ContentBody"
              sx={{ padding: "0px 10px 5px 0px", backgroundColor: "#fff", pl: 0, }}
            >
              <StyledBox
                sx={{
                  padding:"0 !important",
                  fontWeight: "800 !important",
                  borderBottom:"1px solid #D9D9D999",
                  [theme.breakpoints.only("md")]: {
                    pl: 0,
                  },
                }}
                className="acc-content-header-items"
              >

                {/* Description */}
                <Grid item xs={tabs && tabs["patient_dashboard_weights"]?.active? 10 : 12} sm={tabs && tabs["patient_dashboard_weights"]?.active? 8 : 10} md={tabs && tabs["patient_dashboard_weights"]?.active? 7.5 : 9.5} lg={tabs && tabs["patient_dashboard_weights"]?.active? 8 : 10} xl={tabs && tabs["patient_dashboard_weights"]?.active? 8 : 10} 
                  sx={{
                    '@media (max-width:767px)':{
                      maxWidth: tabs && tabs["patient_dashboard_weights"]?.active ? '83.33%' : '100%',
                            flexBasis: tabs && tabs["patient_dashboard_weights"]?.active ? '83.33%' : '100%',
                    }

                    
                  }}
                  >
                  <StyledText sx={{padding:"0 !important", 
                      '@media (max-width:767px)':{
                        borderRight: tabs && tabs["patient_dashboard_weights"]?.active ? "2px solid rgba(0, 0, 0, 0.12)" : "0px !important",
                        
                           
                          
                  }}} className={`${tabs && !!tabs?.patient_dashboard_weights?.active ? "suspect_description_custom_width acc-content-cust-header1 suspect_desc_head" : "acc-content-cust-header1 suspect_desc_head"}`}>
                    Description
                  </StyledText>
                </Grid>

                {tabs && tabs["patient_dashboard_weights"]?.active && (
                  <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>

                    <StyledText className="acc-content-cust-header1 cust_RAF_suspect"
                      sx={{
                        [theme.breakpoints.down("768")]: {
                          borderRight: "0px !important",
                          padding: 0
                        },
                      }}
                    >
                      RAF
                    </StyledText>

                  </Grid>
                )}

                {/* Action */}
                <Grid item xs={12} sm={2} md={2.5} lg={2} xl={2}
                  sx={{
                    '@media (max-width:767px)': {
                      display: 'none'
                    }
                  }}
                >
                  <StyledText sx={{ border: "none !important" }} className={`${tabs && !tabs["patient_dashboard_weights"]?.active ? "suspect_action_custom_width acc-content-cust-header1" : "acc-content-cust-header1"}`}>
                    Actions
                  </StyledText>
                </Grid>
              </StyledBox>
            </Grid>
          </StyledHeader>
        </Box>
        {/* Header end for accordion body */}
        {suspectCode &&
          suspectCode?.map((item, index) => (
            <Box key={index + 1}>
              <Grid
                container
                sx={{
                  paddingTop: "20px", borderTop: "1px solid #D9D9D999",
                }}
                spacing={0}
                className="ContentBody"

              >
                {/* Description contents */}
                <Grid item xs={tabs && tabs["patient_dashboard_weights"]?.active? 10 : 12} sm={tabs && tabs["patient_dashboard_weights"]?.active? 8 : 10} md={tabs && tabs["patient_dashboard_weights"]?.active? 7.5 : 9.5} lg={tabs && tabs["patient_dashboard_weights"]?.active? 8 : 10} xl={tabs && tabs["patient_dashboard_weights"]?.active? 8 : 10} 
                  className="suspect_desc_content"
                  sx={{
                    '@media (max-width:767px)': {
                      maxWidth: tabs && tabs["patient_dashboard_weights"]?.active ? '83.33%' : '100%',
                      flexBasis: tabs && tabs["patient_dashboard_weights"]?.active ? '83.33%' : '100%',
                    }
                  }}
                  // sx={{ padding: "3px 0px"  }}
                >
                  <StyleHead sx={{ pr: 1 }}>
                    {index + 1}. {item.SuspectedCondition}
                    {item.definition?.length > 0 && (

                      <ReadMore
                        tabs={tabs}
                        user={user}
                        item={item}
                        handleAddEventData={handleAddEventData}
                        length={0}
                        readMore={"Read More"}
                        showLess={"Show Less"}
                        other={{
                          color: "#17236D",
                          fontSize: "13px",
                          fontWeight: 400,
                          lineHeight: "22.75px",
                          textDecoration: "underline",
                          ml: 2,
                        }}
                      >
                        {item.definition}
                      </ReadMore>
                    )}
                  </StyleHead>
                  <Box
                    sx={{
                      width:"90%",
                      fontSize: "14px",
                      fontWeight: 400,
                      lineHeight: "21px",
                      color: "#000",
                      margin: "7px 0px",
                    }}
                  >
                    {item?.reason}
                  </Box>
                  <Box
                    sx={{
                      fontSize: "14px",
                      fontWeight: 400,
                      lineHeight: "21px",
                      color: "#000",
                    }}
                  >
                    {item?.remarks}
                  </Box>


                  <div className="acc-content-suspects-code-selector">
                  {/* Code add selectors */}
                  {Object.keys(item?.data)?.length > 0 ?
                    Object.keys(item?.data).map((dataValue, index) => (
                      <Box sx={{ mt: 2 }} key={index}>
                        <Grid
                          container
                          spacing={0}
                          className="ContentBody"
                          sx={{
                           alignItems:'center',
                            pb: 1,
                            mb: 1,
                            flexWrap: "nowrap",
                          }}
                        >
                          {!isCodeSelected(dataValue) ? (
                            <Grid
                              item
                              sx={{ maxWidth:"100% !important" }}
                              // xs="auto"
                              // sm="auto"
                              // md="auto"
                              lg="auto"
                              xl="auto"
                              onClick={() => {
                                if ((tabs?.read_only_rejection_allowed?.active || (tabs?.read_only_mode?.active))) {
                                  return;
                                }
                                if (!isConditionRejected(item)) {
                                  handleClickOpen1(
                                    dataValue,
                                    item?.data[dataValue],
                                    item
                                  );
                                }
                              }
                              }
                            >
                              <StyleCode

                              className="text-container"
                                sx={{
                                  filter: isConditionRejected(item) || (tabs?.read_only_rejection_allowed?.active || (tabs?.read_only_mode?.active))
                                    ? "opacity(0.5)"
                                    : "none",
                                  cursor: isConditionRejected(item) || (tabs?.read_only_rejection_allowed?.active || (tabs?.read_only_mode?.active))
                                    ? "not-allowed"
                                    : "pointer",
                                  pointerEvents: isConditionRejected(item) || (tabs?.read_only_rejection_allowed?.active || (tabs?.read_only_mode?.active))
                                    ? "none"
                                    : "all",
                                }}
                              >
                                {/* {dataValue.substring(0, 70) + '...'} */}

                                {dataValue} 
                                
                                <StyleCircle
                                  sx={{
                                    background: "#17236D",
                                    ...flexAlignCenter,
                                    marginLeft: "6px",
                                    justifyContent: "center",
                                    borderRadius: "100px",
                                    display: "inline-block",
                                    textAlign: "center",
                                    flexShrink:'0'
                                  }}
                                >
                                  <PlusIcon />
                                </StyleCircle>

                                
                              </StyleCode>
                            </Grid>
                          ) : (
                            <Grid
                              item
                              xs="auto"
                              sm="auto"
                              md="auto"
                              lg="auto"
                              xl="auto"
                              sx={{maxWidth:'100% !important'}}
                              onClick={() => {
                                if (!isConditionRejected(item)) {
                                  handleClickOpen1(
                                    dataValue,
                                    item?.data[dataValue],
                                    item
                                  );
                                }
                              }}
                            >
                              <StyleCode
                                sx={{
                                  background: "#008F53",
                                  color: "#fff",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  textAlign: "left"
                                 
                                }}
                              >
                                {dataValue}
                                <StyleCircle
                                  sx={{
                                    background: "#FFF",
                                    ...flexAlignCenter,
                                    justifyContent: "center",
                                    marginLeft: "6px",
                                    borderRadius: "100px",
                                    display: "inline-block",
                                    textAlign: "center",
                                    alignItems: "center",
                                    flexShrink:0
                                  }}
                                >
                                  <CorrectIcon fill={"#008F53"} />
                                </StyleCircle>
                              </StyleCode>
                            </Grid>
                          )}


                          {
                            item?.data[dataValue]?.value &&
                            <Grid
                            item
                            xs={8}
                            sm={8}
                            md={8}
                            lg={10}
                            xl={10}
                            sx={{
                              mt: "3px",
                              [theme.breakpoints.up("lg")]: {
                                ml: "10px",
                              },
                              [theme.breakpoints.up("md")]: {
                                ml: "10px",
                              },
                              [theme.breakpoints.down("md")]: {
                                ml: "10px",
                              },
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "14px",
                                fontWeight: 500,
                                lineHeight: "20px",
                                color: "#000",
                                textTransform: "inherit",
                              }}
                            >
                              {item?.data[dataValue]?.value}
                            </Typography>
                          </Grid>
                          }
                          
                        </Grid>
                      </Box>
                    )) : null}
                </div>
                </Grid>

                {/* RAF Contents */}

                {tabs && tabs["patient_dashboard_weights"]?.active && (
                  <Grid item xs={2} sm={2} md={2} lg={2} xl={2}
                    className="suspect_raf"
                    sx={{
                      textAlign: "start",
                      fontSize: "14px",
                      fontWeight: 600,
                      paddingLeft:"10px !important"
                      // [theme.breakpoints.down("sm")]: {
                      //   display: "none"
                      // },
                    }}

                  >

                    {item?.total_weight ? item.total_weight : "--"}
                  </Grid>
                )}
                {/* Action btn contents */}


                <Grid item xs={12} sm={2} md={2.5} lg={2} xl={2}
                  sx={{
                    display: "flex",
                    '@media (min-width:767px)': {
                     paddingLeft:"10px"
                    }
                  }}
                  className="acc-content-suspects-action"
                >
                  {isConditionRejected(item) ? (
                    <StyledButton
                    disabled={tabs?.read_only_mode?.active}
                      onClick={() =>
                        handleRemoveDeletedCode(item?.SuspectedCondition)
                      }
                      sx={{
                        fontSize: "14px",
                        width: "105px !important",
                        justifyContent: "center",
                        backgroundColor: theme.palette.error.active1,
                        color: "#fff",
                        ":hover": {
                          backgroundColor: theme.palette.error.main,
                        },
                        [theme.breakpoints.down("768")]: {
                          width: "100% !important",
                        },
                        filter:
                          selectedSuspectcode?.some(obj => obj.suspectedCondition === item?.SuspectedCondition)
                            ? "opacity(0.5)"
                            : "none",
                        cursor:
                          selectedSuspectcode?.some(obj => obj.suspectedCondition === item?.SuspectedCondition)
                            ? "not-allowed"
                            : "pointer",
                        pointerEvents:
                          selectedSuspectcode?.some(obj => obj.suspectedCondition === item?.SuspectedCondition) ? "none" : "all",
                      }}
                      startIcon={
                        <StyleCircle
                          sx={{
                            background: "#B90E0E",
                            ...flexAlignCenter,
                            justifyContent: "center",
                            borderRadius: "100px",
                          }}
                        >
                          <CrossWhite />
                        </StyleCircle>
                      }
                    >
                      Rejected
                    </StyledButton>
                  ) : (
                    <StyledButton
                    disabled={tabs?.read_only_mode?.active}
                      onClick={() => handleClickOpen(item)}
                      sx={{
                        fontSize: "14px",
                        width: "98px !important",
                        justifyContent: "center",
                        backgroundColor:(tabs?.read_only_mode?.active)? "#D5D5D5" : theme.palette.primary.main,
                        color: "#fff !important",
                        ":hover": {
                          backgroundColor: theme.palette.primary.main,
                        },
                       
                        '@media (max-width:767px)': {
                          width:"100% !important"
                        },

                        filter:
                          selectedSuspectcode?.some(obj => obj.suspectedCondition === item?.SuspectedCondition)
                            ? "opacity(0.5)"
                            : "none",
                        cursor:
                          selectedSuspectcode?.some(obj => obj.suspectedCondition === item?.SuspectedCondition)
                            ? "not-allowed"
                            : "pointer",
                        pointerEvents:
                          selectedSuspectcode?.some(obj => obj.suspectedCondition === item?.SuspectedCondition) ? "none" : "all",
                      }}
                      startIcon={
                        <StyleCircle
                          sx={{
                            background: (tabs?.read_only_mode?.active)? "#ADADAD" : "#434343",
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
                  )}
                </Grid>

               


              </Grid>
            </Box>
          ))}
      </Box>

      <DialogModal
        open={deleteOpen}
        setOpen={setDeleteOpen}
        header={<DeleteIcon style={{ width: 45, height: 45 }} />}
        width="25rem"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            mb: 3,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                display: "flex",
                width: "90%",
                height: "28px",
                fontSize: "18px",
                fontWeight: 700,
                lineHeight: "28px",
                letterSpacing: "0em",
                textAlign: "left",
                color: "#101828",
              }}
            >
              Are you sure?
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#475467",
              }}
            >
              You want to delete this problem from DoctusTech? This will not
              remove the code from your Electronic Health Record system!
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <SelectField
                value={rejectReason}
                labelText="Select a reason"
                onChange={(e) => handleReseon(e)}
              >
                <MenuItem value="Insufficient Proof">
                  Insufficient Proof
                </MenuItem>
                <MenuItem value="Resolved">Resolved</MenuItem>
                <MenuItem value="A better, more accurate code exists">A better, more accurate code exists</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </SelectField>
              {rejectReason === "Other" && (
                <InputField
                  placeholder="Add Reason"
                  onChange={(e) => handleOtherText(e)}
                  helperText={!error.isValid && error?.reason}
                  labelText="Reason for Rejection"
                />
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                gap: "1rem",
              }}
            >
              <StyleButton variant="outlined" onClick={handleClose} sx={{}}>
                Cancel
              </StyleButton>
              <StyleButton
                variant="contained"
                onClick={() => handleDelete()}
                color="error"
                sx={{}}
                disabled={buttonDisable}
              >
                Delete
              </StyleButton>
            </Box>
          </Box>
        </Box>
      </DialogModal>
    </div>
  );
};

const flexAlignCenter = {
  display: "flex",
  alignItems: "center",
};
