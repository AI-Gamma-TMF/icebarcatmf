import React from "react";

import Preloader from "../../../components/Preloader";
import CreateMaintenanceMode from "./CreateMaintenanceMode";
import useMaintenanceDetail from "../hooks/useMaintenanceDetail";



const EditMaintenanceMode = () => {
  const { updateloading, data } =
  useMaintenanceDetail();


  if (updateloading) return <Preloader />;
  return (
    <CreateMaintenanceMode  tempData = {data}/>
  );
};

export default EditMaintenanceMode;
