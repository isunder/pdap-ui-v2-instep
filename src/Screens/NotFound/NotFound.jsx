import React, { useEffect } from 'react';
import './NotFound.css'
import { TabsSlag } from "../../container/TabsSlag/TabsSlag";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuditLogs } from "../../redux/userSlice/auditLogSlice";
import { convertDate } from '../../utils/helper';

export const NotFound = () => {

  const { doctorDetail } = useSelector((state) => state?.doctor?.data);
  const { user } = useSelector((state) => state);

  const tabs = TabsSlag();
  const funcName = localStorage.getItem("handleAddEventData") || null;
  const dispatch = useDispatch();
  const currentUrl = window.location.href;
  useEffect(() => {
    sessionStorage.clear();

    const identifier = tabs?.["user"]?.value || "";
    const providerName = doctorDetail?.doctor_name || "";
    const patientId = user?.data?.userInfo?.mrn || "";
    const eventDateTime = convertDate(new Date().toISOString());

    const payloadFailure = {
      event_type: "LAUNCH_FAILURE",
      metadata: {
        identifier,
        provider_name: providerName,
        patient_id: patientId,
        event_datetime: eventDateTime,
        description: "Launch Failed",
      }
    };

    if (currentUrl.includes("404")) {
      dispatch(fetchAuditLogs([payloadFailure]));
    }
    return () => {
    };
  }, []);

  return (
    <div id="notfound">
      <div className="notfound">
        <div className="notfound-bg">
          <div></div>
          <div></div>
          <div></div>
        </div>
        <h2></h2>
        <h3 style={{ fontSize: '100% ' }}>Patient appears to be new. There will be data available to be shown at the next
          appointment.</h3>
      </div>
    </div>

  )
}
