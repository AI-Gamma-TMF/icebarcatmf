import React, { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useAllColumns } from "./constant";
import useListing from "./useListing";
import PaginationComponent from "../Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowCircleUp,
  faArrowCircleDown,
} from "@fortawesome/free-solid-svg-icons";
import PlayerSearch from "../../pages/Players/PlayerSearch";
import "./MultiFunctionalTable.css";
import FilterDemo from "./ColumnSelector";
import { PlayerStatusModal } from "../../pages/Players/Components/PlayerStatusModal";
import { Table } from "@themesberg/react-bootstrap";

export const DraggableHeader = ({ header, id, setIsResizing }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
    padding: "8px",
    border: "1px solid #ccc",
    position: "relative",
    userSelect: "none",
    width: header.getSize(),
    minWidth: header.column.columnDef.minSize,
    maxWidth: header.column.columnDef.maxSize,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  };

  const isSorted = header.column.getIsSorted();
  const canSort = header.column.getCanSort();

  const resizer = header.column.getCanResize() ? (
    <div
      className="resizer"
      onMouseDown={(e) => {
        setIsResizing(true);
        e.stopPropagation();
        header.getResizeHandler()(e); // Start resizing logic
      }}
      onMouseUp={() => setIsResizing(false)}
      onClick={(e) => e.stopPropagation()}
    />
  ) : null;

  return (
    <th ref={setNodeRef} style={style}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            cursor: canSort ? "pointer" : "default",
          }}
          onClick={() => {
            if (canSort) {
              header.column.toggleSorting();
            }
          }}
        >
          {flexRender(header.column.columnDef.header, header.getContext())}
          {isSorted && (
            <FontAwesomeIcon
              icon={isSorted === "asc" ? faArrowCircleUp : faArrowCircleDown}
              style={{ color: "#007bff", marginLeft: "5px" }}
            />
          )}
        </span>
        <span
          {...attributes}
          {...listeners}
          style={{ cursor: "grab", paddingLeft: "8px" }}
        >
          ⠿
        </span>
      </div>
      {resizer}
    </th>
  );
};

const MultiFunctionalTable = () => {
  const [sorting, setSorting] = useState([{ id: "userId", desc: true }]);

  const {
    playersData,
    handleStatusShow,
    page,
    setPage,
    limit,
    setLimit,
    sort,
    setSort,
    globalSearch,
    setGlobalSearch,
    getCsvDownloadUrl,
    status,
    statusShow,
    setStatusShow,
    handleYes,
    playerId,
    updateloading,
    setBtnClick,
    loading,
    btnClick,
    totalPages,
    setOrderBy,
  } = useListing();
  const allColumns = useAllColumns(handleStatusShow);

  const [columnsOrder, setColumnsOrder] = useState(
    allColumns.map((col) => col.accessorKey || col.id)
  );
  const defaultVisible = allColumns
    .map((col) => col.id || col.accessorKey)
    .filter(Boolean);
  const [visibleColumns, setVisibleColumns] = useState(defaultVisible);
  const [data, setData] = useState([]);
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
    if (playersData && playersData?.rows) {
      setData(playersData?.rows);
    }
  }, [playersData]);

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
      sorting,
      pagination: {
        pageIndex: page - 1,
        pageSize: limit,
      },
    },
    manualPagination: true,
    // manualSorting: true,
    enableSortingRemoval: false,
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      setSorting(newSorting);
      console.log(newSorting);
      if (newSorting?.length > 0) {
        const colId = newSorting[0]?.id || null;
        const direction = newSorting[0]?.desc ? "desc" : "asc";

        setSort(direction);
        setOrderBy(colId);
        setBtnClick(true);
      }
    },
    pageCount: Math.ceil((playersData?.count || 0) / limit),
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

  return (
    <>
      <PlayerSearch
        setBtnClick={setBtnClick}
        globalSearch={globalSearch}
        setGlobalSearch={setGlobalSearch}
        getCsvDownloadUrl={getCsvDownloadUrl}
        playersData={playersData}
        handleChange={handleChange}
        loading={loading}
        btnClick={btnClick}
        setPage={setPage}
      />

      <FilterDemo
        options={options}
        selectedOptions={selectedOptions}
        setSelectedOptions={handleChange}
        marginTop={"mt-3"}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div style={{ overflowX: "auto", width: "100%" }}>
          <Table
            bordered
            striped
            responsive
            hover
            size="sm"
            className="mt-4 text-center"
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
              {table.getRowModel().rows.length > 0 ? (
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
        </div>
      </DndContext>

      {selectedColumns &&
        selectedColumns?.length > 0 &&
        playersData?.rows?.length !== 0 && (
          <PaginationComponent
            page={playersData?.count < page ? 1 : page}
            totalPages={totalPages}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
          />
        )}
      {statusShow && (
        <PlayerStatusModal
          setShow={setStatusShow}
          show={statusShow}
          handleYes={handleYes}
          status={status}
          playerId={playerId}
          loading={updateloading}
          setBtnClick={setBtnClick}
        />
      )}
    </>
  );
};

export default MultiFunctionalTable;
