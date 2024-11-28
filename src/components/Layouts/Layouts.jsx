import React from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { styled } from "@mui/material";
import { Header } from "../../container/Headers";

const StyledMain = styled("main")(() => ({
  background: "#E6EDF8",
  height: "100%",
  paddingBottom: "20px",
}));

export const Layouts = ({ children }) => {
  const variable = useLocation();
  const userDetail = useSelector((state) => state?.user?.data?.userInfo);
  const sessionObject = JSON.parse(
    localStorage.getItem(`sessionObject_${userDetail?.mrn}`)
  );

  return (
    <>
      {(variable.pathname === '/404' || variable.pathname === '/')?
        <StyledMain>{children}</StyledMain> : <>
        <Header sessionObject={sessionObject} /> 
          <StyledMain>{children}</StyledMain>
        </>}

    </>
  );
};
