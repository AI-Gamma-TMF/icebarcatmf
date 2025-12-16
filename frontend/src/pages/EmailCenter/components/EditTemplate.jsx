import React from "react";

import Preloader from "../../../components/Preloader";
import CreateEmail from "./CreateEmail";
import useTemplateDetails from "../hooks/useTemplateDetails";

const EditTemplate = () => {
  const {  updateloading,
    templatelist,
    // dynamickeys,
    editfetch } =
    useTemplateDetails()
  if (updateloading) return <Preloader />;
  return <CreateEmail tempdata={templatelist}  editfetch={editfetch}/>;
};

export default EditTemplate;
