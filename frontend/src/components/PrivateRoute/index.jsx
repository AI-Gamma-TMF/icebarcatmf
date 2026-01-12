import React from "react";
import RouteWithSidebar from "../RouteWithSidebar";
import usePrivateRoute from "./usePrivateRoute";
import { Navigate, useNavigate } from "react-router-dom";
import { AdminRoutes } from "../../routes";
import { useEffect } from "react";
import { getLoginToken } from "../../utils/storageUtils";

const isDemoHost = () =>
  typeof window !== "undefined" &&
  (window.location.hostname.includes("icebarcatmf-admin-demo") ||
   window.location.hostname.includes("ondigitalocean.app"));

const PrivateRoute = ({ isWithoutCard = false, children, module }) => {
  const { userDetails, loading, permissions } = usePrivateRoute();
  const navigate = useNavigate();

  useEffect(() => {
    // Skip auth redirect on demo host
    if (isDemoHost()) return;
    if (!getLoginToken()) navigate(AdminRoutes.AdminSignin);
  }, [getLoginToken()]);

  // Demo host: bypass ALL auth/permission checks and render content directly
  if (isDemoHost()) {
    return (
      <RouteWithSidebar>
        {isWithoutCard ? children : <div className="app-page app-page--surface">{children}</div>}
      </RouteWithSidebar>
    );
  }

  if (!permissions) {
    return <></>;
  }

  const hasPermission = (() => {
    if (!module) return true;
    const key = Object.keys(module)?.[0];
    return permissions?.[key]?.includes(module[key]);
  })();

  return (
    userDetails && !loading && hasPermission ? (
      <RouteWithSidebar>
        {isWithoutCard ? children : <div className="app-page app-page--surface">{children}</div>}
      </RouteWithSidebar>
    ) : (
      <Navigate replace to={AdminRoutes.Profile} />
    )
  );
};

export default PrivateRoute;
