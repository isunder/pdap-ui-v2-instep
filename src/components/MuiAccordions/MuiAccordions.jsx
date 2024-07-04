import * as React from "react";

import MuiAccordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { styled } from "@mui/material";
import { Mixpanel } from "../../services";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(() => ({
  borderRadius: "0.625rem",
  backgroundColor: "transparent",
  borderBottom: 0,
  "&:before": {
    display: "none",
  },
  width: "100%",
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ sx }) => ({
  borderRadius: "0.625rem",
  ...sx,
}));

export const MuiAccordions = (props) => {
  const {
    tabs,
    panel,
    code,
    name,
    setExpanded,
    expanded,
    setSingleExpand,
    singleExpand,
    sx,
    header,
    expandIcon,
    children,
  } = props;

  const handleChange = (panel) => (_, isExpanded) => {
    if (panel) {
      let codeValue = "";
      if (isExpanded) {
        if (code) codeValue = `${code}-`
        Mixpanel(`${codeValue}${name}-Expand`, tabs, code)
      }
      else {
        Mixpanel(`${codeValue}${name}-Collapse`, tabs, code)
      }
      setExpanded(isExpanded ? panel : false);
    } else {
      setSingleExpand(!singleExpand);
    }
  };


  return (
    <Accordion
      expanded={panel ? expanded === panel : singleExpand}
      onChange={handleChange(panel || false)}
    >
      <StyledAccordionSummary expandIcon={expandIcon} sx={{ ...sx }} className="pdap-act-summary">
        {header}
      </StyledAccordionSummary>
      <AccordionDetails sx={{ padding: 0 }}>{children}</AccordionDetails>
    </Accordion>
  );
};
