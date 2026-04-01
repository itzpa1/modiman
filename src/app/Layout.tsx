import { Outlet } from "react-router";

export const Layout = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Outlet />
    </div>
  );
};
