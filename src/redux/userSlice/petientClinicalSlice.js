import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import { postApiHeaders } from "../../utils/helper";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const slug = urlParams.get('jwt')
const baseUrl = process.env.REACT_APP_BASE_URL;
const importedHeader = postApiHeaders();

export const patientClinicalDocument = createAsyncThunk(
    'patientClinicalDocument',

    async (data, thunkAPI) => {
        const config = {
            
            url: `${baseUrl}/api/v1/patient-clinical-document/?jwt=${slug}`,
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

const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(patientClinicalDocument.pending, (state) => {
                state.loading = true;
            })
            .addCase(patientClinicalDocument.fulfilled, (state, action) => {
                state.loading = false;
                state.result.push(action.payload);
                state.response = "add";
            })
            .addCase(patientClinicalDocument.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default dataSlice;