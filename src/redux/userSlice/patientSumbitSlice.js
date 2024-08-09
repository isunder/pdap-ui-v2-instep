import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import { getApiHeaders, postApiHeaders } from "../../utils/helper";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const slug = urlParams.get('jwt')
const baseUrl = process.env.REACT_APP_BASE_URL;
const importedHeader = postApiHeaders();

export const patientSubmitData = createAsyncThunk(
    'patientSubmitData',

    async (data) => {
        const config = {
            method: 'post',
            url: `${baseUrl}/api/v1/patient-submit-codes-summary/?jwt=${slug}`,
            headers: importedHeader,
            data: data
        };
        const response = await axios(config)
        return response.data
    }
)

const initialState = {
    updateState: false,
    loading: false,
    result: [],
    error: "",
    response: "",
}

const patentSumbit = createSlice({
    name: 'patentSumbit',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(patientSubmitData.pending, (state) => {
                state.loading = true;
            })
            .addCase(patientSubmitData.fulfilled, (state, action) => {
                state.loading = false;
                state.result.push(action.payload);
                state.response = "add";
            })
            .addCase(patientSubmitData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default patentSumbit;