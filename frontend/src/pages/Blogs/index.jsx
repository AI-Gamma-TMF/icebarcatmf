/* eslint-disable react/display-name */
import React from "react";
import { Button, Form, Row, Col, Table } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckSquare,
  faEdit,
  faEye,
  faWindowClose,
  faTrash,
  faArrowCircleUp,
  faArrowCircleDown,
  faCommentMedical,
  faComments
} from "@fortawesome/free-solid-svg-icons";
import Trigger from "../../components/OverlayTrigger";
import { InlineLoader } from "../../components/Preloader";
import PaginationComponent from "../../components/Pagination";
import { AdminRoutes } from "../../routes";
import {
  ConfirmationModal,
  DeleteConfirmationModal,
} from "../../components/ConfirmationModal";
import useCheckPermission from "../../utils/checkPermission";
import { tableHeaders } from "./constants";
import useBlogsListing from "./hooks/useBlogsListing";
import BannerViewer from "../BannerManagement/BannerViewer";
import AddFaqModal from "./components/AddFaqModal";

const BlogsListing = () => {
  const {
    page,
    deleteLoading,
    limit,
    setPage,
    setLimit,
    setSearch,
    search,
    navigate,
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
    handleFaQModal,
    deleteModalShow,
    setDeleteModalShow,
    handleDeleteYes,
    updateloading,
    faQModalShow,
    setFaQModalShow,
    blogId,
    handleAddFaq
  } = useBlogsListing();
  
  const { isHidden } = useCheckPermission();

  return (
    <>
      <Row>
        <Col className="col-10">
          <h3>{t("Blogs")}</h3>
        </Col>
        <Col className="col-2 text-end">
          <Button
            variant="success"
            className="f-right"
            size="sm"
            onClick={() =>
              navigate(AdminRoutes.BlogPageCreate, {
                state: {
                  blogData: blogData?.rows,
                },
              })
            }
            hidden={isHidden({ module: { key: "BlogPost", value: "C" } })}
          >
            {t("createButton")}
          </Button>
        </Col>
      </Row>

      <Row>
        <Col xs="12" md="6" lg="3">
          <Form.Label>{t("filter.search")}</Form.Label>

          <Form.Control
            type="search"
            value={search}
            placeholder="Search title, slug"
            onChange={(event) => {
              setPage(1);
              setSearch(event.target.value.replace(/[~`!$%^&*#=)()><?]+/g, ""));
            }}
          />
        </Col>
        <Col xs="12" md="6" lg="3">
          <Form.Label>{t("filter.status.title")}</Form.Label>

          <Form.Select
            value={active}
            onChange={(event) => {
              setPage(1);
              setActive(event.target.value.replace(/[~`!$%^&*#=)()><?]+/g, ""));
            }}
          >
            <option key="" value="all">
              {t("filter.status.options.all")}
            </option>
            <option key="true" value>
              {t("filter.status.options.active")}
            </option>
            <option key="false" value={false}>
              {t("filter.status.options.inActive")}
            </option>
          </Form.Select>
        </Col>
      </Row>

      {
        <Table
          bordered
          striped
          responsive
          hover
          size="sm"
          className="text-center mt-4"
        >
          <thead className="thead-dark">
            <tr>
              {tableHeaders.map((h, idx) => (
                <th
                  key={idx}
                  onClick={() => h.value !== "" && setOrderBy(h.value)}
                  style={{
                    cursor: (h.value !== "action" && "pointer"),
                  }}
                  className={selected(h) ? "border-3 border border-blue" : ""}
                >
                  {t(h.labelKey)}{" "}
                  {selected(h) &&
                    (sort === "asc" ? (
                      <FontAwesomeIcon
                        style={over ? { color: "red" } : {}}
                        icon={faArrowCircleUp}
                        onClick={() => setSort("desc")}
                        onMouseOver={() => setOver(true)}
                        onMouseLeave={() => setOver(false)}
                      />
                    ) : (
                      <FontAwesomeIcon
                        style={over ? { color: "red" } : {}}
                        icon={faArrowCircleDown}
                        onClick={() => setSort("asc")}
                        onMouseOver={() => setOver(true)}
                        onMouseLeave={() => setOver(false)}
                      />
                    ))}
                </th>
              ))}
            </tr>
          </thead>

          {loading ? (
            <tr>
              <td colSpan={10} className="text-center">
                <InlineLoader />
              </td>
            </tr>
          ) : (
            <tbody>
              {Boolean(blogData) && blogData?.count > 0 ? (
                blogData?.rows?.map((blog) => {
                  const {
                    blogPostId,
                    metaTitle,
                    metaDescription,
                    slug,
                    postHeading,
                    bannerImageUrl,
                    bannerImageAlt,
                    isActive,
                    isPopularBlog,
                  } = blog;
                  return (
                    <tr key={blogPostId}>
                      <td>{blogPostId}</td>

                      <td>
                        <Trigger message={metaTitle} id={blogPostId} />
                        <span
                          id={blogPostId}
                          style={{
                            width: "150px",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            navigate(
                              `${AdminRoutes.BlogDetails.split(
                                ":"
                              ).shift()}${blogPostId}`
                            )
                          }
                          className="text-link d-inline-block text-truncate"
                        >
                          {metaTitle}
                        </span>
                      </td>
                      <td>
                        {metaDescription?.length > 60
                          ? metaDescription?.substring(0, 60) + "..."
                          : metaDescription}
                      </td>
                      <td>{slug || "-"}</td>
                      <td>{postHeading}</td>
                      <td>
                        <BannerViewer
                          thumbnailUrl={bannerImageUrl}
                          isMobile={false}
                        />
                      </td>
                      <td>{bannerImageAlt}</td>

                      <td>
                        {isActive ? (
                          <span className="text-success">
                            {t("activeStatus")}
                          </span>
                        ) : (
                          <span className="text-danger">
                            {t("inActiveStatus")}
                          </span>
                        )}
                      </td>
                      <td>
                        {isPopularBlog ? (
                          <span className="text-success">{t("Popular")}</span>
                        ) : (
                          <span className="text-danger">
                            {t("Not-popular")}
                          </span>
                        )}
                      </td>

                      <td>
                        <Trigger message="Edit" id={`${blogPostId}_Edit`} />
                        <Button
                          id={`${blogPostId}_Edit`}
                          className="m-1"
                          size="sm"
                          variant="warning"
                          onClick={() =>
                            navigate(
                              `${AdminRoutes.BlogEdit.split(
                                ":"
                              ).shift()}${blogPostId}`
                            )
                          }
                          hidden={isHidden({
                            module: { key: "BlogPost", value: "U" },
                          })}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Trigger
                          message="View Details"
                          id={`${blogPostId}_View`}
                        />
                        <Button
                          id={`${blogPostId}_View`}
                          className="m-1"
                          size="sm"
                          variant="info"
                          onClick={() =>
                            navigate(
                              `${AdminRoutes.BlogDetails.split(
                                ":"
                              ).shift()}${blogPostId}`
                            )
                          }
                          hidden={isHidden({
                            module: { key: "BlogPost", value: "R" },
                          })}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Button>

                        {!isActive ? (
                          <>
                            <Trigger
                              message="Set Active"
                              id={`${blogPostId}_Active`}
                            />
                            <Button
                              id={`${blogPostId}_Active`}
                              className="m-1"
                              size="sm"
                              variant="success"
                              onClick={() => handleStatusShow(blog, isActive)}
                              hidden={isHidden({
                                module: { key: "BlogPost", value: "T" },
                              })}
                            >
                              <FontAwesomeIcon icon={faCheckSquare} />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Trigger
                              message="Set In-Active"
                              id={`${blogPostId}_in-Active`}
                            />
                            <Button
                              id={`${blogPostId}_in-Active`}
                              className="m-1"
                              size="sm"
                              variant="danger"
                              onClick={() => handleStatusShow(blog, isActive)}
                              hidden={isHidden({
                                module: { key: "BlogPost", value: "T" },
                              })}
                            >
                              <FontAwesomeIcon icon={faWindowClose} />
                            </Button>
                          </>
                        )}

                        <Trigger
                          message={"Delete"}
                          id={blogPostId + "delete"}
                        />
                        <Button
                          id={blogPostId + "delete"}
                          className="m-1"
                          size="sm"
                          variant="danger"
                          hidden={isHidden({
                            module: { key: "BlogPost", value: "D" },
                          })}
                          onClick={() => handleDeleteModal(blogPostId)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>

                        <Trigger
                          message={"Add Faq"}
                          id={blogPostId + "_addFaq"}
                        />
                        <Button
                          id={blogPostId + "_addFaq"}
                          className="m-1"
                          size="sm"
                          variant="success"
                          hidden={isHidden({
                            module: { key: "BlogPost", value: "C" },
                          })}
                          onClick={() => handleFaQModal(blogPostId)}
                        >
                          <FontAwesomeIcon icon={faCommentMedical} />
                        </Button>

                        <Trigger
                          message={"View Faq"}
                          id={blogPostId + "addFaq"}
                        />
                        <Button
                          id={blogPostId + "addFaq"}
                          className="m-1"
                          size="sm"
                          variant="info"
                          hidden={isHidden({
                            module: { key: "BlogPost", value: "C" },
                          })}
                          onClick={() => navigate(`/admin/blogs/faq/${blogPostId}`)}
                        >
                          <FontAwesomeIcon icon={faComments} />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-danger text-center">
                    {t("noDataFound")}
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </Table>
      }
      {blogData?.count !== 0 && (
        <PaginationComponent
          page={blogData?.count < page ? setPage(1) : page}
          totalPages={totalPages}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
        />
      )}

      <ConfirmationModal
        setShow={setStatusShow}
        show={statusShow}
        handleYes={handleYes}
        active={status}
        loading={updateloading}
      />
      {deleteModalShow && (
        <DeleteConfirmationModal
          deleteModalShow={deleteModalShow}
          setDeleteModalShow={setDeleteModalShow}
          handleDeleteYes={handleDeleteYes}
          loading={deleteLoading}
        />
      )}

      {faQModalShow && (
        <AddFaqModal
          show={faQModalShow}
          setShow={setFaQModalShow}
          handleSubmit={handleAddFaq}
          blogId={blogId}
          loading={deleteLoading}
        />
      )}
    </>
  );
};

export default BlogsListing;
