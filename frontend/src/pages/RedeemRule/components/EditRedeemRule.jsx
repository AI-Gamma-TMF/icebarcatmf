import React from "react";

import Preloader from "../../../components/Preloader";

import CreateRedeemRule from "./CreateRedeemRule";
import useRedeemRuleDetail from "../hooks/useRedeemRuleDetails";

const EditRule = () => {
  const { updateloading, ediRuleData } =
    useRedeemRuleDetail();

  if (updateloading) return <Preloader />;
  return (
    <CreateRedeemRule tempdata={ediRuleData}  />
  );
};

export default EditRule;
