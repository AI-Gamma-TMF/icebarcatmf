import React, { useState } from "react";



import UserList from "./component/Userlist";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import {
  Button,
  Col,
  Table,
  Form,
  Row,
} from "@themesberg/react-bootstrap";

import Trigger from "../../components/OverlayTrigger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  getRedeemUserDetails,
} from "../../utils/apiCalls";
import PaginationComponent from "../../components/Pagination";
import {
  faTrash,faRedoAlt
} from "@fortawesome/free-solid-svg-icons";
import { useDeleteRedeemUser } from "../../reactQuery/hooks/customMutationHook";
import { DeleteConfirmationModal } from "../../components/ConfirmationModal";
import { toast } from "../../components/Toast";
const AddUserSelect = ({
  // sendMail,
  // sendMailLoading,
  // templatedata,
  // istestButton,
  // isRedeemRule,
  editRedeemRule,
  RuleData,
  // editloading,
}) => {
  // const [search, setSearch] = useState('')
  const [limit, setLimit] = useState(15);
  const [page, setPage] = useState(1);
  const [orderBy, _setOrderBy] = useState("");
  const [selectedPlayerIds, setSelectedPlayerIds] = useState([])
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const ruleId = RuleData?.ruleId;
  const {
    data: userdata = [],
refetch:fetch,
  } = useQuery({
    queryKey: ["userData", limit, page, orderBy, ruleId, debouncedSearch],
    queryFn: async ({ queryKey }) => {
      const params = {
        pageNo: queryKey[2],
        limit: queryKey[1],
        ruleId: queryKey[4],
        ...(queryKey[3] && { orderBy: queryKey[3] }),
      };
      if (queryKey[5]) params.email = queryKey[5];
      return getRedeemUserDetails(params);
    },
    select: (res) => res?.data?.userDetails || [],
    refetchOnWindowFocus: false,
  });
  const totalPages = Math.ceil(userdata?.count / limit);
  const resetFilters = () => {
    setSearch("");

  };

  const { mutate: deleteUser, isLoading: deleteLoading } =
    useDeleteRedeemUser({
        onSuccess: () => {
          toast("User Deleted Successfully", "success");
          // queryClient.invalidateQueries({ queryKey: ["userdata"] });
          setDeleteModalShow(false);
          fetch();
        },
      });

      const handleDeleteModal = ( playerId) => {
        
        setSelectedPlayerIds((prev) => [...prev, playerId]) // Add playerId to array
        setDeleteModalShow(true)
      }
  
      const handleDeleteYes = () => {
       
          deleteUser({ ruleId: ruleId, playerIds: selectedPlayerIds })
        
      }
  
  return (
    <div className="mt-3">
      <Row className="mt-2 d-flex">
        <div className="d-flex">
          <h5>Added User</h5>
        </div>
        <Row className="w-100 m-auto">
        <Col xs="12" sm="6" lg="3" className="mb-3">
          <Form.Label
            style={{
              marginBottom: "0",
              marginRight: "15px",
              marginTop: "5px",
            }}
          >
            Search by Email
          </Form.Label>

          <Form.Control
            type="search"
            value={search}
            placeholder="Search By Email"
            onChange={(event) => {
              setPage(1);
              setSearch(event.target.value.replace(/[~`%^#)()><?]+/g, "").trim());
            }}
          />
        </Col>
        

        <Col
          xs="12"
          sm="6"
          lg="1"
          className="d-flex align-items-end mt-2 mt-sm-0 mb-0 mb-sm-3"
        >
          <Trigger message="Reset Filters" id={"redo"} />
          <Button
            id={"redo"}
            variant="success"
            className=""
            onClick={resetFilters}
          >
            <FontAwesomeIcon icon={faRedoAlt} />
          </Button>

        </Col>
      </Row>
  
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
              {[
                // t('casinoGames.addGames.headers.id'),
                "Id",
                "Email",
                "Username",
                "Status",
                "Action"
              ].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {userdata?.count > 0 &&
              userdata.rows.map((data) => {
                return (
                  <tr key={data.userId}>
                    <td>{data.userId}</td>
                    <td>{data.email}</td>
                  <td>{data.username}</td>
                  <td>
                        {data?.isActive ? (
                          <span className="text-success">
                           Active
                          </span>
                        ) : (
                          <span className="text-danger">
                           In-Active
                          </span>
                        )}
                      </td>
                    <td>
                    <Trigger message={"Delete"} id={data.userId+ "delete"} />
                        <Button
                          id={data.userId + "delete"}
                          className="m-1"
                          size="sm"
                          variant="danger"
                          onClick={() => handleDeleteModal( data?.userId)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                    </td>
                  </tr>
                );
              })}
            {userdata?.count === 0 && (
              <tr>
                <td colSpan={5} className="text-danger text-center">
                  No Data
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        
 {deleteModalShow && (
        <DeleteConfirmationModal
          deleteModalShow={deleteModalShow}
          setDeleteModalShow={setDeleteModalShow}
          handleDeleteYes={handleDeleteYes}
          loading={deleteLoading}
        />
      )}
        {userdata?.count !== 0 && (
          <PaginationComponent
            page={userdata?.count < page ? setPage(1) : page}
            totalPages={totalPages}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
          />
        )}

        

        <UserList editRedeemRule={editRedeemRule} RuleData={RuleData} />
      </Row>
    </div>
  );
};

export default AddUserSelect;
