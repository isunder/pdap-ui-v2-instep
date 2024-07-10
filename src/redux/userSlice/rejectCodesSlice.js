import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    rejectValue: [],
    existingReject: [],
    suspectReject: [],
    recaptureReject: [],
    duplicateReject: []
}
export const rejectSlice = createSlice({
    name: 'rejectValue',
    initialState,
    reducers: {
        existingReject: (state, action) => {
            state.existingReject = action.payload
        },
        suspectReject: (state, action) => {
            state.suspectReject = action.payload
        },
        recaptureReject: (state, action) => {
            state.recaptureReject = action.payload
        },
        duplicateReject: (state, action) => {
            state.duplicateReject = action.payload
        }

    },
})


export const { existingReject, suspectReject, recaptureReject, duplicateReject } = rejectSlice.actions

export default rejectSlice.reducer