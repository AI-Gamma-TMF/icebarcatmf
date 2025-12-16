import React from "react";
import { Button, Row, Col, Table } from "@themesberg/react-bootstrap";
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
      <Row>
        <Col className="col-10">
          <h3>Email Center</h3>
        </Col>
        <Col className="col-2 text-end ">
          <Button
            variant="success"
            className="f-right"
            size="sm"
            style={{ height: "40px", width: "100px" }}
            onClick={() => navigate(AdminRoutes.EmailCreate)}
            hidden={isHidden({ module: { key: "emailCenter", value: "C" } })}
          >
            Create
          </Button>
        </Col>
      </Row>

      {
        <Table
          bordered
          striped
          responsive
          hover
          size="sm"
          className="text-center mt-4"
        >
          <thead className="thead-dark">
            <tr>
              {tableHeaders.map((h, idx) => (
                <th
                  key={idx}
                  style={{
                    cursor: "default",
                  }}
                  className={"border-3 border border-blue"}
                >
                  {t(h.labelKey)}{" "}
                </th>
              ))}
            </tr>
          </thead>

          {loading ? (
            <tr>
              <td colSpan={10} className="text-center">
                <InlineLoader />
              </td>
            </tr>
          ) : (
            <tbody>
              {templatelist?.count > 0 ? (
                templatelist?.rows?.map((data) => {
                  const { emailTemplateId, templateName } = data;
                  return (
                    <tr key={emailTemplateId}>
                      <td>{emailTemplateId}</td>

                      <td>
                        <Trigger message={templateName} id={templateName} />
                        <span
                          id={templateName}
                          style={{
                            width: "150px",
                           
                          }}
                          className="d-inline-block text-truncate"
                        >
                          {templateName}
                        </span>
                      </td>

                      <td>
                        <Trigger
                          message="Edit"
                          id={`${emailTemplateId}_Edit`}
                        />
                        <Button
                          id={`${emailTemplateId}_Edit`}
                          className="m-1"
                          size="sm"
                          variant="warning"
                          onClick={() =>
                            navigate(
                              `${AdminRoutes.EmailEdit.split(
                                ":"
                              ).shift()}${emailTemplateId}`
                            )
                          }
                          hidden={isHidden({
                            module: { key: "emailCenter", value: "U" },
                          })}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Trigger
                          message={"Delete"}
                          id={emailTemplateId + "delete"}
                        />
                        <Button
                          id={emailTemplateId + "delete"}
                          className="m-1"
                          size="sm"
                          variant="danger"
                          onClick={() => handleDeleteModal(emailTemplateId)}
                          hidden={isHidden({
                            module: { key: "emailCenter", value: "D" },
                          })}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                        <Trigger
                          message="Test Mail"
                          id={`${emailTemplateId}_test`}
                        />
                        <Button
                          id={`${emailTemplateId}_test`}
                          className="m-1"
                          size="sm"
                          variant="primary"
                          onClick={() =>
                            navigate(AdminRoutes.EmailSend, {
                              state: { templateData: data, istestButton: true },
                            })
                          }
                          hidden={isHidden({
                            module: { key: "emailCenter", value: "C" },
                          })}
                        >
                          <FontAwesomeIcon icon={faPaperPlane} />
                        </Button>
                        <Trigger
                          message="Send Mails"
                          id={`${emailTemplateId}_View`}
                        />
                        <Button
                          id={`${emailTemplateId}_View`}
                          className="m-1"
                          size="sm"
                          variant="info"
                          onClick={() => {
                            navigate(AdminRoutes.EmailSend, {
                              state: { templateData: data },
                            });
                          }}
                          hidden={isHidden({
                            module: { key: "emailCenter", value: "C" },
                          })}
                        >
                          <FontAwesomeIcon icon={faEnvelope} />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-danger text-center">
                    {t("noDataFound")}
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </Table>
      }
      {templatelist?.count !== 0 && (
        <PaginationComponent
          page={templatelist?.count < page ? 1 : page}
          totalPages={totalPages}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
        />
      )}
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
