/*
Filename: Players/index.js
Description: View List of all users.
Author: uchouhan
Created at: 2023/03/03
Last Modified: 2023/03/30
Version: 0.1.0
*/
import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Table,
} from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faArrowCircleUp,
  faArrowCircleDown,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import usePlayerListing from "./usePlayerListing";
import PaginationComponent from "../../components/Pagination";
import { AdminRoutes } from "../../routes";
import { tableHeaders } from "./constants";
import { InlineLoader } from "../../components/Preloader";
import Trigger from "../../components/OverlayTrigger";
import useCheckPermission from "../../utils/checkPermission";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import PlayerSearch from "./PlayerSearch";
import {
  useApproveAffiliateMutation,
  useDeleteAffiliate,
} from "../../reactQuery/hooks/customMutationHook";
import CustomModal from "../../components/CustomModal";
import { toast } from "../../components/Toast";

const AdminAffiliate = () => {
  const {
    t,
    navigate,
    selected,
    loading,
    sort,
    setStatusShow,
    statusShow,
    handleYes,
    status,
    setSort,
    over,
    setOver,
    playersData,
    // search,
    // setSearch,
    totalPages,
    page,
    setPage,
    limit,
    setLimit,
    // setKycOptions,
    setOrderBy,
    // handleStatusShow,
    globalSearch,
    setGlobalSearch,
    orderBy,
    refetch,
  } = usePlayerListing();

  const { isHidden } = useCheckPermission();

  // const [selectedTab, setSelectedTab] = useState("playerSearch");

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [showDeleteAffiliateModal, setShowDeleteAffiliateModal] =
    useState(false);

  const [affiliateDetail, setAffiliateDetail] = useState({});

  const [affiliateId, setAffiliateId] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePlayerTableSorting = (param) => {
    if (param.value === orderBy) {
      setSort(sort === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(param.value);
      setSort("asc");
    }
  };

  const onAffiliateSuccess = () => {
    setIsSubmitting(false)
    toast("Affiliate Approve Successfully", "success");
    setShowConfirmModal(false);
    refetch();
  };

  const onAffiliateError = (err) => {
    setIsSubmitting(false)
    if (err?.response?.data?.errors.length > 0) {
      const { errors } = err.response.data;
      errors.forEach((error) => {
        if (error?.description) {
          if (error.errorCode === 3007) {
            console.log(error)
          } else toast(error?.description, "error");
        }
      });
    }
  };

  const onDeleteAffiliateSuccess = () => {
    setIsSubmitting(false)
    toast("Affiliate Deleted Successfully", "success");
    setShowDeleteAffiliateModal(false);
    refetch();
  };

  const onDeleteAffiliateError = (err) => {
    if (err?.response?.data?.errors.length > 0) {
      const { errors } = err.response.data;
      errors.forEach((error) => {
        if (error?.description) {
          if (error.errorCode === 3007) {
            console.log(error)
          } else toast(error?.description, "error");
        }
      });
    }
  };

  const affiliateMutation = useApproveAffiliateMutation({
    onSuccess: onAffiliateSuccess,
    onError: onAffiliateError,
  });

  const affiliateDeleteMutation = useDeleteAffiliate({
    onSuccess: onDeleteAffiliateSuccess,
    onError: onDeleteAffiliateError,
  });


  const handleAffiliateApproval = () => {
    setIsSubmitting(true)
    const obj = {
      affiliateId: affiliateDetail.affiliateId,
      email: affiliateDetail.email,
      isActive: true,
      affiliate_status: "approved",
    };
    affiliateMutation.mutate(obj);
  };

  const deleteAffiliate = () => {
    setIsSubmitting(true)
    affiliateDeleteMutation.mutate(affiliateId);
  };

  const handleDeleteAffiliateModal = (affiliateId) => {
    setAffiliateId(affiliateId);
    setShowDeleteAffiliateModal(true);
  };

  const handleApproveAffiliateModal = (player) => {
    setAffiliateDetail(player);
    setShowConfirmModal(true);
  };

  return (
    <>
      <Card className="p-2 mb-2">
        <Row>
          <Col>
            <h3>Affiliate</h3>
          </Col>

          <Col className="col-4">
            <div className="d-flex justify-content-end">
              <Button
                variant="success"
                className="m-1"
                size="sm"
                onClick={() => navigate(AdminRoutes.CreateAffiliate)}
                hidden={isHidden({ module: { key: "Admins", value: "C" } })}
              >
                {t("create")}
              </Button>
            </div>
          </Col>
        </Row>

        <PlayerSearch
          globalSearch={globalSearch}
          setGlobalSearch={setGlobalSearch}
        />
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
                  onClick={() => h.value !== "" && handlePlayerTableSorting(h)}
                  style={{
                    cursor: "pointer",
                  }}
                  className={selected(h) ? "border-3 border border-blue" : ""}
                >
                  {t(h.labelKey)}{" "}
                  {selected(h) &&
                    (sort === "asc" ? (
                      <FontAwesomeIcon
                        style={over ? { color: "red" } : {}}
                        icon={faArrowCircleUp}
                        onClick={() => setSort("desc")}
                        onMouseOver={() => setOver(true)}
                        onMouseLeave={() => setOver(false)}
                      />
                    ) : (
                      <FontAwesomeIcon
                        style={over ? { color: "red" } : {}}
                        icon={faArrowCircleDown}
                        onClick={() => setSort("asc")}
                        onMouseOver={() => setOver(true)}
                        onMouseLeave={() => setOver(false)}
                      />
                    ))}
                </th>
              ))}
            </tr>
          </thead>

          {!loading && (
            <tbody>
              {playersData &&
                playersData?.rows.map((player) => {
                  return (
                    <tr key={player.affiliateId}>
                      <td>{player.affiliateId}</td>
                      <td>{player.email}</td>
                      <td>{player.firstName}</td>
                      <td>{player.lastName}</td>
                      <td>{player.phone}</td>
                      <td>{player.state}</td>
                      <td>{player.preferredContact}</td>
                      <td>
                        {player.affiliate_status === "pending" ? (
                          <Button
                            variant="secondary"
                            style={{ padding: "5px" }}
                            onClick={() => handleApproveAffiliateModal(player)}
                          >
                            Pending
                          </Button>
                        ) : (
                          <Button
                            variant="success"
                            className="m-1"
                            size="sm"
                            style={{ padding: "5px", color: "white" }}
                          >
                            {" "}
                            Approve
                          </Button>
                        )}
                      </td>

                      <td>
                        <>
                          <Trigger message="View" id={player.userId + "view"} />
                          <Button
                            id={player.userId + "view"}
                            className="m-1"
                            size="sm"
                            variant="info"
                            onClick={() => {
                              navigate(AdminRoutes.AffiliateDetail, {
                                state: player,
                              });
                            }}
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </Button>

                          <Button
                            id={player.userId + "inactive"}
                            className="m-1"
                            size="sm"
                            variant="danger"
                            onClick={() =>
                              handleDeleteAffiliateModal(player.affiliateId)
                            }
                            hidden={isHidden({
                              module: { key: "Users", value: "T" },
                            })}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </>
                      </td>
                    </tr>
                  );
                })}

              {playersData?.rows?.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="text-danger text-center">
                    {t("noDataFound")}
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </Table>
        {loading && <InlineLoader />}
        {playersData?.rows?.length !== 0 && (
          <PaginationComponent
            page={playersData?.count < page ? setPage(1) : page}
            totalPages={totalPages}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
          />
        )}
      </Card>
      {showConfirmModal && (
        <CustomModal
          showModal={showConfirmModal}
          handleClose={() => setShowConfirmModal(false)}
          handleSubmit={handleAffiliateApproval}
          TextMessage=" Are you sure you  want to approve this Affiliate"
          btnMsg="Approve"
          HeaderMsg="Confirm !"
          disabled={isSubmitting}
        />
      )}
      {showDeleteAffiliateModal && (
        <CustomModal
          showModal={showDeleteAffiliateModal}
          handleClose={() => setShowDeleteAffiliateModal(false)}
          handleSubmit={deleteAffiliate}
          TextMessage="Are you sure you  want To delete this Affiliate"
          btnMsg="Delete"
          HeaderMsg="Confirm !"
          disabled={isSubmitting}
        />
      )}
      <ConfirmationModal
        setShow={setStatusShow}
        show={statusShow}
        handleYes={handleYes}
        active={status}
      />
    </>
  );
};
export default AdminAffiliate;
