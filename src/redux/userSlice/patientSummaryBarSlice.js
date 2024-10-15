import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import { getApiHeaders } from '../../utils/helper';

const queryString = window.location.search;

const slug = sessionStorage.getItem("newslug") || null;
const jwt = sessionStorage.getItem("newjwt") || null;

const baseUrl = process.env.REACT_APP_BASE_URL;
const importedHeader = getApiHeaders();
export const patientSummaryBarSlice = createAsyncThunk("SummaryBar", async () => {
    try {
       if(slug){
        const data = await axios.get(`${baseUrl}/api/v1/patient-summary-bar/?slug=${slug}`, {
            headers: importedHeader
        });
        return data.data;
       }
       else {
        const data = await axios.get(`${baseUrl}/api/v1/patient-summary-bar/`, {
            headers: importedHeader
        });
        return data.data;
       }
    } catch (error) {
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
            state.isError = true;
        });
    }
});
export default slice.reducer
