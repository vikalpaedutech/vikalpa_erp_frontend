// /src/layouts/LayoutWithNavbar.jsx

import React from "react";
import { Outlet } from "react-router-dom";
import { NewNavbar } from "./NewNavbar";

const LayoutWithNewNavbar = () => {
  return (
    <>
      <NewNavbar />
      <div className="main-content">
        <Outlet />
      </div>
    </>
  );
};

export default LayoutWithNewNavbar;
