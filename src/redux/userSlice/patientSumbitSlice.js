import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import { getSlug, getToken, postApiHeaders } from "../../utils/helper";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const slug = getSlug();
const token = getToken();

const baseUrl = process.env.REACT_APP_BASE_URL;
const importedHeader = postApiHeaders();

export const patientSubmitData = createAsyncThunk(
    'patientSubmitData',

    async (data) => {
        const config = {
            method: 'post',
            url: `${baseUrl}/api/v1/patient-submit-codes-summary/?slug=${slug}`,
            headers: importedHeader,
            data: data
        };

        const config2 = {
            method: 'post',
            url: `${baseUrl}/api/v1/patient-submit-codes-summary/`,
            headers: importedHeader,
            data: data
        };
        const response = await axios(slug? config : config2)
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