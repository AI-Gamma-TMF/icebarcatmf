import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { getCmsDynamicData } from "../../../utils/apiCalls";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useCreateCMSMutation,
  useUpdateCMSMutation,
} from "../../../reactQuery/hooks/customMutationHook";
import { toast } from "../../../components/Toast";
import { AdminRoutes } from "../../../routes";
import { useTranslation } from "react-i18next";

const useCreateCms = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(["cms"]);
  const { cmsPageId } = useParams();
  const selectedTab = "EN";
  const [template, setTemplate] = useState("");
  const [showGalleryModal, setShowGalleryModal] = useState("");

  const { data: cmsKeys } = useQuery({
    queryKey: ["cmsKeys"],
    queryFn: getCmsDynamicData,
    select: (res) => res?.data,
    refetchOnWindowFocus: false,
  });
  const { mutate: createCMS, isLoading: createloading } = useCreateCMSMutation({
    onSuccess: () => {
      toast(t("createCmsSuccessToast"), "success");
      queryClient.invalidateQueries({ queryKey: ["cmsList"] });
      navigate(AdminRoutes.CmsListing);
    },
  });

  const queryClient = useQueryClient();
  const { mutate: updateCMS, isLoading: updateloading } = useUpdateCMSMutation({
    onSuccess: () => {
      toast(t("editCmsSuccessToast"), "success");
      queryClient.invalidateQueries({ queryKey: ["cmsList"] });
      queryClient.invalidateQueries({ queryKey: ["cmsDetail", cmsPageId] });
      navigate(AdminRoutes.CmsListing);
    },
  });

  const createCms = (data) => createCMS(data.cmsData);
  const editCms = (data) => updateCMS(data.cmsData);

  return {
    navigate,
    createCms,
    editCms,
    cmsPageId,
    template,
    setTemplate,
    showGalleryModal,
    setShowGalleryModal,
    selectedTab,
    cmsKeys,
    loading: createloading || updateloading,
    languages: [],
    t,
  };
};

export default useCreateCms;
