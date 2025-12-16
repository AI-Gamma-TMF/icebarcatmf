import React from "react";
import {
  Button,
  Row,
  Col,
  Table,
  Form,
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


const DomainBlocking = () => {
  const navigate = useNavigate()
  const { blockedDomainList, selected, loading, page, totalPages, setPage, limit, setLimit, handleDelete, handleDeleteYes, deleteModalShow, setDeleteModalShow, setSearch, search, setOrderBy, sort, over, setOver, setSort, deleteLoading }
    = useDomainBlocking();
  const { isHidden } = useCheckPermission()

  return (
    <>
      <Row className="mb-2">
        <Col>
          <h3>Domain Blocking</h3>
        </Col>
        <Col>
          <div className="d-flex justify-content-end">
            <Button
              variant="success"
              hidden={isHidden({ module: { key: 'DomainBlock', value: 'C' } })}
              size="sm"
              style={{ marginRight: "10px" }}
              onClick={() => {
                navigate(AdminRoutes.DomainBlockCreate);
              }}
            >
              Block Domain
            </Button>
          </div>
        </Col>
        <Row className="mb-2">
          <Col xs={12} md={6} lg={6}>
            <Form.Label style={{ marginBottom: '0', marginRight: '15px', marginTop: '8px' }}>
              Search
            </Form.Label>
            <Form.Control
              type='search'
              placeholder='Search blocked domain'
              value={search}
              style={{ maxWidth: '330px', marginRight: '10px', marginTop: '5px' }}
              onChange={(event) => {
                setPage(1)
                const mySearch = event.target.value.replace(searchRegEx, '')
                setSearch(mySearch)
              }}
            />
          </Col>
        </Row>

      </Row>
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
                onClick={() => h.value !== "action" && setOrderBy(h.value)}
                style={{
                  cursor: (h.value !== "action" && "pointer"),
                }}
                className={selected(h) ? "border-3 border border-blue" : ""}
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
              <td colSpan={10} className="text-center">
                <InlineLoader />
              </td>
            </tr>


          ) : blockedDomainList?.blockedDomains?.count > 0 ? (
            blockedDomainList.blockedDomains.rows.map(
              ({
                domainId,
                domainName,
                createdAt,
                updatedAt,
              }) => (
                <tr key={domainId}>
                  <td>{domainId}</td>
                  <td>{domainName}</td>                 
                  <td>{formatDateMDY(createdAt)}</td>
                  <td>{formatDateMDY(updatedAt)}</td>
                  <td>
                    {/* <Trigger message="Edit" id={domainId + "edit"} />
                    <Button
                      id={domainId + "edit"}
                      hidden={isHidden({ module: { key: 'GeoComply', value: 'U' } })}
                      className="m-1"
                      size="sm"
                      variant="warning"
                      onClick={() =>
                        navigate(
                          `${AdminRoutes.DomainBlockEdit.split(":").shift()}${domainId}`
                        )
                      }
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Button> */}
                    <Trigger message="Delete" id={domainId + "delete"} />
                    <Button
                      id={domainId + "delete"}
                      hidden={isHidden({ module: { key: 'DomainBlock', value: 'D' } })}
                      className="m-1"
                      size="sm"
                      variant="warning"
                      onClick={() => handleDelete(domainId)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>                    
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan={10} className="text-danger text-center">
                No Data Found
              </td>
            </tr>
          )
          }
        </tbody>

      </Table>
      {blockedDomainList?.blockedDomains?.count !== 0 && (
        <PaginationComponent
          page={blockedDomainList?.blockedDomains?.count < page ? setPage(1) : page}
          totalPages={totalPages}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
        />
      )}
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
