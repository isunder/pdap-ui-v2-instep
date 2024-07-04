import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  existingSelectedMainCode: "",
  existingSelectedRejectData: "",
  existingCondition: [],
  existingClinicalDoc: null,
  existingRejectReason: "Insufficient Proof",
  existingOtherText: null,
  // UI states
  existingUiExpanded: false,
  existingError: {},
  existingOpen: false,
  existingDeleteOpen: false,
  existingHandleFunction: false,

  // const [expanded, setExpanded] = useState(false);
  // const [existingCondition, setExistingCondition] = useState([]);
  // const [clinicalDoc, setClinicalDoc] = useState(null);
  // const [rejectReason, setRejectReason] = useState("Insufficient Proof");
  // const [otherText, setOtherText] = useState(null);
  // const [error, setError] = useState({});
  // const [open, setOpen] = useState(false);
  // const [Deleteopen, setDeleteOpen] = useState(false);
  // const [handleFunction, setHandleFunction] = useState(false);
  // const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  // const [selectedRejectData, setSelectedRejectData] = useState();
  // const [selectedMainCode, setSelectedMainCode] = useState("");
};
export const codesAccordionSlice = createSlice({
  name: "codesAccordion",
  initialState,
  reducers: {
    // Common update
    setAccordionSliceData: (state, { payload }) => {
      if (payload.type && payload.type in state) {
        state[payload.type] = payload.data;
      }
    },
  },
});

export const { setAccordionSliceData } = codesAccordionSlice.actions;

export default codesAccordionSlice.reducer;
