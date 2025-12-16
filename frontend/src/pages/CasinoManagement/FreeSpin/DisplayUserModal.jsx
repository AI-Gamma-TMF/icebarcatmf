import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, Modal, Button } from "@themesberg/react-bootstrap";
import { getFreeSpinUserPreview } from "../../../utils/apiCalls";
import PaginationComponent from "../../../components/Pagination/index";
import { InlineLoader } from "../../../components/Preloader";

const DisplayUserModal = ({ show, setShow, viewCategory }) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);

  const { data: userData, isLoading } = useQuery({
    queryKey: ["", viewCategory],
    queryFn: () => getFreeSpinUserPreview({ viewCategory }),
    select: (res) => res?.data?.data,
  });

  const totalPages = Math.ceil(userData?.count / limit);

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>View {viewCategory} Users</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <InlineLoader />
        ) : (
          <>
            <Table
              bordered
              striped
              responsive
              hover
              size="sm"
              className="text-center mt-4"
            >
              <thead>
                <tr>
                  {["UserId", "Email", "UserName", "FirstName", "LastName"].map(
                    (header) => (
                      <th key={header}>{header}</th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {!isLoading &&
                  userData?.rows?.map((user) => (
                    <tr key={user?.userId}>
                      <td>{user?.userId}</td>
                      <td>{user?.email}</td>
                      <td>{user?.username}</td>
                      <td>{user?.firstName}</td>
                      <td>{user?.lastName}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
            {userData?.count !== 0 && (
              <PaginationComponent
                page={userData?.count < page ? setPage(1) : page}
                totalPages={totalPages}
                setPage={setPage}
                limit={limit}
                setLimit={setLimit}
              />
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => setShow(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DisplayUserModal;
