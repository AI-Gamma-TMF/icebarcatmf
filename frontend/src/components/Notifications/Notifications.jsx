import React from 'react'
import useNotifications from '../../pages/NotificationCenter/hooks/useNotifications';
import NotificationList from './NotificationList';
import Popup from '../Navbar/Popup';

const Notifications = ({ onClose, title, targetElement, isOpen, count , setCount}) => {

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
    } = useNotifications({showNotification: true, isOpen, count, setCount})

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

export default Notifications