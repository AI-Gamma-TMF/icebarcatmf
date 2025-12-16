import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useQueryClient , useQuery } from "@tanstack/react-query";

import {
  useCreateBlogMutation,
  useUpdateBlogMutation,
} from "../../../reactQuery/hooks/customMutationHook";
import { toast } from "../../../components/Toast";
import { AdminRoutes } from "../../../routes";
import { useTranslation } from "react-i18next";
import { serialize } from 'object-to-formdata';
import { getGamePagesList } from "../../../utils/apiCalls";
const useCreateBlog = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(["blogs"]);
  const { blogId } = useParams();
  const selectedTab = "EN";
  const [template, setTemplate] = useState("");
  const [showGalleryModal, setShowGalleryModal] = useState("");

  // const { data: cmsKeys } = useQuery({
  //   queryKey: ["cmsKeys"],
  //   queryFn: getCmsDynamicData,
  //   select: (res) => res?.data,
  //   refetchOnWindowFocus: false,
  // });
  const { mutate: createBlogPost, isLoading: createloading } = useCreateBlogMutation({
    onSuccess: () => {
      toast(t("createBlogSuccessToast"), "success");
      queryClient.invalidateQueries({ queryKey: ["blogList"] });
      navigate(AdminRoutes.Blogs);
    },
  });

  const queryClient = useQueryClient();
  const { mutate: updateBlogPost, isLoading: updateloading } = useUpdateBlogMutation({
    onSuccess: () => {
      toast(t("updateBlogToast"), "success");
      queryClient.invalidateQueries({ queryKey: ["blogList"] });
      queryClient.invalidateQueries({ queryKey: ["blogPostId", blogId] });
      navigate(AdminRoutes.Blogs);
    },
  });

  const { data: gamePagesList } = useQuery({
    // queryKey: ['blogDetail', blogId ],
    queryFn: () => getGamePagesList({isDropDown:true}),
    select: (res) => res?.data?.GamePageDetails?.rows,
    refetchOnWindowFocus: false,
  })

  const createBlog = (data) => createBlogPost(serialize(data.blogData));
  const editBlog = (data) => updateBlogPost(serialize(data.blogData));

  return {
    navigate,
    createBlog,
    editBlog,
    blogId,
    template,
    setTemplate,
    showGalleryModal,
    setShowGalleryModal,
    selectedTab,
    loading: createloading || updateloading,
    languages: [],
    t,
    gamePagesList
  };
};

export default useCreateBlog;
