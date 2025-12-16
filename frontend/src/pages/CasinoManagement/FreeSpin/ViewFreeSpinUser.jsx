import React from "react";
import useViewUsers from "./hooks/useViewUsers";
import { InlineLoader } from "../../../components/Preloader";
import {Row, Table} from '@themesberg/react-bootstrap'
import { capitalizeFirstLetter } from "../../../utils/helper";

const ViewFreeSpinUser = ()=>{

    const {
      // page, setPage,
      //   limit, setLimit,
        userData,
        isLoading,
        // totalPages,
        viewCategory} = useViewUsers()

    return(
       <>
            <Row>
                <h1>View {capitalizeFirstLetter(viewCategory)} Users</h1>
            </Row>
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
              <thead className="thead-dark">
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
            
          </>
        )}
       </>
    )
}

export default ViewFreeSpinUser