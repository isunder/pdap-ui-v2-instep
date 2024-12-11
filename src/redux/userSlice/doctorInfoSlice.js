import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import { getApiHeaders, getSlug, getToken } from '../../utils/helper';

const queryString = window.location.search;


const slug = getSlug();
const token = getToken();
const baseUrl = process.env.REACT_APP_BASE_URL;

export const doctorInfo = createAsyncThunk("doctorInfo", async () => {
    try {
   if(slug){
    const data = await axios.get(`${baseUrl}/api/v1/patient-doctor-info/?slug=${slug}`);
    return data.data;
   }

   else if(token){
    const data = await axios.get(`${baseUrl}/api/v1/patient-doctor-info/`,{
        headers: getApiHeaders()

    });
    return data.data;
   }
   
    } 
    catch (error) {
        console.log("error in doctorInfo", error)
        return error;
    }
});

const slice = createSlice({
    name: 'doctor',
    initialState: {
        isLoading: false,
        data: {},
        isError: false
    },
    reducers: {},
    extraReducers: (builder) => {
        // for doctor's detail
        builder.addCase(doctorInfo.pending, (state) => {
            state.isLoading = true
        });
        builder.addCase(doctorInfo.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data.doctorDetail = action.payload;
        });
        builder.addCase(doctorInfo.rejected, (state, action) => {
            state.isLoading = false;
            state.data.doctorDetail = action.payload;
            state.isError = true;
        });
    }
});
export default slice.reducer
