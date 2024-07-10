import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../userSlice/patientInfoSlice';
import doctorReducer from '../userSlice/doctorInfoSlice';
import summaryReducer from '../userSlice/acceptCodesSlice';
import rejectReducer from '../userSlice/rejectCodesSlice';
import patientSummaryBarReducer from '../userSlice/patientSummaryBarSlice';
import codesAccordionSliceReducer from '../interfaceSlice/codesAccordionSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        doctor: doctorReducer,
        summary: summaryReducer,
        reject: rejectReducer,
        summaryBar: patientSummaryBarReducer,
        codesAccordion: codesAccordionSliceReducer,
    },
})
export default store;