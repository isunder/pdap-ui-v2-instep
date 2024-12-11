import React,{useState, useEffect} from "react";
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { Codes, History, NotFound, MyProfile } from "./Screens";
import { Layouts } from "./components";
import { isSlugOrJwt } from "./utils/helper";

export const Routers = () => {

  


  return (
    <BrowserRouter>
      <Layouts>
        <Routes>
          <Route path="/" element={<Codes />} />
          <Route path="/history" element={<History />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layouts>
    </BrowserRouter>
  );
};
