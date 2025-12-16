import React, { useState } from "react";
import { Button, Table, Row, Col, Form } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faFileDownload,
  faTrashCanArrowUp,
  faRedoAlt
} from "@fortawesome/free-solid-svg-icons";
import Trigger from "../../../components/OverlayTrigger";
import { leaderTableHeaders } from "../constants";
import { useTranslation } from "react-i18next";
import {
  convertToTimeZone,
  getFormattedTimeZoneOffset,
  onDownloadCsvClick,
} from "../../../utils/helper";
import { getItem } from "../../../utils/storageUtils";
import { timeZones } from "../../Dashboard/constants";
import { ConfirmationModal } from "../../../components/ConfirmationModal";
import { useBootPlayerTournamentMutation } from "../../../reactQuery/hooks/customMutationHook";
import { toast } from "../../../components/Toast";
import AddFreeEntry from "./AddFreeEntry";
import { getDateTime } from "../../../utils/dateFormatter";
import PaginationComponent from "../../../components/Pagination";
import useCheckPermission from "../../../utils/checkPermission";

const LeaderBoard = ({
  list,
  tournamentData,
  refetchTournament,
  page,
  setPage,
  totalPages,
  limit,
  setLimit,
  getCsvDownloadUrl,
  payoutTournamentList,
  search,
  setSearch
}) => {
  const { isHidden } = useCheckPermission();
  const [statusShow, setStatusShow] = useState(false);
  const [downloadInProgress, setDownloadInProgress] = useState(false);
  const [itemToUpdate, setItemToUpdate] = useState(null);
  const [isBootedAction, setIsBootedAction] = useState(null);
  const { t } = useTranslation(["tournaments"]);
  const timeZone = getItem("timezone");
  const timezoneOffset =
    timeZone != null
      ? timeZones.find((x) => x.code === timeZone).value
      : getFormattedTimeZoneOffset();

  const updatePlayer = useBootPlayerTournamentMutation({
    onSuccess: (res) => {
      if (res?.data) {
        toast(res?.data?.message, "success");
        refetchTournament();
      }
      setStatusShow(false);
    },
    onError: (error) => {
      if (error?.response?.data?.errors.length > 0) {
        const { errors } = error.response.data;
        errors.map((error) => {
          if (error?.description) toast(error?.description, "error");
        });
      }
      setStatusShow(false);
    },
  });

  const handleOnSubmit = async () => {
    if (!itemToUpdate) return;

    const payload = {
      userId: itemToUpdate?.userId,
      tournamentId: itemToUpdate?.tournamentId,
      isBooted: isBootedAction,
    };

    updatePlayer.mutate(payload);
  };


  const handleActionClick = (data, action) => {
    setItemToUpdate(data);
    setIsBootedAction(action);
    setStatusShow(true); // Show confirmation modal
  };

  const handleDownloadClick = async () => {
    try {
      const filename = "tournament_data";

      setDownloadInProgress(true);
      const url = getCsvDownloadUrl();
      await onDownloadCsvClick(url, filename);
    } catch (error) {
      console.error("Error downloading CSV:", error);
    } finally {
      setDownloadInProgress(false);
    }
  };

  const leaderTableHeadersModified = leaderTableHeaders?.map((header) => {
    if (header.labelKey === "scWinAmount") {
      return { ...header, labelKey: "Rewarded SC" };
    }
    if (header.labelKey === "gcWinAmount") {
      return { ...header, labelKey: "Rewarded GC" };
    }
    return header;
  });

  return (
    <>
      <Row>
        <Col xs={5} lg='auto' className='mt-2 mt-lg-0'>
          <div className='d-flex justify-content-start align-items-center w-100 flex-wrap'>
            <Form.Label column='sm' style={{ marginBottom: '0', marginRight: '15px' }}>
              Search by User Id, Username or Email
            </Form.Label>

            <Form.Control
              type='search'
              value={search}
              placeholder={'Search.... '}
              onChange={(event) => {
                setPage(1);
                setSearch(event?.target?.value);
              }}
              style={{ minWidth: '230px' }}
            />
          </div>
        </Col>
        <Col xs={4} style={{ marginTop: "30px" }}>
          <Trigger message="Reset Filters" id={"redo"} />
          <Button
            id={"redo"}
            variant="success"
            className=""
            onClick={() => {
              setSearch('')
            }}
          >
            <FontAwesomeIcon icon={faRedoAlt} />
          </Button>
        </Col>
      </Row>

      <div className="text-right pe-3 flex">
        <AddFreeEntry
          tournamentData={tournamentData}
          refetchTournament={refetchTournament}
        />
        <Button
          id={"csv"}
          variant="success"
          disabled={list?.count === 0 || downloadInProgress}
          onClick={handleDownloadClick}
          className="ms-2"
        >
          {downloadInProgress ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            <FontAwesomeIcon icon={faFileDownload} />
          )}
        </Button>
      </div>
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
            {leaderTableHeadersModified?.map((h, idx) => (
              <th key={idx}>{t(h.labelKey)} </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {list?.rows?.length > 0 &&
            list?.rows?.map((data, _index) => {

              return (
                <tr key={data?.tournamentId}>
                  <td>{data?.rank}</td>
                  <td>{data?.userId}</td>
                  <td>
                    <Trigger
                      message={data?.User.username}
                      id={data?.User.username}
                    />
                    <span
                      id={data?.User.username}
                      style={{ width: "100px", cursor: "pointer" }}
                      className="d-inline-block text-truncate"
                    >
                      {data?.User.username}
                    </span>
                  </td>
                  <td>{data?.User.email}</td>
                  <td>{data?.score}</td>
                  <td>{getDateTime(convertToTimeZone(data?.createdAt, timezoneOffset))}</td>
                  {/* <td>{tournamentData?.entryCoin === 'SC' ? data?.scBet : data?.gcBet}</td> */}

                  <td>{data?.playerBet}</td>
                  <td>{data?.playerWin}</td>

                  <td>{data?.ggr ? data?.ggr : '-'}</td>
                  <td>{data?.isWinner ? "Yes" : "No"}</td>
                  <td>{(tournamentData?.status === '2' || tournamentData?.status === '3') ? data?.scWinAmount : "-"}</td>
                  <td>{(tournamentData?.status === '2' || tournamentData?.status === '3') ? data?.gcWinAmount : "-"}</td>
                  <td>{data?.isBooted ? <span className="text-danger">Booted</span> : <span>-</span>}</td>
                  <td>
                    <Trigger
                      message="Boot"
                      id={data?.userId + "boot"}
                    />
                    <Button
                      id={data?.userId + "boot"}
                      className="btn btn-success m-1"
                      size="sm"
                      hidden={isHidden({ module: { key: "Tournaments", value: "U" } })}
                      disabled={data?.isBooted || payoutTournamentList?.data?.isPayoutCompleted}
                      onClick={() => handleActionClick(data, true)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                    <Trigger message="Unboot" id={data?.userId + "unboot"} />
                    <Button
                      id={data?.userId + "unboot"}
                      className="btn btn-warning m-1"
                      style={{
                        fontSize: "17px",
                        padding: "2px 8px",
                        color: "#000",
                      }}
                      size="sm"
                      disabled={!data?.isBooted || payoutTournamentList?.data?.isPayoutCompleted}
                      onClick={() => handleActionClick(data, false)} // Unboot action (false)
                    >
                      <FontAwesomeIcon icon={faTrashCanArrowUp} />
                    </Button>
                  </td>
                </tr>
              );
            })}
          {list?.count === 0 && (
            <tr>
              <td colSpan={7} className="text-danger text-center">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      {list?.count !== 0 && (
        <PaginationComponent
          page={list?.count < page ? setPage(1) : page}
          totalPages={totalPages}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
        />
      )}
      <ConfirmationModal
        setShow={setStatusShow}
        show={statusShow}
        handleYes={handleOnSubmit}
        message={
          <span>
            Are you sure you want to boot to{" "}
            {isBootedAction ? "boot" : "unboot"}{" "}
            <strong>{itemToUpdate?.User?.username}</strong> from the tournament?
          </span>
        }
        loading={updatePlayer.isLoading}
      />
    </>
  );
};

export default LeaderBoard;
