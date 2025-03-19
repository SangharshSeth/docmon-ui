
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const DashboardLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">
          <Header />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
