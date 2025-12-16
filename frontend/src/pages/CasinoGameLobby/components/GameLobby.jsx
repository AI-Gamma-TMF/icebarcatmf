import { Row, Col, Button, Form as BForm, Card } from "@themesberg/react-bootstrap";
import moment from "moment";
import { useState } from "react";
import Datetime from "react-datetime";
import Select from "react-select";
import { Tooltip as ReactTooltip } from 'react-tooltip'; 
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { InlineLoader } from "../../../components/Preloader";
import { fallBackImg } from "../constant";
import useGameLobby from "../hooks/useGameLobby";
import "swiper/css";
import "swiper/css/navigation";
import "../_gamelobby.scss";

const GameLobby = () => {
  const {
    startDate,
    setStartDate,
    setEndDate,
    subCategory,
    subCategoryId,
    setSubCategoryId,
    gameLobbyDetails,
    gameLobbyLoading,
    search,
    setSearch,
    setPage,
  } = useGameLobby();

  const [errorEnd, setErrorEnd] = useState("");
  const [errorStart, setErrorStart] = useState("");

  const handleMonthYearChange = (date, _event) => {
    const selectedDate = moment(date);
    const start = selectedDate.clone().startOf("month");
    const end = selectedDate.clone().endOf("month");

    setStartDate(start);
    setEndDate(end);
    setErrorStart("");
    setErrorEnd("");
  };


  return (
    <div className="game-lobby">
      <Row className="mb-2 mt-4">
        <Col xs="auto">
          <h4 className="mb-0">Games</h4>
        </Col>
      </Row>
      <Row className="mb-2 mt-4">
        <Col sm={6} lg={3}>
          <BForm.Label>Sub Categories</BForm.Label>
          <Select
            placeholder="Sub Categories"
            options={subCategory}
            className="lobby-select"
            isClearable
            value={
              subCategory?.find((option) => option.value === subCategoryId) ||
              null
            }
            onChange={(e) => setSubCategoryId(e ? e.value : null)}
          />
        </Col>
        <Col sm={6} lg={2}>
          <BForm.Label>Search</BForm.Label>
          <BForm.Control
            type="search"
            value={search}
            placeholder={"Search by game name"}
            onChange={(event) => {
              setPage(1);
              setSearch(
                event.target.value.replace(/[~`!$%@^&*#=)()><?]+/g, "")
              );
            }}
          />
        </Col>
        
        <Col sm={6} lg={2}>
          <BForm.Label>Monthly Discount</BForm.Label>

          <Datetime
            dateFormat="MMMM YYYY"
            timeFormat={false}
            value={startDate}
            onChange={handleMonthYearChange}
            closeOnSelect={true} // this is key
            inputProps={{ placeholder: "Select Month", readOnly: true }}
            isValidDate={(currentDate) => {
              // Disallow future months and years
              return currentDate.isSameOrBefore(moment(), "month");
            }}
          />
          {(errorStart || errorEnd) && (
            <div style={{ color: "red", marginTop: "5px" }}>
              {errorStart || errorEnd}
            </div>
          )}
        </Col>
      </Row>
      {gameLobbyLoading ? (
        <InlineLoader />
      ) : (
        <>{gameLobbyDetails.length > 0 ?
          <>
            {!search ? (
              <Row className="mb-2 mt-4">
                {gameLobbyDetails?.map((category, _catIdx) => (
                  <div
                    key={category.masterGameSubCategoryId}
                    className="category-section py-3"
                  >
                    <div className="category-header d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={category.imageUrl?.thumbnail}
                          alt={category.name}
                          width={24}
                          height={24}
                        />
                        <h5 className="mb-0">{category.name}</h5>
                      </div>

                      <div className="swiper-controls">
                        <Button
                          variant="outline-primary"
                          id={`swiper-button-prev-${category.masterGameSubCategoryId}`}
                          size="md"
                        >
                          ‹
                         </Button>
                        <Button
                          variant="outline-primary"
                          id={`swiper-button-next-${category.masterGameSubCategoryId}`}
                          size="md"
                        >
                          ›
                        </Button>
                      </div>
                    </div>

                    <Swiper
                      spaceBetween={10}
                      navigation={{
                        nextEl: `#swiper-button-next-${category.masterGameSubCategoryId}`,
                        prevEl: `#swiper-button-prev-${category.masterGameSubCategoryId}`,
                      }}
                      modules={[Navigation]}
                      breakpoints={{
                        0: { slidesPerView: 2 },
                        576: { slidesPerView: 3 },
                        768: { slidesPerView: 4 },
                        992: { slidesPerView: 5 },
                        1200: { slidesPerView: 8 },
                      }}
                      className="game-swiper"
                    >
                      {category.subCategoryGames?.map((game) => (
                        <SwiperSlide key={game.masterCasinoGameId}>

                          <div className="game-card">
                            <div className="game-image-wrapper">
                              <img
                                src={game.imageUrl || fallBackImg}
                                alt={game.name}
                                className="game-image"
                                width="100%"
                                height="auto"
                              />
                            </div>
                            <div className="game-info">
                              <small>ID: {game.masterCasinoGameId}</small>
                              <strong
                                className="d-block mt-1 game-name"
                                data-tooltip-id="game-tooltip"
                                data-tooltip-content={game.name}
                              >
                                {game.name}
                              </strong>
                              {game.discountPercentage != null ? (
                                <span className="discount-badge">
                                  GGR Discount : {game.discountPercentage}%
                                </span>) : (
                                <span className="nodiscount-badge">
                                  GGR Discount : NA
                                </span>
                              )}
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}

                      {gameLobbyDetails.length > 0 && (
                        <ReactTooltip id="game-tooltip" place="bottom" className="react-tooltip" />
                      )}
                    </Swiper>
                  </div>
                ))}
              </Row>
            ) : (
              <Row className="mb-2 mt-4">
                {gameLobbyDetails?.map((category, _catIdx) => (
                  <div
                    key={category.masterGameSubCategoryId}
                    className="category-section py-3"
                  >
                    <div className="category-header d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={category.imageUrl?.thumbnail}
                          alt={category.name}
                          width={24}
                          height={24}
                        />
                        <h5 className="mb-0">{category.name}</h5>
                      </div>
                    </div>

                    <div className="searched-game-wrap">
                      {category.subCategoryGames?.map((game) => (
                        <div key={game.masterCasinoGameId}>
                          <div className="game-card">
                            <div className="game-image-wrapper">
                              <img
                                src={game.imageUrl || fallBackImg}
                                alt={game.name}
                                className="game-image"
                                width="100%"
                                height="auto"
                              />
                            </div>
                            <div className="game-info">
                              <small>ID: {game.masterCasinoGameId}</small>
                              <strong
                                className="d-block mt-1 game-name"
                                data-tooltip-id="game-tooltip"
                                data-tooltip-content={game.name}
                              >
                                {game.name}
                              </strong>
                              {game.discountPercentage != null ? (
                                <span className="discount-badge">
                                  GGR Discount : {game.discountPercentage}%
                                </span>) : (
                                <span className="nodiscount-badge">
                                  GGR Discount : NA
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {gameLobbyDetails.length > 0 && (
                        <ReactTooltip id="game-tooltip" place="bottom" className="react-tooltip" />
                      )}
                    </div>
                  </div>
                ))}
              </Row>
            )}
          </> :
          <Card className="nogame-card">No data available</Card>
        }</>
      )}
    </div>
  );
};

export default GameLobby;
