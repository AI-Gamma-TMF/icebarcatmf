import React from "react";
import {
  Button,
  Row,
  Col,
  Table,
  Form,
  Card,
} from "@themesberg/react-bootstrap";
import { tableHeaders } from "./constant";
import { formatDateMDY } from "../../utils/dateFormatter";
import Trigger from "../../components/OverlayTrigger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleDown, faArrowAltCircleUp } from "@fortawesome/free-regular-svg-icons";
import { AdminRoutes } from "../../routes";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../../components/Pagination";
import { InlineLoader } from "../../components/Preloader";
import { DeleteConfirmationModal } from "../../components/ConfirmationModal";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { searchRegEx } from "../../utils/helper";
import useCheckPermission from "../../utils/checkPermission";
import useDomainBlocking from "./hooks/useDomainBlocking";
import "./domainBlocking.scss";


const DomainBlocking = () => {
  const navigate = useNavigate()
  const { blockedDomainList, selected, loading, page, totalPages, setPage, limit, setLimit, handleDelete, handleDeleteYes, deleteModalShow, setDeleteModalShow, setSearch, search, setOrderBy, sort, over, setOver, setSort, deleteLoading }
    = useDomainBlocking();
  const { isHidden } = useCheckPermission()

  return (
    <>
      <div className="dashboard-typography domain-blocking-page">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
          <div>
            <h3 className="domain-blocking-page__title">Domain Blocking</h3>
            <p className="domain-blocking-page__subtitle">
              Block domains and manage access restrictions
            </p>
          </div>

          <div className="domain-blocking-page__actions">
            <Button
              variant="primary"
              className="domain-blocking-page__create-btn"
              hidden={isHidden({ module: { key: "DomainBlock", value: "C" } })}
              size="sm"
              onClick={() => {
                navigate(AdminRoutes.DomainBlockCreate);
              }}
            >
              Block Domain
            </Button>
          </div>
        </div>

        <Card className="dashboard-filters domain-blocking-filters mb-4">
          <Card.Body>
            <Row className="g-3 align-items-end">
              <Col xs={12} md={6} lg={6}>
                <Form.Label>Search</Form.Label>
                <Form.Control
                  type="search"
                  placeholder="Search blocked domain"
                  value={search}
                  onChange={(event) => {
                    setPage(1);
                    const mySearch = event.target.value.replace(searchRegEx, "");
                    setSearch(mySearch);
                  }}
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <div className="dashboard-data-table">
          <div className="domain-blocking-table-wrap">
            <Table bordered hover responsive size="sm" className="mb-0 text-center">
              <thead>
                <tr>
                  {tableHeaders.map((h, idx) => (
                    <th
                      key={idx}
                      onClick={() => h.value !== "action" && setOrderBy(h.value)}
                      style={{
                        cursor: h.value !== "action" ? "pointer" : "default",
                      }}
                      className={selected(h) ? "sortable active" : "sortable"}
                    >
                      {h.labelKey}{" "}
                      {selected(h) &&
                        (sort === "ASC" ? (
                          <FontAwesomeIcon
                            style={over ? { color: "red" } : {}}
                            icon={faArrowAltCircleUp}
                            onClick={() => setSort("DESC")}
                            onMouseOver={() => setOver(true)}
                            onMouseLeave={() => setOver(false)}
                          />
                        ) : (
                          <FontAwesomeIcon
                            style={over ? { color: "red" } : {}}
                            icon={faArrowAltCircleDown}
                            onClick={() => setSort("ASC")}
                            onMouseOver={() => setOver(true)}
                            onMouseLeave={() => setOver(false)}
                          />
                        ))}
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
                ) : blockedDomainList?.blockedDomains?.count > 0 ? (
                  blockedDomainList.blockedDomains.rows.map(
                    ({ domainId, domainName, createdAt, updatedAt }) => (
                      <tr key={domainId}>
                        <td>{domainId}</td>
                        <td>{domainName}</td>
                        <td>{formatDateMDY(createdAt)}</td>
                        <td>{formatDateMDY(updatedAt)}</td>
                        <td>
                          <div className="domain-blocking-actions">
                            <Trigger message="Delete" id={domainId + "delete"} />
                            <Button
                              id={domainId + "delete"}
                              hidden={isHidden({ module: { key: "DomainBlock", value: "D" } })}
                              className="domain-blocking-icon-btn"
                              size="sm"
                              variant="danger"
                              onClick={() => handleDelete(domainId)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td colSpan={tableHeaders.length} className="text-center py-4 domain-blocking-empty">
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>

        {blockedDomainList?.blockedDomains?.count !== 0 && (
          <PaginationComponent
            page={blockedDomainList?.blockedDomains?.count < page ? setPage(1) : page}
            totalPages={totalPages}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
          />
        )}
      </div>
      {deleteModalShow &&
        (
          <DeleteConfirmationModal
            deleteModalShow={deleteModalShow}
            setDeleteModalShow={setDeleteModalShow}
            handleDeleteYes={handleDeleteYes}
            loading={deleteLoading}
          />)
      }
    </>
  );
};

export default DomainBlocking;
