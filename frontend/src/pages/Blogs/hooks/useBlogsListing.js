import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { toast } from "../../../components/Toast";
import {
  errorHandler,
  useAddFaqMutation,
  useDeleteBlog,
  useDeleteFaq,
  useUpdateBlogStatusMutation,
} from "../../../reactQuery/hooks/customMutationHook";
import { getBlogDetail } from "../../../utils/apiCalls";

const useBlogsListing = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(["blogs"]);
  const [limit, setLimit] = useState(15);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [status, setStatus] = useState("");
  const [active, setActive] = useState("all");
  const [statusShow, setStatusShow] = useState(false);
  const [blog, setBlog] = useState("");
  const [orderBy, setOrderBy] = useState("blogPostId");
  const [sort, setSort] = useState("desc");
  const [over, setOver] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [faQModalShow, setFaQModalShow] = useState(false);
  const [blogId, setBlogId] = useState("");
  const [faqId, setFaqId] = useState("");
  const queryClient = useQueryClient();

  const { mutate: updateStatus, isLoading: updateloading } =
    useUpdateBlogStatusMutation({
      onSuccess: ({ data }) => {
        if (data.success) {
          if (data.message) toast(data.message, "success");
          queryClient.invalidateQueries({ queryKey: ["blogList"] });
          queryClient.invalidateQueries({
            queryKey: ["blogDetail", blog.blogPostId],
          });
          blogsRefetch();
          const updatedList = queryClient.getQueryData(["blogList", limit, page, debouncedSearch, active, orderBy, sort]);
          // If current page is now empty and not the first page, go back one
          if (Array.isArray(updatedList?.data?.blogPostDetails?.rows) && updatedList?.data?.blogPostDetails?.rows.length === 1 && page > 1) {
    
            setPage((prev) => prev - 1);
          }
        }
      },
      onError: (error) => {
        errorHandler(error);
      },
    });



  const { isLoading: loading, refetch: blogsRefetch, data: blogData } = useQuery({
    queryKey: ["blogList", limit, page, debouncedSearch, active, orderBy, sort],
    queryFn: ({ queryKey }) => {
      const params = { pageNo: queryKey[2], limit: queryKey[1] };
      if (queryKey[3]) params.search = queryKey[3];
      if (queryKey[4]) params.isActive = active;
      if (queryKey[5]) params.orderBy = orderBy;
      if (queryKey[6]) params.sort = sort;
      return getBlogDetail(params);
    },
    select: (res) => res?.data?.blogPostDetails,
    refetchOnWindowFocus: false,
  });
  const totalPages = Math.ceil(blogData?.count / limit);

  const { mutate: deleteBlog, isLoading: deleteLoading } = useDeleteBlog({
    onSuccess: () => {
      toast(t("deleteBlogSuccessToast"), "success");
      queryClient.invalidateQueries({ queryKey: ["blogList"] });
      const updatedList = queryClient.getQueryData(["blogList", limit, page, debouncedSearch, active, orderBy, sort]);
      // If current page is now empty and not the first page, go back one
      if (Array.isArray(updatedList?.data?.blogPostDetails?.rows) && updatedList?.data?.blogPostDetails?.rows.length === 1 && page > 1) {

        setPage((prev) => prev - 1);
      }
      setDeleteModalShow(false);
    },
  });

  const { mutate: deleteFaq } = useDeleteFaq({
    onSuccess: () => {
      toast(t("Faq deleted successfully"), "success");
      queryClient.invalidateQueries({ queryKey: ["faq"] });
      setDeleteModalShow(false);
    },
  });

  const { mutate: addFaq, isLoading: isAddFaqLoading } = useAddFaqMutation({
    onSuccess: () => {
      toast(t("Faq Added Successfully"), "success");
      queryClient.invalidateQueries({ queryKey: ["blogList"] });
      setFaQModalShow(false);
    },
  });


  const selected = (h) => orderBy === h.value && h.labelKey !== "Actions";

  const handleStatusShow = (blog, status) => {
    setBlog(blog);
    setStatus(!status);
    setStatusShow(true);
  };

  const handleYes = () => {
    const data = {
      blogPostId: blog?.blogPostId,
      isActive: status,
    };
    updateStatus(data);
    setStatusShow(false);
  };

  const handleDeleteModal = (id) => {
    setBlogId(id);
    setDeleteModalShow(true);
  };


  const handleFaqDeleteModal = (faqId, blogId) => {
    setBlogId(blogId)
    setFaqId(faqId);
    setDeleteModalShow(true);
  };

  const handleFaQModal = (id) => {
    setBlogId(id);
    setFaQModalShow(true);
  };


  const handleFaqDeleteYes = () => {
    console.log(blogId, faqId);

    deleteFaq({ blogPostId: +blogId, faqId: +faqId })

  };


  const handleDeleteYes = () => {
    deleteBlog({ blogPostId: +blogId });
  };

  const handleAddFaq = (data) => {
    const payload = {
      blogPostId: blogId,
      faqs: data?.faqs
    }
    console.log(payload);
    addFaq(payload);
  };

  return {
    navigate,
    limit,
    page,
    search,
    setPage,
    setLimit,
    setSearch,
    blogData,
    totalPages,
    loading,
    handleStatusShow,
    statusShow,
    setStatusShow,
    handleYes,
    status,
    active,
    setActive,
    t,
    over,
    setOver,
    selected,
    setOrderBy,
    sort,
    setSort,
    handleDeleteModal,
    deleteModalShow,
    setDeleteModalShow,
    handleDeleteYes,
    deleteLoading,
    updateloading,
    handleFaQModal,
    faQModalShow,
    setFaQModalShow,
    handleAddFaq,
    isAddFaqLoading,
    handleFaqDeleteModal,
    handleFaqDeleteYes
  };
};

export default useBlogsListing;
