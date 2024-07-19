import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { addAuditLog1 } from "../../utils/indexedDb";

export const ReadMore = ({ children, length, readMore, showLess, other, item }) => {
    const [isReadMore, setIsReadMore] = useState(false);
    const toggleReadMore = () => {
        setIsReadMore(!isReadMore)
        if (!isReadMore) {
            addAuditLog1('Suspect read more', item.SuspectedCondition, item.definition)
        }

        else {
            addAuditLog1('Suspect read less', item.SuspectedCondition, item.definition)
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