/* eslint-disable no-mixed-spaces-and-tabs */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, Modal } from '@themesberg/react-bootstrap'

const ModalView = (props) => {
  const {
    openModal,
    submitHandler,
    handleSubmit,
    firstBtnName,
    secondBtnName,
    children,
    headerTitle,
    toggleModal,
    className,
    size,
    footerClass,
    headerClass,
    center,
    hideFooter,
    handleClick,
    hideHeader,
    titleHeaderIcon,
    firstBtnClass,
    secondBtnClass
  } = props
  return (
    <Modal
      zIndex='9999'
      show={openModal}
      onHide={toggleModal}
      className={className}
      size={size}
      centered={center}
    >
      {
      !hideHeader &&
        <Modal.Header toggle={ toggleModal } className={ headerClass }>
          {
            titleHeaderIcon && <img src={ titleHeaderIcon } alt='' />
          }
          {headerTitle}
        </Modal.Header>
      }
      <Modal.Body>
        {children}
      </Modal.Body>
      {!hideFooter &&
        <Modal.Footer className={footerClass}>
          <div>
            <Button
              className={firstBtnClass + ' me-2'}
              type='submit'
              onClick={handleSubmit ? handleSubmit(submitHandler) : handleClick}
            >{firstBtnName}
            </Button>
            {
            secondBtnName && secondBtnName !== '' &&
              <Button className={secondBtnClass ? secondBtnClass : 'btn-primary'} onClick={toggleModal}>{secondBtnName}</Button>
            }
          </div>
        </Modal.Footer>}
    </Modal>
  )
}

ModalView.propTypes = {
    openModal: PropTypes.bool,
    handleSubmit: PropTypes.func,
    submitHandler: PropTypes.func,
    firstBtnName: PropTypes.string,
    secondBtnName: PropTypes.string,
    children: PropTypes.object,
    size: PropTypes.string,
    headerTitle: PropTypes.string,
    toggleModal: PropTypes.func,
    className: PropTypes.string,
    footerClass: PropTypes.string,
    headerClass: PropTypes.string,
    center: PropTypes.bool,
    hideFooter: PropTypes.bool,
    handleClick: PropTypes.func,
    hideHeader: PropTypes.bool,
    titleHeaderIcon: PropTypes.string,
    firstBtnClass: PropTypes.string,
    secondBtnClass: PropTypes.string,
}
export default ModalView