import { Button, Col, Row, Form, Card } from "@themesberg/react-bootstrap";
import { useState } from "react";
import Trigger from "../../../components/OverlayTrigger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileDownload, faRedoAlt } from "@fortawesome/free-solid-svg-icons";
import { onDownloadCsvClick } from "../../../utils/helper";
import VaultList from "../../../components/VaultList";
import useVaultList from "../hooks/useVaultList";
import "./vault.scss";

const Vault = ({ email, isAllUser }) => {
  const {
    t,
    setLimit,
    setPage,
    totalPages,
    limit,
    page,
    vaultRefetch,
    vaultData,
    loading,
    getCsvDownloadUrl,
    search,
    setSearch,
    setUsername,
    username,
    operator,
    setOperator,
    filterBy,
    setFilterBy,
    filterValue,
    setFilterValue,
    sort,
    setSort,
    over,
    setOver,
    orderBy,
    setOrderBy,
    selected,
  } = useVaultList(email);
  const [downloadInProgress, setDownloadInProgress] = useState(false);

  const handleDownloadClick = async () => {
    try {
      let filename = "Vault_Data";

      if (search) {
        filename += `_${search}`;
      }
      if (username) {
        filename += `_${username}`;
      }
      setDownloadInProgress(true);
      const url = getCsvDownloadUrl();
      await onDownloadCsvClick(url, filename);
    } catch (error) {
      console.error("Error downloading CSV:", error);
    } finally {
      setDownloadInProgress(false);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setLimit(15);
    setPage(1);
    setUsername("");
    setFilterBy("");
    setOperator("");
    setFilterValue("");
  };

  return (
    <div className="dashboard-typography vault-page">
      {isAllUser && (
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="vault-page__title">Vault</h3>
            <p className="vault-page__subtitle">View vault balances across users</p>
          </div>
        </div>
      )}

      <Card className="dashboard-filters mb-4">
        <Card.Body>
          <Row className="g-3 align-items-start">
            <Col xs={12} md={6} lg={4}>
              <Form.Label>{t("transactions.filters.search")}</Form.Label>
              <Form.Control
                className="vault-filters__control"
                type="search"
                value={search}
                placeholder="Search By Email"
                onChange={(event) => {
                  setPage(1);
                  setSearch(
                    event.target.value.replace(/[~`%^#)()><?]+/g, "").trim()
                  );
                }}
              />
            </Col>

            <Col xs={12} md={6} lg={4}>
              <Form.Label>User Name</Form.Label>
              <Form.Control
                className="vault-filters__control"
                type="search"
                value={username}
                placeholder="Search by Username"
                onChange={(event) => {
                  setPage(1);
                  setUsername(
                    event?.target?.value?.replace(/[~`%^#)()><?]+/g, "").trim()
                  );
                }}
              />
            </Col>

            <Col xs={12} md={6} lg={4}>
              <Form.Label>Filter By</Form.Label>
              <Form.Select
                className="vault-filters__select"
                onChange={(e) => {
                  setPage(1);
                  setFilterBy(e?.target?.value);
                }}
                value={filterBy}
              >
                <option hidden>Select Coin</option>
                <option value="vaultScCoin">Vault SC Coin</option>
                <option value="vaultGcCoin">Vault GC Coin</option>
              </Form.Select>
            </Col>

            <Col xs={12} md={6} lg={4}>
              <Form.Label>Operator</Form.Label>
              <Form.Select
                className="vault-filters__select"
                onChange={(e) => {
                  setPage(1);
                  setOperator(e?.target?.value);
                }}
                value={operator}
                disabled={!filterBy}
              >
                <option hidden>Select Operator</option>
                <option value="=">=</option>
                <option value=">">{`>`}</option>
                <option value=">=">{`>=`}</option>{" "}
                <option value="<">{`<`}</option>{" "}
                <option value="<=">{`<=`}</option>
              </Form.Select>
            </Col>

            <Col xs={12} md={6} lg={4}>
              <Form.Label>Value</Form.Label>
              <Form.Control
                className="vault-filters__control"
                type="number"
                onKeyDown={(evt) =>
                  ["e", "E", "+"]?.includes(evt.key) && evt?.preventDefault()
                }
                name="filterValue"
                value={filterValue}
                onChange={(e) => {
                  setFilterValue(e?.target?.value);
                }}
                placeholder="Enter Value"
                disabled={!operator}
              />
            </Col>

            <Col xs={12} lg={4} className="d-flex align-items-end">
              <div className="vault-filters__actions w-100">
                <div className="flex-grow-1" />

                <Trigger message="Reset Filters" id={"redo"} />
                <Button
                  id={"redo"}
                  className="vault-action-btn vault-action-btn--reset"
                  onClick={resetFilters}
                >
                  <FontAwesomeIcon icon={faRedoAlt} /> Reset
                </Button>

                <Trigger message="Download as CSV" id={"csv"} />
                <Button
                  id={"csv"}
                  className="vault-action-btn vault-action-btn--download"
                  disabled={vaultData?.count === 0 || downloadInProgress}
                  onClick={handleDownloadClick}
                >
                  {downloadInProgress ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faFileDownload} /> Export CSV
                    </>
                  )}
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <div className="dashboard-data-table">
        <div className="vault-table-wrap">
          <VaultList
            page={page}
            setLimit={setLimit}
            limit={limit}
            setPage={setPage}
            totalPages={totalPages}
            data={vaultData}
            loading={loading}
            isAllUser={isAllUser}
            vaultRefetch={vaultRefetch}
            sort={sort}
            setSort={setSort}
            over={over}
            setOver={setOver}
            orderBy={orderBy}
            setOrderBy={setOrderBy}
            selected={selected}
          />
        </div>
      </div>
    </div>
  );
};

export default Vault;
