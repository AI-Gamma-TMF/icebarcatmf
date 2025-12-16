import React from 'react'
import NotificationList from './NotificationList';
import Popup from '../Navbar/Popup';
import useCriticalNotifications from '../../pages/NotificationCenter/hooks/useCriticalNotifications';

const CriticalNotifications = ({ onClose, title, targetElement, isOpen,  alertcount ,
    setAlertCount, }) => {

    const {
        notificationsData,
        loading,
        notifications,
        setNotifications,
        setSearch,
        setIsUnread,
        markReadNotifications,
        markAllReadNotifications,
        handleSetUnread,
        showNotificationDetails,
        setShowNotificationDetails,
        handleLoadMore,
        hasMore,isUnread
    } = useCriticalNotifications({showNotification: true,isOpen,alertcount,setAlertCount})

    return (
        <>

            <Popup
                isOpen={isOpen}
                onClose={onClose}
                title={title}
                targetElement={targetElement}
            >
                <NotificationList
                    notificationsData={notificationsData}
                    loading={loading}
                    notifications={notifications}
                    setNotifications={setNotifications}
                    setSearch={setSearch}
                    setIsUnread={setIsUnread}
                    handleSetUnread={handleSetUnread}
                    markReadNotifications={markReadNotifications}
                    markAllReadNotifications={markAllReadNotifications}
                    showNotificationDetails={showNotificationDetails}
                    setShowNotificationDetails={setShowNotificationDetails}
                    handleLoadMore={handleLoadMore}
                    hasMore={hasMore}
                    isUnread={isUnread}
                />
            </Popup>

        </>
    );
}

export default CriticalNotifications