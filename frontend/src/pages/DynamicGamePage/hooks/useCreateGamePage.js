import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCreateGamePageCardMutation,
  useCreateGamePageMutation,
  useEditGamePageCardMutation,
  useUpdateGamePageMutation,
} from "../../../reactQuery/hooks/customMutationHook";
import { toast } from "../../../components/Toast";
import { AdminRoutes } from "../../../routes";
import { useTranslation } from "react-i18next";
import { serialize } from 'object-to-formdata';

const useCreateGamePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(["blogs"]);
  const { gamePageId } = useParams();
  const selectedTab = "EN";
  const [template, setTemplate] = useState("");
  const [showGalleryModal, setShowGalleryModal] = useState("");


  // const { mutate: createBlogPost, isLoading: createloading } = useCreateBlogMutation({
  //   onSuccess: () => {
  //     toast(t("createBlogSuccessToast"), "success");
  //     queryClient.invalidateQueries({ queryKey: ["blogList"] });
  //     navigate(AdminRoutes.Blogs);
  //   },
  // });

  const { mutate: createGamePage, isLoading: createGameloading } = useCreateGamePageMutation({
    onSuccess: () => {
      toast(t("Game Page Added SuccessFully"), "success");
      queryClient.invalidateQueries({ queryKey: ["gamePageList"] });
      navigate(AdminRoutes.GamePages);
    },
  });

  const { mutate: createGameCard } = useCreateGamePageCardMutation({
    onSuccess: () => {
      toast(t("Game Page Card Added SuccessFully"), "success");
      queryClient.invalidateQueries({ queryKey: ["gamePageList"] });
      navigate(AdminRoutes.GamePages);
    },
  });


  const { mutate: editGameCard, isLoading: editGamePageCardloading } = useEditGamePageCardMutation({
    onSuccess: () => {
      toast(t("Game Page Card Updated SuccessFully"), "success");
      queryClient.invalidateQueries({ queryKey: ["gamePageList"] });
      navigate(
        `${AdminRoutes.GamePageCardView.split(
          ":"
        ).shift()}${gamePageId}`
      )
    },
  });

  const queryClient = useQueryClient();
  const { mutate: editGamePage, isLoading: updateloading } = useUpdateGamePageMutation({
    onSuccess: () => {
      toast(t("Game Page Updated Successfully"), "success");
      queryClient.invalidateQueries({ queryKey: ["gamePageList"] });
      queryClient.invalidateQueries({ queryKey: ["gameId", gamePageId] });
      navigate(AdminRoutes.GamePages);
    },
  });

  const createGame = (data) => createGamePage(serialize(data.gamePageData));

  const createGamePageCard = (data) => createGameCard(serialize(data.gamePageData));

  const updateGameCard = (data) => editGameCard(serialize(data.gamePageData));

  const updateGamePage = (data) => editGamePage(serialize(data.gamePageData))

  return {
    navigate,
    gamePageId,
    createGame,
    createGamePageCard,
    template,
    setTemplate,
    showGalleryModal,
    setShowGalleryModal,
    selectedTab,
    loading: createGameloading || updateloading,
    languages: [],
    t,
    updateGameCard,
    editGamePageCardloading,
    editGamePage,
    updateGamePage
  };
};

export default useCreateGamePage;
