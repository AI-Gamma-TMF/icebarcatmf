import { Row, Button, Col, Table } from '@themesberg/react-bootstrap'
import React from 'react'
// import { useTranslation } from 'react-i18next'
// import { useQueryClient } from '@tanstack/react-query'
import Trigger from '../../../../components/OverlayTrigger'
import { faEdit } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { PAGE_ASSET_TYPE } from '../../constants'

const ListAssets = ({
  assetType,
  assets,
  handleShowModal,
  setSelectedAsset,
  handleDeleteModal
}) => {
  // const { t } = useTranslation(['contentPages'])
  // const queryClient = useQueryClient()
  
  return (
    <Row>
      <Col sm={12} className='my-2'>
        <div className='text-right m-n1'>
          <button
            type='button' className='m-1 btn btn-success'
            onClick={() => {
              handleShowModal('Add', assetType)
            }}
          >{`Add New ${assetType === PAGE_ASSET_TYPE.DIGITAL ? 'Digital' : assetType === PAGE_ASSET_TYPE.TEXT ? 'Text' : 'Message'} Assest`}
          </button>
        </div>
      </Col>
      <Table bordered striped responsive hover size='sm' className='text-center mt-4'>
        <thead className='thead-dark'>
          <tr>
            {['Asset Key', 'Asset Value', 'Actions'].map((h,idx) => (
              <th key={idx}>
                {h}{' '}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {!!assets && assets.map((asset) => {
            return (
              <tr key={asset.assetKey}>
                <td>{asset.assetKey}</td>

                {assetType === PAGE_ASSET_TYPE.TEXT && 
                  <td>
                    <div style={{maxHeight: "180px", overflowY: 'auto'}} dangerouslySetInnerHTML={{ __html: asset.assetValue }}>
                      {/* <div dangerouslySetInnerHTML={{ __html: asset.assetValue }} /> */}
                    </div>
                  </td>
                }

                {assetType === PAGE_ASSET_TYPE.DIGITAL && 
                  <td style={{whiteSpace: 'normal', display: "flex", justifyContent: "center"}}>
                    <div style={{maxWidth: "180px", maxHeight: "180px"}}>
                      <img style={{cursor: "pointer", minWidth: "100px", minHeight: "100px"}} onClick={() => window.open(asset.assetValue, "_blank")} src={asset.assetValue} />
                    </div>
                  </td>
                }

                {assetType === PAGE_ASSET_TYPE.MESSAGE && <td style={{whiteSpace: 'normal'}}>{asset.assetValue}</td>}

                <td style={{whiteSpace: 'nowrap'}}>
                  <Trigger message='Edit' id={`${asset.assetKey}_Edit`} />
                    <Button
                      id={`${asset.assetKey}_Edit`}
                      className='m-1'
                      size='sm'
                      variant='warning'
                      onClick={() => {
                        setSelectedAsset(asset)
                        handleShowModal('Edit', assetType)
                      }}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                  <Trigger message='View Details' id={`${asset.assetKey}_View`} />
                  <Trigger message={'Delete'} id={asset.assetKey +'delete'} />

                  <Button
                  id={asset.assetKey +'delete'}
                    className='m-1'
                    size='sm'
                    variant='danger'
                    onClick={() => {
                      setSelectedAsset(asset)
                      handleDeleteModal()
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>

                </td>
              </tr>
            )
          })}
          {assets?.length === 0 && (
            <tr>
              <td colSpan={3} className='text-danger text-center'>
                {'No Data Found'}
              </td>
            </tr>
          )}
        </tbody>
      </Table>

    </Row>
  )
}

export default ListAssets
