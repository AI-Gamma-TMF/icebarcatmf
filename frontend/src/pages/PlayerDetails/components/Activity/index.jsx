import React, { useState } from "react";
import ActivityTable from "./ActivityTable";
import AccountOverview from "./AccountOverview";
import { timeZones } from "../../../Dashboard/constants";
import { getItem } from "../../../../utils/storageUtils";

const Activity = ({basicInfo}) => {
  const [openAccountOverview, setOpenAccountOverview] = useState(false)
  const [currentDetails,setCurrentDetails] = useState({})
  const timeZone = getItem("timezone");
  const timezoneOffset = timeZones?.find(x=> x.code === timeZone)?.value;  
  return (
    <>
      {openAccountOverview ? 
      <AccountOverview 
      setOpenAccountOverview={setOpenAccountOverview}
      basicInfo={basicInfo}
      setCurrentDetails={setCurrentDetails}
      currentDetails={currentDetails}
      /> : 
      <ActivityTable 
      setOpenAccountOverview={setOpenAccountOverview} 
      basicInfo={basicInfo}
      setCurrentDetails={setCurrentDetails}
      timezoneOffset={timezoneOffset}
      timeZone={timeZone}
      />}
    </>
  );
};

export default Activity;
