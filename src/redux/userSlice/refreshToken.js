import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { postApiHeaders } from '../../utils/helper';

const slug = sessionStorage.getItem("newslug") || null;
const jwt = sessionStorage.getItem("newjwt") || null;

const baseUrl = process.env.REACT_APP_BASE_URL;
const importedHeader = postApiHeaders();

export const refreshSSOToken = createAsyncThunk("Refresh_Token", async (payload) => {
    try {
        let url = `${baseUrl}/api/v1/sso-refresh-token/`;
        if (slug) {
            url += `?slug=${slug}`;
        }

        const response = await axios.post(url, payload, { headers: importedHeader });
        return response.data;
    } catch (error) {
        console.log("Error in refreshing token", error);
        throw error;
    }
});

const slice = createSlice({
    name: 'refreshtoken',
    initialState: {
        isLoading: false,
        data: {},
        isError: false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(refreshSSOToken.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(refreshSSOToken.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
        });
        builder.addCase(refreshSSOToken.rejected, (state, action) => {
            state.isLoading = false;
            console.log('Error', action.error);
            state.isError = true;
        });
    }
});

export default slice.reducer;
