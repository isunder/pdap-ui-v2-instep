import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import { getApiHeaders } from '../../utils/helper';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const slug = urlParams.get('slug')
const baseUrl = process.env.REACT_APP_BASE_URL;
const headerr = getApiHeaders();
export const patientSummaryBarSlice = createAsyncThunk("SummaryBar", async () => {
    try {
        const data = await axios.get(`${baseUrl}/api/v1/patient-summary-bar/`, {
            headers: headerr
        });
        return data.data;
    } catch (error) {
        console.log("error in patientSummaryBarSlice", error)
    }
});

const slice = createSlice({
    name: 'summaryBar',
    initialState: {
        isLoading: false,
        data: {},
        isError: false
    },
    reducers: {},
    extraReducers: (builder) => {
        // for patient summary bar details
        builder.addCase(patientSummaryBarSlice.pending, (state) => {
            state.isLoading = true
        });
        builder.addCase(patientSummaryBarSlice.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
        });
        builder.addCase(patientSummaryBarSlice.rejected, (state, action) => {
            state.isLoading = false;
            console.log('Error', action.payload)
            state.isError = true;
        });
    }
});
export default slice.reducer
