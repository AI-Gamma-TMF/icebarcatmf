import React from "react";
import { Button, Row, Col, Table, Card } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faEnvelope,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import Trigger from "../../components/OverlayTrigger";
import { InlineLoader } from "../../components/Preloader";
import PaginationComponent from "../../components/Pagination";
import { AdminRoutes } from "../../routes";
import { DeleteConfirmationModal } from "../../components/ConfirmationModal";
import useCheckPermission from "../../utils/checkPermission";
import { tableHeaders } from "./constants.js";
import useTemplateListing from "./hooks/useTemplateListing.js";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./emailCenterListing.scss";
const EmailCenter = () => {
  const { t } = useTranslation(["cms"]);
  const { isHidden } = useCheckPermission();
  const navigate = useNavigate();
  const {
    // emailTemplatedata,
    templatelist,
    totalPages,
    // dynamickeys,
    loading,
    limit,
    page,
    handleDeleteYes,
    deleteModalShow,
    setDeleteModalShow,
    deleteLoading,
    handleDeleteModal,
    setPage,
    setLimit,
  } = useTemplateListing({
    isListingPage: true,
    isCreatePage: false,
  });

  return (
    <>
      <div className="dashboard-typography email-center-page">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
          <div>
            <h3 className="email-center-page__title">Email Center</h3>
            <p className="email-center-page__subtitle">Manage email templates and send campaigns</p>
          </div>

          <div className="email-center-page__actions">
            <Button
              variant="primary"
              className="email-center-page__create-btn"
              size="sm"
              onClick={() => navigate(AdminRoutes.EmailCreate)}
              hidden={isHidden({ module: { key: "emailCenter", value: "C" } })}
            >
              Create
            </Button>
          </div>
        </div>

        <Card className="dashboard-filters email-center-filters mb-4">
          <Card.Body>
            <div className="text-muted small">
              Templates are used for manual and automated sends.
            </div>
          </Card.Body>
        </Card>

        <div className="dashboard-data-table">
          <div className="email-center-table-wrap">
            <Table bordered hover responsive size="sm" className="mb-0 text-center">
              <thead>
                <tr>
                  {tableHeaders.map((h, idx) => (
                    <th key={idx} className="sortable">
                      {t(h.labelKey)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={tableHeaders.length} className="text-center py-4">
                      <InlineLoader />
                    </td>
                  </tr>
                ) : templatelist?.count > 0 ? (
                  templatelist?.rows?.map((data) => {
                    const { emailTemplateId, templateName } = data;
                    return (
                      <tr key={emailTemplateId}>
                        <td>{emailTemplateId}</td>
                        <td>
                          <Trigger message={templateName} id={templateName} />
                          <span id={templateName} className="d-inline-block text-truncate email-center-name">
                            {templateName}
                          </span>
                        </td>
                        <td>
                          <div className="email-center-actions">
                            <Trigger message="Edit" id={`${emailTemplateId}_Edit`} />
                            <Button
                              id={`${emailTemplateId}_Edit`}
                              className="email-center-icon-btn"
                              size="sm"
                              variant="warning"
                              onClick={() =>
                                navigate(`${AdminRoutes.EmailEdit.split(":").shift()}${emailTemplateId}`)
                              }
                              hidden={isHidden({ module: { key: "emailCenter", value: "U" } })}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </Button>

                            <Trigger message={"Delete"} id={emailTemplateId + "delete"} />
                            <Button
                              id={emailTemplateId + "delete"}
                              className="email-center-icon-btn"
                              size="sm"
                              variant="danger"
                              onClick={() => handleDeleteModal(emailTemplateId)}
                              hidden={isHidden({ module: { key: "emailCenter", value: "D" } })}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>

                            <Trigger message="Test Mail" id={`${emailTemplateId}_test`} />
                            <Button
                              id={`${emailTemplateId}_test`}
                              className="email-center-icon-btn"
                              size="sm"
                              variant="primary"
                              onClick={() =>
                                navigate(AdminRoutes.EmailSend, {
                                  state: { templateData: data, istestButton: true },
                                })
                              }
                              hidden={isHidden({ module: { key: "emailCenter", value: "C" } })}
                            >
                              <FontAwesomeIcon icon={faPaperPlane} />
                            </Button>

                            <Trigger message="Send Mails" id={`${emailTemplateId}_View`} />
                            <Button
                              id={`${emailTemplateId}_View`}
                              className="email-center-icon-btn"
                              size="sm"
                              variant="info"
                              onClick={() => {
                                navigate(AdminRoutes.EmailSend, {
                                  state: { templateData: data },
                                });
                              }}
                              hidden={isHidden({ module: { key: "emailCenter", value: "C" } })}
                            >
                              <FontAwesomeIcon icon={faEnvelope} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={tableHeaders.length} className="text-center py-4 email-center-empty">
                      {t("noDataFound")}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>

        {templatelist?.count !== 0 && (
          <PaginationComponent
            page={templatelist?.count < page ? 1 : page}
            totalPages={totalPages}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
          />
        )}
      </div>
      {deleteModalShow && (
        <DeleteConfirmationModal
          deleteModalShow={deleteModalShow}
          setDeleteModalShow={setDeleteModalShow}
          handleDeleteYes={handleDeleteYes}
          loading={deleteLoading}
        />
      )}
    </>
  );
};

export default EmailCenter;
