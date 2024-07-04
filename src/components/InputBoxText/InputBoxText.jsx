import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export const InputBoxText = ({ handleChange, style, placeholder, label }) => {
    return (
        <Box
            fullWidth
            component="form"
            autoComplete="off"
            sx={{
                ...style
            }}
        >
            <Box>
                <TextField
                    fullWidth
                    size='small'
                    onChange={handleChange}
                    id="outlined-multiline-flexible"
                    label={label}
                    multiline
                    maxRows={4}
                    placeholder={placeholder}
                />
            </Box>
        </Box>
    )
}