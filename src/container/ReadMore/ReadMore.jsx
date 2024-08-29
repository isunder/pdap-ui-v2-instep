import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";


export const ReadMore = ({ children, length, readMore, showLess, other, user, tabs, item, handleAddEventData }) => {
    const [isReadMore, setIsReadMore] = useState(false);
    const { doctorDetail } = useSelector((state) => state?.doctor?.data);

    const toggleReadMore = () => {
        setIsReadMore(!isReadMore)
        if (!isReadMore) {
            const exampleMetadata = {
                event_type: "SUSPECT_SEE_LESS_DETAILS", metadata: {
                    identifier: tabs?.["id_user"]?.value || "",
                    provider_name: doctorDetail?.doctor_name || "",
                    patient_id: user?.data?.userInfo?.mrn || "",
                    event_datetime: new Date().toISOString(),
                    code: item?.code,
                    description: item?.definition,
                    raf: item?.total_weight,
                    alternateCodes: "",
                }
            };

            handleAddEventData(exampleMetadata);
        }

        else {
            const exampleMetadata = {
                event_type: "SUSPECT_READ_MORE_DETAILS", metadata: {
                    identifier: tabs?.["id_user"]?.value || "",
                    provider_name: doctorDetail?.doctor_name || "",
                    patient_id: user?.data?.userInfo?.mrn || "",
                    event_datetime: new Date().toISOString(),
                    code: item?.code,
                    description: item?.definition,
                    reasonForRejection: "rejectReason",
                    raf: item?.total_weight,
                    alternateCodes: "",
                }
            };

            handleAddEventData(exampleMetadata);
        }

    }
    return (
        <>
            <Box component='p' onClick={() => toggleReadMore()} sx={{
                mt: isReadMore ? 1 : 0,
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "21px",
                display: isReadMore ? "block" : "inline",
            }} >
                {!isReadMore ? children.slice(0, length) : children}
                <Typography component='span' sx={{ cursor: 'pointer', ...other }}

                >
                    {!isReadMore ? `${readMore}` : `${showLess}`}
                </Typography>
            </Box>
        </>
    );
}