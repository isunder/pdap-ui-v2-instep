import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import useMediaQuery from "@mui/material/useMediaQuery";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import {
  ArrowDropDownIcon,
  CorrectIcon,
  CrossWhite,
  MuiAccordions,
  PrimaryButton,
  DocIcon,
  DeleteIcon,
} from "../../components";
import "../../Screens/Codes/Codes.css";
import "./ExistingConditions.css";
import { patientExistingConditions } from "../../redux/userSlice/patientInfoSlice";
import { TabsSlag } from "../TabsSlag/TabsSlag";
import { patientClinicalDocument } from "../../redux/userSlice/petientClinicalSlice";
import {
  existingRejectInfo,
  existingValue,
} from "../../redux/userSlice/acceptCodesSlice";
import { existingReject } from "../../redux/userSlice/rejectCodesSlice";
import { ReasonTextVal } from "../../components/Validation/ReasonTextVal";
import { DialogModal } from "../../components/Modal/DialogModal";
import Documentmodal from "../../components/DocumentModal/DocumentModal";
import { SelectField } from "../../components/SelectField";
import { InputField } from "../../components/InputField";
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
import { addAuditLog1 } from "../../utils/indexedDb";
import { convertDate } from "../../utils/helper";

export const ExistingConditions = ({ sessionObject, handleAddEventData }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const tabs = TabsSlag();
  const userDetail = useSelector((state) => state?.user?.data?.userInfo);

  const [expanded, setExpanded] = useState(false);
  const [existingCondition, setExistingCondition] = useState([]);
  const [clinicalDoc, setClinicalDoc] = useState(null);
  const [rejectReason, setRejectReason] = useState("Insufficient Proof");
  const [otherText, setOtherText] = useState(null);
  const [error, setError] = useState({});
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [handleFunction, setHandleFunction] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedRejectData, setSelectedRejectData] = useState();
  const [selectedMainCode, setSelectedMainCode] = useState("");
  const [sessionObjLoaded, setSessionObjLoaded] = useState(false);
  const existingRejectCode = useSelector(
    (state) => state?.summary?.existingRejectCode
  );
  const { doctorDetail } = useSelector((state) => state?.doctor?.data);
  const [rejectExistingData, setExistingRejectData] =
    useState(existingRejectCode);

  const existingCode = useSelector((state) => state?.summary?.existing);
  const [selectedExistingcode, setSelectedExistingcode] = useState([]);

  const existingRejectData = useSelector(
    (state) => state?.reject?.existingReject
  );
  const [rejectExistingCode, setRejectExistingCode] = useState([]);

  const [checkedAcceptAll, setCheckedAcceptAll] = useState([]);

  const [buttonDisable, setButtonDisable] = useState(false)
  const { user } = useSelector((state) => state);


  const handleClickOpen = (item, code) => {
    setButtonDisable(false);

    if (!isNaN(item)) {
      let code = result[item];
      setHandleFunction(true);
      setSelectedRejectData(code);

      const exampleMetadata = {
        event_type: "EXISTING_CONDITION_REJECT_ALL_CODES",
        metadata: {
          identifier: tabs?.["user"]?.value || "",
          provider_name: doctorDetail?.doctor_name || "",
          patient_id: user?.data?.userInfo?.mrn || "",
          event_datetime: convertDate(new Date().toISOString()),
          code: item?.code,
          description: item?.value ? item?.value : item?.info?.value,
          reasonForRejection: '',
          raf: item?.info?.total_weight,
          alternateCodes: item?.info?.alternate_codes,
          parentCodesCount: ""
        }
      };

      handleAddEventData(exampleMetadata);
    } else {
      setSelectedRejectData(item);
      const exampleMetadata =
      {
        event_type: "EXISTING_CONDITION_REJECTION_REASON_SELECTION",
        metadata: {
          identifier: tabs?.["user"]?.value || "",
          provider_name: doctorDetail?.doctor_name || "",
          patient_id: user?.data?.userInfo?.mrn || "",
          event_datetime: convertDate(new Date().toISOString()),
          code: item?.code,
          description: item?.value ? item?.value : item?.info?.value,
          reasonForRejection: rejectReason,
          raf: item?.info?.total_weight,
          alternateCodes: item?.info?.alternate_codes,
          parentCodesCount: (existingCondition?.length + 1)
        }
      };

      handleAddEventData(exampleMetadata);
    }
    setSelectedMainCode(code);
    setDeleteOpen(true);

  };

  const handleRemoveDeletedCode = (item, id) => {

    if (userDetail?.mrn) {
      sessionObject = JSON.parse(
        localStorage.getItem(`sessionObject_${userDetail.mrn}`)
      );
      let code = sessionObject?.existingCodeReject?.some((value, index) => {
        let key = Object.keys(value)[0];
        if (item?.code === key) {
          return true;
        }
      });

      let codeList;
      if (code) {
        codeList = sessionObject?.existingCodeReject?.filter(
          (value) => Object.keys(value)[0] !== item?.code
        );

        let sessionExisting = sessionObject?.existingCode;
        let sessionSuspect = sessionObject?.suspectCode;
        let sessionSuspectReject = sessionObject?.suspectCodeReject;
        let sessionRecapture = sessionObject?.recaptureCode;
        let sessionRecaptureReject = sessionObject?.recaptureCodeReject;
        let sessionDuplicate = sessionObject?.duplicateCode;
        let sessionDuplicateReject = sessionObject?.duplicateCodeReject;
        let expirationDate = sessionObject?.expiresAt;

        sessionObject = {
          mrn: userDetail?.mrn,
          expiresAt: expirationDate,
          existingCode: sessionExisting,
          existingCodeReject: codeList,
          suspectCode: sessionSuspect,
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
        setRejectExistingCode(codeList);
      }

      const updatedRejectData = rejectExistingData?.map((itemData) => {
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
            let isMainCode = rejectExistingData?.some(
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
              setExistingRejectData([...updatingData]);
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
              setExistingRejectData([...changeData]);
            }
          } else {
            if (updatedRejectData[id]?.alternate_codes?.length === 0) {
              const newData = rejectExistingData?.filter(
                (val) => Object.keys(val)[0] !== item?.code
              );
              setExistingRejectData(newData);
            } else {
              codeValue[id].delete_code = false;
              setExistingRejectData([...rejectExistingData]);
            }
          }
        }
      }
    }


    const exampleMetadata = {
      event_type: "EXISTING_CONDITION_REJECT-CODE",
      metadata: {
        identifier: tabs?.["user"]?.value || "",
        provider_name: doctorDetail?.doctor_name || "",
        patient_id: user?.data?.userInfo?.mrn || "",
        event_datetime: convertDate(new Date().toISOString()),
        code: item?.code,
        description: item?.value ? item?.value : item?.info?.value,
        reasonForRejection: '',
        raf: item?.info?.total_weight,
        alternateCodes: item?.info?.alternate_codes,
        parentCodesCount: (existingCondition?.length + 1)
      }
    };

    handleAddEventData(exampleMetadata);
  };

  const handleClose = () => {
    rejectReason !== "Insufficient Proof" &&
      setRejectReason("Insufficient Proof");
    otherText?.length > 0 && setOtherText(null);
    setError({});
    setDeleteOpen(false);

    const exampleMetadata = {
      event_type: "EXISTING_CONDITION_REJECTION_REASON_CANCEL", metadata: {
        identifier: tabs?.["user"]?.value || "",
        provider_name: doctorDetail?.doctor_name || "",
        patient_id: user?.data?.userInfo?.mrn || "",
        event_datetime: convertDate(new Date().toISOString()),
        parentCodesCount: (existingCondition?.length + 1)
      }
    };

    handleAddEventData(exampleMetadata)

  };

  const handleClickOpen1 = (item) => {

    if (userDetail?.mrn) {
      sessionObject = JSON.parse(
        localStorage.getItem(`sessionObject_${userDetail.mrn}`)
      );
      let code = sessionObject?.existingCode?.some((value, index) => {
        if (item?.code === value?.code) {
          return true;
        }
      });
      let codeList,
        updateVal = [];
      let sessionExistingReject = sessionObject?.existingCodeReject;
      let sessionSuspect = sessionObject?.suspectCode;
      let sessionSuspectReject = sessionObject?.suspectCodeReject;
      let sessionRecapture = sessionObject?.recaptureCode;
      let sessionRecaptureReject = sessionObject?.recaptureCodeReject;
      let sessionDuplicateReject = sessionObject?.duplicateCodeReject;
      let sessionDuplicate = sessionObject?.duplicateCode;
      let expirationDate = sessionObject?.expiresAt;
      if (code) {
        codeList = sessionObject?.existingCode?.filter(
          (value) => value?.code !== item?.code
        );
        updateVal = codeList;
        setSelectedExistingcode(codeList);

        const exampleMetadata = {
          event_type: "EXISTING_CONDITION_ACCEPT_CODE", metadata: {
            identifier: tabs?.["user"]?.value || "",
            provider_name: doctorDetail?.doctor_name || "",
            patient_id: user?.data?.userInfo?.mrn || "",
            event_datetime: convertDate(new Date().toISOString()),
            code: item?.code,
            description: item?.value ? item?.value : item?.info?.value,
            reasonForRejection: '',
            raf: item?.info?.total_weight,
            alternateCodes: item?.info?.alternate_codes,
            parentCodesCount: (existingCondition?.length + 1)
          }
        };

        handleAddEventData(exampleMetadata);

      } else {

        codeList = {
          code: item?.code,
          value: item?.value ? item?.value : item?.info?.value,
          additional_info: item?.remarks ? item?.remarks : item?.info?.remarks,
        };
        updateVal =
          selectedExistingcode?.length > 0
            ? [...selectedExistingcode, codeList]
            : [codeList];
        setSelectedExistingcode(updateVal);

        const exampleMetadata = {
          event_type: "EXISTING_CONDITION_ACCEPT_CODE", metadata: {
            identifier: tabs?.["user"]?.value || "",
            provider_name: doctorDetail?.doctor_name || "",
            patient_id: user?.data?.userInfo?.mrn || "",
            event_datetime: convertDate(new Date().toISOString()),
            code: item?.code,
            description: item?.value ? item?.value : item?.info?.value,
            reasonForRejection: '',
            raf: item?.info?.total_weight,
            alternateCodes: item?.info?.alternate_codes,
            parentCodesCount: (existingCondition?.length + 1)
          }
        };

        handleAddEventData(exampleMetadata);
      }

      sessionObject = {
        mrn: userDetail?.mrn,
        expiresAt: expirationDate,
        existingCode: updateVal,
        existingCodeReject: sessionExistingReject,
        suspectCode: sessionSuspect,
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
    }
  };

  const handleClose1 = () => {
    setOpen(false);
  };

  const state = useSelector((state) => state?.user?.data?.existingCondition);
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

  result?.length !== existingCondition?.length && setExistingCondition(result);

  function checkCodesAvailability(input1, input2) {
    const result = input1?.map((item) => {
      const mainCode = item?.code;
      const alternateCodes = item?.info.alternate_codes || [];
      const isMainCodeAvailable = input2?.some((obj) => obj?.code === mainCode);
      const areAlternateCodesAvailable = alternateCodes.every((alternateCode) =>
        input2?.some((obj) => obj?.code === alternateCode?.code)
      );

      return {
        mainCode,
        isMainCodeAvailable,
        areAlternateCodesAvailable,
      };
    });
    result?.length !== checkedAcceptAll?.length && setCheckedAcceptAll(result);
    return result;
  }

  const handleClickAll = (index) => {
    let value = result[index];
    let allValue = [value, value?.info?.alternate_codes];
    let allCodes = allValue?.flat(1);
    let codeList = allCodes?.filter((item) => {
      let isExist = selectedExistingcode?.some((value, index) => {
        if (item?.code === value?.code) {
          return true;
        }
      });
      if (!isExist) {
        return {
          code: item?.code,
          value: item?.value ? item?.value : item?.info?.value,
          additional_info: item?.remarks ? item?.remarks : item?.info?.remarks,
        };
      }
    });

    let rejectedCodes = rejectExistingCode.filter((value) => {
      let acceptedCodes = allCodes?.some(
        (item) => item?.code === Object.keys(value)[0]
      );
      if (!acceptedCodes) {
        return value;
      }
    });
    setRejectExistingCode([...rejectedCodes]);
    codeList.length &&
      setSelectedExistingcode([...selectedExistingcode, ...codeList]);

  };

  useEffect(() => {
    dispatch(patientExistingConditions());
  }, []);

  useEffect(() => {
    if (sessionObject && !sessionObjLoaded && Object.keys(sessionObject).length > 0) {
      let newExisting =
        existingCode?.length > 0 && sessionObject?.existingCode?.length > 0
          ? [...sessionObject?.existingCode, ...existingCode]
          : existingCode?.length > 0
            ? existingCode
            : sessionObject?.existingCode || [];
      selectedExistingcode?.length === 0 &&
        setSelectedExistingcode([...newExisting]);

      let newExistingReject =
        rejectExistingCode?.length > 0 &&
          sessionObject?.existingCodeReject?.length > 0
          ? [...sessionObject?.existingCodeReject, ...rejectExistingCode]
          : rejectExistingCode?.length > 0
            ? rejectExistingCode
            : sessionObject?.existingCodeReject || [];
      rejectExistingCode?.length === 0 &&
        setRejectExistingCode([...newExistingReject]);
      checkCodesAvailability(existingCondition, existingCode);
      setSessionObjLoaded(true);
    }
  }, [sessionObject]);

  useEffect(() => {
    let sessionExisting = existingCode?.length > 0 ? existingCode : [];
    selectedExistingcode?.length !== sessionExisting?.length &&
      setSelectedExistingcode([...sessionExisting]);

    let newExistingReject =
      existingRejectData?.length > 0 ? existingRejectData : [];
    rejectExistingCode?.length !== newExistingReject?.length &&
      setRejectExistingCode([...newExistingReject]);
  }, [existingCode.length, existingRejectData.length]);

  useEffect(() => {
    dispatch(existingValue(selectedExistingcode));
    dispatch(existingReject(rejectExistingCode));
    dispatch(existingRejectInfo(rejectExistingData));
  }, [selectedExistingcode, rejectExistingCode]);

  const handleCollapse = (code) => {

    let val;

    let changeData = existingCondition?.map((value) => {
      return value?.code === code
        ? ((value.collapse = !value?.collapse), value)
        : value;
    });

    const changeData2 = existingCondition?.filter((value) => {
      return value?.code === code
    });

    setExistingCondition(changeData);

    const exampleMetadata = {
      event_type: changeData2[0]?.collapse ? "EXISTING_CONDITION_SEE_ALL_DETAILS" : "EXISTING_CONDITION_SEE_LESS_DETAILS", metadata: {
        identifier: tabs?.["user"]?.value,
        provider_name: doctorDetail?.doctor_name || "",
        patient_id: user?.data?.userInfo?.mrn || "",
        event_datetime: convertDate(new Date().toISOString()),
        code: changeData2[0]?.code,
        description: changeData2[0]?.info?.value,
        reasonForRejection: '',
        raf: changeData2[0]?.info?.total_weight,
        alternateCodes: changeData2[0]?.info.alternate_codes,
        parentCodesCount: changeData?.length + 1
      }
    };

    handleAddEventData(exampleMetadata);

  };

  const handleIsCollapse = (data) => {
    let code = data?.value;
    let changeData = existingCondition?.map((value) => {
      const isValid = value?.info?.alternate_codes?.find(
        (obj) => obj.code === code.code
      );
      if (isValid) {
        return (isValid.isCollapse = !isValid?.isCollapse), value;
      }
      return value;
    });

    setExistingCondition(changeData);

    const exampleMetadata = {
      event_type: "EXISTING_CONDITION_SEE_ALL_DETAILS", metadata: {
        identifier: tabs?.["user"]?.value || "",
        provider_name: doctorDetail?.doctor_name || "",
        patient_id: user?.data?.userInfo?.mrn || "",
        event_datetime: convertDate(new Date().toISOString()),
        code: code,
        description: "",
        reasonForRejection: '',
        raf: "",
        alternateCodes: "",
        parentCodesCount: (existingCondition?.length + 1)
      }
    };

    handleAddEventData(exampleMetadata);

  };

  const handleClinicalDoc = async (item) => {
    let data = await dispatch(
      patientClinicalDocument({
        code: item?.code,
        code_type: "existing-conditions",
      })
    );
    setClinicalDoc(data.payload);
    setOpen(true);
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
      let existingCodes = selectedExistingcode?.filter((value) => {
        let altExist = altCode?.some((item) => item?.code === value?.code);
        if (!altExist) {
          if (selectedRejectData?.code !== value?.code) {
            return value;
          }
        }
      });

      let rejectedData = rejectExistingData?.filter(
        (value) => Object.keys(value)[0] !== selectedRejectData?.code
      );
      let rejectedAltData = rejectExistingCode?.filter((value) => {
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

      setSelectedExistingcode([...existingCodes]);
      setExistingRejectData([...rejectedData, rejectList]);
      setRejectExistingCode([
        ...rejectedAltData,
        ...altRejectCode,
        altRejectList,
      ]);
      rejectReason !== "Insufficient Proof" &&
        setRejectReason("Insufficient Proof");
      otherText?.length > 0 && setOtherText(null);
      setHandleFunction(false);
      setDeleteOpen(false);

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
      return
    } else {
      let code = rejectExistingData?.some((value, index) => {
        let key = Object.keys(value)[0];
        if (selectedMainCode === key) {
          return true;
        }
      });
      if (code) {
        if (selectedRejectData?.value) {
          const updatedRejectData = rejectExistingData?.map((item) => {
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
                        code: selectedRejectData?.code,
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
          setExistingRejectData([...updatedRejectData]);
        } else {
          const codeValue = rejectExistingData?.find(
            (itemData) => Object.keys(itemData)[0] === selectedMainCode
          );
          let changeData = rejectExistingData?.map((value) => {
            return Object.keys(codeValue)[0] === Object.keys(value)[0]
              ? {
                [selectedMainCode]: {
                  ...value[selectedMainCode],
                  delete_code: true,
                },
              }
              : value;
          });
          setExistingRejectData([...changeData]);
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
                  code: selectedRejectData?.code,
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
        setExistingRejectData([...rejectExistingData, rejectlist]);
        rejectReason !== "Insufficient Proof" &&
          setRejectReason("Insufficient Proof");
        otherText?.length > 0 && setOtherText(null);
      }

      let codeList = {
        [selectedRejectData.code]: {
          value: selectedRejectData?.value
            ? selectedRejectData?.value
            : selectedRejectData?.info?.value,
          reason: reason,
        },
      };
      setRejectExistingCode([...rejectExistingCode, codeList]);
      setDeleteOpen(false);
      rejectReason !== "Insufficient Proof" &&
        setRejectReason("Insufficient Proof");
      otherText?.length > 0 && setOtherText(null);

      const exampleMetadata = {
        event_type: "EXISTING_CONDITION_REJECTION_REASON_DELETION", metadata: {
          identifier: tabs?.["user"]?.value || "",
          provider_name: doctorDetail?.doctor_name || "",
          patient_id: user?.data?.userInfo?.mrn || "",
          event_datetime: convertDate(new Date().toISOString()),
          code: selectedRejectData?.code,
          description: selectedRejectData?.info?.remarks,
          reasonForRejection: reason,
          raf: selectedRejectData?.info?.total_weight,
          alternateCodes: selectedRejectData?.info?.alternate_codes,
          parentCodesCount: (existingCondition?.length + 1)
        }
      };

      handleAddEventData(exampleMetadata);

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
                  <StyledText sx={{ paddingLeft: "6px !important" }} className="acc-content-header-item ct-code">
                    Code(s)
                  </StyledText>
                  <StyledText sx={{
                    [theme.breakpoints.only("xs")]: {
                      borderRight: "2px solid black"
                    },
                  }} className="acc-content-header-item ct-desc">
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
        {existingCondition &&
          existingCondition?.map((item, index) => {
            return (
              <Box key={index} className="acc-content-inr">
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
                      borderBottomLeftRadius: Object.keys(item?.info?.alternate_codes).length > 0 ? 0 : "10px",
                      borderBottomRightRadius: Object.keys(item?.info?.alternate_codes).length > 0 ? 0 : "10px",

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
                            mt: "9px",
                          },
                          [theme.breakpoints.up("md")]: {
                            mr: 2,
                            mt: "9px",
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

                              [theme.breakpoints.up("md")]: {
                                fontSize: "90%",
                              },

                            }}
                          >
                            {item?.info?.value}
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
                        <Grid sx={{ gap: "10px !important", marginTop: "7px" }} container>
                          {/* Expanded view */}
                          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <StyledText
                              sx={{
                                fontWeight: 400,
                                width: "100%",
                                // maxWidth: "35rem",
                                padding: "0 !important",
                                margin: "0 !important",
                                textTransform: "inherit",
                                display: "inline-block",
                                verticalAlign: "bottom",
                              }}
                            >
                              {item?.info?.value}
                            </StyledText>
                          </Grid>

                          {
                            !item?.info['hide_noted_by_&_noted_date'] &&
                            <>
                              <Grid item xs={6} sm={12} md={12} lg={6} xl={6}>
                                <Box
                                  sx={{
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
                                      padding: "0px",
                                      margin: "0px",
                                      paddingLeft: "4px"
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

                                  }}
                                >
                                  Date:
                                  <Typography
                                    sx={{
                                      fontSize: "14px",
                                      fontWeight: 500,
                                      lineHeight: "25px",
                                      letterSpacing: "0.02em",
                                      paddingLeft: "4px",
                                    }}
                                  >
                                    {item?.info?.noted_date}
                                  </Typography>
                                </Box>
                              </Grid>
                            </>
                          }

                          {

                            !item?.info?.hide_remarks && (
                              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Box
                                  sx={{

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
                            )}

                          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Box
                              sx={{

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
                              fontWeight: 600,
                              textDecorationLine: "underline",
                              color: "#3D4A8F",

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
                              marginTop: "7px",
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
                            {selectedExistingcode?.some(
                              (ele) => ele.code === item.code
                            ) ? (
                              <StyledButton1
                                sx={{ border: "none !important", width: "105px !important" }}
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
                                    <CorrectIcon />
                                  </StyleCircle>
                                }
                                className="acc-content-act-btn act-btn-active"
                              >
                                Accepted
                              </StyledButton1>
                            ) : !rejectExistingCode?.some((value, index) => {
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
                                    <CorrectIcon state="white" />
                                  </StyleCircle>
                                }
                                disabled={tabs?.read_only?.active}
                                className="acc-content-act-btn"
                              >
                                Accept
                              </StyledButton>
                            ) : null}
                            {!selectedExistingcode?.some(
                              (ele) => ele?.code === item?.code
                            ) &&
                              (rejectExistingCode?.some((value, index) => {
                                let key = Object.keys(value)[0];
                                if (item?.code === key) {
                                  return true;
                                }
                              }) ? (
                                <StyledButton
                                  onClick={() =>
                                    handleRemoveDeletedCode(item, item?.code)
                                  }
                                  disabled={tabs?.read_only?.active}
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
                        fontWeight: "600",
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
                      item?.info?.alternate_codes?.map(
                        (value, altCodeIndex) => (
                          <Box key={altCodeIndex}>
                            <StyledAccordingBox>
                              {/* Alternate code content start */}
                              <Grid
                                container
                                spacing={0}
                                className="ContentBody"
                                sx={{
                                  padding: "10px 10px 10px",
                                  backgroundColor: "#fff",

                                }}
                              >
                                {/* Alt code Content - Code */}
                                <Grid
                                  item
                                  className="acc-content-header-item ct-code"
                                >
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
                                    {value?.code?.length > 11 ? (
                                      <Tooltip title={value?.code}>
                                        {value?.code}
                                      </Tooltip>
                                    ) : (
                                      value?.code
                                    )}
                                  </StyleCode>
                                </Grid>

                                {/* Alt code Content - Description */}
                                <Grid
                                  item
                                  className="acc-content-header-item ct-desc"
                                >
                                  {/* Collapsed view */}
                                  {!value?.isCollapse ? (
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
                                          textOverflow: "ellipsis",
                                          whiteSpace: "nowrap",
                                          textTransform: "inherit",
                                          display: "inline-block",
                                          verticalAlign: "bottom",
                                        }}
                                      >
                                        {value?.value}
                                      </StyledText>
                                      <StyledText
                                        sx={{
                                          fontWeight: 600,
                                          textDecorationLine: "underline",
                                          color: theme.palette.secondary.main,
                                          display: "inline-block",
                                          cursor: "pointer",
                                          flexShrink: 0,
                                          [theme.breakpoints.up("md")]: {
                                            ml: "20px",
                                          },
                                        }}
                                        onClick={() =>
                                          handleIsCollapse({ value })
                                        }
                                      >
                                        See All
                                      </StyledText>
                                    </Box>
                                  ) : (
                                    <Grid container>
                                      {/* Expanded view */}
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
                                            // maxWidth: "35rem",
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
                                        sm={12}
                                        md={12}
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
                                              fontWeight: 700,
                                              lineHeight: "25px",
                                              letterSpacing: "0.02em",
                                              paddingLeft: "4px",
                                            }}
                                          >
                                            {value?.noted_by}
                                          </Typography>
                                        </Box>
                                      </Grid>
                                      <Grid
                                        item
                                        xs={6}
                                        sm={12}
                                        md={12}
                                        lg={6}
                                        xl={6}
                                      >
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
                                            {value?.remarks}
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
                                            (source, sindex) => (
                                              <Typography
                                                key={sindex}
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
                                      {tabs &&
                                        tabs["patient_dashboard_view_document"]
                                          ?.active && (
                                          <Box
                                            onClick={() =>
                                              handleClinicalDoc(value)
                                            }
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
                                          fontWeight: 600,
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
                                    </Grid>
                                  )}
                                </Grid>

                                {/* Alt code Content - RAF */}
                                {tabs &&
                                  tabs["patient_dashboard_weights"]?.active && (
                                    <Grid
                                      item
                                      sx={{
                                        [theme.breakpoints.only("sm")]: {
                                          pl: "10px",
                                        }
                                        ,
                                        [theme.breakpoints.only("md")]: {
                                          pl: "2px !impotant",
                                        },

                                        [theme.breakpoints.only("lg")]: {
                                          pl: "2px !impotant",
                                        }
                                      }}
                                      className="acc-content-header-item ct-raf"

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

                                              [theme.breakpoints.only("md")]: {
                                                pl: "2px !impotant",
                                              },

                                              [theme.breakpoints.only("lg")]: {
                                                pl: "2px !impotant",
                                              }
                                            }}
                                          >
                                            {value?.total_weight}
                                          </StyledText>
                                        )}
                                    </Grid>
                                  )}

                                {/* Alt code Content - Actions */}
                                <Grid
                                  item
                                  className="acc-content-header-item ct-actions"
                                >
                                  <Grid
                                    container
                                    className="acc-content-act-btns-wrap-otr"
                                  >
                                    <Grid
                                      item
                                      className="acc-content-act-btns-wrap"
                                    >
                                      <Box
                                        sx={{
                                          ...flexAlignCenter,
                                          mt: 0.5,
                                        }}
                                        className="acc-content-act-btns"
                                      >
                                        {selectedExistingcode?.some(
                                          (ele) => ele?.code === value?.code
                                        ) ? (
                                          <StyledButton1
                                            sx={{ width: "105px !important" }}
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
                                            className="acc-content-act-btn act-btn-active"
                                          >
                                            Accepted
                                          </StyledButton1>
                                        ) : !rejectExistingCode?.some(
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
                                            className="acc-content-act-btn"
                                          >
                                            Accept
                                          </StyledButton>
                                        ) : null}
                                        {!selectedExistingcode?.some(
                                          (ele) => ele?.code === value?.code
                                        ) &&
                                          (rejectExistingCode?.some(
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
                                                  value?.code
                                                )
                                              }
                                              sx={{
                                                backgroundColor:
                                                  theme.palette.error.active1,
                                                color: "#fff",
                                                ":hover": {
                                                  backgroundColor:
                                                    theme.palette.error.main,
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
                                                handleClickOpen(
                                                  value,
                                                  value?.code
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
                                                    background: "#434343",
                                                    ...flexAlignCenter,
                                                    justifyContent: "center",
                                                    borderRadius: "100px",
                                                  }}
                                                >
                                                  <CrossWhite />
                                                </StyleCircle>
                                              }
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
                              {/* Alternate code content end */}
                            </StyledAccordingBox>
                          </Box>
                        )
                      )}

                    <Grid
                      container
                      spacing={0}
                      className="ContentBody"
                      sx={{
                        padding: "10px 10px 10px",
                        backgroundColor: "#fff",
                        borderRadius: "0px 0px 10px 10px",
                        marginBottom: "2px",
                        marginTop: "1px",
                        justifyContent: "center",
                        textAlign: "center",
                        [theme.breakpoints.down("md")]: {
                          display: "none",
                        },
                      }}
                    >
                      {!(
                        checkedAcceptAll?.[index]?.isMainCodeAvailable &&
                        checkedAcceptAll?.[index]?.areAlternateCodesAvailable
                      ) ? (
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                          {tabs &&
                            tabs["patient_dashboard_accept_all"]?.active &&
                            (rejectExistingData &&
                              rejectExistingData?.some((value) => {
                                if (Object.keys(value)[0] === item?.code) {
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
                          sx={{ mr: 2, width: "105px !important", height: "2rem" }}
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
                          checkedAcceptAll?.[index]?.isMainCodeAvailable &&
                          checkedAcceptAll?.[index]?.areAlternateCodesAvailable
                        ) ? (
                          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            {tabs &&
                              tabs["patient_dashboard_accept_all"]?.active &&
                              (rejectExistingData &&
                                rejectExistingData?.some((value) => {
                                  if (Object.keys(value)[0] === item?.code) {
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

      <Documentmodal
        fullScreen={fullScreen}
        open={open}
        handleClose1={handleClose1}
        clinicalDoc={clinicalDoc}
      />
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
            gap: 2,
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
                disabled={buttonDisable}
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
