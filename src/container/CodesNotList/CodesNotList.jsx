import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@emotion/react";
import {
  Box,
  Divider,
  Grid,
  Typography,
  styled,
  ButtonGroup,
  Tooltip,
} from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import Dialog from "@mui/material/Dialog";
import MenuItem from "@mui/material/MenuItem";
import DialogActions from "@mui/material/DialogActions";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useDispatch, useSelector } from "react-redux";

import {
  ArrowDropDownIcon,
  CorrectIcon,
  CrossWhite,
  PrimaryButton,
  MuiAccordions,
  DocIcon,
  ArrowUpIcon,
  InputBoxText,
  DeleteIcon,
} from "../../components";
import "../../Screens/Codes/Codes.css";
import { patientRecaptureCode } from "../../redux/userSlice/patientInfoSlice";
import { recaptureReject } from "../../redux/userSlice/rejectCodesSlice";
import {
  recaptureValue,
  recaptureRejectInfo,
} from "../../redux/userSlice/acceptCodesSlice";
import { patientClinicalDocument } from "../../redux/userSlice/petientClinicalSlice";
import { TabsSlag } from "../TabsSlag/TabsSlag";
import { ReasonTextVal } from "../../components/Validation/ReasonTextVal";
import DocumentModal from "../../components/DocumentModal/DocumentModal";
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import { DialogModal } from "../../components/Modal/DialogModal";
import Deletemodal from "../../components/DeleteModal/DeleteModal";
import { SelectField } from "../../components/SelectField";
import { InputField } from "../../components/InputField";
import { Mixpanel } from "../../services";
import {
  StyleCircle,
  StyleButton,
  StyleCode,
  StyledText,
  StyledHeader,
  StyledBox,
  StyledAccordingBox,
  StyledButton,
  StyledButton1,
  StyledButton2,
} from "../Common/StyledMuiComponents";

export const CodesNotList = ({ sessionObject }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const userDetail = useSelector((state) => state?.user?.data?.userInfo);
  const tabs = TabsSlag();

  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [Deleteopen, setDeleteOpen] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [checkedAcceptAll, setCheckedAcceptAll] = useState([]);
  const [selectedMainCode, setSelectedMainCode] = useState("");
  const [handleFunction, setHandleFunction] = useState(false);
  const [clinicalDoc, setClinicalDoc] = useState(null);
  const [recapture, setRecapture] = useState([]);
  const [selectedRejectData, setSelectedRejectData] = useState({});
  const [rejectReason, setRejectReason] = useState("Insufficient Proof");
  const [otherText, setOtherText] = useState(null);
  const [error, setError] = useState({});
  const recaptureCode = useSelector((state) => state?.summary?.recapture);
  const [selectedRecapturecode, setSelectedRecapturecode] = useState([]);

  const RejectedCodes = useSelector((state) => state?.reject?.recaptureReject);
  const [rejectRecaptureCode, setRejectRecaptureCode] = useState([]);
  const [sessionObjLoaded, setSessionObjLoaded] = useState(false);

  const recatupreRejectCode = useSelector(
    (state) => state?.summary?.recaptureRejectCode
  );
  const [rejectRecaptureData, setRecaptureRejectData] =
    useState(recatupreRejectCode);

  const state = useSelector((state) => state?.user?.data?.recaptureCode);

  let array = [];
  state &&
    Object.keys(state)?.forEach((key) => {
      array.push({
        code: key,
        info: state[key],
        collapse: false,
      });
    });

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
        },
        collapse: false,
      };
    });

  result?.length !== recapture?.length && setRecapture(result);

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

  const handleClickAll = (index) => {
    let value = result[index];
    let allValue = [value, value?.info?.alternate_codes];
    let allCodes = allValue?.flat(1);
    let codeList = allCodes?.filter((item) => {
      let isExist = selectedRecapturecode?.some((value, index) => {
        if (item?.code === value?.code) {
          return true;
        }
      });
      if (!isExist) {
        return {
          code: item.code,
          value: item?.value ? item?.value : item?.info?.value,
          additional_info: item?.remarks ? item?.remarks : item?.info?.remarks,
        };
      }
    });

    let rejectedCodes = rejectRecaptureCode.filter((value) => {
      let acceptedCodes = allCodes?.some(
        (item) => item?.code === Object.keys(value)[0]
      );
      if (!acceptedCodes) {
        return value;
      }
    });
    setRejectRecaptureCode([...rejectedCodes]);
    codeList?.length &&
      setSelectedRecapturecode([...selectedRecapturecode, ...codeList]);
    Mixpanel(
      `${value?.code}-CodesNotList-Codes-AcceptAll-And-Add-Summary`,
      tabs,
      value?.code
    );
  };

  const handleOtherText = (e) => {
    let value = e.target.value;
    let val = ReasonTextVal(value);
    setError(val);
    setOtherText(e.target.value);
  };

  const handleDeleteAll = () => {
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
    } else {
      let altCode = selectedRejectData?.info?.alternate_codes;
      let recaptureCodes = selectedRecapturecode.filter((value) => {
        let altExist = altCode?.some((item) => item?.code === value?.code);
        if (!altExist) {
          if (selectedRejectData.code !== value?.code) {
            return value;
          }
        }
      });

      let rejectedData = rejectRecaptureData?.filter(
        (value) => Object.keys(value)[0] !== selectedRejectData?.code
      );
      let rejectedAltData = rejectRecaptureCode.filter((value) => {
        if (Object.keys(value)[0] !== selectedRejectData?.code) {
          let altExist = altCode?.some(
            (item) => item?.code === Object.keys(value)[0]
          );
          if (!altExist) {
            return value;
          }
        }
      });
      let altRejectCode = altCode?.map((value) => {
        return {
          [value.code]: {
            value: value?.value,
            reason: reason,
          },
        };
      });
      let altRejectList = {
        [selectedMainCode]: {
          value: selectedRejectData?.value
            ? selectedRejectData?.value
            : selectedRejectData?.info?.value,
          reason: reason,
        },
      };
      let newAltCode = altCode?.map((value) => {
        return {
          code: value?.code,
          reason: reason,
          value: value?.value,
        };
      });
      let rejectList = {
        [selectedMainCode]: {
          value: selectedRejectData?.value
            ? selectedRejectData?.value
            : selectedRejectData?.info?.value,
          reason: reason,
          delete_code: true,
          alternate_codes: newAltCode,
        },
      };

      setSelectedRecapturecode([...recaptureCodes]);
      setRecaptureRejectData([...rejectedData, rejectList]);
      setRejectRecaptureCode([
        ...rejectedAltData,
        ...altRejectCode,
        altRejectList,
      ]);
      rejectReason !== "Insufficient Proof" &&
        setRejectReason("Insufficient Proof");
      otherText?.length > 0 && setOtherText(null);
      setHandleFunction(false);
      setDeleteOpen(false);
      Mixpanel(
        `${selectedRejectData?.code}-CodesNotList-Codes-RejectAll-And-Add-Summary`,
        tabs,
        selectedRejectData?.code
      );
    }
  };

  useEffect(() => {
    dispatch(patientRecaptureCode());
  }, []);

  useEffect(() => {
    if (sessionObject && !sessionObjLoaded && Object.keys(sessionObject).length > 0) {
      let newRecapture =
        recaptureCode?.length > 0 && sessionObject?.recaptureCode?.length > 0
          ? [...sessionObject?.recaptureCode, ...recaptureCode]
          : recaptureCode?.length > 0
            ? recaptureCode
            : sessionObject?.recaptureCode || [];
      selectedRecapturecode?.length === 0 &&
        setSelectedRecapturecode([...newRecapture]);

      let newRecaptureReject =
        rejectRecaptureCode?.length > 0 &&
          sessionObject?.recaptureCodeReject?.length > 0
          ? [...sessionObject?.recaptureCodeReject, ...rejectRecaptureCode]
          : rejectRecaptureCode?.length > 0
            ? rejectRecaptureCode
            : sessionObject?.recaptureCodeReject || [];
      rejectRecaptureCode?.length === 0 &&
        setRejectRecaptureCode([...newRecaptureReject]);

      checkCodesAvailability(recapture, recaptureCode);
      setSessionObjLoaded(true);
    }
  }, [sessionObject]);

  useEffect(() => {
    dispatch(recaptureReject(rejectRecaptureCode));
    dispatch(recaptureValue(selectedRecapturecode));
    dispatch(recaptureRejectInfo(rejectRecaptureData));
  }, [selectedRecapturecode, rejectRecaptureCode]);

  useEffect(() => {
    let sessionExisting = recaptureCode?.length > 0 ? recaptureCode : [];
    selectedRecapturecode?.length !== sessionExisting?.length &&
      setSelectedRecapturecode([...sessionExisting]);

    let newExistingReject = RejectedCodes?.length > 0 ? RejectedCodes : [];
    rejectRecaptureCode?.length !== newExistingReject?.length &&
      setRejectRecaptureCode([...newExistingReject]);
  }, [recaptureCode.length, RejectedCodes.length]);

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
    rejectReason !== "Insufficient Proof" &&
      setRejectReason("Insufficient Proof");
    otherText?.length > 0 && setOtherText(null);
    setError({});
    setDeleteOpen(false);
  };

  const handleClose1 = () => {
    setOpen(false);
  };

  const handleRemoveDeletedCode = (item, id) => {
    if (userDetail?.mrn) {
      sessionObject = JSON.parse(
        localStorage.getItem(`sessionObject_${userDetail.mrn}`)
      );
      let code = sessionObject?.recaptureCodeReject?.some((value, index) => {
        let key = Object.keys(value)[0];
        if (item?.code === key) {
          return true;
        }
      });

      let codeList;
      if (code) {
        codeList = sessionObject?.recaptureCodeReject.filter(
          (value) => Object.keys(value)[0] !== item?.code
        );
        let sessionExisting = sessionObject?.existingCode;
        let sessionExistingReject = sessionObject?.existingCodeReject;
        let sessionSuspect = sessionObject?.suspectCode;
        let sessionSuspectReject = sessionObject?.suspectCodeReject;
        let sessionRecapture = sessionObject?.recaptureCode;
        let sessionDuplicate = sessionObject?.duplicateCode;
        let sessionDuplicateReject = sessionObject?.duplicateCodeReject;
        let expirationDate = sessionObject?.expiresAt;

        sessionObject = {
          mrn: userDetail?.mrn,
          expiresAt: expirationDate,
          existingCode: sessionExisting,
          existingCodeReject: sessionExistingReject,
          suspectCode: sessionSuspect,
          suspectCodeReject: sessionSuspectReject,
          recaptureCode: sessionRecapture,
          recaptureCodeReject: codeList,
          duplicateCode: sessionDuplicate,
          duplicateCodeReject: sessionDuplicateReject,
        };
        localStorage.setItem(
          `sessionObject_${userDetail.mrn}`,
          JSON.stringify(sessionObject)
        );
        setRejectRecaptureCode(codeList);
      }

      const updatedRejectData = rejectRecaptureData?.map((itemData) => {
        const key = Object.keys(itemData)[0];

        if (id === key) {
          return {
            [key]: {
              ...itemData[key],
              alternate_codes: itemData[key]?.alternate_codes?.filter(
                (val) => val?.code !== item?.code
              ),
            },
          };
        }

        return itemData;
      });
      if (updatedRejectData) {
        const codeValue = updatedRejectData.find(
          (itemData) => Object.keys(itemData)[0] === id
        );

        if (codeValue) {
          if (codeValue[id]?.value) {
            let isMainCode = rejectRecaptureData?.some(
              (value) => Object.keys(value)[0] === item?.code
            );
            if (isMainCode) {
              const updatingData = updatedRejectData?.map((val) => {
                return Object.keys(val)[0] === item?.code
                  ? {
                    [selectedMainCode]: {
                      ...val[selectedMainCode],
                      delete_code: false,
                    },
                  }
                  : val;
              });
              setRecaptureRejectData([...updatingData]);
            } else {
              let changeData = updatedRejectData?.map((value) => {
                return Object.keys(codeValue)[0] === Object.keys(value)[0]
                  ? {
                    [selectedMainCode]: {
                      ...value[selectedMainCode],
                      delete_code: codeValue[id]?.delete_code,
                    },
                  }
                  : value;
              });
              setRecaptureRejectData([...changeData]);
            }
          } else {
            if (updatedRejectData[id]?.alternate_codes?.length === 0) {
              const newData = rejectRecaptureData?.filter(
                (val) => Object.keys(val)[0] !== item?.code
              );
              setRecaptureRejectData(newData);
            } else {
              codeValue[id].delete_code = false;
              setRecaptureRejectData([...rejectRecaptureData]);
            }
          }
        }
      }
      Mixpanel(`${id}-CodesNotList-Codes-Remove-From-Summary `, tabs, id);
    }
  };

  const handleDelete = () => {
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
    } else {
      let code = rejectRecaptureData?.some((value, index) => {
        let key = Object.keys(value)[0];
        if (selectedMainCode === key) {
          return true;
        }
      });
      if (code) {
        if (selectedRejectData?.value) {
          const updatedRejectData = rejectRecaptureData?.map((item) => {
            const key = Object.keys(item)[0];
            if (selectedMainCode === key) {
              if (item?.value) {
                return {
                  [key]: {
                    ...item[key],
                  },
                };
              } else {
                return {
                  [key]: {
                    ...item[key],
                    alternate_codes: [
                      ...(item[key]?.alternate_codes || []),
                      {
                        code: selectedRejectData.code,
                        reason: reason,
                        value: selectedRejectData?.value,
                      },
                    ],
                  },
                };
              }
            }

            return item;
          });
          setRecaptureRejectData([...updatedRejectData]);
        } else {
          const codeValue = rejectRecaptureData?.find(
            (itemData) => Object.keys(itemData)[0] === selectedMainCode
          );
          let changeData = rejectRecaptureData?.map((value) => {
            return Object.keys(codeValue)[0] === Object.keys(value)[0]
              ? {
                [selectedMainCode]: {
                  ...value[selectedMainCode],
                  delete_code: true,
                },
              }
              : value;
          });
          setRecaptureRejectData([...changeData]);
        }
      } else {
        let rejectlist;
        if (selectedRejectData?.value) {
          rejectlist = {
            [selectedMainCode]: {
              value: selectedRejectData?.value,
              reason: reason,
              delete_code: false,
              alternate_codes: [
                {
                  code: selectedRejectData.code,
                  reason: reason,
                  value: selectedRejectData?.value,
                },
              ],
            },
          };
        } else {
          rejectlist = {
            [selectedMainCode]: {
              value: selectedRejectData?.info?.value,
              reason: reason,
              delete_code: true,
              alternate_codes: [],
            },
          };
        }
        setRecaptureRejectData([...rejectRecaptureData, rejectlist]);
      }

      let codeList = {
        [selectedRejectData.code]: {
          value: selectedRejectData?.value
            ? selectedRejectData?.value
            : selectedRejectData?.info?.value,
          reason: reason,
        },
      };
      setRejectRecaptureCode([...rejectRecaptureCode, codeList]);
      rejectReason !== "Insufficient Proof" &&
        setRejectReason("Insufficient Proof");
      otherText?.length > 0 && setOtherText(null);
      setDeleteOpen(false);
      Mixpanel(
        `${selectedRejectData.code}-CodesNotList-Codes-Reject-And-Add-Summary `
          .tabs,
        selectedRejectData.code
      );
    }
  };

  const handleIsCollapse = (data) => {
    let code = data?.value;
    let changeData = recapture?.map((value) => {
      const isValid = value?.info?.alternate_codes.find(
        (obj) => obj?.code === code?.code
      );
      if (isValid) {
        return (isValid.isCollapse = !isValid.isCollapse), value;
      }
      return value;
    });
    setRecapture(changeData);
  };

  const handleReseon = (event) => {
    const value = event.target.value;
    if (value !== "Other") {
      setError({});
    }
    setRejectReason(value);
  };

  const handleClickOpen1 = (item) => {
    if (userDetail?.mrn) {
      sessionObject = JSON.parse(
        localStorage.getItem(`sessionObject_${userDetail.mrn}`)
      );
      let code = sessionObject?.recaptureCode?.some((value, index) => {
        if (item?.code === value?.code) {
          return true;
        }
      });

      let codeList,
        updateVal = [];
      let sessionExisting = sessionObject?.existingCode;
      let sessionExistingReject = sessionObject?.existingCodeReject;
      let sessionSuspect = sessionObject?.suspectCode;
      let sessionSuspectReject = sessionObject?.suspectCodeReject;
      let sessionRecaptureReject = sessionObject?.recaptureCodeReject;
      let sessionDuplicate = sessionObject?.duplicateCode;
      let sessionDuplicateReject = sessionObject?.duplicateCodeReject;
      let expirationDate = sessionObject?.expiresAt;
      if (code) {
        codeList = sessionObject?.recaptureCode?.filter(
          (value) => value?.code !== item?.code
        );
        updateVal = codeList;
        Mixpanel(
          `${item?.code}-CodesNotList-Codes-Remove-From-Summary`,
          tabs,
          item?.code
        );
      } else {
        codeList = {
          code: item.code,
          value: item?.value ? item?.value : item?.info?.value,
          additional_info: item?.remarks ? item?.remarks : item?.info?.remarks,
        };
        updateVal =
          selectedRecapturecode?.length > 0
            ? [...selectedRecapturecode, codeList]
            : [codeList];
        Mixpanel(
          `${item?.code}-CodesNotList-Codes-Accept-And-Add-Summary`,
          tabs,
          item?.code
        );
      }
      setSelectedRecapturecode(updateVal);
      sessionObject = {
        mrn: userDetail?.mrn,
        expiresAt: expirationDate,
        existingCode: sessionExisting,
        existingCodeReject: sessionExistingReject,
        suspectCode: sessionSuspect,
        suspectCodeReject: sessionSuspectReject,
        recaptureCode: updateVal,
        recaptureCodeReject: sessionRecaptureReject,
        duplicateCode: sessionDuplicate,
        duplicateCodeReject: sessionDuplicateReject,
      };
      localStorage.setItem(
        `sessionObject_${userDetail.mrn}`,
        JSON.stringify(sessionObject)
      );
    }
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

  const handleCollapse = (code) => {
    let changeData = recapture?.map((value) => {
      return value?.code === code
        ? ((value.collapse = !value?.collapse), value)
        : value;
    });
    setRecapture(changeData);
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
                  <StyledText className="acc-content-header-item ct-actions">
                    Actions
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

      {/* Accordion body */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: "0rem" }}>
        {recapture &&
          recapture?.map((item, index) => {
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
                      borderBottomLeftRadius: index === (recapture.length - 1) ? "10px" : 0,
                      borderBottomRightRadius: index === (recapture.length - 1) ? "10px" : 0,
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
                          item?.code
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
                            {item?.info?.value}
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
                              {item?.info?.value}
                            </StyledText>
                          </Grid>
                          <Grid item xs={6} sm={12} md={12} lg={6} xl={6}>
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
                                  fontWeight: 700,
                                  lineHeight: "25px",
                                  letterSpacing: "0.02em",
                                  paddingLeft: "4px",
                                }}
                              >
                                {item?.info?.noted_by}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6} sm={12} md={12} lg={6} xl={6}>
                            <Box
                              sx={{
                                fontSize: "14px",
                                fontWeight: 500,
                                lineHeight: "25px",
                                letterSpacing: "0em",
                                display: "inline-block",
                                [theme.breakpoints.up("lg")]: {
                                  ml: 2,
                                  my: 1,
                                },
                              }}
                            >
                              Date:
                              <Typography
                                sx={{
                                  fontSize: "14px",
                                  fontWeight: 700,
                                  lineHeight: "25px",
                                  letterSpacing: "0.02em",
                                  paddingLeft: "4px",
                                }}
                              >
                                {item?.info?.noted_date}
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
                                color: "#00000099",
                              }}
                            >
                              Sources:
                              {item?.info?.sources?.map((source, index) => (
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
                          {tabs &&
                            tabs["patient_dashboard_view_document"]?.active && (
                              <Box
                                onClick={() => handleClinicalDoc(item)}
                                className="acc-content-links-docview-cta"
                                sx={{
                                  textAlign: "end",
                                  [theme.breakpoints.only("md")]: {
                                    display: "none",
                                  },
                                  cursor: "pointer",
                                }}
                              >
                                <DocIcon className="acc-content-links-docview-icon" />
                                <Typography
                                  className="acc-content-links-docview-text"
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
                            {item?.info?.total_weight}
                          </StyledText>
                        )}
                      </Grid>
                    )}
                    {/* Content - Actions */}
                    <Grid item className="acc-content-header-item ct-actions">
                      <Grid container className="acc-content-act-btns-wrap-otr">
                        <Grid item className="acc-content-act-btns-wrap">
                          <Box
                            sx={{
                              ...flexAlignCenter,
                              mt: 0.5,
                            }}
                            className="acc-content-act-btns"
                          >
                            {selectedRecapturecode?.some(
                              (ele) => ele.code === item.code
                            ) ? (
                              <StyledButton1
                                onClick={() => handleClickOpen1(item)}
                                startIcon={
                                  <StyleCircle
                                    sx={{
                                      background: "white",
                                      ...flexAlignCenter,
                                      justifyContent: "center",
                                      borderRadius: "100px",
                                    }}
                                  >
                                    <CorrectIcon state="active" />
                                  </StyleCircle>
                                }
                                className="acc-content-act-btn act-btn-active"
                              >
                                Accepted
                              </StyledButton1>
                            ) : !rejectRecaptureCode?.some((value, index) => {
                              let key = Object.keys(value)[0];
                              if (item.code === key) {
                                return true;
                              }
                            }) ? (
                              <StyledButton
                                onClick={() => handleClickOpen1(item)}
                                sx={{
                                  mr: 1,
                                  [theme.breakpoints.only("xl")]: {
                                    mr: 2,
                                  },
                                  background:
                                    tabs?.read_only?.active && "#D5D5D5 ",
                                }}
                                startIcon={
                                  <StyleCircle
                                    sx={{
                                      background: tabs?.read_only?.active ? '#ADADAD' : '#3D4A8F',
                                      ...flexAlignCenter,
                                      justifyContent: "center",
                                      borderRadius: "100px",
                                    }}
                                  >
                                    <CorrectIcon />
                                  </StyleCircle>
                                }
                                disabled={tabs?.read_only?.active}
                                className="acc-content-act-btn"
                              >
                                Accept
                              </StyledButton>
                            ) : null}
                            {!selectedRecapturecode?.some(
                              (ele) => ele?.code === item?.code
                            ) &&
                              (rejectRecaptureCode?.some((value, index) => {
                                let key = Object.keys(value)[0];
                                if (item?.code === key) {
                                  return true;
                                }
                              }) ? (
                                <StyledButton
                                  onClick={() =>
                                    handleRemoveDeletedCode(item, item?.code)
                                  }
                                  sx={{
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
                                        background: "#B90E0E",
                                        ...flexAlignCenter,
                                        justifyContent: "center",
                                        borderRadius: "100px",
                                        filter: "contrast(0.8)",
                                      }}
                                    >
                                      <CrossWhite />
                                    </StyleCircle>
                                  }
                                  className="acc-content-act-btn act-btn-active"
                                >
                                  Rejected
                                </StyledButton>
                              ) : (
                                <StyledButton
                                  onClick={() =>
                                    handleClickOpen(item, item?.code)
                                  }
                                  sx={{
                                    backgroundColor: theme.palette.primary.main,
                                    color: "#fff",
                                    ":hover": {
                                      backgroundColor:
                                        theme.palette.primary.main,
                                    },
                                    background:
                                      tabs?.read_only?.active && "#D5D5D5 ",
                                  }}
                                  startIcon={
                                    <StyleCircle
                                      sx={{
                                        background: tabs?.read_only?.active ? '#ADADAD' : '#434343',
                                        ...flexAlignCenter,
                                        justifyContent: "center",
                                        borderRadius: "100px",
                                      }}
                                    >
                                      <CrossWhite />
                                    </StyleCircle>
                                  }
                                  disabled={tabs?.read_only?.active}
                                  className="acc-content-act-btn"
                                >
                                  Reject
                                </StyledButton>
                              ))}
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  {/* Body content end */}
                </StyledAccordingBox>

                {Object.keys(item?.info?.alternate_codes)?.length > 0 && (
                  <MuiAccordions
                    tabs={tabs}
                    panel={item}
                    code={item?.code}
                    name="Show-Alternet-Codes"
                    expanded={expanded}
                    setExpanded={setExpanded}
                    sx={{
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
                        fontWeight: "600",
                        lineHeight: "21px",
                        letterSpacing: "0em",
                        textAlign: "left",
                        color: "#fff",
                        paddingRight: "10px",
                      },
                    }}
                    expandIcon={<ArrowDropDownIcon width={12} height={12} />}
                    header={`Show Alternate Codes (${Object.keys(item?.info?.alternate_codes)?.length
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
                                    <Grid item md={10} lg={9} xl={9}>
                                      <Box
                                        sx={{
                                          ...flexAlignCenter,
                                          mt: 0.5,
                                          justifyContent: "end",
                                        }}
                                      >
                                        {selectedRecapturecode?.some(
                                          (ele) => ele?.code === value?.code
                                        ) ? (
                                          <StyledButton1
                                            onClick={() =>
                                              handleClickOpen1(value)
                                            }
                                            startIcon={
                                              <StyleCircle
                                                sx={{
                                                  background: "white",
                                                  ...flexAlignCenter,
                                                  justifyContent: "center",
                                                  borderRadius: "100px",
                                                }}
                                              >
                                                <CorrectIcon state="active" />
                                              </StyleCircle>
                                            }
                                          >
                                            Accepted
                                          </StyledButton1>
                                        ) : !rejectRecaptureCode?.some(
                                          (val, index) => {
                                            let key = Object.keys(val)[0];
                                            if (value?.code === key) {
                                              return true;
                                            }
                                          }
                                        ) ? (
                                          <StyledButton
                                            onClick={() =>
                                              handleClickOpen1(value)
                                            }
                                            sx={{
                                              mr: 1,
                                              [theme.breakpoints.only("xl")]: {
                                                mr: 2,
                                              },
                                              background:
                                                tabs?.read_only?.active &&
                                                "#D5D5D5 ",
                                            }}
                                            startIcon={
                                              <StyleCircle
                                                sx={{
                                                  background: tabs?.read_only?.active ? '#ADADAD' : '#3D4A8F',
                                                  ...flexAlignCenter,
                                                  justifyContent: "center",
                                                  borderRadius: "100px",
                                                }}
                                              >
                                                <CorrectIcon />
                                              </StyleCircle>
                                            }
                                            disabled={tabs?.read_only?.active}
                                          >
                                            Accept
                                          </StyledButton>
                                        ) : null}
                                        {!selectedRecapturecode?.some(
                                          (ele) => ele?.code === value?.code
                                        ) &&
                                          (rejectRecaptureCode?.some(
                                            (val, index) => {
                                              let key = Object.keys(val)[0];
                                              if (value?.code === key) {
                                                return true;
                                              }
                                            }
                                          ) ? (
                                            <StyledButton
                                              onClick={() =>
                                                handleRemoveDeletedCode(
                                                  value,
                                                  item?.code
                                                )
                                              }
                                              sx={{
                                                backgroundColor:
                                                  theme.palette.primary.main,
                                                color: "#fff",
                                                ":hover": {
                                                  backgroundColor:
                                                    theme.palette.primary.main,
                                                },
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
                                              onClick={() =>
                                                handleClickOpen(
                                                  value,
                                                  item?.code
                                                )
                                              }
                                              sx={{
                                                backgroundColor:
                                                  theme.palette.primary.main,
                                                color: "#fff",
                                                ":hover": {
                                                  backgroundColor:
                                                    theme.palette.primary.main,
                                                },
                                                background:
                                                  tabs?.read_only?.active &&
                                                  "#D5D5D5 ",
                                              }}
                                              startIcon={
                                                <StyleCircle
                                                  sx={{
                                                    background: tabs?.read_only?.active ? '#ADADAD' : '#434343',
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
                                              Reject
                                            </StyledButton>
                                          ))}
                                      </Box>
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
                                <Grid
                                  item
                                  xs={12}
                                  sm={12}
                                  md={4.5}
                                  lg={3}
                                  xl={2.5}
                                  sx={{
                                    [theme.breakpoints.only("xl")]: {
                                      ml: 3,
                                    },
                                  }}
                                >
                                  <Box
                                    sx={{
                                      ...flexAlignCenter,
                                      mt: 1,
                                      justifyContent: "start",
                                    }}
                                  >
                                    {selectedRecapturecode?.some(
                                      (ele) => ele?.code === value?.code
                                    ) ? (
                                      <StyledButton1
                                        onClick={() => handleClickOpen1(value)}
                                        sx={{
                                          mr: 23,
                                          width: "50%",
                                        }}
                                        startIcon={
                                          <StyleCircle
                                            sx={{
                                              background: "white",
                                              ...flexAlignCenter,
                                              justifyContent: "center",
                                              borderRadius: "100px",
                                            }}
                                          >
                                            <CorrectIcon state="active" />
                                          </StyleCircle>
                                        }
                                      >
                                        Accepted
                                      </StyledButton1>
                                    ) : !rejectRecaptureCode?.some(
                                      (val, index) => {
                                        let key = Object.keys(val)[0];
                                        if (value?.code === key) {
                                          return true;
                                        }
                                      }
                                    ) ? (
                                      <StyledButton
                                        onClick={() => handleClickOpen1(value)}
                                        sx={{
                                          mr: 2,
                                          width: "50%",
                                          background:
                                            tabs?.read_only?.active && "#D5D5D5 ",
                                        }}
                                        startIcon={
                                          <StyleCircle
                                            sx={{
                                              background: tabs?.read_only?.active ? '#ADADAD' : '#3D4A8F',
                                              ...flexAlignCenter,
                                              justifyContent: "center",
                                              borderRadius: "100px",
                                            }}
                                          >
                                            <CorrectIcon />
                                          </StyleCircle>
                                        }
                                        disabled={tabs?.read_only?.active}
                                      >
                                        Accept
                                      </StyledButton>
                                    ) : null}
                                    {!selectedRecapturecode?.some(
                                      (ele) => ele?.code === value?.code
                                    ) &&
                                      (rejectRecaptureCode?.some(
                                        (val, index) => {
                                          let key = Object.keys(val)[0];
                                          if (value?.code === key) {
                                            return true;
                                          }
                                        }
                                      ) ? (
                                        <StyledButton
                                          onClick={() =>
                                            handleRemoveDeletedCode(
                                              value,
                                              item?.code
                                            )
                                          }
                                          sx={{
                                            backgroundColor:
                                              theme.palette.primary.main,
                                            color: "#fff",
                                            mr: 25,
                                            width: "50%",
                                            ":hover": {
                                              backgroundColor:
                                                theme.palette.primary.main,
                                            },
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
                                          onClick={() =>
                                            handleClickOpen(value, item?.code)
                                          }
                                          sx={{
                                            backgroundColor:
                                              theme.palette.primary.main,
                                            color: "#fff",
                                            width: "50%",
                                            ":hover": {
                                              backgroundColor:
                                                theme.palette.primary.main,
                                            },
                                            background:
                                              tabs?.read_only?.active &&
                                              "#D5D5D5 ",
                                          }}
                                          startIcon={
                                            <StyleCircle
                                              sx={{
                                                background: tabs?.read_only?.active ? '#ADADAD' : '#434343',
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
                                          Reject
                                        </StyledButton>
                                      ))}
                                  </Box>
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
                                    <Grid item md={4.9} lg={9} xl={10}>
                                      <Box
                                        sx={{
                                          ...flexAlignCenter,
                                          mt: 0.5,
                                          justifyContent: "end",
                                          [theme.breakpoints.only("md")]: {
                                            justifyContent: "end",
                                          },
                                        }}
                                      >
                                        {selectedRecapturecode?.some(
                                          (ele) => ele.code === value.code
                                        ) ? (
                                          <StyledButton1
                                            onClick={() =>
                                              handleClickOpen1(value)
                                            }
                                            startIcon={
                                              <StyleCircle
                                                sx={{
                                                  background: "white",
                                                  ...flexAlignCenter,
                                                  justifyContent: "center",
                                                  borderRadius: "100px",
                                                }}
                                              >
                                                <CorrectIcon state="active" />
                                              </StyleCircle>
                                            }
                                          >
                                            Accepted
                                          </StyledButton1>
                                        ) : !rejectRecaptureCode?.some(
                                          (val, index) => {
                                            let key = Object.keys(val)[0];
                                            if (value.code === key) {
                                              return true;
                                            }
                                          }
                                        ) ? (
                                          <StyledButton
                                            onClick={() =>
                                              handleClickOpen1(value)
                                            }
                                            sx={{
                                              mr: 1,
                                              [theme.breakpoints.only("xl")]: {
                                                mr: 2,
                                              },
                                              background:
                                                tabs?.read_only?.active &&
                                                "#D5D5D5 ",
                                            }}
                                            startIcon={
                                              <StyleCircle
                                                sx={{
                                                  background: tabs?.read_only?.active ? '#ADADAD' : '#3D4A8F',
                                                  ...flexAlignCenter,
                                                  justifyContent: "center",
                                                  borderRadius: "100px",
                                                }}
                                              >
                                                <CorrectIcon />
                                              </StyleCircle>
                                            }
                                            disabled={tabs?.read_only?.active}
                                          >
                                            Accept
                                          </StyledButton>
                                        ) : null}
                                        {!selectedRecapturecode?.some(
                                          (ele) => ele?.code === value?.code
                                        ) &&
                                          (rejectRecaptureCode?.some(
                                            (val, index) => {
                                              let key = Object.keys(val)[0];
                                              if (value?.code === key) {
                                                return true;
                                              }
                                            }
                                          ) ? (
                                            <StyledButton
                                              onClick={() =>
                                                handleRemoveDeletedCode(
                                                  value,
                                                  item?.code
                                                )
                                              }
                                              sx={{
                                                backgroundColor:
                                                  theme.palette.primary.main,
                                                color: "#fff",
                                                ":hover": {
                                                  backgroundColor:
                                                    theme.palette.primary.main,
                                                },
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
                                              onClick={() =>
                                                handleClickOpen(
                                                  value,
                                                  item?.code
                                                )
                                              }
                                              sx={{
                                                backgroundColor:
                                                  theme.palette.primary.main,
                                                color: "#fff",
                                                ":hover": {
                                                  backgroundColor:
                                                    theme.palette.primary.main,
                                                },
                                                background:
                                                  tabs?.read_only?.active &&
                                                  "#D5D5D5 ",
                                              }}
                                              startIcon={
                                                <StyleCircle
                                                  sx={{
                                                    background: tabs?.read_only?.active ? '#ADADAD' : '#434343',
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
                                              Reject
                                            </StyledButton>
                                          ))}
                                      </Box>
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
                                            {value?.total_weight}
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
                                  <Box
                                    sx={{
                                      ...flexAlignCenter,
                                      mt: 1,
                                      justifyContent: "start",
                                      [theme.breakpoints.only("md")]: {
                                        justifyContent: "start",
                                        ml: 12,
                                      },
                                    }}
                                  >
                                    {selectedRecapturecode?.some(
                                      (ele) => ele?.code === value?.code
                                    ) ? (
                                      <StyledButton1
                                        onClick={() => handleClickOpen1(value)}
                                        sx={{
                                          mr: 23,
                                          width: "50%",
                                        }}
                                        startIcon={
                                          <StyleCircle
                                            sx={{
                                              background: "white",
                                              ...flexAlignCenter,
                                              justifyContent: "center",
                                              borderRadius: "100px",
                                            }}
                                          >
                                            <CorrectIcon state="active" />
                                          </StyleCircle>
                                        }
                                      >
                                        Accepted
                                      </StyledButton1>
                                    ) : !rejectRecaptureCode?.some(
                                      (val, index) => {
                                        let key = Object.keys(val)[0];
                                        if (value?.code === key) {
                                          return true;
                                        }
                                      }
                                    ) ? (
                                      <StyledButton
                                        onClick={() => handleClickOpen1(value)}
                                        sx={{
                                          mr: 2,
                                          width: "50%",
                                          background:
                                            tabs?.read_only?.active && "#D5D5D5 ",
                                        }}
                                        startIcon={
                                          <StyleCircle
                                            sx={{
                                              background: tabs?.read_only?.active ? '#ADADAD' : '#3D4A8F',
                                              ...flexAlignCenter,
                                              justifyContent: "center",
                                              borderRadius: "100px",
                                            }}
                                          >
                                            <CorrectIcon />
                                          </StyleCircle>
                                        }
                                        disabled={tabs?.read_only?.active}
                                      >
                                        Accept
                                      </StyledButton>
                                    ) : null}
                                    {!selectedRecapturecode?.some(
                                      (ele) => ele.code === value.code
                                    ) &&
                                      (rejectRecaptureCode?.some(
                                        (val, index) => {
                                          let key = Object.keys(val)[0];
                                          if (value.code === key) {
                                            return true;
                                          }
                                        }
                                      ) ? (
                                        <StyledButton
                                          onClick={() =>
                                            handleRemoveDeletedCode(
                                              value,
                                              item?.code
                                            )
                                          }
                                          sx={{
                                            backgroundColor:
                                              theme.palette.primary.main,
                                            color: "#fff",
                                            mr: 24,
                                            ml: 0,
                                            width: "50%",
                                            ":hover": {
                                              backgroundColor:
                                                theme.palette.primary.main,
                                            },
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
                                          onClick={() =>
                                            handleClickOpen(value, item?.code)
                                          }
                                          sx={{
                                            backgroundColor:
                                              theme.palette.primary.main,
                                            color: "#fff",
                                            width: "50%",
                                            ":hover": {
                                              backgroundColor:
                                                theme.palette.primary.main,
                                            },
                                            background:
                                              tabs?.read_only?.active &&
                                              "#D5D5D5 ",
                                          }}
                                          startIcon={
                                            <StyleCircle
                                              sx={{
                                                background: tabs?.read_only?.active ? '#ADADAD' : '#434343',
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
                                          Reject
                                        </StyledButton>
                                      ))}
                                  </Box>
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
                            (rejectRecaptureData?.some((value) => {
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
                                      tabs?.read_only?.active && "#D5D5D5 ",
                                  }}
                                  startIcon={
                                    <StyleCircle
                                      sx={{
                                        background: tabs?.read_only?.active ? '#ADADAD' : '#434343',
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
                              <CorrectIcon state="active" />
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
                              (rejectRecaptureData?.some((value) => {
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
                                    backgroundColor: theme.palette.primary.main,
                                    color: "#fff",
                                    ":hover": {
                                      backgroundColor:
                                        theme.palette.primary.main,
                                    },
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
                                        tabs?.read_only?.active && "#D5D5D5 ",
                                    }}
                                    startIcon={
                                      <StyleCircle
                                        sx={{
                                          background: tabs?.read_only?.active ? '#ADADAD' : '#434343',
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
                                <CorrectIcon state="active" />
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
      {/* Accordion body end */}

      <DocumentModal
        fullScreen={fullScreen}
        open={open}
        handleClose1={handleClose1}
        clinicalDoc={clinicalDoc}
      />

      <DialogModal
        open={Deleteopen}
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
                <MenuItem value="Other">Other</MenuItem>
              </SelectField>
              {rejectReason === "Other" && (
                <InputField
                  // labelText='Please mention the reason for rejection'
                  placeholder="Please mention the reason for rejection"
                  onChange={(e) => handleOtherText(e)}
                  helperText={!error.isValid && error?.reason}
                  labelText="Please enter reject reason"
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
                Close
              </StyleButton>
              <StyleButton
                variant="contained"
                onClick={() =>
                  handleFunction ? handleDeleteAll() : handleDelete()
                }
                color="error"
                sx={{}}
              >
                Delete
              </StyleButton>
            </Box>
          </Box>
        </Box>
      </DialogModal>
    </Box>
  );
};

const flexAlignCenter = {
  display: "flex",
  alignItems: "center",
};
