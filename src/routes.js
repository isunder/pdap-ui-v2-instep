import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Codes, History, NotFound, MyProfile } from "./Screens";
import { Layouts } from "./components";

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
