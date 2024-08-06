import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const slug = urlParams.get('slug')
const baseUrl = process.env.REACT_APP_BASE_URL;

const headerr = {
    'Method' : "GET",
    'Content-Type': 'application/json'
}

// function for patient info
export const patientInfo = createAsyncThunk("patientInfo", async () => {
    try {
        if (slug) {
            const data = await axios.get(`${baseUrl}/api/v1/patient-info/?slug=${slug}`,
                {
                    headers: headerr
                }
            );
            return data.data;
        }
    } catch (error) {
        console.log("error in patientInfo", error)
    }
});

// function for patient Existing Conditions
export const patientExistingConditions = createAsyncThunk("patientExistingConditions", async () => {
    try {
        if (slug) {
            const data = await axios.get(`${baseUrl}/api/v1/patient-existing-conditions/?slug=${slug}` , {
                headers: headerr
            });
            return data.data;
        }
    } catch (error) {
        console.log("error in patientExistingConditions", error)
    }
});

// function for patient addresh codes
export const patientAddressCode = createAsyncThunk("patientAddressCode", async () => {
    try {
        if (slug) {
            const data = await axios.get(`${baseUrl}/api/v1/patient-addressed-codes/?slug=${slug}`, {
                headers: headerr
            });
            return data.data;
        }
    } catch (error) {
        console.log("error in patientAddressCode", error)
    }
});

// function for patient Duplicate Codes
export const patientDuplicateCode = createAsyncThunk("patientDuplicateCode", async () => {
    try {
        if (slug) {
            const data = await axios.get(`${baseUrl}/api/v1/patient-duplicate-codes/?slug=${slug}`, {
                headers: headerr
            });
            return data.data;
        }
    } catch (error) {
        console.log("error in patientDuplicateCode", error)
    }
});

// function for patient Duplicate Codes
export const patientDeletedCode = createAsyncThunk("patientDeletedCode", async () => {
    try {
        if (slug) {
            const data = await axios.get(`${baseUrl}/api/v1/patient-deleted-codes/?slug=${slug}` , {
                headers: headerr
            });
            return data.data;
        }
    } catch (error) {
        console.log("error in patientDeletedCode", error)
    }
});

// function for patient suspect Codes
export const patientSuspectedCode = createAsyncThunk("patientSuspectedCode", async () => {
    try {
        if (slug) {
            const data = await axios.get(`${baseUrl}/api/v1/patient-suspect-codes/?slug=${slug}` , {
                headers: headerr
            });
            return data.data;
        }
    } catch (error) {
        console.log("error in patientSuspectedCode", error)
    }
});

// function for patient ummary
export const patientSummary = createAsyncThunk("patientSummary", async () => {
    try {
        if (slug) {
            const data = await axios.get(`${baseUrl}/api/v1/patient-summary/?slug=${slug}` , {
                headers: headerr
            });
            return data.data;
        }
    } catch (error) {
        console.log("error in patientSummary", error)
    }
});

// for patientRecaptureCode
export const patientRecaptureCode = createAsyncThunk("patientRecaptureCode", async () => {
    try {
        if (slug) {
            const data = await axios.get(`${baseUrl}/api/v1/patient-recapture-codes/?slug=${slug}`, {
                headers: headerr
            });
            return data.data;
        }
    } catch (error) {
        console.log("error in patientRecaptureCode", error)
    }
});

// for patient tabs
export const patientTabFlag = createAsyncThunk("patientTabFlag", async () => {
    try {
        if (slug) {
            const data = await axios.get(`${baseUrl}/api/v1/patient-tabs/?slug=${slug}` , {
                headers: headerr
            });
            return data.data;
        }
    } catch (error) {
        console.log("error in patientTabFlag", error)
    }
});

// for patient history
export const patientHistory = createAsyncThunk("patientHistory", async () => {
    try {
        if (slug) {
            const data = await axios.get(`${baseUrl}/api/v1/patient-history/?slug=${slug}` , {
                headers: headerr
            });
            return data.data;
        }
    } catch (error) {
        console.log("error in patientHistory", error)
    }
});

const slice = createSlice({
    name: 'user',
    initialState: {
        isLoading: false,
        data: {},
        isError: false
    },
    reducers: {},
    extraReducers: (builder) => {
        // for patient details
        builder.addCase(patientInfo.pending, (state) => {
            state.isLoading = true
        });
        builder.addCase(patientInfo.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data.userInfo = action.payload;
        });
        builder.addCase(patientInfo.rejected, (state, action) => {
            state.isLoading = false;
            
            state.isError = true;
        });

        // for patient existing condition
        builder.addCase(patientExistingConditions.pending, (state) => {
            state.isLoading = true
        });
        builder.addCase(patientExistingConditions.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data.existingCondition = action.payload;
        });
        builder.addCase(patientExistingConditions.rejected, (state, action) => {
            state.isLoading = false;
            
            state.isError = true;
        });

        // for patient addressed codes
        builder.addCase(patientAddressCode.pending, (state) => {
            state.isLoading = true
        });
        builder.addCase(patientAddressCode.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data.adressCode = action.payload;
        });
        builder.addCase(patientAddressCode.rejected, (state, action) => {
            state.isLoading = false;
            
            state.isError = true;
        });

        // for patient duplicate code
        builder.addCase(patientDuplicateCode.pending, (state) => {
            state.isLoading = true
        });
        builder.addCase(patientDuplicateCode.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data.duplicateCode = action.payload;
        });
        builder.addCase(patientDuplicateCode.rejected, (state, action) => {
            state.isLoading = false;
            
            state.isError = true;
        });

            // for patient delted code
            builder.addCase(patientDeletedCode.pending, (state) => {
                state.isLoading = true
            });
            builder.addCase(patientDeletedCode.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data.deletedCodes = action.payload;
            });
            builder.addCase(patientDeletedCode.rejected, (state, action) => {
                state.isLoading = false;
                
                state.isError = true;
            });

        // for patient patient Suspect code
        builder.addCase(patientSuspectedCode.pending, (state) => {
            state.isLoading = true
        });
        builder.addCase(patientSuspectedCode.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data.suspectedCode = action.payload;
        });
        builder.addCase(patientSuspectedCode.rejected, (state, action) => {
            state.isLoading = false;
            
            state.isError = true;
        });

        // for patient patient summary
        builder.addCase(patientSummary.pending, (state) => {
            state.isLoading = true
        });
        builder.addCase(patientSummary.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data.summary = action.payload;
        });
        builder.addCase(patientSummary.rejected, (state, action) => {
            state.isLoading = false;
            
            state.isError = true;
        });

        // for patient patient recapture code
        builder.addCase(patientRecaptureCode.pending, (state) => {
            state.isLoading = true
        });
        builder.addCase(patientRecaptureCode.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data.recaptureCode = action.payload;
        });
        builder.addCase(patientRecaptureCode.rejected, (state, action) => {
            state.isLoading = false;
            
            state.isError = true;
        });

        // for patient tabs flag
        builder.addCase(patientTabFlag.pending, (state) => {
            state.isLoading = true
        });
        builder.addCase(patientTabFlag.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data.tabs = action.payload;
        });
        builder.addCase(patientTabFlag.rejected, (state, action) => {
            state.isLoading = false;
            
            state.isError = true;
        });

        // for patient history
        builder.addCase(patientHistory.pending, (state) => {
            state.isLoading = true
        });
        builder.addCase(patientHistory.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data.history = action.payload;
        });
        builder.addCase(patientHistory.rejected, (state, action) => {
            state.isLoading = false;
            
            state.isError = true;
        });
    }
});
export default slice.reducer
