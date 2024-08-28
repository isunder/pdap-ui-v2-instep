import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { getApiHeaders, getSlug, getToken } from '../../utils/helper';

const baseUrl = process.env.REACT_APP_BASE_URL;
const slug = getSlug();
const token = getToken();

export const fetchAuditLogs = createAsyncThunk(
  'fetchAuditLogs222',
  async (params) => {
      const url = slug
        ? `${baseUrl}/api/v1/audit-logs/?slug=${slug}`
        : `${baseUrl}/api/v1/audit-logs/`;
      const headers = token ? getApiHeaders(token) : {};
      const response = await axios.post(url, params, { headers });
      return response.data;
  }
);


const auditLogSlice = createSlice({
  name: 'auditLogs',
  initialState: {
    status: 'idle',
    error: null,
    data: [], 
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditLogs.pending, (state) => {
        state.status = 'loading';
        state.error = null; // Clear previous errors
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload; // Save data from the response
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch audit logs'; // Provide default error message
      });
  },
});

export default auditLogSlice.reducer;
