import { Table } from "@themesberg/react-bootstrap";
import React from "react";
import { DocStatus, tableHeaders } from "./constants";
import { getDateTime } from "../../utils/dateFormatter";
import Trigger from "../OverlayTrigger";

const UserDocsList = ({
  userDocuments,
  handleVerify,
  handleImagePreview,
  setDocStatus
}) => {

  return (
    <Table
      bordered
      striped
      responsive
      hover
      size='sm'
      className='text-center mt-4'
    >
      <thead className='thead-dark'>
        <tr>
          {tableHeaders.map((c) => (
            <th key={c}>{c}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {userDocuments &&
          userDocuments?.map(
            ({
              userDocumentId,
              documentUrl,
              documentName,
              status,
              reason,
              updatedAt,
              createdAt,
              documentExpiry,
              actionPerformedAt,
              signature,
            }) => {
              return (
                <tr key={`user-docs-list ${userDocumentId}`}>

                  <td
                    className='text-link'
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      handleVerify("approved", userDocumentId)
                      const documentData = documentUrl?.[documentUrl?.length - 1];
                      setDocStatus(status)
                      handleImagePreview(
                        documentData,
                        documentName,
                        signature
                      );
                    }}
                  >
                    {documentUrl?.[documentUrl?.length - 1]?.split('/')[6] || 'document'}
                  </td>

                  <td>
                    <Trigger
                      message={documentName}
                      id={documentName + "docname"}
                    />
                    <span
                      id={documentName + "docname"}
                      style={{
                        width: "130px",
                        cursor: "pointer",
                      }}
                      className='d-inline-block text-truncate'
                    >
                      {documentName}
                    </span>
                  </td>

                  {!signature ? (
                    <td>
                      {DocStatus?.[status] || 'Pending'}
                    </td>
                  ) : (
                    <td>Pending</td>
                  )}

                  <td>{getDateTime(createdAt)}</td>
                  <td>{getDateTime(updatedAt)}</td>
                  <td>{getDateTime(documentExpiry)}</td>
                  <td>{getDateTime(actionPerformedAt)}</td>

                  <td>{reason || "N/A"}</td>
                </tr>
              );
            }
          )}

        {userDocuments?.length < 1 && (
          <tr>
            <td colSpan={8} className='text-danger text-center'>
              No data found
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default UserDocsList;
