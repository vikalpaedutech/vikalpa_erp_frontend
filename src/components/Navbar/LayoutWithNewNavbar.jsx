// /src/layouts/LayoutWithNavbar.jsx

import React from "react";
import { Outlet } from "react-router-dom";
import { NewNavbar } from "./NewNavbar";

import { Footer } from "./ErpTestFooter";

const LayoutWithNewNavbar = () => {
  return (
    <>
      <NewNavbar />
      <Footer/>
      <div className="main-content">
        <Outlet />
      </div>
    </>
  );
};

export default LayoutWithNewNavbar;
