import { faFileDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@themesberg/react-bootstrap";
import React from "react";
import Trigger from "../../../components/OverlayTrigger";

const SampleCSVManagedBy = () => {
  const csvData = [
    ["userId", "managedBy"],
    ["1", "3"],
    ["2", ""],
    ["3", ""],
  ];

  const downloadCSV = () => {
    const rows = csvData
      .map((row) =>
        row
          .map(String)
          .map((cell) => `"${cell.replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "sample.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Trigger
        id={"sample-csv"}
        message={"Download Sample csv for bulk user assignment"}
      />
      <Button onClick={downloadCSV} id="sample-csv" variant="success">
        <FontAwesomeIcon icon={faFileDownload} />
      </Button>
    </>
  );
};

export default SampleCSVManagedBy;
