import React from "react";
import RouteWithSidebar from "../RouteWithSidebar";
import usePrivateRoute from "./usePrivateRoute";
import { Navigate, useNavigate } from "react-router-dom";
import { AdminRoutes } from "../../routes";
import { useEffect } from "react";
import { getLoginToken } from "../../utils/storageUtils";

const PrivateRoute = ({ isWithoutCard = false, children, module }) => {
  const { userDetails, loading, permissions } = usePrivateRoute();
  const navigate = useNavigate();
  const isDemoHost =
    typeof window !== "undefined" &&
    window.location.hostname.includes("icebarcatmf-admin-demo");

  useEffect(() => {
    if (!getLoginToken()) navigate(AdminRoutes.AdminSignin);
  }, [getLoginToken()]);

  if (!permissions && !isDemoHost) {
    return <></>;
  }

  const hasPermission = (() => {
    if (isDemoHost) return true; // demo: bypass permission checks so dashboard renders
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
