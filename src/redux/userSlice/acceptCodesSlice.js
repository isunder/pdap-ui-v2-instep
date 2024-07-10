import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    summaryValue: [],
    existing: [],
    suspect: [],
    recapture: [],
    duplicate: [],
    existingRejectCode: [],
    recaptureRejectCode: [],
    duplicateRejectCode: []
}
export const summarySlice = createSlice({
    name: 'summaryValue',
    initialState,
    reducers: {
        existingValue: (state, action) => {
            state.existing = action.payload
        },
        suspectValue: (state, action) => {
            state.suspect = action.payload
        },
        recaptureValue: (state, action) => {
            state.recapture = action.payload
        },
        duplicateValue: (state, action) => {
            state.duplicate = action.payload
        },
        existingRejectInfo: (state, action) => {
            state.existingRejectCode = action.payload
        },
        recaptureRejectInfo: (state, action) => {
            state.recaptureRejectCode = action.payload
        },
        duplicateRejectInfo: (state, action) => {
            state.duplicateRejectCode = action.payload
        }
    },
})


export const { existingValue, suspectValue, recaptureValue, duplicateValue, existingRejectInfo, recaptureRejectInfo, duplicateRejectInfo } = summarySlice.actions

export default summarySlice.reducer