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
import "./adminAffiliateListing.scss";

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
      <div className="dashboard-typography admin-affiliate-page">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
          <div>
            <h3 className="admin-affiliate-page__title">Affiliate</h3>
            <p className="admin-affiliate-page__subtitle">
              Create and manage affiliate accounts
            </p>
          </div>

          <div className="admin-affiliate-page__actions">
            <Button
              variant="primary"
              className="admin-affiliate-page__create-btn"
              size="sm"
              onClick={() => navigate(AdminRoutes.CreateAffiliate)}
              hidden={isHidden({ module: { key: "Admins", value: "C" } })}
            >
              {t("create")}
            </Button>
          </div>
        </div>

        <Card className="dashboard-filters admin-affiliate-filters mb-4">
          <Card.Body>
            <PlayerSearch globalSearch={globalSearch} setGlobalSearch={setGlobalSearch} />
          </Card.Body>
        </Card>

        <div className="dashboard-data-table">
          <div className="admin-affiliate-table-wrap">
            <Table bordered hover responsive size="sm" className="mb-0 text-center">
              <thead>
                <tr>
                  {tableHeaders.map((h, idx) => (
                    <th
                      key={idx}
                      onClick={() => h.value !== "" && handlePlayerTableSorting(h)}
                      style={{
                        cursor: h.value !== "" ? "pointer" : "default",
                      }}
                      className={selected(h) ? "sortable active" : "sortable"}
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
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={tableHeaders.length} className="text-center py-4">
                      <InlineLoader />
                    </td>
                  </tr>
                ) : playersData?.rows?.length > 0 ? (
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
                              className="admin-affiliate-status-btn admin-affiliate-status-btn--pending"
                              onClick={() => handleApproveAffiliateModal(player)}
                            >
                              Pending
                            </Button>
                          ) : (
                            <span className="admin-affiliate-pill admin-affiliate-pill--approved">
                              Approved
                            </span>
                          )}
                        </td>
                        <td>
                          <div className="admin-affiliate-actions">
                            <Trigger message="View" id={player.userId + "view"} />
                            <Button
                              id={player.userId + "view"}
                              className="admin-affiliate-icon-btn"
                              size="sm"
                              variant="info"
                              onClick={() => {
                                navigate(AdminRoutes.AffiliateDetail, { state: player });
                              }}
                            >
                              <FontAwesomeIcon icon={faEye} />
                            </Button>

                            <Trigger message="Delete" id={player.userId + "delete"} />
                            <Button
                              id={player.userId + "delete"}
                              className="admin-affiliate-icon-btn"
                              size="sm"
                              variant="danger"
                              onClick={() => handleDeleteAffiliateModal(player.affiliateId)}
                              hidden={isHidden({ module: { key: "Users", value: "T" } })}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={tableHeaders.length} className="text-center py-4 admin-affiliate-empty">
                      {t("noDataFound")}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>

        {playersData?.rows?.length !== 0 && (
          <PaginationComponent
            page={playersData?.count < page ? setPage(1) : page}
            totalPages={totalPages}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
          />
        )}
      </div>
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
