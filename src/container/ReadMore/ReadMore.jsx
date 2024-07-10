import { Box, Typography } from "@mui/material";
import { useState } from "react";

export const ReadMore = ({ children, length, readMore, showLess, other }) => {
    const [isReadMore, setIsReadMore] = useState(false);
    const toggleReadMore = () => {
        setIsReadMore(!isReadMore)
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