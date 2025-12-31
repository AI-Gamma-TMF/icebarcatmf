/* eslint-disable react/display-name */
import React from "react";
import { Button, Form, Row, Col, Table, Card } from "@themesberg/react-bootstrap";
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
  faComments,
  faPlus
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
import "./blogs.scss";

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
    <div className="dashboard-typography blog-page">
      {/* Header Row */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="blog-page__title">{t("Blogs")}</h3>
          <p className="blog-page__subtitle">Manage blog posts and FAQs</p>
        </div>
        <div>
          <Button
            variant="primary"
            className="blog-page__create-btn"
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
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            {t("createButton")}
          </Button>
        </div>
      </div>

      {/* Filters Card */}
      <Card className="dashboard-filters mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col xs="12" md="6" lg="4">
              <Form.Label>{t("filter.search")}</Form.Label>
              <Form.Control
                type="search"
                value={search}
                placeholder="Search title, slug..."
                onChange={(event) => {
                  setPage(1);
                  setSearch(event.target.value.replace(/[~`!$%^&*#=)()><?]+/g, ""));
                }}
                className="blog-filters__control"
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
                className="blog-filters__select"
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
        </Card.Body>
      </Card>

      {/* Table Card */}
      <div className="dashboard-data-table">
        <div className="blog-table-wrap">
          <Table bordered hover responsive size="sm" className="mb-0">
            <thead>
              <tr>
                {tableHeaders.map((h, idx) => (
                  <th
                    key={idx}
                    onClick={() => h.value !== "" && setOrderBy(h.value)}
                    style={{
                      cursor: (h.value !== "" && h.labelKey !== "Actions") ? "pointer" : "default",
                    }}
                    className={selected(h) ? "sortable active" : "sortable"}
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

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={tableHeaders.length} className="text-center py-4">
                    <InlineLoader />
                  </td>
                </tr>
              ) : (
                <>
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
                              onClick={() =>
                                navigate(
                                  `${AdminRoutes.BlogDetails.split(
                                    ":"
                                  ).shift()}${blogPostId}`
                                )
                              }
                              className="blog-table__title"
                            >
                              {metaTitle}
                            </span>
                          </td>
                          <td>
                            <div className="blog-table__description" title={metaDescription}>
                            {metaDescription?.length > 60
                              ? metaDescription?.substring(0, 60) + "..."
                              : metaDescription}
                            </div>
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
                              <span className="blog-pill blog-pill--active">
                                {t("activeStatus")}
                              </span>
                            ) : (
                              <span className="blog-pill blog-pill--inactive">
                                {t("inActiveStatus")}
                              </span>
                            )}
                          </td>
                          <td>
                            {isPopularBlog ? (
                              <span className="blog-pill blog-pill--active">{t("Popular")}</span>
                            ) : (
                              <span className="blog-pill blog-pill--inactive">
                                {t("Not-popular")}
                              </span>
                            )}
                          </td>

                          <td className="blog-table__actions">
                            <div className="blog-actions">
                            <Trigger message="Edit" id={`${blogPostId}_Edit`} />
                            <Button
                              id={`${blogPostId}_Edit`}
                              className="blog-icon-btn"
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
                              className="blog-icon-btn"
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
                                  className="blog-icon-btn"
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
                                  className="blog-icon-btn"
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
                              className="blog-icon-btn"
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
                              className="blog-icon-btn"
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
                              className="blog-icon-btn"
                              size="sm"
                              variant="info"
                              hidden={isHidden({
                                module: { key: "BlogPost", value: "C" },
                              })}
                              onClick={() => navigate(`/admin/blogs/faq/${blogPostId}`)}
                            >
                              <FontAwesomeIcon icon={faComments} />
                            </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={tableHeaders.length} className="text-center py-4 blog-empty">
                        {t("noDataFound")}
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </Table>
        </div>
      </div>
      
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
    </div>
  );
};

export default BlogsListing;
