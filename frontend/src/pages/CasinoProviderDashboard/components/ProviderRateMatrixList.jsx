import {  faEdit } from "@fortawesome/free-regular-svg-icons";
import {
  faPlus
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table, Row, Col, Button, Form } from "@themesberg/react-bootstrap"
import Select from "react-select";

import "../_provider.scss";
import { DeleteConfirmationModal } from '../../../components/ConfirmationModal/index'
import Trigger from '../../../components/OverlayTrigger'
import PaginationComponent from '../../../components/Pagination'
import { InlineLoader } from '../../../components/Preloader'
import { AdminRoutes } from '../../../routes'
import useCheckPermission from '../../../utils/checkPermission'
import { providersTableHeaders } from '../constant'
import useProviderRateMatrixListing from '../hooks/useProviderRateMatrixListing';


const ProviderRateMatrixList = ({ isHitoricalTab }) => {
  const { isHidden } = useCheckPermission()

  const {
    selected,
    loading,
    deleteModalShow,
    setDeleteModalShow,
    handleDeleteYes,
    deleteLoading,
    navigate,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    providerId,
    setProviderId,
    providerNameOptions,
    providerDetails
  } = useProviderRateMatrixListing(isHitoricalTab)

  // console.log('providerDetails ::', providerDetails, totalPages);

  return (
    <Row className="mt-4">
      <Row className="mb-2 provider-dashboard-filters g-3 align-items-end">
        <Col xs={12} md={6} lg={4} className="provider-dashboard-filters__col">
          <Form.Label className="provider-dashboard-filters__label">Game Provider</Form.Label>
          <Select
            placeholder="Game Provider"
            options={providerNameOptions}
            isClearable
            className="gs-select"
            classNamePrefix="gs-select"
            menuPortalTarget={document.body}
            menuPosition="fixed"
            value={
              providerNameOptions.find(
                (option) => option.value === providerId
              ) || null
            }
            onChange={(e) => setProviderId(e ? e.value : null)}
          />
        </Col>
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
            {providersTableHeaders.map((h, idx) => (
              <th
                key={idx}
                // onClick={() => h.value !== 'action' &&
                //   h.value !== 'gameName' &&
                //   h.value !== 'winningDate' &&
                //   setOrderBy(h.value)}
                // style={{
                //   cursor: "pointer",
                // }}
                className={selected(h) ? "border-3 border border-blue" : ""}
              >
                {h.labelKey}{" "}
                {/* {selected(h) &&
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
                  ))} */}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="text-center">
                <InlineLoader />
              </td>
            </tr>
          ) : providerDetails?.rows?.length > 0 ? (
            providerDetails?.rows?.map(
              ({
                providerId,
                aggregatorName,
                providerName,
                status,
                hasProviderRate
              }) => (
                <tr key={providerId}>
                  <td>{aggregatorName || '-'}</td>
                  <td>{providerName || '-'}</td>
                  <td>
                    {
                      hasProviderRate ?
                        <>
                          <Trigger message="Edit" id={providerId + "edit"} />
                          <Button
                            id={providerId + "edit"}
                            hidden={isHidden({ module: { key: 'ProviderDashboard', value: 'U' } })}
                            className="m-1"
                            size="sm"
                            variant="warning"
                            onClick={() =>
                              navigate(`${AdminRoutes.EditProvidersRateMatrix.split(":").shift()}${providerId}`)
                            }
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                        </> :
                        <>
                          <Trigger message="Create" id={providerId + "create"} />
                          <Button
                            id={providerId + "create"}
                            hidden={isHidden({ module: { key: 'ProviderDashboard', value: 'C' } })}
                            className="m-1"
                            size="sm"
                            // variant="warning"
                            variant="info"

                            disabled={status === 1 || status === 2}
                            onClick={() =>
                              navigate(`${AdminRoutes.CreateProvidersRateMatrix.split(":").shift()}${providerId}`)
                            }
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </Button>
                        </>
                    }
                  </td>
                </tr>
              )
            )
          ) : (
            <tr>
              <td colSpan={6} className="text-danger text-center">
                No Data Found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {providerDetails?.count !== 0 && (
        <PaginationComponent
          page={providerDetails?.count < page ? setPage(1) : page}
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
    </Row>
  )
}

export default ProviderRateMatrixList