import { IconButton } from "@mui/material"
import { CrosseIcon } from "../Icons"

export const CloseButton = ({ ...rest }) => {
    return <IconButton sx={{ padding: 0 }}{...rest} >
        <CrosseIcon />
    </IconButton>
}