import React from "react";

import Preloader from "../../../components/Preloader";

import FreeSpinCreate from "./FreeSpinCreate";
import useFreeSpinDetails from "./hooks/useFreeSpinDetails";



const EditFreeSpin = () => {
  const { updateloading, editdata } =
  useFreeSpinDetails({isEdit:true,isView:false});
 


  if (updateloading) return <Preloader />;
  return (
  
    <FreeSpinCreate tempData={editdata}/>
  );
};

export default EditFreeSpin;
