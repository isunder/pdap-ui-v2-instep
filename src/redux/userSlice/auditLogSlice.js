import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const slug = urlParams.get('slug')
const baseUrl = process.env.REACT_APP_BASE_URL;

export const fetchAuditLogs = createAsyncThunk('auditLogs/fetchAuditLogs', async (params, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${baseUrl}/api/v1/events/log?slug=${slug}`, params);
        return response.data;  // Return the data if you want to store it
    } catch (error) {
        console.error('Error fetching audit logs:', error.response ? error.response.data : error.message);
        return rejectWithValue(error.response ? error.response.data : error.message);
    }
});

const auditLogSlice = createSlice({
    name: 'auditLogs',
    initialState: {
        status: 'idle',
        error: null,
        data: [], // Assuming you want to store the fetched data
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAuditLogs.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAuditLogs.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload; // Save the data from the response
            })
            .addCase(fetchAuditLogs.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default auditLogSlice.reducer;
