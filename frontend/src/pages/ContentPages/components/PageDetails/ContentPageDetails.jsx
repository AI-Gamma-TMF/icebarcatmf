import React from 'react'
import { Tabs, Tab, Row, Col } from "@themesberg/react-bootstrap";
import Preloader from '../../../../components/Preloader'
import useContentPageDetails from '../../hooks/useContentPageDetails'
import SeoDetails from './SeoDetails';
import ListAssets from './ListAssets';
import { PAGE_ASSET_TYPE } from '../../constants';
import AddNewAsset from './AddNewAsset';
import { DeleteConfirmationModal } from '../../../../components/ConfirmationModal';

const ContentPageDetails = () => {
  const { 
    t,
    contentPageData,
    loading,
    selectedTab,
    setSelectedTab,
    selectedAsset,
    setSelectedAsset,
    type,
    selectedAssetType,
    handleClose,
    handleShowModal,
    showModal,
    deleteModalShow,
    setDeleteModalShow,
    handleDeleteModal,
    handleDeleteYes
  } = useContentPageDetails()
  if(loading) return <Preloader />
  return (
    <div style={{marginLeft: '5px'}}>
      <Row>
        <Col className='d-flex'>
          <h3>{`Page: ${contentPageData.pageName}`}</h3>
        </Col>
      </Row>
      <Tabs
        activeKey={selectedTab}
        onSelect={(tab) => setSelectedTab(tab)}
        className='nav-light cus__nav--light'
        mountOnEnter
        unmountOnExit
      >
        <Tab eventKey='seoDetails' title='SEO'>
          <div className='mt-5'>
            <Row className='mt-3 d-flex'>
              <SeoDetails 
                pageId={contentPageData.pageId} 
                seoDetails={contentPageData.seoDetails} 
              />
            </Row>
          </div>
        </Tab>

        <Tab eventKey='textAssets' title='Text Assets'>
          <div className='mt-5'>
            <Row className='mt-3 d-flex'>
              <ListAssets 
                assetType={PAGE_ASSET_TYPE.TEXT} 
                assets={contentPageData.textAssets} 
                handleShowModal={handleShowModal} 
                setSelectedAsset={setSelectedAsset} 
                setDeleteModalShow={setDeleteModalShow} 
                handleDeleteModal={handleDeleteModal} 
              />
            </Row>
          </div>
        </Tab>

        <Tab eventKey='digitalAssets' title='Digital Assets'>
          <div className='mt-5'>
            <Row className='mt-3 d-flex'>
              <ListAssets 
                assetType={PAGE_ASSET_TYPE.DIGITAL} 
                assets={contentPageData.digitalAssets} 
                handleShowModal={handleShowModal} 
                setSelectedAsset={setSelectedAsset} 
                setDeleteModalShow={setDeleteModalShow} 
                handleDeleteModal={handleDeleteModal} 
              />
            </Row>
          </div>
        </Tab>

        <Tab eventKey='messages' title='Messages'>
          <div className='mt-5'>
            <Row className='mt-3 d-flex'>
              <ListAssets 
                assetType={PAGE_ASSET_TYPE.MESSAGE} 
                assets={contentPageData.messages} 
                handleShowModal={handleShowModal} 
                setSelectedAsset={setSelectedAsset} 
                setDeleteModalShow={setDeleteModalShow} 
                handleDeleteModal={handleDeleteModal} 
              />
            </Row>
          </div>
        </Tab>
      </Tabs>

      {deleteModalShow &&
        (
          <DeleteConfirmationModal
            deleteModalShow={deleteModalShow}
            setDeleteModalShow={setDeleteModalShow}
            handleDeleteYes={handleDeleteYes}
          />
        )
      }

      {type === 'Edit'
        ? (
            selectedAsset && (
              <AddNewAsset
                t={t}
                assetType={selectedAssetType}
                selectedAsset={selectedAsset}
                handleClose={handleClose}
                pageId={contentPageData.pageId}
                showModal={showModal}
                type={type}
              />
            )
          )
        : (
          <AddNewAsset
            t={t}
            handleClose={handleClose}
            pageId={contentPageData.pageId}
            assetType={selectedAssetType}
            selectedAsset={selectedAsset}
            showModal={showModal}
            type={type}
          />
          )}
    </div>
  )
}

export default ContentPageDetails
