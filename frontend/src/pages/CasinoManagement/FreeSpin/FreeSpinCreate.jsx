import React, { useState } from "react";
import { Formik } from "formik";
import SpinCreateForm from "./SpinCreateForm";
import { Row, Col } from "@themesberg/react-bootstrap";
import {
  errorHandler,
  useCreateFreeSpinGrantMutation,
  useUpdateFreeSpinGrantMutation,
} from "../../../reactQuery/hooks/customMutationHook";
import {
  freeSpinSchema,
  updatefreeSpinSchema,
} from "./schema";
import useCreateFreeSpin from "./hooks/useCreateFreespin";
import { AdminRoutes } from "../../../routes";
import { useNavigate } from "react-router-dom";
import { toast } from "../../../components/Toast";
import useFreeSpinListing from "./hooks/useFreeSpinListing";

const FreeSpinCreate = ({ tempData }) => {
  const editData = tempData?.data;

  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState([]);
  const { freeSpinUsersList,createFreeSpinGrant,createLoading,updateFreeSpinGrant,updateLoading,  } = useCreateFreeSpin();
  

 
  const userSummary = selectedUser.map((user) => ({
    userId: user.userId,
    email: user.email,
  }));
  const handleCreateSpinSubmit = (formValues) => {
     const shouldSetDefaultDaysValidity =
    !formValues?.startDate &&
    !formValues?.endDate &&
    (!formValues?.daysValidity || formValues?.daysValidity === '');
    const body = {
      ...formValues,
      masterCasinoGameId: Number(formValues?.masterCasinoGameId),
      providerId: Number(formValues?.providerId),
      emailTemplateId: formValues?.isNotifyUser
        ? Number(formValues?.emailTemplateId)
        : "",

      users: freeSpinUsersList ? freeSpinUsersList : userSummary,
      isUserUploadCsv: freeSpinUsersList ? true : false,
      startDate: formValues?.startDate
        ? new Date(formValues?.startDate).toISOString()
        : null,
      endDate: formValues?.endDate
        ? new Date(formValues?.endDate).toISOString()
        : null,
        daysValidity: shouldSetDefaultDaysValidity ? 3 : formValues.daysValidity,
    };

    createFreeSpinGrant(body);
  };
  const handleUpdateSpinSubmit = (formValues) => {
        const shouldSetDefaultDaysValidity =
    !formValues?.startDate &&
    !formValues?.endDate &&
    (!formValues?.daysValidity || formValues?.daysValidity === '');
    const body = {
      ...formValues,
      freeSpinId: editData?.freeSpinId,
     
      providerId: Number(formValues?.providerId),
      emailTemplateId: formValues?.isNotifyUser
        ? Number(formValues?.emailTemplateId)
        : "",
      users: freeSpinUsersList ? freeSpinUsersList : userSummary,
      isUserUploadCsv: freeSpinUsersList ? true : false,
      daysValidity: shouldSetDefaultDaysValidity ? 3 : formValues.daysValidity,
    };

    if (
      formValues?.startDate &&
      new Date(formValues?.startDate).toISOString() !==
        new Date(editData?.startDate).toISOString()
    ) {
      body.startDate = new Date(formValues?.startDate).toISOString();
    } else {
      body.startDate = null;
    }

    if (
      formValues?.endDate &&
      new Date(formValues?.endDate).toISOString() !==
        new Date(editData?.endDate).toISOString()
    ) {
      body.endDate = new Date(formValues?.endDate).toISOString();
    } else {
      body.endDate = null;
    }
    if (
      formValues?.masterCasinoGameId &&
      Number(formValues?.masterCasinoGameId) !==
        Number(editData?.masterCasinoGameId)
    ) {
      body.masterCasinoGameId = Number(formValues?.masterCasinoGameId);
    } else {
      body.masterCasinoGameId = null;
    }
     if (
      formValues?.providerId &&
      Number(formValues?.providerId) !==
        Number(editData?.providerId)
    ) {
      body.providerId = Number(formValues?.providerId);
    } else {
      body.providerId = null;
    }
     if (
      formValues?.freeSpinAmount &&
      Number(formValues?.freeSpinAmount) !==
        Number(editData?.freeSpinAmount)
    ) {
      body.freeSpinAmount = Number(formValues?.freeSpinAmount);
    } else {
      body.freeSpinAmount = null;
    }
     if (
      formValues?.freeSpinRound &&
      Number(formValues?.freeSpinRound) !==
        Number(editData?.freeSpinRound)
    ) {
      body.freeSpinRound = Number(formValues?.freeSpinRound);
    } else {
      body.freeSpinRound = null;
    }
    
    updateFreeSpinGrant(body);
  };

  return (
    <>
      <Row className="align-items-center justify-content-between mb-3">
        <Col>
          <h3>{editData ? "Edit Free Spin" : "Create Free Spin"} </h3>
        </Col>
        {editData && <Col xs="auto">
          <div
            className={`px-3 py-2 border rounded text-center ${
              editData?.status == "0"
                ? "text-warning"
                : editData?.status == "1"
                ? "text-success"
                : editData?.status == "2"
                ? "text-muted"
                : editData?.status == "3"
                ? "text-danger"
                : ""
            }`}
            style={{ minWidth: "120px" }}
          >
            {editData?.status == "0"
              ? "Upcoming"
              : editData?.status == "1"
              ? "Ongoing"
              : editData?.status == "2"
              ? "Completed"
              : editData?.status == "3"
              ? "Cancelled"
              : "----"}
          </div>
        </Col>}
      </Row>

      <Formik
        initialValues={{
          providerId: editData ? editData?.providerId : "",
          masterCasinoGameId: editData ? editData?.masterCasinoGameId : "",
          freeSpinAmount: editData ? editData?.freeSpinAmount : "",
          title: editData ? editData?.title : "",
          startDate: editData ? editData?.startDate : null,
          endDate: editData ? editData?.endDate : null,
          coinType: editData ? editData?.coinType : "SC",
          freeSpinRound: editData ? editData?.freeSpinRound : "",
          freeSpinType: editData ? editData?.freeSpinType : "",
          emailTemplateId: editData ? editData?.emailTemplateId : "",
          isNotifyUser: editData ? editData?.isNotifyUser : false,
          subscriptionId:editData ? editData?.subscriptionId : "",
          daysValidity: editData ? editData?.daysValidity : ""
        }}
        validationSchema={editData ? updatefreeSpinSchema : freeSpinSchema}
        onSubmit={editData ? handleUpdateSpinSubmit : handleCreateSpinSubmit}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          handleBlur,
          setFieldValue,
          errors,
        }) => {
          return (
            <SpinCreateForm
              values={values}
              handleChange={handleChange}
              handleBlur={handleBlur}
              setFieldValue={setFieldValue}
              handleSubmit={handleSubmit}
              errors={errors}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              isLoading={createLoading || updateLoading}
              editData={editData}
            />
          );
        }}
      </Formik>
    </>
  );
};

export default FreeSpinCreate;
