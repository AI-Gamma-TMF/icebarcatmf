import React from 'react'
import './notifications.scss'
import { toast } from 'react-hot-toast'
import { Button } from '@themesberg/react-bootstrap'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"

export const NotificationToast = (title, message) => {
  return toast(
    (t) => (
      <div className='notification-toast'>
        <div className='notification-toast-head'>
          <div className='notification-toast-title'>{title}</div>
          <Button
            className='notification-toast-btn'
            onClick={() => toast.dismiss(t.id)}>
            <FontAwesomeIcon icon={faXmark} className='me-1' style={{ color: 'rgb(38,43,64)' }} />
          </Button>
        </div>
        <div className='notification-toast-message'>{message}</div>
      </div>
    ),
    {
      position: "bottom-right",
      duration: 6000,
      style: {
        padding: '5px',
        backgroundColor: '#F4D793'
      },
    }
  )
}