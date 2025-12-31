import React, { useEffect, useMemo, useState } from "react";
import Datetime from "react-datetime";
import useUserDailyReport from "../hooks/useUserDailyReport";
import { Button, Col, Form, Row, Table, Card } from "@themesberg/react-bootstrap";
import { useAllColumnsDailyReport } from "../constant";
import {
  faCircleInfo,
  faFileDownload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formattedDate } from "../../../utils/dateFormatter";
import { onDownloadCsvClick } from "../../../utils/helper";
import PaginationComponent from "../../../components/Pagination";
import { MultiSelect } from "react-multi-select-component";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DraggableHeader } from "../../../components/MultiFunctionTable";
import { InlineLoader } from "../../../components/Preloader";
import Trigger from "../../../components/OverlayTrigger";
import { useNavigate } from "react-router-dom";
import { AdminRoutes } from "../../../routes";
import "./userDailyReport.scss";

const DailyUserReport = () => {
  const {
    userDailyReport,
    isLoading,
    dateField,
    setDateField,
    dateError,
    setDateError,
    getCsvDownloadUrl,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
  } = useUserDailyReport();

  const navigate = useNavigate();
  const [downloadInProgress, setDownloadInProgress] = useState(false);

  const allColumns = useAllColumnsDailyReport();
  const defaultVisible = allColumns
    .map((col) => col.id || col.accessorKey)
    .filter(Boolean);
  const [visibleColumns, setVisibleColumns] = useState(defaultVisible);
  const [data, setData] = useState([]);
  const [columnsOrder, setColumnsOrder] = useState(
    allColumns.map((col) => col.accessorKey || col.id)
  );
  const [isResizing, setIsResizing] = useState(false); // Track resizing state

  const options = useMemo(() => {
    return allColumns
      .map((col) => {
        const key = col.id || col.accessorKey;
        if (!key) return null;
        return {
          value: key,
          label: col.header,
        };
      })
      .filter(Boolean);
  }, [allColumns]);

  const [selectedColumns, setSelectedColumns] = useState(visibleColumns);
  const [selectedOptions, setSelectedOptions] = useState(
    options.filter((option) => visibleColumns.includes(option.value))
  );

  const handleChange = (selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);
    setSelectedOptions(selectedOptions);
    setSelectedColumns(selectedValues);
    setVisibleColumns(selectedValues);
  };

  useEffect(() => {
    if (userDailyReport && userDailyReport?.rows) {
      setData(userDailyReport?.rows);
    }
  }, [userDailyReport]);

  const columns = useMemo(() => {
    return columnsOrder
      .filter((key) => selectedColumns.includes(key))
      .map((key) => {
        const col = allColumns.find(
          (c) => c.accessorKey === key || c.id === key
        );
        return {
          ...col,
          size: col.size || 150,
          minSize: 50,
          maxSize: 500,
          enableResizing: true,
          enableSorting: true,
          header: col.header,
        };
      });
  }, [columnsOrder, selectedColumns, allColumns]);

  const columnIds = useMemo(
    () => columns.map((c) => c.id || c.accessorKey),
    [columns]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: limit,
      },
    },
    manualPagination: true,

    pageCount: Math.ceil((userDailyReport?.count || 0) / limit),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode: "onEnd", // Ensure resizing ends properly
    enableColumnResizing: true, // Enable column resizing functionality
  });
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    if (isResizing) return; // Prevent dragging while resizing

    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = columnsOrder.indexOf(active.id);
    const newIndex = columnsOrder.indexOf(over.id);
    setColumnsOrder(arrayMove(columnsOrder, oldIndex, newIndex));
  };

  const handleStartDateChange = (date) => {
    setDateField({
      ...dateField,
      startDate: date,
    });
    if (dateField.endDate && date && date.isAfter(dateField.endDate)) {
      setDateError({
        ...dateError,
        startDateError: "Start date cannot be greater than end date.",
      });
    } else {
      setDateError({
        startDateError: "",
        endDateError: "",
      });
    }
  };
  const handleEndDateChange = (date) => {
    setDateField({
      ...dateField,
      endDate: date,
    });
    if (dateField.startDate && date && date.isBefore(dateField.startDate)) {
      setDateError({
        ...dateError,
        endDateError: "End date must be greater than the start date.",
      });
    } else {
      setDateError({
        startDateError: "",
        endDateError: "",
      });
    }
  };

  const handleDownloadClick = async () => {
    try {
      const formattedStartDate = formattedDate(dateField?.startDate);
      const formattedEndDate = formattedDate(dateField?.endDate);
      const baseFilename = "user_daily_report";
      const parts = [formattedStartDate, formattedEndDate].filter(
        (value) => value !== ""
      );

      const filename =
        parts.length > 0 ? `${baseFilename}_${parts.join("_")}` : baseFilename;

      setDownloadInProgress(true);
      const url = getCsvDownloadUrl();
      await onDownloadCsvClick(url, filename);
    } catch (error) {
      console.error("Error downloading CSV:", error);
    } finally {
      setDownloadInProgress(false);
    }
  };

  return (
    <>
      <div className="users-daily-report-page dashboard-typography">
        <Row className="d-flex align-items-center mb-2">
          <Col sm={8}>
            <h3 className="users-daily-report-page__title">Users Daily Report</h3>
            <div className="users-daily-report-page__subtitle">
              {typeof userDailyReport?.count === "number" ? `${userDailyReport.count} records` : ""}
            </div>
          </Col>

          <Col sm={4} className="d-flex justify-content-end gap-2">
            <Trigger message="Help" id="help-icon" />
            <Button
              id="help-icon"
              variant="secondary"
              size="sm"
              className="users-daily-report-page__icon-btn"
              onClick={() => navigate(`${AdminRoutes.UserDailyReportHelp}`)}
            >
              <FontAwesomeIcon icon={faCircleInfo} />
            </Button>

            <Trigger id={"csv"} message={"Download as CSV"} />
            <Button
              id="csv"
              variant="success"
              size="sm"
              className="users-daily-report-page__action-btn"
              onClick={handleDownloadClick}
              disabled={
                downloadInProgress ||
                userDailyReport === undefined ||
                userDailyReport?.rows?.length === 0
              }
            >
              {downloadInProgress ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : (
                <>
                  <FontAwesomeIcon icon={faFileDownload} /> CSV
                </>
              )}
            </Button>
          </Col>
        </Row>

        <Card className="p-2 mb-2 users-daily-report-page__card">
          <Row className="dashboard-filters users-daily-report-filters g-3 align-items-start">
            <Col xs={12} md={4} lg={4} className="users-daily-report-select-col">
              <Form.Label className="form-label">Select Columns</Form.Label>
              <MultiSelect
                options={options}
                value={selectedOptions}
                onChange={handleChange}
                labelledBy="Select Column"
                className="custom-multiselect users-daily-report-multiselect"
                hasSelectAll={true}
                overrideStrings={{
                  selectSomeItems: "Select Column",
                  allItemsAreSelected: "All Selected",
                  search: "Search...",
                }}
              />
            </Col>

            <Col xs={12} sm={6} md={4} lg={4}>
              <Form.Label className="form-label">Start Date</Form.Label>
              <Datetime
                value={dateField?.startDate}
                onChange={handleStartDateChange}
                timeFormat={false}
                inputProps={{ readOnly: true }}
              />
              <div className="users-daily-report-page__error">
                {dateError?.startDateError ? dateError?.startDateError : ""}
              </div>
            </Col>

            <Col xs={12} sm={6} md={4} lg={4}>
              <Form.Label className="form-label">End Date</Form.Label>
              <Datetime
                value={dateField?.endDate}
                onChange={handleEndDateChange}
                timeFormat={false}
                inputProps={{ readOnly: true }}
              />
              <div className="users-daily-report-page__error">
                {dateError?.endDateError ? dateError?.endDateError : ""}
              </div>
            </Col>
          </Row>

          <div className="dashboard-section-divider" />

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="table-responsive dashboard-table users-daily-report-table-wrap mt-2">
              <Table
                hover
                size="sm"
                className="dashboard-data-table users-daily-report-table text-center"
              >
                <thead>
                  <SortableContext
                    items={columnIds}
                    strategy={horizontalListSortingStrategy}
                  >
                    <tr>
                      {table.getHeaderGroups()[0].headers.map((header) => (
                        <DraggableHeader
                          key={header.id}
                          header={header}
                          id={header.column.id}
                          isResizing={isResizing}
                          setIsResizing={setIsResizing}
                        />
                      ))}
                    </tr>
                  </SortableContext>
                </thead>

                <tbody>
                  {isLoading && table.getRowModel().rows.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length} className="text-center">
                        <InlineLoader />
                      </td>
                    </tr>
                  ) : table.getRowModel().rows.length > 0 ? (
                    <>
                      {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                          {row.getVisibleCells().map((cell) => (
                            <td
                              key={cell.id}
                              style={{
                                width: cell.column.getSize(),
                                minWidth: cell.column.columnDef.minSize,
                                maxWidth: cell.column.columnDef.maxSize,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}

                      {isLoading ? (
                        <tr>
                          <td colSpan={columns.length} className="text-center">
                            <InlineLoader />
                          </td>
                        </tr>
                      ) : null}
                    </>
                  ) : (
                    <tr>
                      <td colSpan={columns.length} className="text-center p-3">
                        <span className="users-daily-report-empty">No data found</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </DndContext>

          {selectedColumns &&
            selectedColumns?.length > 0 &&
            userDailyReport?.count !== 0 && (
              <div className="users-daily-report-page__pagination">
                <PaginationComponent
                  page={userDailyReport?.count < page ? setPage(1) : page}
                  totalPages={totalPages}
                  setPage={setPage}
                  limit={limit}
                  setLimit={setLimit}
                />
              </div>
            )}
        </Card>
      </div>
    </>
  );
};

export default DailyUserReport;
