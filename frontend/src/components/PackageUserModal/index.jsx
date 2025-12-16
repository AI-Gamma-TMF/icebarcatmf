import React from 'react'
import { Modal, Table } from '@themesberg/react-bootstrap'
import useCheckPermission from '../../utils/checkPermission'
import { Link } from 'react-router-dom';
const PackageUserModal = ({ show, setShow, packageDetail }) => {
  const { isHidden } = useCheckPermission()
  return (
    <>
      <Modal
        show={show}
        onHide={() => {
          setShow(false)
        }}
        size='md'
      >
        <Modal.Header closeButton>
          <Modal.Title>Package Users For Package Id {packageDetail?.packageId}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className='d-flex mt-2'>
            <div style={{ overflow: 'auto', maxHeight: '400px', width: '100%', marginRight: '10px' }}>
              <Table size='sm' className='text-center'>
                <thead>
                  <tr className='thead-dark'>
                    <th>
                      User Id
                    </th>
                    <th>First Name</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                {packageDetail?.users.length > 0 && packageDetail?.users.map(user => 
                  <tr key={`games-list ${user.userId}`}>
                    <td>
                      {user.userId}
                    </td>
                    <td>
                      {isHidden({ module: { key: "Users", value: "R" } }) ? (
                        `${user.firstName} ${user.lastName}`
                      ) : (
                        <Link to={`/admin/player-details/${user.userId}`}>
                          {`${user.firstName} ${user.lastName}`}
                        </Link>
                      )}
                    </td>
                    <td>{user.email}</td>
                  </tr>
                )}
                </tbody>
              </Table>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default PackageUserModal