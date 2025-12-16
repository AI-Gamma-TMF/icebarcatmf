import React, { useEffect, useMemo, useState } from "react";
import Datetime from "react-datetime";
import useUserDailyReport from "../hooks/useUserDailyReport";
import { Button, Col, Form, Row, Table } from "@themesberg/react-bootstrap";
import { useAllColumnsDailyReport } from "../constant";
import {
  faCircleInfo,
  faFileDownload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formattedDate } from "../../../utils/dateFormatter";
import { onDownloadCsvClick } from "../../../utils/helper";
import PaginationComponent from "../../../components/Pagination";
import FilterDemo from "../../../components/MultiFunctionTable/ColumnSelector";
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
      <Row className="mb-3 d-flex justify-content-between align-items-center">
        <h3 className="w-auto">Users Daily Report</h3>

        <Trigger message={"help"} id={"help-icon"} />
        <FontAwesomeIcon
          id="help-icon"
          style={{ cursor: "pointer" }}
          className="w-auto "
          icon={faCircleInfo}
          onClick={() => navigate(`${AdminRoutes.UserDailyReportHelp}`)}
        />
      </Row>
      <Row className="d-flex align-items-center flex-nowrap">
        <FilterDemo
          options={options}
          selectedOptions={selectedOptions}
          setSelectedOptions={handleChange}
          marginTop={"mt-n4"}
        />
        <Col sm={6} lg={3}>
          <Form.Label>Start Date </Form.Label>
          <Datetime
            value={dateField?.startDate}
            onChange={handleStartDateChange}
            timeFormat={false}
            inputProps={{ readOnly: true }}
          />
          <div style={{ minHeight: "1.25rem", marginTop: "0.5rem" }}>
            {dateError?.startDateError && (
              <span style={{ color: "red" }}>{dateError?.startDateError}</span>
            )}
          </div>
        </Col>
        <Col sm={6} lg={3}>
          <Form.Label>End Date </Form.Label>

          <Datetime
            value={dateField?.endDate}
            onChange={handleEndDateChange}
            timeFormat={false}
            inputProps={{ readOnly: true }}
          />
          <div style={{ minHeight: "1.25rem", marginTop: "0.5rem" }}>
            {dateError?.endDateError && (
              <div style={{ color: "red" }}>{dateError?.endDateError}</div>
            )}
          </div>
        </Col>
        <Col xs="auto ms-auto">
          <Trigger id={"csv"} message={"Download as CSV"} />
          <Button
            id="csv"
            variant="success"
            style={{ marginLeft: "10px" }}
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
              <FontAwesomeIcon icon={faFileDownload} />
            )}
          </Button>
        </Col>
      </Row>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        {/* <div style={{ overflowX: "auto", width: "100%" }}> */}
        <Table
          bordered
          striped
          responsive
          hover
          size="sm"
          className="text-center mt-4"
        >
          <thead className="thead-dark">
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
                    setIsResizing={setIsResizing} // Pass setIsResizing to handle resizer
                  />
                ))}
              </tr>
            </SortableContext>
          </thead>
          <tbody>
            {isLoading ? (
              <td colSpan={columns.length} className="text-center">
                <InlineLoader/>
              </td>
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
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
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center p-3 text-danger"
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
       
      </DndContext>

      {selectedColumns &&
        selectedColumns?.length > 0 &&
        userDailyReport?.count !== 0 && (
          <PaginationComponent
            page={userDailyReport?.count < page ? setPage(1) : page}
            totalPages={totalPages}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
          />
        )}
    </>
  );
};

export default DailyUserReport;
