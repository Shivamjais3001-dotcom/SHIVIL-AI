import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function DashboardLayout() {
  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 bg-gray-100 p-10 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;