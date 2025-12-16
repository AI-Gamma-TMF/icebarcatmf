import { useEffect, useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { getAllNotifications } from "../../../utils/apiCalls";
import {
  useMarkAllCriticalNotificationReadMutation,
  useMarkNotificationReadMutation,
} from "../../../reactQuery/hooks/customMutationHook";
import { useUserStore } from "../../../store/store";
import { whaleAlertSocket } from "../../../utils/socket";

const useCriticalNotifications = ({isOpen,alertcount,setAlertCount}) => {
  const queryClient = useQueryClient();
  const [showNotificationsTab, setShowNotificationsTab] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [limit, _setLimit] = useState(15);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [isUnread, setIsUnread] = useState(false);
 
  // const [totalCount, setTotalCount] = useState(0)
  const [showNotificationDetails, setShowNotificationDetails] = useState(false);
  const [hasMore, setHasMore] = useState(true);
const [type, _setType] = useState('CRITICAL_ALERT')
  const handleShowNotifications = () => {
    setShowNotificationsTab(!showNotificationsTab);
  };
  

  const queryKey = useMemo(
    () => ["criticalNotificationsList", limit, page, debouncedSearch, isUnread,type],
    [limit, page, debouncedSearch, isUnread,type]
  );

  const { isLoading: loading, data: notificationsData, refetch: refetchCriticalNotifications } = useQuery({
    // queryKey: ["notificationsList", limit, page, debouncedSearch, isUnread],
    queryKey,
    queryFn: ({ queryKey }) => {
      const params = { pageNo: queryKey[2], limit: queryKey[1] };
      if (queryKey[3]) params.contentSearch = queryKey[3];
      if (queryKey[4]) params.isUnread = queryKey[4];
      if(queryKey[5]) params.type = queryKey[5];
     

      return getAllNotifications(params);
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  });
  useEffect(() => {
    if (isOpen) {
      setSearch(""); // Clear search
      setIsUnread(false)
      queryClient.invalidateQueries({
        queryKey: ["criticalNotificationsList"], // or use your dynamic queryKey
      });
    }
  }, [isOpen]);

  const { mutate: updateNotifications } =
    useMarkNotificationReadMutation({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["criticalNotificationsList"],
        });
      },
      onError: (error) => {
        console.log(error);
      },
    });
  
    // mark all read
  const { mutate: markAllRead } =
  useMarkAllCriticalNotificationReadMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["criticalNotificationsList"],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSetUnread = () => {
   
    setPage(1)
    if(page>1){
      setNotifications([])
    }
    setHasMore(false)
    setIsUnread(!isUnread);
  };

  const markReadNotifications = (id) => {
    updateNotifications(id);
  };

  const markAllReadNotifications = () => {
    markAllRead()
  };

  const handleLoadMore = () => {
    // setLimit(prevLimit => Math.min(prevLimit + 15, totalCount));
    if(hasMore) {
      setPage(page + 1)
    } else return
  };

  useEffect(() => {
    // setTotalCount(notificationsData?.data?.notifications?.count);
    setAlertCount(notificationsData?.data?.notifications?.unreadCount);
  }, [notificationsData]);

  useEffect(() => {
    if (notificationsData?.data?.notifications?.rows) {
      const newData = notificationsData.data.notifications.rows;
      if (page === 1) {
        setNotifications(newData);
      } else {
        setNotifications((prev) => [...prev, ...newData]);
      }
    }
  }, [notificationsData, page]);

  useEffect(() => {
    if (notificationsData?.data?.notifications?.count > notifications.length) {
      setHasMore(true);
    } else {
      setHasMore(false);
    }
  }, [notificationsData]);
  
  
    const notificationsSocketConnection = useUserStore(
      (state) => state.notificationsSocketConnection
    );
  
    useEffect(() => {
      if (notificationsSocketConnection) {
        whaleAlertSocket.on('ADMIN_NOTIFICATIONS', (data) => {
          // const title = data?.data?.title
          // const message = data?.data?.message
        //   {showNotification && NotificationToast(title, message)}
           if(data?.data?.type === 'CRITICAL_ALERT'){
          setAlertCount((prevCount) => {
            return Number(prevCount) + 1
          })
          setNotifications((prevNotifications) => {
            return [{ ...data?.data, createdAt: Date.now() }, ...prevNotifications];
          });
        }
        })
      }
    }, [notificationsSocketConnection])


  return {
    notificationsData,
    notifications,
    refetchCriticalNotifications,
    setNotifications,
    loading,
    alertcount,
    setAlertCount,
    search,
    setSearch,
    isUnread,
    setIsUnread,
    showNotificationsTab,
    setShowNotificationsTab,
    handleShowNotifications,
    handleSetUnread,
    markReadNotifications,
    markAllReadNotifications,
    showNotificationDetails,
    setShowNotificationDetails,
    handleLoadMore,
    hasMore,
  };
};

export default useCriticalNotifications;
