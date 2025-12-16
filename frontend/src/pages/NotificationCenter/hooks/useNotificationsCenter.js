import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotificationCenterSettings } from "../../../utils/apiCalls";
import { errorHandler, useSetNotificationsSettingsMutation } from "../../../reactQuery/hooks/customMutationHook";
import { toast } from '../../../components/Toast'

const useNotificationsCenter = () => {
  const queryClient = useQueryClient();
  
  const { mutate: setNotificationSettings, isLoading: setNotificationLoading } =
    useSetNotificationsSettingsMutation({
      onSuccess: ({ data }) => {
        toast(data.message, "success");
        queryClient.invalidateQueries({
          queryKey: ["notificationSettings"],
        });
      },
      onError: (error) => {
        errorHandler(error);
      },
    });

  const { isLoading: settingsLoading, data: notificationSettings } = useQuery({
    queryKey: ["notificationSettings"],
    queryFn: () => {
      const params = {};
      return getNotificationCenterSettings(params);
    },
  });


  return {
    notificationSettings,
    settingsLoading,
    setNotificationSettings,
    setNotificationLoading
  };
};

export default useNotificationsCenter;
