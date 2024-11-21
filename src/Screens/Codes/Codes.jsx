import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Container,
  Grid,
  Typography,
  styled,
  useTheme,
  Button,
  Tooltip,
  Skeleton,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import {
  ArrowDropUpIcon
} from "../../components";
import Drawer from "@mui/material/Drawer";
import { MuiAccordions } from "../../components/MuiAccordions/MuiAccordions";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import moment from "moment";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAppContext from "../../hooks/useAppContext";
import { ClipLoader } from 'react-spinners';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import {
  AddressedCodes,
  CodesNotList,
  DuplicateCodes,
  ExistingConditions,
  SubHeader,
  Suspects,
  DeletedCodes,
  Header
} from "../../container";
import { WarningIcon } from "../../components";
import { PrimaryButton } from "../../components/Button";
import { ArrowDropDownIcon, CrossIcon } from "../../../src/components/Icons";
import "./Codes.css";
import { patientSummary, patientTabFlag } from "../../redux/userSlice/patientInfoSlice";
import {
  existingRejectInfo,
  existingValue,
  recaptureValue,
  suspectValue,
  duplicateValue,
} from "../../redux/userSlice/acceptCodesSlice";
import { patientSubmitData } from "../../redux/userSlice/patientSumbitSlice";
import {
  existingReject,
  recaptureReject,
  suspectReject,
  duplicateReject,
} from "../../redux/userSlice/rejectCodesSlice";
import { GreenDoneIcon } from "../../../src/components/Icons";
import { TabsSlag } from "../../container/TabsSlag/TabsSlag";
import { DialogModal } from "../../components/Modal/DialogModal";
import SubmitModal from "../../components/SubmitModal/SubmitModal";
import { addAuditLog1, getAuditLog1, addAuditLog2, getAuditLog2 } from "../../utils/indexedDb";
import { fetchAuditLogs } from "../../redux/userSlice/auditLogSlice";
import { convertDate, isSlugOrJwt } from "../../utils/helper";
import { IdleModal } from "../../components/idleModal/IdleModal";
import { refreshSSOToken } from "../../redux/userSlice/refreshToken";
import { useLocation, useNavigate } from "react-router-dom";
import { History, NotFound, MyProfile } from "../../Screens";
import { Visibility } from "@mui/icons-material";
import 'bootstrap/dist/css/bootstrap.min.css';
import zIndex from "@mui/material/styles/zIndex";
import { Scans } from "../../container/Scan";

const StyledText = styled("Box")(() => ({
  fontSize: "0.96rem",
  lineHeight: "1.3rem",
  fontWeight: 400,
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

const StyleSheetNumber1 = styled("Span")(({ theme }) => ({
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

const StyleButton = styled(Button)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "2.5rem",
  fontSize: "1rem",
  fontWeight: 600,
  borderRadius: "0.5rem",
}));

export const Codes = () => {
  const tabs = TabsSlag();
  const dispatch = useDispatch();
  const queryString = window.location.search;
  const slug = isSlugOrJwt();
  const theme = useTheme();
  const { user } = useSelector((state) => state);
  const [openSubmitModal, setOpenSubmitModal] = useState();
  const [closeSubmitModal, setCloseSubmitModal] = useState(false);
  const { state, setState } = useAppContext();
  const [codesDataLoaded, setCodesDataLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalSubmit, setIsModalSubmit] = useState(false);
  const { doctorDetail } = useSelector((state) => state?.doctor?.data);
  const userDetail = useSelector((state) => state?.user?.data?.userInfo);
  const [combinedDatahoag, setCombinedDatahoag] = useState([]);
  const [combinedData2hoag, setCombinedData2hoag] = useState([]);

  const sessionObject = JSON.parse(
    localStorage.getItem(`sessionObject_${userDetail?.mrn}`)
  );
  const tabData = useSelector((state) => state.user.data.tabs);
  const recaptureCode = useSelector((state) => state?.summary?.recapture);
  const recaptureCodeReject = useSelector(
    (state) => state?.reject.recaptureReject
  );

  const existingCode = useSelector((state) => state?.summary?.existing);
  const existingCodeReject = useSelector(
    (state) => state?.reject?.existingReject
  );
  const suspectCode = useSelector((state) => state?.summary.suspect);
  const suspectCodeReject = useSelector(
    (state) => state?.reject?.suspectReject
  );
  const duplicateCode = useSelector((state) => state?.summary?.duplicate);
  const duplicateCodeReject = useSelector(
    (state) => state?.reject.duplicateReject
  );
  const navigate = useNavigate();
  const location = useLocation();

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

  const [switchModal, setSwitchModal] = useState(true);
  const [idleModal, setIdleModal] = useState(false);
  const [hoagmodalarrow, setHoagmodalarrow] = useState(false);

  const [existingRejectCode, setExistingRejectCode] = useState([]);
  const [recaptureRejectCode, setRecaptureRejectCode] = useState([]);
  const [duplicateRejectCode, setDuplicateRejectCode] = useState([]);
  const existingRejectData = useSelector(
    (state) => state?.summary?.existingRejectCode
  );
  const [rejectExistingData, setExistingRejectData] =
    useState(existingRejectData);
  const [sumCount, setSumCount] = useState(0);
  const [dialog, setDialog] = useState(false);
  const isLoading = useSelector((state) => state?.summary?.isLoading);
  const codesSkeletonData = [
    {
      height: 40,
      marginBottom: "10px",
    },
    {
      height: 100,
      marginBottom: "8px",
    },
    {
      height: 100,
      marginBottom: "8px",
    },
    {
      height: 100,
      marginBottom: "8px",
    },
    {
      height: 100,
      marginBottom: "8px",
    },
  ];

  const objToArr = (state) => {
    let array = [];
    state &&
      state?.map((value, index) => {
        let key = Object.keys(value);
        array.push({
          code: key[0],
          value: value[key]?.value,
          reason: value[key]?.reason,
        });
      });
    return array;
  };
  const sessionHistory = () => {
    let newExisting =
      existingCode?.length > 0 && sessionObject?.existingCode?.length > 0
        ? [...sessionObject?.existingCode, ...existingCode]
        : existingCode?.length > 0
          ? existingCode
          : sessionObject?.existingCode || [];

    let sessionExisting = newExisting?.filter((item, index, self) => {
      return index === self.findIndex((t) => t.code === item.code);
    });

    let newExistingReject =
      existingCodeReject?.length > 0 &&
        sessionObject?.existingCodeReject?.length > 0
        ? [...sessionObject?.existingCodeReject, ...existingCodeReject]
        : existingCodeReject?.length > 0
          ? existingCodeReject
          : sessionObject?.existingCodeReject || [];

    let sessionExistingReject = newExistingReject?.filter(
      (item, index, self) => {
        let key = Object.keys(item);
        return index === self.findIndex((t) => Object.keys(t)[0] === key[0]);
      }
    );

    let newRecapture =
      recaptureCode?.length > 0 && sessionObject?.recaptureCode?.length > 0
        ? [...sessionObject?.recaptureCode, ...recaptureCode]
        : recaptureCode?.length > 0
          ? recaptureCode
          : sessionObject?.recaptureCode || [];

    let sessionRecapture = newRecapture?.filter((item, index, self) => {
      return index === self.findIndex((t) => t.code === item.code);
    });

    let newRecaptureReject =
      recaptureCodeReject?.length > 0 &&
        sessionObject?.recaptureCodeReject?.length > 0
        ? [...sessionObject?.recaptureCodeReject, ...recaptureCodeReject]
        : recaptureCodeReject?.length > 0
          ? recaptureCodeReject
          : sessionObject?.recaptureCodeReject || [];

    let sessionRecaptureReject = newRecaptureReject?.filter(
      (item, index, self) => {
        let key = Object.keys(item);
        return index === self.findIndex((t) => Object.keys(t)[0] === key[0]);
      }
    );

    let newSuspect =
      suspectCode?.length > 0 && sessionObject?.suspectCode?.length > 0
        ? [...sessionObject?.suspectCode, ...suspectCode]
        : suspectCode?.length > 0
          ? suspectCode
          : sessionObject?.suspectCode || [];

    let sessionSuspect = newSuspect?.filter((item, index, self) => {
      return index === self.findIndex((t) => t.code === item.code);
    });

    let newSuspectReject =
      suspectCodeReject?.length > 0 &&
        sessionObject?.suspectCodeReject?.length > 0
        ? [...sessionObject?.suspectCodeReject, ...suspectCodeReject]
        : suspectCodeReject?.length > 0
          ? suspectCodeReject
          : sessionObject?.suspectCodeReject || [];

    let sessionSuspectReject = newSuspectReject?.filter((item, index, self) => {
      let key = Object.keys(item)[0];
      return index === self.findIndex((t) => Object.keys(t)[0] === key);
    });

    let newDuplicate =
      duplicateCode?.length > 0 && sessionObject?.duplicateCode?.length > 0
        ? [...sessionObject?.duplicateCode, ...duplicateCode]
        : duplicateCode?.length > 0
          ? duplicateCode
          : sessionObject?.duplicateCode || [];

    let sessionDuplicate = newDuplicate?.filter((item, index, self) => {
      return index === self.findIndex((t) => t.code === item.code);
    });

    let newDuplicateReject =
      duplicateCodeReject?.length > 0 &&
        sessionObject?.duplicateCodeReject?.length > 0
        ? [...sessionObject?.duplicateCodeReject, ...duplicateCodeReject]
        : duplicateCodeReject?.length > 0
          ? duplicateCodeReject
          : sessionObject?.duplicateCodeReject || [];

    let sessionDuplicateReject = newDuplicateReject?.filter(
      (item, index, self) => {
        let key = Object.keys(item)[0];
        return index === self.findIndex((t) => Object.keys(t)[0] === key);
      }
    );

    const date = new Date();
    const d = new Date();
    let expires = sessionObject?.expiresAt ? sessionObject?.expiresAt : 0;
    let isTime = new Date(date) > new Date(expires) ? false : true;
    let dataLength =
      existingCode?.length ||
      0 + existingCodeReject?.length ||
      0 + recaptureCode?.length ||
      0 + recaptureCodeReject?.length ||
      0 + suspectCode?.length ||
      0 + suspectCodeReject?.length ||
      0 + duplicateCode?.length ||
      0 + duplicateCodeReject?.length;
    if (dataLength > 0 && expires === 0) {
      const newDate = new Date(d.setDate(d.getDate() + 6));
      expires = newDate.toString();
      let sessionObject = {
        mrn: userDetail?.mrn,
        expiresAt: expires,
        existingCode: sessionExisting,
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
    } else if (userDetail?.mrn === sessionObject?.mrn && isTime) {
      let sessionObject = {
        mrn: userDetail?.mrn,
        expiresAt: expires,
        existingCode: sessionExisting,
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
    } else if (sessionObject && !isTime) {
      localStorage.removeItem(`sessionObject_${userDetail.mrn}`);
    }
  };




  useEffect(() => {

  }, [setOpenSubmitModal])


  // Application JWT and Slug remove  :-------------------------------------------------:

  const [newSlug, setNewSlug] = useState(isSlugOrJwt());

  useEffect(() => {
    if (location.pathname === "/") {
      const url = new URL(window.location.href);
      url.searchParams.delete('slug');
      url.searchParams.delete('jwt');
      window.history.replaceState({}, '', url);
    }
  }, [location.pathname])

  useEffect(() => {
    localStorage.setItem('lastVisitedRoute', location.pathname);
  }, [location]);

  const lastLocation = localStorage.getItem("lastVisitedRoute");

  useEffect(() => {
    if (Object.keys(slug).length === 0 && slug.constructor === Object && lastLocation == "/") {
      navigate("/404")
    }
  }, [])


  // Application Inactivity Recorder  :-------------------------------------------------:

  const [isInactive, setIsInactive] = useState(false);
  let inactivityTimer;

  useEffect(() => {
    const handleActivity = () => {
      setIsInactive(false);
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => setIsInactive(true), 15 * 60000);
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    inactivityTimer = setTimeout(() => setIsInactive(true), 15 * 60000);

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, []);

  useEffect(() => {
    if (isInactive) {
      setIdleModal(true);
    }
  }, [isInactive]);


  // Application Time Recorder and SSO token Refresh :-------------------------------------------------:

  const [loadingTime, setLoadingTime] = useState(null);

  useEffect(() => {
    const startTime = new Date().getTime();
    localStorage.setItem('appStartTime', startTime);

    const slug = isSlugOrJwt();

    if (!slug.isJwt) {
      return
    }

    const intervalId = setInterval(() => {
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - startTime;

      if (tabs && tabs['Patient_Validity_Timeout']?.active) {
        const patientTime = tabs['Patient_Validity_Timeout']?.value * 1000;
        setLoadingTime(patientTime);
        clearInterval(intervalId);
        dispatch(refreshSSOToken());
      }

      else if (elapsedTime >= 20 * 60 * 1000) {
        setLoadingTime(elapsedTime);
        clearInterval(intervalId);
        dispatch(refreshSSOToken());
      }
    }, 15 * 60 * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [dispatch, tabs]);

  // Indexed Db Code and Setup

  const [eventData, setEventData] = useState([]);
  const [newEventData, setNewEventData] = useState([]);

  // Fetch initial event data
  useEffect(() => {
    const payload = { token: "" }
    dispatch(refreshSSOToken(payload))
    async function fetchEventData() {
      try {
        const [data1, data2] = await Promise.all([getAuditLog1(), getAuditLog2()]);
        setEventData(data1);
        setNewEventData(data2);
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    }
    fetchEventData();
  }, []);

  const handleAddEventData = async (data) => {
    try {
      await addAuditLog1(data);
      const allEventData = await getAuditLog1();
      setEventData(allEventData);
    } catch (error) {
      console.error('Error adding event data:', error);
    }
  };

  const removeObjectById = (arr, id) => {
    const index = arr.findIndex(item => item.id === id);
    if (index !== -1) {
      arr.splice(index, 1);
    }
  };

  useEffect(() => {
    const processEventData = async () => {
      const itemsToProcess = eventData.filter(item => !newEventData.some(existingItem => existingItem.id === item.id));

      for (const item of itemsToProcess) {
        try {
          const { id, ...itemWithoutId } = item;
          await dispatch(fetchAuditLogs([itemWithoutId]));
          await addAuditLog2(item);
          removeObjectById(eventData, id)
          const updatedEventData = await getAuditLog2();
          setNewEventData(updatedEventData);
        } catch (error) {
          console.error('Error processing event data:', error);
        }
      }
    };

    if (eventData.length > 0) {
      processEventData();
    }
  }, [eventData]);

  const [currentURL, setCurrentURL] = useState("")

  const sendAuditLog = async () => {

    const payload = {
      event_type: "LAUNCH_SUCCESS",
      metadata: {
        identifier: tabs?.["user"]?.value,
        provider_name: doctorDetail?.doctor_name,
        patient_id: user?.data?.userInfo?.mrn,
        event_datetime: convertDate(new Date().toISOString()),
        description: "Launch Successful",
      }
    };

    setCurrentURL(window.location.href);
    await new Promise(resolve => setTimeout(resolve, 3000));

    if (!currentURL.includes("/404")) {
      try {
        await dispatch(fetchAuditLogs([payload]));
      } catch (error) {
        console.error("Failed to dispatch audit logs:", error);
      }
    }
  };

  const handleSubmitRedirect = async (tabs) => {

    setIsModalOpen(true);
    const isAthenaModal = tabs['type']?.value == "Athena";

    if (isAthenaModal) {
      setSwitchModal(true);

      const exampleMetadata = {
        event_type: "SUMMARY_SUBMIT_ATHENA_MODEL_OPEN", metadata: {
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
      setSwitchModal(false);

      const exampleMetadata = {
        event_type: "SUMMARY_SUBMIT_EPIC_MODEL_OPEN", metadata: {
          identifier: tabs?.["user"]?.value || "",
          provider_name: doctorDetail?.doctor_name || "",
          patient_id: user?.data?.userInfo?.mrn || "",
          event_datetime: convertDate(new Date().toISOString()),
          parentCodesCount: (suspectCode?.length)

        }
      };

      handleAddEventData(exampleMetadata)
    }
    const isSummaryModal = tabs['patient_dashboard_summary_screen']?.active || false;
    if (isSummaryModal) {
      setOpenSubmitModal(true)
    } else {
      handleSubmit()
    }
    return;
  }


  const handleSubmit = async () => {
    const tenetType = tabs['type']?.value;

    const filteredExistingCode = tenetType === "EPIC"
      ? existingCode?.every(item => item.code_in_problem_list === true)
        ? []
        : existingCode.filter(item => item.code_in_problem_list === false)
      : existingCode;

    const filteredRecaptureCode = tenetType === "EPIC"
      ? recaptureCode?.every(item => item.code_in_problem_list === true)
        ? []
        : recaptureCode.filter(item => item.code_in_problem_list === false)
      : recaptureCode;

    const filteredDuplicateCode = tenetType === "EPIC"
      ? duplicateCode?.every(item => item.code_in_problem_list === true)
        ? []
        : duplicateCode.filter(item => item.code_in_problem_list === false)
      : duplicateCode;

    const shouldSkipApiCall =
      filteredExistingCode?.length === 0 &&
      filteredRecaptureCode?.length === 0 &&
      filteredDuplicateCode?.length === 0;

    if (shouldSkipApiCall) {
      setOpenSubmitModal(false);
      setDialog(true);
      setIsModalSubmit(true);
      return;
    }

    let requestBody = {};

    if (filteredExistingCode?.length > 0) {
      let mapped = filteredExistingCode.map((item) => ({
        [item.code]: {
          value: item?.value,
          additional_info: item?.additional_info,
        },
      }));
      let existing_codes = Object.assign({}, ...mapped);
      requestBody = { ...requestBody, existing_codes };
    }

    if (existingCodeReject.length > 0) {
      let object = existingRejectData.reduce((obj, item) => {
        let key = Object.keys(item);
        return Object.assign(obj, { [key]: item[key] });
      }, {});
      let mapped = { existing_codes: object };
      let existing_codes = Object.assign({}, mapped);
      requestBody = requestBody.delete_codes
        ? { ...requestBody, delete_codes: { ...requestBody.delete_codes, existing_codes } }
        : { ...requestBody, delete_codes: existing_codes };
    }

    if (filteredRecaptureCode?.length > 0) {
      let mapped = filteredRecaptureCode.map((item) => ({
        [item.code]: {
          value: item?.value,
          additional_info: item?.additional_info,
        },
      }));
      let recapture_codes = Object.assign({}, ...mapped);
      requestBody = { ...requestBody, recapture_codes };
    }

    if (filteredDuplicateCode?.length > 0) {
      let mapped = filteredDuplicateCode.map((item) => ({
        [item.code]: {
          value: item?.value,
          additional_info: item?.additional_info,
        },
      }));
      let duplicate_codes = Object.assign({}, ...mapped);
      requestBody = { ...requestBody, duplicate_codes };
    }

    if (recaptureCodeReject?.length > 0) {
      let mapped = recaptureCodeReject.map((item) => item);
      let recapture_codes = Object.assign({}, ...mapped);
      requestBody = requestBody.delete_codes
        ? { ...requestBody, delete_codes: { ...requestBody.delete_codes, recapture_codes } }
        : { ...requestBody, delete_codes: { recapture_codes } };
    }

    if (duplicateCodeReject?.length > 0) {
      let mapped = duplicateCodeReject.map((item) => item);
      let duplicate_codes = Object.assign({}, ...mapped);
      requestBody = requestBody.delete_codes
        ? { ...requestBody, delete_codes: { ...requestBody.delete_codes, duplicate_codes } }
        : { ...requestBody, delete_codes: { duplicate_codes } };
    }

    if (suspectCode?.length > 0) {
      let mapped = suspectCode.map((item) => ({
        [item.code]: {
          value: item?.value,
          additional_info: item?.additional_info,
        },
      }));
      let suspect_codes = Object.assign({}, ...mapped);
      requestBody = { ...requestBody, suspect_codes };
    }

    if (suspectCodeReject?.length > 0) {
      let mapped = suspectCodeReject.map((item) => item);
      let new_codes = Object.assign({}, ...mapped);
      requestBody = requestBody.delete_codes
        ? { ...requestBody, delete_codes: { ...requestBody.delete_codes, new_codes } }
        : { ...requestBody, delete_codes: { new_codes } };
    }

    // Post summary API call
    try {
      const result = await dispatch(patientSubmitData(requestBody));
      if (result?.meta?.requestStatus === "fulfilled") {
        setOpenSubmitModal(false);
        setDialog(true);
        setIsModalSubmit(true);

        const isAthenaModal = tabs['type']?.value === "Athena";
        const exampleMetadata = {
          event_type: isAthenaModal ? "SUMMARY_ATHENA_MODAL_SUBMIT_AND_CLOSE" : "SUMMARY_EPIC_MODAL_SUBMIT_AND_CLOSE",
          metadata: {
            identifier: tabs?.["user"]?.value || "",
            provider_name: doctorDetail?.doctor_name || "",
            patient_id: user?.data?.userInfo?.mrn || "",
            event_datetime: convertDate(new Date().toISOString()),
            code: { existingCode, existingCodeReject, suspectCodeReject, suspectCode, recaptureCode, recaptureCodeReject, duplicateCode, duplicateCodeReject },
            reasonForRejection: '',
            parentCodesCount: existingCode?.length,
          }
        };

        handleAddEventData(exampleMetadata);
        localStorage.removeItem(`sessionObject_${userDetail.mrn}`);
      }
    } catch (error) {
      // Handle error if needed
    }
  };

  const [loadingSummary, setLoadingSummary] = useState(true)
  useEffect(() => {
    if (slug && tabData) {
      dispatch(patientSummary()).then(() => {
        setLoadingSummary(false)
      }).catch((error) => {
        setLoadingSummary(false)
      });
      sendAuditLog();
      const timer = setTimeout(() => {
        setCodesDataLoaded(true);
      }, 2000);

      // Clean up the timeout if the component is unmounted before the timeout completes
      return () => clearTimeout(timer);
    }
  }, [tabData]);

  useEffect(() => {
    setExistingRejectCode(() => objToArr(existingCodeReject));
    setRecaptureRejectCode(() => objToArr(recaptureCodeReject));
    setDuplicateRejectCode(() => objToArr(duplicateCodeReject));
  }, [
    existingCodeReject,
    recaptureCodeReject,
    suspectCode,
    duplicateCodeReject,
  ]);

  const { summary } = useSelector((state) => state.user.data);
  console.log('summary:----', state?.reject);
  

  // const localData =
  const existingConditionNew = useSelector((state) => state.user.data.existingCondition);
  const duplicateCodeNew = useSelector((state) => state.user.data.duplicateCode);
  const recaptureCodeNew = useSelector((state) => state.user.data.recaptureCode);
  const suspectCodeNew = useSelector((state) => state.user.data.suspectedCode);

  const codesData = [
    {
      key: 1,
      code: "Existing conditions",
      codeCount: summary?.existing_codes_count,
      problemList: "Recapturing required",
      container: <ExistingConditions sessionObject={sessionObject} handleAddEventData={handleAddEventData} />,
    },
    {
      key: 2,
      code: "Suspects",
      codeCount: summary?.suspect_conditions_count,
      problemList: "Review Potential diagnoses",
      container: <Suspects sessionObject={sessionObject} handleAddEventData={handleAddEventData} />,
    },
    {
      key: 3,
      code: "Codes not in problem list",
      codeCount: summary?.recapture_codes_count,
      problemList: "Update Problem List",
      container: <CodesNotList sessionObject={sessionObject} handleAddEventData={handleAddEventData} />,
    },
    {
      key: 4,
      code: "Addressed Codes",
      codeCount: summary?.addressed_codes_count,
      container: <AddressedCodes sessionObject={sessionObject} handleAddEventData={handleAddEventData} />,
    },
    {
      key: 5,
      code: "Additional diagnoses",
      codeCount: summary?.duplicate_codes_count,
      container: <DuplicateCodes sessionObject={sessionObject} handleAddEventData={handleAddEventData} />,
    },

    {
      key: 6,
      code: "Deleted Codes / Conditions",
      codeCount: summary?.deleted_codes_count,
      container: <DeletedCodes sessionObject={sessionObject} handleAddEventData={handleAddEventData} />,
    },

    {
      key: 7,
      code: "External Data",
      codeCount: summary?.external_data_count,
      container: <Scans sessionObject={sessionObject} handleAddEventData={handleAddEventData} />,
    },
  ];


  const handleDelete = (event, item, key) => {
    event.stopPropagation()
    let newSessionObject = {};
    if (key === "existing") {
      if (item?.reason) {
        const codeList = existingCodeReject.filter(
          (value) => Object.keys(value)[0] !== item?.code
        );

        const updatedRejectData = rejectExistingData?.map((itemData) => {
          const key = Object.keys(itemData)[0];

          if (item?.code === key) {
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
          const codeValue = updatedRejectData?.find(
            (itemData) => Object.keys(itemData)[0] === item?.code
          );

          if (codeValue) {
            if (codeValue[item.code]?.value) {
              if (codeValue[item.code]?.alternate_codes?.length === 0) {
                const updatingData = updatedRejectData?.filter(
                  (val) => Object.keys(val)[0] !== Object.keys(codeValue)[0]
                );
                setExistingRejectData([...updatingData]);
              } else {
                let changeData = updatedRejectData?.map((value) => {
                  return Object.keys(codeValue)[0] === Object.keys(value)[0]
                    ? {
                      [item.code]: {
                        ...value[item.code],
                        delete_code: false,
                      },
                    }
                    : value;
                });
                setExistingRejectData([...changeData]);
              }
            } else {
              if (updatedRejectData[item.code]?.alternate_codes?.length === 0) {
                const newData = rejectExistingData?.filter(
                  (val) => Object.keys(val)[0] !== item?.code
                );
                setExistingRejectData(newData);
              } else {
                codeValue[item.code].delete_code = false;
                setExistingRejectData([...rejectExistingData]);
              }
            }
          }
        }
        newSessionObject = {
          ...sessionObject,
          existingCodeReject: codeList,
        };
        dispatch(existingReject(codeList));
        dispatch(existingRejectInfo());
      } else {
        const codeList = existingCode.filter(
          (value) => value?.code !== item?.code
        );
        newSessionObject = {
          ...sessionObject,
          existingCode: codeList,
        };
        dispatch(existingValue(codeList));
      }

      const exampleMetadata = {
        event_type: "SUMMARY_EXISTING_CODE_REMOVED", metadata: {
          identifier: tabs?.["user"]?.value || "",
          provider_name: doctorDetail?.doctor_name || "",
          patient_id: user?.data?.userInfo?.mrn || "",
          event_datetime: convertDate(new Date().toISOString()),
          code: item?.code,
          description: item?.value ? item?.value : item?.info?.value,
          reasonForRejection: '',
          raf: item?.info?.total_weight,
          alternateCodes: item?.info?.alternate_codes,
          parentCodesCount: (existingCode?.length)
        }
      };

      handleAddEventData(exampleMetadata)

    } else if (key === "suspect") {
      if (item[Object.keys(item)]?.reason) {
        const codeList = suspectCodeReject.filter(
          (value) => Object.keys(value)[0] !== Object.keys(item)[0]
        );
        newSessionObject = {
          ...sessionObject,
          suspectCodeReject: codeList,
        };
        dispatch(suspectReject(codeList));
      } else {
        const codeList = suspectCode.filter(
          (value) => value?.code !== item?.code
        );
        newSessionObject = {
          ...sessionObject,
          suspectCode: codeList,
        };
        dispatch(suspectValue(codeList));
      }

      const exampleMetadata = {
        event_type: "SUMMARY_SUSPECT_CODE_REMOVED", metadata: {
          identifier: tabs?.["user"]?.value || "",
          provider_name: doctorDetail?.doctor_name || "",
          patient_id: user?.data?.userInfo?.mrn || "",
          event_datetime: convertDate(new Date().toISOString()),
          code: item?.code,
          description: item?.value ? item?.value : item?.info?.value,
          reasonForRejection: '',
          raf: item?.info?.total_weight,
          alternateCodes: item?.info?.alternate_codes,
          parentCodesCount: (existingCode?.length)
        }
      };

      handleAddEventData(exampleMetadata)

    } else if (key === "recapture") {
      if (item?.reason) {
        const codeList = recaptureCodeReject.filter(
          (value) => Object.keys(value)[0] !== item.code
        );
        newSessionObject = {
          ...sessionObject,
          recaptureCodeReject: codeList,
        };
        dispatch(recaptureReject(codeList));
      } else {
        const codeList = recaptureCode.filter(
          (value) => value?.code !== item?.code
        );
        newSessionObject = {
          ...sessionObject,
          recaptureCode: codeList,
        };
        dispatch(recaptureValue(codeList));
      }

      const exampleMetadata = {
        event_type: "SUMMARY_RECAPTURE_CODE_REMOVED", metadata: {
          identifier: tabs?.["user"]?.value || "",
          provider_name: doctorDetail?.doctor_name || "",
          patient_id: user?.data?.userInfo?.mrn || "",
          event_datetime: convertDate(new Date().toISOString()),
          code: item?.code,
          description: item?.value ? item?.value : item?.info?.value,
          reasonForRejection: '',
          raf: item?.info?.total_weight,
          alternateCodes: item?.info?.alternate_codes,
          parentCodesCount: (existingCode?.length)
        }
      };

      handleAddEventData(exampleMetadata)

    } else if (key === "duplicate") {
      if (item?.reason) {
        const codeList = duplicateCodeReject.filter(
          (value) => Object.keys(value)[0] !== item.code
        );
        newSessionObject = {
          ...sessionObject,
          duplicateCodeReject: codeList,
        };
        dispatch(duplicateReject(codeList));
      } else {
        const codeList = duplicateCode.filter(
          (value) => value?.code !== item?.code
        );
        newSessionObject = {
          ...sessionObject,
          duplicateCode: codeList,
        };
        dispatch(duplicateValue(codeList));
      }

      const exampleMetadata = {
        event_type: "SUMMARY_DUPLICATE_CODE_REMOVED", metadata: {
          identifier: tabs?.["user"]?.value || "",
          provider_name: doctorDetail?.doctor_name || "",
          patient_id: user?.data?.userInfo?.mrn || "",
          event_datetime: convertDate(new Date().toISOString()),
          code: item?.code,
          description: item?.value ? item?.value : item?.info?.value,
          reasonForRejection: '',
          raf: item?.info?.total_weight,
          alternateCodes: item?.info?.alternate_codes,
          parentCodesCount: (existingCode?.length)
        }
      };

      handleAddEventData(exampleMetadata)

    }
    localStorage.setItem(
      `sessionObject_${userDetail.mrn}`,
      JSON.stringify(newSessionObject)
    );
  };


  useEffect(() => {
    sessionHistory();
    setSumCount(
      existingCode?.length +
      existingCodeReject?.length +
      recaptureCode?.length +
      recaptureCodeReject?.length +
      suspectCode?.length +
      suspectCodeReject?.length +
      duplicateCode?.length +
      duplicateCodeReject?.length
    );
  }, [
    existingCode,
    recaptureCode,
    suspectCode,
    duplicateCode,
    existingCodeReject,
    recaptureCodeReject,
    suspectCodeReject,
    duplicateCodeReject,
  ]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [expanded, setExpanded] = React.useState(false);
  const [singleExpand, setSingleExpand] = React.useState(false);
  const [isLoadingMain, setIsLoadingMain] = useState(true);

  localStorage.setItem("setLoading", true);

  useEffect(() => {
    // Dispatch the patientTabFlag thunk and update the loading state
    dispatch(patientTabFlag())
      .then(() => {
        setIsLoadingMain(false);
        localStorage.setItem("setLoading", false)
      })
      .catch(() => {
        localStorage.setItem("setLoading", false)
      });
  }, [dispatch]);

  // New Expand in mobile function

  const respExpand = (event, panel) => {
    if (expanded === panel) {
      setExpanded(false);
    } else {
      setExpanded(panel);
    }
  };


  const [topValue, setTopValue] = useState("");
  const [arrowState, setArrowState] = useState(false);
  const [arrowState2, setArrowState2] = useState(false);

  // Update topValue based on window width
  useEffect(() => {
    const handleResize = () => {
      let baseValue;

      if (window.innerWidth < 375) {
        baseValue = "9.2rem"; // Example for widths below 375px
      } else if (window.innerWidth >= 375 && window.innerWidth < 549) {
        baseValue = "10rem"; // Example for widths between 375px and 549px
      } else {
        baseValue = "10rem"; // Example for widths 549px and above
      }

      // Check if either tab is active and add 30px
      if (tabs?.read_only_rejection_allowed?.active || tabs?.read_only_mode?.active) {
        // Convert baseValue to pixels, add 30px, and set as the new topValue
        const baseValueInPx = parseFloat(baseValue) * 16; // Convert rem to px (1rem = 16px)
        setTopValue(`${(baseValueInPx + 36) / 16}rem`); // Convert back to rem
      }
      else if ((tabs && tabs?.patient_dashboard_recapture_percentage?.active && tabs?.patient_dashboard_suspect_percentage?.active) || doctorDetail?.doctor_name) {
        const baseValueInPx = parseFloat(baseValue) * 16; // Convert rem to px (1rem = 16px)
        if (window.innerWidth < 549) {
          setTopValue(`${(baseValueInPx + 66) / 16}rem`); // Convert back to rem
        }
        else {
          setTopValue(baseValue);
        }
      }
      else {
        setTopValue(baseValue);
      }
    };

    // Set initial value and add resize event listener
    handleResize();
    window.addEventListener("resize", handleResize);

    // Clean up event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, [tabs]);


  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);

  const styles = {
    visibility: show ? "visible" : "hidden",
    height: "max-content",
    top: '200%',
    cursor: "auto",
    transition: "all ease-in-out"
  };

  const styles2 = {
    visibility: show2 ? "visible" : "hidden",
    height: "max-content",
    top: '200%',
    cursor: "auto",
    transition: "all ease-in-out"
  };

  const offcanvasBody = {
    padding: 0,
    cursor: "auto",
    overflowY: 'unset !important'
  }

  const backdropStyle = {
    width: '100vw',
    height: '100vh',
    position: 'absolute',
    backdropFilter: 'brightness(0.5)',
    zIndex: '-1'
  }

  const handleShow = () => {
    setShow(!show)
    setShow2(false)
    setArrowState(!arrowState)
  }

  const handleShow2 = () => {
    setShow2(!show2)
    setShow(false)
    setArrowState2(!arrowState2)
  }

  // handle hoag modal switch on final summary screen
  const finalSummaryScreenHoag = () => {
    setHoagmodalarrow(!hoagmodalarrow);

  }


  useEffect(() => {

    const combined = [
      ...existingCode.filter((item) => item.code_in_problem_list === false),
      ...suspectCode.filter((item) => item.value !== ""),
      ...duplicateCode.filter((item) => item.code_in_problem_list === false),
      ...recaptureCode.filter((item) => item.code_in_problem_list === false),
    ];

    const combined2 = [
      ...existingCode.filter((item) => item.code_in_problem_list === true),
      ...suspectCode.filter((item) => item.value === ""),
      ...duplicateCode.filter((item) => item.code_in_problem_list === true),
      ...recaptureCode.filter((item) => item.code_in_problem_list === true),
    ];

    setCombinedDatahoag(combined);
    setCombinedData2hoag(combined2)
  }, [existingCode, suspectCode, duplicateCode, recaptureCode]);


  if (isLoadingMain) {
    return <div style={{ height: '100vh', backgroundColor: 'white' }}></div>; // Blank screen
  }




  return (
    <>
      <Header />
      <SubHeader />
      {(tabs?.read_only_rejection_allowed?.active || (tabs?.read_only_mode?.active)) && (
        <Box
          sx={{
            backgroundColor: "#FDDECF",
            marginTop: "121px",

            '@media (max-width: 549px)': {
              marginTop: "171px",
            }

          }}
          className="pdap-ui-codes-read-only-t1-wrap"
        >
          <Container maxWidth="xl" className="pdap-ui-codes-read-only-t1-ctr">
            <Typography
              sx={{
                fontSize: "0.75rem",
                fontStyle: "normal",
                fontWeight: "600",
                lineHeight: "normal",
              }}
              className="pdap-ui-codes-read-only-t1"
            >
              This page is loaded in read-only mode.
            </Typography>
          </Container>
        </Box>
      )}
      <ToastContainer
        position="top-center"
        transition={Zoom}
        autoClose={2000}
      />
      <Box sx={{ flexGrow: 1, }}>

        <Container
          maxWidth="xl"
          sx={{
            marginTop: (tabs?.read_only_rejection_allowed?.active || tabs?.read_only_mode?.active)
              ? undefined
              : "100px !important",
            padding: "0px 50px !important",
            [theme.breakpoints.down("md")]: {
              padding: "0px !important",

              marginTop: (tabs?.read_only_rejection_allowed?.active || tabs?.read_only_mode?.active)
                ? "0"
                : "125px !important",
            },

            [theme.breakpoints.down("550")]: {
              marginTop: (tabs?.read_only_rejection_allowed?.active || tabs?.read_only_mode?.active)
                ? "0"
                : "185px !important",
            },

            [theme.breakpoints.up("md")]: {
              display: "none",
            },
          }}
        >
          <Grid container position={'relative'} sx={isModalSubmit ?
            { display: "none" } :
            { display: "flex", mt: 0, pt: 0, mb: 0 }

          }>

            <Grid
              item xs={6}
              sx={{
                backgroundColor: "#17236D", color: "white",
                padding: "15px 20px",
                [theme.breakpoints.down("sm")]: {
                  padding: "10px 10px",
                },
              }} >
              <Box
                sx={{

                  [theme.breakpoints.up("md")]: {
                    display: "none",
                  },
                }}
              >
                <Box sx={{
                  [theme.breakpoints.up("md")]: {
                    display: "none",
                  },
                }}>
                  <React.Fragment>


                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                      <Grid item
                        onClick={() => handleShow()}
                        type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop" aria-controls="offcanvasTop"
                        sx={{
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          position: "unset",
                          [theme.breakpoints.down("xs")]: {
                            padding: "10px 5px"
                          }

                        }} xs={12} sm={12} md={4} lg={4}>
                        <StyledText className="pendingActions"
                          sx={{ ...flexCenter, gap: "4px" }}
                          type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop" aria-controls="offcanvasTop"


                        >
                          Pending actions
                          <Box
                            sx={{
                              borderRadius: " 1.875rem",
                              background: "white",
                              color: "#F20000",
                              width: "20px",
                              height: "20px",
                              ...flexCenter,
                              justifyContent: "center",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                textAlign: "center",
                                lineHeight: "160%",
                                fontWeight: 600,
                                ...flexCenter,
                              }}
                            >

                              {!loadingSummary ? ((summary?.recapture_codes_count + summary?.suspect_conditions_count + summary?.existing_codes_count) || 0) : <ClipLoader color="#000000" size={15} />}
                            </Typography>
                          </Box>
                        </StyledText>

                        <div style={styles} className="offcanvas offcanvas-top position-absolute" tabindex="-1" id="offcanvasTop" aria-labelledby="offcanvasTopLabel">
                          <div style={offcanvasBody} className="offcanvas-body ">
                            <Box
                              sx={{
                                backgroundColor: "#F2F4FF",
                                px: 2,
                                py: 2,
                              }}
                            >
                              <Grid container>
                                <Grid item lg={2} md={2} sm={1.5} xs={1.5}>
                                  <PrimaryButton
                                    onClick={(event) => respExpand(event, 1)}
                                    disabled={(summary?.existing_codes_count === undefined || summary?.existing_codes_count === 0) || 0}
                                    sx={{
                                      width: "2.375rem",
                                      height: "1.5625rem",
                                      backgroundColor: theme.palette.error.A200,
                                      color: theme.palette.error.main,
                                      ":hover": {
                                        backgroundColor: theme.palette.error.A200,
                                      },
                                      ":disabled": {
                                        backgroundColor: theme.palette.error.A200, // Same as normal state
                                        color: theme.palette.error.main, // Same as normal state
                                      },
                                      fontWeight: 600,
                                      minWidth: "inherit",
                                      fontSize: "0.875rem",
                                    }}
                                  >
                                    {summary?.existing_codes_count || 0}
                                  </PrimaryButton>
                                </Grid>
                                <Grid
                                  item
                                  lg={10}
                                  md={10}
                                  sm={10.5}
                                  xs={10.5}
                                  sx={{ pl: 1 }}
                                >
                                  <Typography
                                    sx={{
                                      fontSize: "1rem",
                                      color: "rgba(0, 0, 0, 0.60);",
                                      fontWeight: "600",
                                      lineHeight: "1.375rem",
                                      textTransform: "initial",
                                    }}
                                  >
                                    You have { }
                                    <Typography
                                      sx={{
                                        color: "#000;",
                                      }}
                                    >
                                      {summary?.existing_codes_count || 0}
                                    </Typography>
                                    { } urgent existing conditions requiring recapturing.
                                  </Typography>
                                </Grid>
                              </Grid>
                              <Grid container sx={{ my: 2 }}>
                                <Grid item lg={2} md={2} sm={1.5} xs={1.5}>
                                  <PrimaryButton
                                    onClick={(event) => respExpand(event, 2)}
                                    disabled={(summary?.suspect_conditions_count === undefined || summary?.suspect_conditions_count === 0) || 0}
                                    sx={{
                                      width: "2.375rem",
                                      height: "1.5625rem",
                                      backgroundColor: theme.palette.error.A200,
                                      color: theme.palette.error.main,
                                      ":hover": {
                                        backgroundColor: theme.palette.error.A200,
                                      },
                                      ":disabled": {
                                        backgroundColor: theme.palette.error.A200, // Same as normal state
                                        color: theme.palette.error.main, // Same as normal state
                                      },
                                      fontWeight: 600,
                                      minWidth: "inherit",
                                      fontSize: "0.875rem",
                                    }}
                                  >
                                    {summary?.suspect_conditions_count || 0}
                                  </PrimaryButton>
                                </Grid>
                                <Grid
                                  item
                                  lg={10}
                                  md={10}
                                  sm={10.5}
                                  xs={10.5}
                                  sx={{ pl: 1 }}
                                >
                                  <Typography
                                    sx={{
                                      fontSize: "1rem",
                                      color: "rgba(0, 0, 0, 0.60);",
                                      fontWeight: "600",
                                      lineHeight: "1.375rem",
                                      textTransform: "initial",
                                    }}
                                  >
                                    You have { }
                                    <Typography
                                      sx={{
                                        color: "#000;",
                                      }}
                                    >
                                      {summary?.suspect_conditions_count || 0}
                                    </Typography>
                                    { }  urgent new suspects for review.
                                  </Typography>
                                </Grid>
                              </Grid>
                              <Grid container sx={{ my: 2 }}>
                                <Grid item lg={2} md={2} sm={1.5} xs={1.5}>
                                  <PrimaryButton
                                    onClick={(event) => respExpand(event, 3)}
                                    disabled={(summary?.recapture_codes_count === undefined || summary?.recapture_codes_count === 0) || 0}
                                    sx={{
                                      width: "2.375rem",
                                      height: "1.5625rem",
                                      backgroundColor: theme.palette.error.A200,
                                      color: theme.palette.error.main,
                                      ":hover": {
                                        backgroundColor: theme.palette.error.A200,
                                      },
                                      ":disabled": {
                                        backgroundColor: theme.palette.error.A200, // Same as normal state
                                        color: theme.palette.error.main, // Same as normal state
                                      },
                                      fontWeight: 600,
                                      minWidth: "inherit",
                                      fontSize: "0.875rem",
                                    }}
                                  >
                                    {summary?.recapture_codes_count || 0}
                                  </PrimaryButton>
                                </Grid>
                                <Grid
                                  item
                                  lg={10}
                                  md={10}
                                  sm={10.5}
                                  xs={10.5}
                                  sx={{ pl: 1 }}
                                >
                                  <Typography
                                    sx={{
                                      fontSize: "1rem",
                                      color: "rgba(0, 0, 0, 0.60);",
                                      fontWeight: "600",
                                      lineHeight: "1.375rem",
                                      textTransform: "initial",
                                    }}
                                  >
                                    You have { }
                                    <Typography
                                      sx={{
                                        color: "#000;",
                                        pr: 0.5,
                                      }}
                                    >
                                      {summary?.recapture_codes_count || 0}
                                    </Typography>
                                    { } existing conditions that are not in the problem list.
                                  </Typography>
                                </Grid>
                              </Grid>
                              {/* <Grid container >
                        <Grid item lg={2} md={2} sm={1.5} xs={3} >
                          <PrimaryButton

                            sx={{
                              width: "2.375rem",
                              height: "1.5625rem",
                              backgroundColor: "#F200001A",
                              color: theme.palette.error.main,
                              ":hover": {
                                backgroundColor: "#F200001A",
                              },
                              fontWeight: 600,
                              minWidth: "inherit",
                              fontSize: "0.875rem",
                            }}
                          >
                            {summary?.duplicate_codes_count || 0}
                          </PrimaryButton>
                        </Grid>
                        <Grid
                          item
                          lg={10}
                          md={10}
                          sm={10.5}
                          xs={9}
                          sx={{ pl: 1 }}
                        >
                          <Typography
                            sx={{
                              fontSize: "1rem",
                              color: "rgba(0, 0, 0, 0.60);",
                              fontWeight: "600",
                              lineHeight: "1.375rem",
                              textTransform: "initial",
                            }}
                          >
                            You have  { }
                            <Typography
                              sx={{
                                color: "#000;",
                              }}
                            >
                              {summary?.duplicate_codes_count || 0}
                            </Typography>
                            { } Duplicate Codes
                          </Typography>
                        </Grid>
                      </Grid> */}
                            </Box>
                          </div>

                          <div style={backdropStyle} class="backdrop-filter"> </div>
                        </div>

                        <>
                          {
                            !loadingSummary ? (
                              arrowState ? (
                                <ArrowDropUpIcon
                                  type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop" aria-controls="offcanvasTop"

                                  width={" 0.75rem"}
                                  height={"0.5rem"}
                                  fill={"white"}
                                />
                              ) : (
                                <ArrowDropDownIcon
                                  type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop" aria-controls="offcanvasTop"
                                  width={" 0.75rem"}
                                  height={"0.5rem"}
                                  fill={"white"}
                                />
                              )) : null
                          }
                        </>



                      </Grid>
                    </Grid>



                  </React.Fragment>
                </Box>
              </Box>
            </Grid>

            <Grid
              item
              xs={6}
              lg={3}
              md={4}
              sx={{

                backgroundColor: "white",
                padding: "15px 20px",
                [theme.breakpoints.down("sm")]: {
                  padding: "10px 10px",
                },
              }}
            >
              <>
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                  <Grid onClick={() => handleShow2()}
                    type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop2" aria-controls="offcanvasTop"
                    sx={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      [theme.breakpoints.down("xs")]: {
                        padding: "10px 5px"
                      }
                    }} item xs={12} sm={12} md={4} lg={4}>
                    <StyledText className="summary-mobile" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop2" aria-controls="offcanvasTop" sx={{ ...flexCenter, gap: 0.5 }}>
                      Summary
                      {sumCount >= 0 && (
                        <Box
                          sx={{
                            background: "#E6682D",
                            color: "#FFFFFF",
                            borderRadius: "100%",
                            height: "20px",
                            width: "20px",
                            ...flexCenter,
                            justifyContent: "center"
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              textAlign: "center",
                              fontSize: "0.75rem",
                              fontStyle: "normal",
                              fontWeight: "600",
                              lineHeight: "normal",
                              ...flexCenter,
                              [theme.breakpoints.up("sm")]: {
                                p: '7px',
                              },

                            }}
                          >
                            {!loadingSummary ? (sumCount || 0) : <ClipLoader color="#ffffff" size={15} />}
                          </Typography>
                        </Box>
                      )}
                    </StyledText>

                    {
                      !loadingSummary ? (
                        arrowState2 ? (
                          <ArrowDropUpIcon
                            type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop" aria-controls="offcanvasTop"

                            width={" 0.75rem"}
                            height={"0.5rem"}
                            fill={"black"}
                          />
                        ) : (
                          <ArrowDropDownIcon
                            type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop" aria-controls="offcanvasTop"
                            width={" 0.75rem"}
                            height={"0.5rem"}
                            fill={"black"}
                          />
                        )) : null
                    }


                    <div style={styles2} className="offcanvas offcanvas-top position-absolute" tabindex="-1" id="offcanvasTop2" aria-labelledby="offcanvasTopLabel1">
                      <div style={offcanvasBody} className="offcanvas-body" >


                        <Card
                          className="CardBox"
                          sx={{
                            [theme.breakpoints.up("md")]: {
                              display: "none",
                              minWidth: 275,
                              borderRadius: "0.625rem 0.625rem 0.625rem 0.625rem",
                              mt: 3,
                            },
                            [theme.breakpoints.down("md")]: {
                              borderRadius: "0px",
                            },
                          }}
                        >
                          <CardContent>

                            <Grid
                              container
                              rowSpacing={1}
                              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                            >
                              <Grid type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop2" aria-controls="offcanvasTop" sx={{
                                display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 0px",
                                [theme.breakpoints.down("xs")]: {
                                  padding: "10px 5px"
                                }
                              }} item xs={12} sm={12} md={4} lg={4}>
                                <StyledText className="summary-mobile" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop2" aria-controls="offcanvasTop" sx={{ ...flexCenter, gap: 0.5 }}>
                                  Summary
                                  {sumCount >= 0 && (
                                    <Box
                                      sx={{
                                        background: "#E6682D",
                                        color: "#FFFFFF",
                                        borderRadius: "100%",
                                        height: "20px",
                                        width: "20px",
                                        ...flexCenter,
                                        justifyContent: "center"
                                      }}
                                    >
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          textAlign: "center",
                                          fontSize: "0.75rem",
                                          fontStyle: "normal",
                                          fontWeight: "600",
                                          lineHeight: "normal",

                                          [theme.breakpoints.up("sm")]: {
                                            p: '7px',
                                          },

                                        }}
                                      >
                                        {sumCount}
                                      </Typography>
                                    </Box>
                                  )}
                                </StyledText>

                                {state["down"] ? (
                                  <ArrowDropUpIcon
                                    type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop2" aria-controls="offcanvasTop"

                                    width={" 0.75rem"}
                                    height={"0.5rem"}
                                    fill={"black"}
                                  />
                                ) : (
                                  <ArrowDropDownIcon
                                    type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop2" aria-controls="offcanvasTop"

                                    width={" 0.75rem"}
                                    height={"0.5rem"}
                                    fill={"black"}
                                  />
                                )}
                              </Grid>
                            </Grid>
                            <Box>
                              <Grid
                                container
                                sx={{
                                  borderBottom: "1px solid #00000029",
                                  pb: 2,
                                  mb: 2,
                                }}
                              >
                                <Grid item lg={9} md={9} sm={10} xs={10}>
                                  <Typography className="HeadSummary">
                                    Existing Conditions (recapturing required)
                                  </Typography>
                                </Grid>

                                {!(
                                  existingCode?.length ||
                                  0 + existingRejectCode?.length ||
                                  0
                                ) > 0 ? (
                                  <>
                                    <Grid
                                      item
                                      lg={3}
                                      md={2}
                                      sm={2}
                                      xs={12}
                                      sx={{ textAlign: "end" }}
                                    >
                                      <StyleSheetNumber>0</StyleSheetNumber>
                                    </Grid>

                                    <div className="ItemsDiv">
                                      <p>0 item</p>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <Grid
                                      item
                                      lg={3}
                                      md={2}
                                      sm={2}
                                      xs={12}
                                      sx={{ textAlign: "end" }}
                                    >
                                      <StyleSheetNumber>
                                        {(existingCode?.length || 0) +
                                          (existingRejectCode?.length || 0)}
                                      </StyleSheetNumber>
                                    </Grid>
                                    {existingCode?.length > 0 &&
                                      existingCode?.map((item, index) => (
                                        <Stack
                                          direction="row"
                                          justifyContent={'start'}
                                          spacing={1}
                                          sx={{
                                            px: 0,
                                            ml: 0.08,
                                            mt: 0.5,
                                            cursor: "pointer",
                                          }}
                                        >
                                          <Tooltip
                                            sx={{ padding: " 0px !important" }}
                                            title={item?.code + " : " + item?.value}
                                          >
                                            <Typography

                                              onClick={(event) =>
                                                handleDelete(event, item, "existing")
                                              }
                                            >
                                              <StylePop className="ChipSpan">
                                                {item?.code?.slice(0, 20)}{" "}
                                                {item?.code.length > 20 ? "..." : ""}
                                                :
                                                {item?.value?.slice(0, 20)}{" "}
                                                {item?.value?.length > 20 ? "..." : ""}
                                                <Typography sx={{ flexGrow: 1, ml: "10px" }}>
                                                  <CrossIcon />{" "}
                                                </Typography>
                                              </StylePop>{" "}
                                            </Typography>
                                          </Tooltip>
                                        </Stack>
                                      ))}
                                    {existingRejectCode?.length > 0 &&
                                      existingRejectCode?.map((item, index) => (
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
                                              onClick={(event) =>
                                                handleDelete(event, item, "existing")
                                              }
                                            >
                                              <StylePop className="ChipSpan rejected">
                                                {item?.code?.slice(0, 20)}{" "}
                                                {item?.code.length > 20 ? "..." : ""}
                                                :
                                                {item?.value?.slice(0, 20)}{" "}
                                                {item?.value?.length > 20 ? "..." : ""}
                                                <Typography sx={{ flexGrow: 1, ml: "10px" }}>
                                                  <CrossIcon state="rejected" />{" "}
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
                                  borderBottom: "1px solid #00000029",
                                  pb: 2,
                                  mb: 2,
                                }}
                              >
                                <Grid item lg={9} md={9} sm={10} xs={10}>
                                  <Typography className="HeadSummary">
                                    Suspects
                                  </Typography>
                                </Grid>

                                {!(
                                  Object?.keys(suspectCode)?.length ||
                                  0 + suspectCodeReject?.length ||
                                  0
                                ) > 0 ? (
                                  <>
                                    <Grid
                                      item
                                      lg={3}
                                      md={2}
                                      sm={2}
                                      xs={12}
                                      sx={{ textAlign: "end" }}
                                    >
                                      <StyleSheetNumber>0</StyleSheetNumber>
                                    </Grid>

                                    <div className="ItemsDiv">
                                      <p>0 item</p>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <Grid
                                      item
                                      lg={3}
                                      md={2}
                                      sm={2}
                                      xs={12}
                                      sx={{ textAlign: "end" }}
                                    >
                                      <StyleSheetNumber>
                                        {(suspectCode?.length || 0) +
                                          (suspectCodeReject?.length || 0)}
                                      </StyleSheetNumber>
                                    </Grid>
                                    {suspectCode?.length > 0 &&
                                      suspectCode?.map((item, index) => (
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
                                              onClick={(event) =>
                                                handleDelete(event, item, "suspect")
                                              }
                                            >
                                              <StylePop className="ChipSpan">
                                                {item?.code?.slice(0, 20)}{" "}
                                                {item?.code.length > 20 ? "..." : ""}
                                                {item?.value ? ":" : ""}
                                                {item?.value?.slice(0, 20)}{" "}
                                                {item?.value?.length > 20 ? "..." : ""}
                                                <Typography sx={{ flexGrow: 1, ml: "10px" }}>
                                                  <CrossIcon />{" "}
                                                </Typography>
                                              </StylePop>{" "}
                                            </Typography>
                                          </Tooltip>
                                        </Stack>
                                      ))}
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
                                              onClick={(event) =>
                                                handleDelete(event, item, "suspect")
                                              }
                                            >
                                              <StylePop className="ChipSpan rejected">
                                                {Object.keys(item)
                                                  .toString()
                                                  .slice(0, 20)}{" "}
                                                {Object.keys(item).toString().length >
                                                  20
                                                  ? "..."
                                                  : ""}
                                                {item?.value ? ":" : ""}
                                                {item?.value?.slice(0, 20)}{" "}
                                                {item?.value?.length > 20 ? "..." : ""}

                                                <Typography sx={{ flexGrow: 1, ml: "10px" }}>
                                                  <CrossIcon state="rejected" />{" "}
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
                                  borderBottom: "1px solid #00000029",
                                  pb: 2,
                                  mb: 2,
                                }}
                              >
                                <Grid item lg={9} md={9} sm={10} xs={10}>
                                  <Typography className="HeadSummary">
                                    Codes not in problem list
                                  </Typography>
                                </Grid>

                                {!(
                                  recaptureCode?.length ||
                                  0 + recaptureRejectCode?.length ||
                                  0
                                ) > 0 ? (
                                  <>
                                    <Grid
                                      item
                                      lg={3}
                                      md={2}
                                      sm={2}
                                      xs={12}
                                      sx={{ textAlign: "end" }}
                                    >
                                      <StyleSheetNumber>0</StyleSheetNumber>
                                    </Grid>

                                    <div className="ItemsDiv">
                                      <p>0 item</p>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <Grid
                                      item
                                      lg={3}
                                      md={2}
                                      sm={2}
                                      xs={12}
                                      sx={{ textAlign: "end" }}
                                    >
                                      <StyleSheetNumber>
                                        {(recaptureCode?.length || 0) +
                                          (recaptureRejectCode?.length || 0)}
                                      </StyleSheetNumber>
                                    </Grid>
                                    {recaptureCode?.length > 0 &&
                                      recaptureCode?.map((item, index) => (
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
                                              onClick={(event) =>
                                                handleDelete(event, item, "recapture")
                                              }
                                            >
                                              <StylePop className="ChipSpan">
                                                {item?.code?.slice(0, 20)}{" "}
                                                {item?.code.length > 20 ? "..." : ""}
                                                :
                                                {item?.value?.slice(0, 20)}{" "}
                                                {item?.value?.length > 20 ? "..." : ""}
                                                <Typography sx={{ flexGrow: 1, ml: "10px" }}>
                                                  <CrossIcon />{" "}
                                                </Typography>
                                              </StylePop>{" "}
                                            </Typography>
                                          </Tooltip>
                                        </Stack>
                                      ))}
                                    {recaptureRejectCode?.length > 0 &&
                                      recaptureRejectCode?.map((item, index) => (
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
                                              onClick={(event) =>
                                                handleDelete(event, item, "recapture")
                                              }
                                            >
                                              <StylePop className="ChipSpan rejected">
                                                {item?.code?.slice(0, 20)}{" "}
                                                {item?.code.length > 20 ? "..." : ""}
                                                :
                                                {item?.value?.slice(0, 20)}{" "}
                                                {item?.value?.length > 20 ? "..." : ""}
                                                <Typography sx={{ flexGrow: 1, ml: "10px" }}>
                                                  <CrossIcon state="rejected" />{" "}
                                                </Typography>
                                              </StylePop>{" "}
                                            </Typography>
                                          </Tooltip>
                                        </Stack>
                                      ))}
                                  </>
                                )}
                              </Grid>
                              <Grid container sx={{ pb: 2, mb: 0 }}>
                                <Grid item lg={9} md={9} sm={10} xs={10}>
                                  <Typography className="HeadSummary">
                                    Additional diagnoses
                                  </Typography>
                                </Grid>

                                {!(
                                  duplicateCode?.length ||
                                  0 + duplicateRejectCode?.length ||
                                  0
                                ) > 0 ? (
                                  <>
                                    <Grid
                                      item
                                      lg={3}
                                      md={2}
                                      sm={2}
                                      xs={12}
                                      sx={{ textAlign: "end" }}
                                    >
                                      <StyleSheetNumber>0</StyleSheetNumber>
                                    </Grid>

                                    <div className="ItemsDiv">
                                      <p>0 item</p>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <Grid
                                      item
                                      lg={3}
                                      md={2}
                                      sm={2}
                                      xs={12}
                                      sx={{ textAlign: "end" }}
                                    >
                                      <StyleSheetNumber>
                                        {(duplicateCode?.length || 0) +
                                          (duplicateRejectCode?.length || 0)}
                                      </StyleSheetNumber>
                                    </Grid>
                                    {duplicateCode?.length > 0 &&
                                      duplicateCode?.map((item, index) => (
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
                                              onClick={(event) =>
                                                handleDelete(event, item, "duplicate")
                                              }
                                            >
                                              <StylePop className="ChipSpan">
                                                {item?.code?.slice(0, 20)}{" "}
                                                {item?.code.length > 20 ? "..." : ""}
                                                :
                                                {item?.value?.slice(0, 20)}{" "}
                                                {item?.value?.length > 20 ? "..." : ""}
                                                <Typography sx={{ flexGrow: 1, ml: "10px" }}>
                                                  <CrossIcon />{" "}
                                                </Typography>
                                              </StylePop>{" "}
                                            </Typography>
                                          </Tooltip>
                                        </Stack>
                                      ))}
                                    {duplicateRejectCode?.length > 0 &&
                                      duplicateRejectCode?.map((item, index) => (
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
                                              onClick={(event) =>
                                                handleDelete(event, item, "duplicate")
                                              }
                                            >
                                              <StylePop className="ChipSpan rejected">
                                                {item?.code?.slice(0, 20)}{" "}
                                                {item?.code.length > 20 ? "..." : ""}
                                                :
                                                {item?.value?.slice(0, 20)}{" "}
                                                {item?.value?.length > 20 ? "..." : ""}
                                                <Typography sx={{ flexGrow: 1, ml: "10px" }}>
                                                  <CrossIcon state="rejected" />{" "}
                                                </Typography>
                                              </StylePop>{" "}
                                            </Typography>
                                          </Tooltip>
                                        </Stack>
                                      ))}
                                  </>
                                )}
                              </Grid>
                              {existingCode?.length > 0 ||
                                recaptureCode?.length > 0 ||
                                duplicateCode?.length > 0 ||
                                Object?.keys(suspectCode)?.length > 0 ||
                                existingCodeReject?.length > 0 ||
                                recaptureCodeReject?.length > 0 ||
                                suspectCodeReject?.length > 0 ||
                                duplicateCodeReject?.length > 0 ? (
                                <button
                                  style={{ cursor: "pointer" }}
                                  className="SubmitBtn"
                                  onClick={() => handleSubmitRedirect(tabs)}
                                >
                                  Submit
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
                                  Submit
                                </button>
                              )}
                            </Box>
                          </CardContent>
                        </Card>

                      </div>
                      <div style={backdropStyle} class="backdrop-filter"> </div>
                    </div>
                  </Grid>
                </Grid>
              </>
            </Grid>
          </Grid>
        </Container>

        <Container
          maxWidth="xl"
          sx={{
            marginTop: (tabs?.read_only_rejection_allowed?.active || tabs?.read_only_mode?.active)
              ? undefined
              : "100px !important",
            padding: "8px 50px !important",
            [theme.breakpoints.down("md")]: {
              padding: "10px !important",
            },

            '@media (max-width: 968px)': {
              marginTop: "0 !important",
            },
          }}
        >
          <Grid container spacing={2.5}>
            <Grid item xs={12} lg={9} md={8} sx={{ marginTop: "20px" }}>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {!isModalSubmit && codesData?.map((item, i) => (
                  <MuiAccordions
                    item={item}
                    summary={summary}
                    handleAddEventData={handleAddEventData}
                    tabs={tabs}
                    panel={item?.key}
                    name={item?.code}
                    setExpanded={setExpanded}
                    expanded={expanded}
                    key={item?.key}
                    sx={{
                      background:
                        expanded === item?.key
                          ? theme.palette.black.main
                          : "white",
                      color:
                        expanded === item?.key
                          ? "white"
                          : theme.palette.black.main,
                      borderBottomLeftRadius: expanded === item.key && 0,
                      borderBottomRightRadius: expanded === item.key && 0,
                    }}
                    expandIcon={
                      <ArrowDropDownIcon
                        width={12}
                        height={12}
                        fill={
                          expanded === item?.key
                            ? "white"
                            : theme.palette.secondary.A400
                        }
                      />
                    }
                    header={
                      <>
                        <Grid
                          container
                          className="codes-act-header-container"
                        >
                          <Grid
                            item
                            xs={7}
                            sm={7}
                            md={6}
                            lg={4}
                            xl={4}
                            className="codes-act-header"
                          >
                            <StyledText
                              sx={{
                                ...flexCenter,
                                gap: 0.5,
                                fontWeight: 500,
                                fontSize: "18px",
                              }}
                              className="codes-act-header-title"
                            >
                              {item?.code}
                              <Box
                                sx={{
                                  background:
                                    expanded === item.key
                                      ? "#FFFFFF"
                                      : "#3D4A8F",
                                  color:
                                    expanded === item.key
                                      ? "#3D4A8F"
                                      : "#FFFFFF",
                                  borderRadius: "100%",
                                  height: "1.3125rem",
                                  width: "1.3125rem",
                                  ...flexCenter,
                                  justifyContent: "center",
                                  [theme.breakpoints.only("xs")]: {
                                    m: 0,
                                  },
                                  ml: 1,
                                }}
                                className="codes-act-header-count-wrap"
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    textAlign: "center",
                                    fontWeight: 600,
                                    fontSize: "0.75rem",
                                    lineHeight: "0.914rem",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                  }}
                                  className="codes-act-header-count-text"
                                >
                                  {!loadingSummary ? (item?.codeCount || 0) : <ClipLoader color="#ffffff" size={15} />}
                                </Typography>
                              </Box>
                            </StyledText>
                          </Grid>
                          <Grid
                            item
                            xs={5}
                            sm={5}
                            md={6}
                            lg={8}
                            xl={8}
                            sx={{

                              [theme.breakpoints.up("xl")]: {
                                pl: 8,
                              },
                              [theme.breakpoints.up("md")]: {
                                pl: 6,
                              },
                            }}
                            className="codes-act-header-plist-wrap"
                          >
                            {item.problemList && (
                              <StyledText
                                sx={{
                                  ...flexCenter,
                                  gap: 0.5,
                                  fontWeight: 400,
                                  fontSize: "16px",
                                  marginRight: 4,
                                  [theme.breakpoints.down("md")]: {
                                    py: 1,
                                  },
                                }}
                                className="codes-act-header-plist-wrap1"
                              >
                                <Box
                                  sx={{
                                    ...flexCenter,
                                    justifyContent: "center",
                                  }}
                                  className="codes-act-header-plist-box"
                                >
                                  <WarningIcon
                                    width="1.3125rem"
                                    height="1.3125rem"
                                    fill={
                                      expanded === item.key ? "white" : "red"
                                    }
                                    className="codes-act-header-plist-icon"
                                  />
                                </Box>
                                {item.problemList}
                              </StyledText>
                            )}
                          </Grid>
                        </Grid>
                      </>
                    }
                  >
                    {item.container}
                  </MuiAccordions>
                ))}

                {isModalSubmit &&
                  <Container sx={{ height: '80vh' }}>

                  </Container>
                }
              </Box>

            </Grid>
            <Grid item xs={12} lg={3} md={4} sx={{ marginTop: "20px " }}>
              {!isModalSubmit && <Card
                sx={{
                  minWidth: 275,
                  borderRadius: "0.625rem 0.625rem 0.625rem 0.625rem",

                  [theme.breakpoints.down("md")]: {
                    display: "none",
                  },
                }}
              >
                <CardHeader
                  sx={{
                    background: "#242424",
                    borderRadius: "0.625rem 0.625rem 0rem 0rem",
                    paddingLeft: "5px",
                  }}
                  titleTypographyProps={{
                    fontSize: "1rem",
                    color: "#fff",
                    textTransform: "inherit",
                    fontWeight: "500",
                    paddingLeft: "0px !important",
                  }}
                  title="Codes needing attention"
                />
                <CardContent sx={{ position: "relative" }}>
                  {/* Content Wrapper */}
                  <div style={{ filter: loadingSummary ? "blur(4px)" : "none", pointerEvents: loadingSummary ? "none" : "auto" }}>
                    <Grid
                      container
                      sx={{ borderBottom: "1px solid #00000029", pb: 1, mb: 2 }}
                    >
                      <Grid item lg={2} md={2} sm={2} xs={12}>
                        <PrimaryButton
                          onClick={() => setExpanded(expanded == 1 ? false : 1)}
                          disabled={(summary?.existing_codes_count === undefined || summary?.existing_codes_count === 0) || 0}
                          sx={{
                            width: "2.375rem",
                            height: "1.5625rem",
                            backgroundColor: theme.palette.error.A200,
                            color: theme.palette.error.main,
                            ":hover": {
                              backgroundColor: theme.palette.error.A200,
                            },
                            ":disabled": {
                              backgroundColor: theme.palette.error.A200,
                              color: theme.palette.error.main,
                            },
                            fontWeight: 600,
                            minWidth: "inherit",
                            fontSize: "0.875rem",
                          }}
                        >
                          {summary?.existing_codes_count || 0}
                        </PrimaryButton>
                      </Grid>
                      <Grid item lg={10} md={10} sm={2} xs={12} sx={{ pl: 1 }}>
                        <Typography
                          sx={{
                            fontFamily: "Proxima Nova Rg",
                            fontSize: "1rem",
                            color: "rgba(0, 0, 0, 0.60)",
                            fontWeight: "500",
                            lineHeight: "1.375rem",
                            textTransform: "initial",
                          }}
                        >
                          You have{" "}
                          <Typography
                            component="span"
                            sx={{
                              color: "#000",
                              fontWeight: "800",
                            }}
                          >
                            {summary?.existing_codes_count || 0}
                          </Typography>{" "}
                          urgent existing conditions requiring recapturing.
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid
                      container
                      sx={{ borderBottom: "1px solid #00000029", pb: 1, mb: 2 }}
                    >
                      <Grid item lg={2} md={2} sm={2} xs={12}>
                        <PrimaryButton
                          disabled={(summary?.suspect_conditions_count === undefined || summary?.suspect_conditions_count === 0) || 0}
                          sx={{
                            width: "2.375rem",
                            height: "1.5625rem",
                            backgroundColor: theme.palette.error.A200,
                            color: theme.palette.error.main,
                            ":hover": {
                              backgroundColor: theme.palette.error.A200,
                            },
                            ":disabled": {
                              backgroundColor: theme.palette.error.A200,
                              color: theme.palette.error.main,
                            },
                            fontWeight: 600,
                            minWidth: "inherit",
                            fontSize: "0.875rem",
                          }}
                          onClick={() => setExpanded((summary?.suspect_conditions_count === undefined && summary?.suspect_conditions_count === 0) ? false : expanded == 2 ? false : 2)}
                        >
                          {summary?.suspect_conditions_count || 0}
                        </PrimaryButton>
                      </Grid>
                      <Grid item lg={10} md={10} sm={2} xs={12} sx={{ pl: 1 }}>
                        <Typography
                          sx={{
                            fontFamily: "Proxima Nova Rg",
                            fontWeight: 500,
                            fontSize: "1rem",
                            color: "rgba(0, 0, 0, 0.60)",
                            lineHeight: "1.375rem",
                            textTransform: "initial",
                          }}
                        >
                          You have{" "}
                          <Typography
                            component="span"
                            sx={{
                              color: "#000",
                              fontWeight: "800",
                            }}
                          >
                            {summary?.suspect_conditions_count || 0}
                          </Typography>{" "}
                          urgent new suspects for review.
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid container>
                      <Grid item lg={2} md={2} sm={2} xs={12}>
                        <PrimaryButton
                          disabled={(summary?.recapture_codes_count === undefined || summary?.recapture_codes_count === 0) || 0}
                          onClick={() => setExpanded(expanded == 3 ? false : 3)}
                          sx={{
                            width: "2.375rem",
                            height: "1.5625rem",
                            backgroundColor: theme.palette.error.A200,
                            color: theme.palette.error.main,
                            ":hover": {
                              backgroundColor: theme.palette.error.A200,
                            },
                            ":disabled": {
                              backgroundColor: theme.palette.error.A200,
                              color: theme.palette.error.main,
                            },
                            fontWeight: 600,
                            minWidth: "inherit",
                            fontSize: "0.875rem",
                          }}
                        >
                          {summary?.recapture_codes_count || 0}
                        </PrimaryButton>
                      </Grid>
                      <Grid item lg={10} md={10} sm={2} xs={12} sx={{ pl: 1, mt: 1 }}>
                        <Typography
                          sx={{
                            fontFamily: "Proxima Nova Rg",
                            fontWeight: 500,
                            fontSize: "1rem",
                            color: "rgba(0, 0, 0, 0.60)",
                            fontWeight: "600",
                            lineHeight: "1.375rem",
                            textTransform: "initial",
                          }}
                        >
                          You have{" "}
                          <Typography
                            component="span"
                            sx={{
                              color: "#000",
                              fontWeight: "800",
                            }}
                          >
                            {summary?.recapture_codes_count || 0}
                          </Typography>{" "}
                          codes that are not in the problem list.
                        </Typography>
                      </Grid>
                    </Grid>
                  </div>

                  {/* Loader Overlay */}
                  {loadingSummary && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(255, 255, 255, 0.7)", // Optional: Semi-transparent background for emphasis
                      }}
                    >
                      <ClipLoader size={48} color="#17236D" cssOverride={{
                        borderWidth: '5px'
                      }} />


                    </div>
                  )}
                </CardContent>

              </Card>
              }

              {!isModalSubmit && <Card
                className="CardBox"
                sx={{
                  minWidth: 275,
                  borderRadius: "0.625rem 0.625rem 0.625rem 0.625rem",
                  mt: 3,

                  [theme.breakpoints.down("md")]: {
                    display: "none",
                  },
                }}
              >
                <CardHeader
                  sx={{
                    background: "#242424",
                    borderRadius: "0.625rem 0.625rem 0rem 0rem",
                    paddingLeft: "5px",
                    flexDirection: "row-reverse",
                  }}
                  titleTypographyProps={{
                    fontSize: "1rem",
                    color: "#fff",
                    textTransform: "inherit",
                    fontWeight: "600",
                    paddingLeft: "0px !important",

                    [theme.breakpoints.up("md")]: {
                      color: theme.palette.black.main,
                    },
                  }}
                  title="Summary"
                  avatar={
                    sumCount > 0 ? (
                      <Avatar className="AvatarCard" aria-label="recipe">
                        {sumCount}
                      </Avatar>
                    ) : (
                      <Avatar className="AvatarCard" aria-label="recipe" >
                        0
                      </Avatar>
                    )
                  }
                />

                <CardContent sx={{ position: "relative" }}>
                  <div style={{ filter: loadingSummary ? "blur(4px)" : "none", pointerEvents: loadingSummary ? "none" : "auto" }}>
                    <Box>
                      <Grid
                        container
                        sx={{ borderBottom: "1px solid #00000029", pb: 2, mb: 2 }}
                      >
                        <Grid item lg={9} md={9} sm={10} xs={12}>
                          <Typography className="HeadSummary">
                            Existing Conditions (recapturing required)
                          </Typography>
                        </Grid>
                        {!(existingCode?.length || existingRejectCode?.length) >
                          0 ? (
                          <>
                            <Grid
                              item
                              lg={3}
                              md={3}
                              sm={2}
                              xs={12}
                              sx={{ textAlign: "end" }}
                            >
                              <StyleSheetNumber>0</StyleSheetNumber>
                            </Grid>

                            <div className="ItemsDiv">
                              <p>0 item</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <Grid
                              item
                              lg={3}
                              md={3}
                              sm={2}
                              xs={12}
                              sx={{ textAlign: "end" }}
                            >
                              <StyleSheetNumber>
                                {(existingCode?.length || 0) +
                                  (existingRejectCode?.length || 0)}
                              </StyleSheetNumber>
                            </Grid>
                            {existingCode?.length > 0 &&
                              existingCode?.map((item, index) => (
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
                                      sx={
                                        {
                                          padding: "0px !important",
                                          paddingRight: "8px !important"
                                        }
                                      }
                                      onClick={(event) =>
                                        handleDelete(event, item, "existing")
                                      }
                                    >
                                      <StylePop className="ChipSpan">
                                        {item?.code?.slice(0, 20)}{" "}
                                        {item?.code.length > 20 ? "..." : ""}
                                        <Typography sx={{ flexGrow: 1, ml: "10px" }}>
                                          <CrossIcon />{" "}
                                        </Typography>
                                      </StylePop>{" "}
                                    </Typography>
                                  </Tooltip>
                                </Stack>
                              ))}
                            {existingRejectCode?.length > 0 &&
                              existingRejectCode?.map((item, index) => (
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
                                      onClick={(event) =>
                                        handleDelete(event, item, "existing")
                                      }
                                      sx={
                                        {
                                          padding: "0px !important",
                                          paddingRight: "8px !important"
                                        }
                                      }
                                    >
                                      <StylePop className="ChipSpan rejected">
                                        {item?.code?.slice(0, 20)}{" "}
                                        {item?.code.length > 20 ? "..." : ""}
                                        <Typography sx={{ flexGrow: 1, ml: "10px" }}>
                                          <CrossIcon state="rejected" />{" "}
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
                        sx={{ borderBottom: "1px solid #00000029", pb: 2, mb: 2 }}
                      >
                        <Grid item lg={9} md={9} sm={10} xs={12}>
                          <Typography className="HeadSummary">
                            Suspects
                          </Typography>
                        </Grid>
                        {!(
                          Object?.keys(suspectCode)?.length ||
                          0 + suspectCodeReject?.length ||
                          0
                        ) > 0 ? (
                          <>
                            <Grid
                              item
                              lg={3}
                              md={3}
                              sm={2}
                              xs={12}
                              sx={{ textAlign: "end" }}
                            >
                              <StyleSheetNumber>0</StyleSheetNumber>
                            </Grid>

                            <div className="ItemsDiv">
                              <p>0 item</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <Grid
                              item
                              lg={3}
                              md={3}
                              sm={2}
                              xs={12}
                              sx={{ textAlign: "end" }}
                            >
                              <StyleSheetNumber>
                                {(suspectCode?.length || 0) +
                                  (suspectCodeReject?.length || 0)}
                              </StyleSheetNumber>
                            </Grid>
                            {suspectCode && suspectCode?.length > 0 &&
                              suspectCode?.map((item, index) => (
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
                                    title={item?.code + ((item?.value) ? (" : " + item?.value) : null)}
                                  >
                                    <Typography
                                      sx={
                                        {
                                          padding: "0px !important",
                                          paddingRight: "8px !important"
                                        }
                                      }
                                      onClick={(event) =>
                                        handleDelete(event, item, "suspect")
                                      }
                                    >
                                      <StylePop className="ChipSpan">
                                        {item?.code?.slice(0, 20)}{" "}
                                        {item?.code.length > 20 ? "..." : ""}
                                        <Typography sx={{ flexGrow: 1, ml: "10px" }}>
                                          <CrossIcon />{" "}
                                        </Typography>
                                      </StylePop>{" "}
                                    </Typography>
                                  </Tooltip>
                                </Stack>
                              ))}
                            {suspectCodeReject && suspectCodeReject?.length > 0 &&
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
                                      item[Object.keys(item)].value
                                    }
                                  >
                                    <Typography
                                      sx={
                                        {
                                          padding: "0px !important",
                                          paddingRight: "8px !important"
                                        }
                                      }
                                      onClick={(event) =>
                                        handleDelete(event, item, "suspect")
                                      }
                                    >
                                      <StylePop className="ChipSpan rejected">
                                        {Object.keys(item)
                                          .toString()
                                          .slice(0, 20)}{" "}
                                        {Object.keys(item).toString().length > 20
                                          ? "..."
                                          : ""}
                                        <Typography sx={{ flexGrow: 1, ml: "10px" }}>
                                          <CrossIcon state="rejected" />{" "}
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
                        sx={{ borderBottom: "1px solid #00000029", pb: 2, mb: 2 }}
                      >
                        <Grid item lg={9} md={9} sm={10} xs={12}>
                          <Typography className="HeadSummary">
                            Codes not in problem list
                          </Typography>
                        </Grid>
                        {!(
                          recaptureCode?.length ||
                          0 + recaptureRejectCode?.length ||
                          0
                        ) > 0 ? (
                          <>
                            <Grid
                              item
                              lg={3}
                              md={3}
                              sm={2}
                              xs={12}
                              sx={{ textAlign: "end" }}
                            >
                              <StyleSheetNumber>0</StyleSheetNumber>
                            </Grid>

                            <div className="ItemsDiv">
                              <p>0 item</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <Grid
                              item
                              lg={3}
                              md={3}
                              sm={2}
                              xs={12}
                              sx={{ textAlign: "end" }}
                            >
                              <StyleSheetNumber>
                                {(recaptureCode?.length || 0) +
                                  (recaptureRejectCode?.length || 0)}
                              </StyleSheetNumber>
                            </Grid>
                            {recaptureCode && recaptureCode?.length > 0 &&
                              recaptureCode?.map((item, index) => (
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  sx={{
                                    px: 0,
                                    position: "relative",
                                    ml: 0.08,
                                    mt: 0.5,
                                    cursor: "pointer",
                                  }}
                                >
                                  <Tooltip
                                    title={item?.code + " : " + item?.value}
                                  >
                                    <Typography
                                      sx={
                                        {
                                          padding: "0px !important",
                                          paddingRight: "8px !important"
                                        }
                                      }
                                      onClick={(event) =>
                                        handleDelete(event, item, "recapture")
                                      }
                                    >
                                      <StylePop className="ChipSpan">
                                        {item?.code?.slice(0, 20)}{" "}
                                        {item?.code.length > 20 ? "..." : ""}
                                        <Typography sx={{ flexGrow: 1, ml: "10px" }}>
                                          <CrossIcon />{" "}
                                        </Typography>
                                      </StylePop>{" "}
                                    </Typography>
                                  </Tooltip>
                                </Stack>
                              ))}
                            {recaptureRejectCode && recaptureRejectCode?.length > 0 &&
                              recaptureRejectCode?.map((item, index) => (
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  sx={{
                                    px: 0,
                                    position: "relative",
                                    ml: 0.08,
                                    mt: 0.5,
                                    cursor: "pointer",
                                  }}
                                >
                                  <Tooltip
                                    title={item?.code + " : " + item?.value}
                                  >
                                    <Typography
                                      sx={
                                        {
                                          padding: "0px !important",
                                          paddingRight: "8px !important"
                                        }
                                      }
                                      onClick={(event) =>
                                        handleDelete(event, item, "recapture")
                                      }
                                    >
                                      <StylePop className="ChipSpan rejected">
                                        {item?.code?.slice(0, 20)}{" "}
                                        {item?.code.length > 20 ? "..." : ""}
                                        <Typography sx={{ flexGrow: 1, ml: "10px" }}>
                                          <CrossIcon state="rejected" />{" "}
                                        </Typography>
                                      </StylePop>{" "}
                                    </Typography>
                                  </Tooltip>
                                </Stack>
                              ))}
                          </>
                        )}
                      </Grid>

                      <Grid container sx={{ pb: 2, mb: 0, position: "relative" }}>
                        <Grid item lg={9} md={9} sm={10} xs={12}>
                          <Typography className="HeadSummary">
                            Additional diagnoses
                          </Typography>
                        </Grid>
                        {!(
                          duplicateCode?.length ||
                          0 + duplicateRejectCode?.length ||
                          0
                        ) > 0 ? (
                          <>
                            <Grid
                              item
                              lg={3}
                              md={3}
                              sm={2}
                              xs={12}
                              sx={{ textAlign: "end" }}
                            >
                              <StyleSheetNumber>0</StyleSheetNumber>
                            </Grid>

                            <div className="ItemsDiv">
                              <p>0 item</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <Grid
                              item
                              lg={3}
                              md={3}
                              sm={2}
                              xs={12}
                              sx={{ textAlign: "end" }}
                            >
                              <StyleSheetNumber>
                                {(duplicateCode?.length || 0) +
                                  (duplicateRejectCode?.length || 0)}
                              </StyleSheetNumber>
                            </Grid>
                            {duplicateCode && duplicateCode?.length > 0 &&
                              duplicateCode?.map((item, index) => (
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  sx={{
                                    px: 0,
                                    position: "relative",
                                    ml: 0.08,
                                    mt: 0.5,
                                    cursor: "pointer",
                                  }}
                                >
                                  <Tooltip
                                    title={item?.code + " : " + item?.value}
                                  >
                                    <Typography
                                      sx={
                                        {
                                          padding: "0px !important",
                                          paddingRight: "8px !important"
                                        }
                                      }
                                      onClick={(event) =>
                                        handleDelete(event, item, "duplicate")
                                      }
                                    >
                                      <StylePop className="ChipSpan">
                                        {item?.code?.slice(0, 20)}{" "}
                                        {item?.code.length > 20 ? "..." : ""}
                                        <Typography sx={{ flexGrow: 1, ml: "10px" }}>
                                          <CrossIcon />{" "}
                                        </Typography>
                                      </StylePop>{" "}
                                    </Typography>
                                  </Tooltip>
                                </Stack>
                              ))}
                            {duplicateRejectCode?.length > 0 &&
                              duplicateRejectCode?.map((item, index) => (
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  sx={{
                                    px: 0,
                                    position: "relative",
                                    ml: 0.08,
                                    mt: 0.5,
                                    cursor: "pointer",
                                  }}
                                >
                                  <Tooltip
                                    title={item?.code + " : " + item?.value}
                                  >
                                    <Typography
                                      sx={
                                        {
                                          padding: "0px !important",
                                          paddingRight: "8px !important"
                                        }
                                      }
                                      onClick={(event) =>
                                        handleDelete(event, item, "duplicate")
                                      }
                                    >
                                      <StylePop className="ChipSpan rejected">
                                        {item?.code?.slice(0, 20)}{" "}
                                        {item?.code.length > 20 ? "..." : ""}
                                        <Typography sx={{ flexGrow: 1, ml: "10px" }}>
                                          <CrossIcon state="rejected" />{" "}
                                        </Typography>
                                      </StylePop>{" "}
                                    </Typography>
                                  </Tooltip>
                                </Stack>
                              ))}
                          </>
                        )}
                      </Grid>

                      <Grid container sx={{ pb: 2, mb: 0, position: "relative" }}>
                        <Grid item lg={9} md={9} sm={10} xs={12}>
                          <Typography className="HeadSummary">
                            External Data
                          </Typography>
                        </Grid>
                        {!(
                          duplicateCode?.length ||
                          0 + duplicateRejectCode?.length ||
                          0
                        ) > 0 ? (
                          <>
                            <Grid
                              item
                              lg={3}
                              md={3}
                              sm={2}
                              xs={12}
                              sx={{ textAlign: "end" }}
                            >
                              <StyleSheetNumber>0</StyleSheetNumber>
                            </Grid>

                            <div className="ItemsDiv">
                              <p>0 item</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <Grid
                              item
                              lg={3}
                              md={3}
                              sm={2}
                              xs={12}
                              sx={{ textAlign: "end" }}
                            >
                              <StyleSheetNumber>
                                {(duplicateCode?.length || 0) +
                                  (duplicateRejectCode?.length || 0)}
                              </StyleSheetNumber>
                            </Grid>
                            {duplicateCode && duplicateCode?.length > 0 &&
                              duplicateCode?.map((item, index) => (
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  sx={{
                                    px: 0,
                                    position: "relative",
                                    ml: 0.08,
                                    mt: 0.5,
                                    cursor: "pointer",
                                  }}
                                >
                                  <Tooltip
                                    title={item?.code + " : " + item?.value}
                                  >
                                    <Typography
                                      sx={
                                        {
                                          padding: "0px !important",
                                          paddingRight: "8px !important"
                                        }
                                      }
                                      onClick={(event) =>
                                        handleDelete(event, item, "duplicate")
                                      }
                                    >
                                      <StylePop className="ChipSpan">
                                        {item?.code?.slice(0, 20)}{" "}
                                        {item?.code.length > 20 ? "..." : ""}
                                        <Typography sx={{ flexGrow: 1, ml: "10px" }}>
                                          <CrossIcon />{" "}
                                        </Typography>
                                      </StylePop>{" "}
                                    </Typography>
                                  </Tooltip>
                                </Stack>
                              ))}
                            {duplicateRejectCode?.length > 0 &&
                              duplicateRejectCode?.map((item, index) => (
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  sx={{
                                    px: 0,
                                    position: "relative",
                                    ml: 0.08,
                                    mt: 0.5,
                                    cursor: "pointer",
                                  }}
                                >
                                  <Tooltip
                                    title={item?.code + " : " + item?.value}
                                  >
                                    <Typography
                                      sx={
                                        {
                                          padding: "0px !important",
                                          paddingRight: "8px !important"
                                        }
                                      }
                                      onClick={(event) =>
                                        handleDelete(event, item, "duplicate")
                                      }
                                    >
                                      <StylePop className="ChipSpan rejected">
                                        {item?.code?.slice(0, 20)}{" "}
                                        {item?.code.length > 20 ? "..." : ""}
                                        <Typography sx={{ flexGrow: 1, ml: "10px" }}>
                                          <CrossIcon state="rejected" />{" "}
                                        </Typography>
                                      </StylePop>{" "}
                                    </Typography>
                                  </Tooltip>
                                </Stack>
                              ))}
                          </>
                        )}
                      </Grid>

                      {existingCode?.length > 0 ||
                        recaptureCode?.length > 0 ||
                        duplicateCode?.length > 0 ||
                        Object?.keys(suspectCode)?.length > 0 ||
                        existingCodeReject?.length > 0 ||
                        recaptureCodeReject?.length > 0 ||
                        duplicateCodeReject?.length > 0 ||
                        suspectCodeReject?.length > 0 ? (
                        <button
                          style={{ cursor: "pointer" }}
                          className="SubmitBtn"
                          onClick={() => handleSubmitRedirect(tabs)}
                        >
                          Submit
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
                          Submit
                        </button>
                      )}
                    </Box>
                  </div>

                  {loadingSummary && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(255, 255, 255, 0.7)", // Optional: Semi-transparent background for emphasis
                      }}
                    >
                      <ClipLoader size={48} color="#17236D" cssOverride={{
                        borderWidth: '5px'
                      }} />
                    </div>
                  )}
                </CardContent>


              </Card>
              }
            </Grid>
          </Grid>
        </Container>

      </Box>

      <SubmitModal
        handleAddEventData={handleAddEventData}
        openSubmitModal={openSubmitModal}
        closeSubmitModal={closeSubmitModal}
        handleSubmit={handleSubmit}
        setOpenSubmitModal={setOpenSubmitModal}
        setCloseSubmitModal={setCloseSubmitModal}
        existingCode={existingCode}
        recaptureCode={recaptureCode}
        switchModal={switchModal}
        duplicateCode={duplicateCode}
        duplicateCodeReject={duplicateCodeReject}
        suspectCode={suspectCode}
        suspectCodeReject={suspectCodeReject}
        summary={summary}
        existingCodeReject={existingCodeReject}
        existingRejectData={existingRejectData}
        handleDelete={handleDelete}
        recaptureRejectCode={recaptureRejectCode}
        recaptureCodeReject={recaptureCodeReject}
        existingRejectCode={existingRejectCode}
        duplicateRejectCode={duplicateRejectCode}
        existingConditionNew={existingConditionNew}
        duplicateCodeNew={duplicateCodeNew}
        recaptureCodeNew={recaptureCodeNew}
        suspectCodeNew={suspectCodeNew}
        isModalOpen={isModalOpen}

      />

      <DialogModal
        open={dialog}
        setOpen={setDialog}
        header={<GreenDoneIcon style={{ width: 45, height: 45, }} />}
        width="26rem"
        removeCloseButton={true}
        sx={{ padding: 0 }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            mb: 3,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                display: "flex",
                fontSize: "18px",
                justifyContent: 'center',
                fontWeight: 700,
                lineHeight: "28px",
                letterSpacing: "0em",
                textAlign: "center",
                color: "#242629",
              }}
            >
              Your actions are successfully captured
            </Typography>
            {
              tabs && tabs['type']?.value == "Athena" ?
                (<><Typography
                  variant="body2"
                  sx={{
                    marginTop: '5px',
                    color: "#5C6469",
                    textAlign: 'center'
                  }}
                >
                  You can now close the DoctusTech window by
                </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#5C6469",
                      textAlign: 'center'
                    }}
                  >
                    clicking X button.
                  </Typography></>) : (<><Typography
                    onClick={() => finalSummaryScreenHoag()}
                    variant="body2"
                    sx={{
                      marginTop: '5px',
                      color: "#0D426A",
                      textAlign: 'center',
                      cursor: "pointer",

                    }}
                  >
                    Review actions that have been taken {!hoagmodalarrow ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
                  </Typography>

                    {hoagmodalarrow ? <DialogContent
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexDirection: "column",
                        padding: "0px !important",
                        overflowX: "hidden",
                        height: '325px',
                        overflowY: 'auto'
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
                          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ margin: 0, padding: 0 }}>
                            <Grid >
                              <Card sx={{ margin: '0px !important', padding: '0px !important' }}>
                                <CardContent sx={{ paddingInline: "0px", marginRight: { xs: "0px", sm: "0px", md: "16px" } }}>
                                  <Box className="modalInner" sx={{ overflow: "hidden", }}>
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
                                          Codes/Conditions to be actioned in Reconcile Outside Information tab
                                        </StyledCodeTypography>
                                      </Grid>

                                      {combinedDatahoag.length == 0 ? (
                                        <>
                                          <div className="ItemsDivNew">
                                            <p>No applicable codes/conditions.</p>
                                          </div>
                                        </>
                                      ) :

                                        combinedDatahoag.map((item, index) => (
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
                                                  {
                                                    windowSize.width > 967
                                                      ? item?.value?.slice(0, 40) + (item?.value?.length > 40 ? "..." : "")
                                                      : windowSize.width > 767
                                                        ? item?.value?.slice(0, 25) + (item?.value?.length > 25 ? "..." : "")
                                                        : windowSize.width > 567
                                                          ? item?.value?.slice(0, 25) + (item?.value?.length > 25 ? "..." : "")
                                                          : windowSize.width > 437
                                                            ? item?.value?.slice(0, 24) + (item?.value?.length > 24 ? "..." : "")
                                                            : windowSize.width > 407
                                                              ? item?.value?.slice(0, 20) + (item?.value?.length > 20 ? "..." : "")
                                                              : windowSize.width > 367
                                                                ? item?.value?.slice(0, 15) + (item?.value?.length > 15 ? "..." : "")
                                                                : windowSize.width > 319
                                                                  ? item?.value?.slice(0, 10) + (item?.value?.length > 10 ? "..." : "")
                                                                  : item?.value
                                                  }
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
                                        combinedData2hoag.length == 0 ? (
                                          <>
                                            <div className="ItemsDivNew">
                                              <p>No applicable codes/conditions.</p>
                                            </div>
                                          </>
                                        ) :

                                          combinedData2hoag.map((item, index) => (
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
                                                title={item?.code + ((item?.value) ? (" : " + item?.value) : null)}
                                              >
                                                <Typography>
                                                  <StylePop className="ChipSpan">
                                                    {item?.code?.slice(0, 30)} {item?.code.length > 30 ? "..." : ""}
                                                    {item?.value ? ":" : ""}
                                                    {
                                                      windowSize.width > 967
                                                        ? item?.value?.slice(0, 40) + (item?.value?.length > 40 ? "..." : "")
                                                        : windowSize.width > 767
                                                          ? item?.value?.slice(0, 25) + (item?.value?.length > 25 ? "..." : "")
                                                          : windowSize.width > 567
                                                            ? item?.value?.slice(0, 25) + (item?.value?.length > 25 ? "..." : "")
                                                            : windowSize.width > 437
                                                              ? item?.value?.slice(0, 24) + (item?.value?.length > 24 ? "..." : "")
                                                              : windowSize.width > 407
                                                                ? item?.value?.slice(0, 20) + (item?.value?.length > 20 ? "..." : "")
                                                                : windowSize.width > 367
                                                                  ? item?.value?.slice(0, 15) + (item?.value?.length > 15 ? "..." : "")
                                                                  : windowSize.width > 319
                                                                    ? item?.value?.slice(0, 10) + (item?.value?.length > 10 ? "..." : "")
                                                                    : item?.value
                                                    }
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
                                                        {
                                                          windowSize.width > 967
                                                            ? item[Object.keys(item)].value.slice(0, 40) + (item[Object.keys(item)].value.length > 40 ? "..." : "")
                                                            : windowSize.width > 767
                                                              ? item[Object.keys(item)].value.slice(0, 25) + (item[Object.keys(item)].value.length > 25 ? "..." : "")
                                                              : windowSize.width > 567
                                                                ? item[Object.keys(item)].value.slice(0, 24) + (item[Object.keys(item)].value.length > 24 ? "..." : "")
                                                                : windowSize.width > 437
                                                                  ? item[Object.keys(item)].value.slice(0, 24) + (item[Object.keys(item)].value.length > 24 ? "..." : "")
                                                                  : windowSize.width > 407
                                                                    ? item[Object.keys(item)].value.slice(0, 20) + (item[Object.keys(item)].value.length > 20 ? "..." : "")
                                                                    : windowSize.width > 367
                                                                      ? item[Object.keys(item)].value.slice(0, 15) + (item[Object.keys(item)].value.length > 15 ? "..." : "")
                                                                      : windowSize.width > 319
                                                                        ? item[Object.keys(item)].value.slice(0, 10) + (item[Object.keys(item)].value.length > 10 ? "..." : "")
                                                                        : item[Object.keys(item)].value
                                                        }
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
                                                        {
                                                          windowSize.width > 967
                                                            ? item[Object.keys(item)].value.slice(0, 40) + (item[Object.keys(item)].value.length > 40 ? "..." : "")
                                                            : windowSize.width > 767
                                                              ? item[Object.keys(item)].value.slice(0, 25) + (item[Object.keys(item)].value.length > 25 ? "..." : "")
                                                              : windowSize.width > 567
                                                                ? item[Object.keys(item)].value.slice(0, 24) + (item[Object.keys(item)].value.length > 24 ? "..." : "")
                                                                : windowSize.width > 437
                                                                  ? item[Object.keys(item)].value.slice(0, 24) + (item[Object.keys(item)].value.length > 24 ? "..." : "")
                                                                  : windowSize.width > 407
                                                                    ? item[Object.keys(item)].value.slice(0, 20) + (item[Object.keys(item)].value.length > 20 ? "..." : "")
                                                                    : windowSize.width > 367
                                                                      ? item[Object.keys(item)].value.slice(0, 15) + (item[Object.keys(item)].value.length > 15 ? "..." : "")
                                                                      : windowSize.width > 319
                                                                        ? item[Object.keys(item)].value.slice(0, 10) + (item[Object.keys(item)].value.length > 10 ? "..." : "")
                                                                        : item[Object.keys(item)].value
                                                        }
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
                                                        {
                                                          windowSize.width > 967
                                                            ? item[Object.keys(item)].value.slice(0, 40) + (item[Object.keys(item)].value.length > 40 ? "..." : "")
                                                            : windowSize.width > 767
                                                              ? item[Object.keys(item)].value.slice(0, 25) + (item[Object.keys(item)].value.length > 25 ? "..." : "")
                                                              : windowSize.width > 567
                                                                ? item[Object.keys(item)].value.slice(0, 24) + (item[Object.keys(item)].value.length > 24 ? "..." : "")
                                                                : windowSize.width > 437
                                                                  ? item[Object.keys(item)].value.slice(0, 24) + (item[Object.keys(item)].value.length > 24 ? "..." : "")
                                                                  : windowSize.width > 407
                                                                    ? item[Object.keys(item)].value.slice(0, 20) + (item[Object.keys(item)].value.length > 20 ? "..." : "")
                                                                    : windowSize.width > 367
                                                                      ? item[Object.keys(item)].value.slice(0, 15) + (item[Object.keys(item)].value.length > 15 ? "..." : "")
                                                                      : windowSize.width > 319
                                                                        ? item[Object.keys(item)].value.slice(0, 10) + (item[Object.keys(item)].value.length > 10 ? "..." : "")
                                                                        : item[Object.keys(item)].value
                                                        }
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
                                                        {
                                                          windowSize.width > 967
                                                            ? item[Object.keys(item)].value.slice(0, 40) + (item[Object.keys(item)].value.length > 40 ? "..." : "")
                                                            : windowSize.width > 767
                                                              ? item[Object.keys(item)].value.slice(0, 25) + (item[Object.keys(item)].value.length > 25 ? "..." : "")
                                                              : windowSize.width > 567
                                                                ? item[Object.keys(item)].value.slice(0, 24) + (item[Object.keys(item)].value.length > 24 ? "..." : "")
                                                                : windowSize.width > 437
                                                                  ? item[Object.keys(item)].value.slice(0, 24) + (item[Object.keys(item)].value.length > 24 ? "..." : "")
                                                                  : windowSize.width > 407
                                                                    ? item[Object.keys(item)].value.slice(0, 20) + (item[Object.keys(item)].value.length > 20 ? "..." : "")
                                                                    : windowSize.width > 367
                                                                      ? item[Object.keys(item)].value.slice(0, 15) + (item[Object.keys(item)].value.length > 15 ? "..." : "")
                                                                      : windowSize.width > 319
                                                                        ? item[Object.keys(item)].value.slice(0, 10) + (item[Object.keys(item)].value.length > 10 ? "..." : "")
                                                                        : item[Object.keys(item)].value
                                                        }                                         </StylePop>{" "}
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
                    </DialogContent> : null}

                  </>)
            }
          </Box>
        </Box>
      </DialogModal>


      <IdleModal open={idleModal}
        setOpen={setIdleModal}
        header={<GreenDoneIcon style={{ width: 45, height: 45, }} />}
        width="26rem"
        removeCloseButton={true} />
    </>
  );
};

const flexCenter = {
  display: "flex",
  alignItems: "center",
};

const flexAlignCenter = {
  display: "flex",
  alignItems: "center",
};