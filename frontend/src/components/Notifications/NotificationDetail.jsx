import React from 'react'
import { Card } from '@themesberg/react-bootstrap'
import './notifications.scss'

const NotificationDetail = ({ notificationData }) => {
  return (
    <Card className='notification-detail-card mx-2 p-1' >
      <p className="notification-detail-type">Type: {notificationData.type}</p>
      <p className="notification-detail-subtype"> Subtype: {notificationData.subtype}</p>
      {notificationData.link && (
        <p className="notification-detail-link-title"> Link:
          <a href={notificationData.link} className="notification-detail-link">Go to page</a>
        </p>
      )}
      {notificationData.image && (
        <img
          src={notificationData.image}
          alt='notif-img'
        />
      )}
    </Card>
  )
}

export default NotificationDetail