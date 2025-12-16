import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { casinoCategorySchema } from "../schemas";
import { serialize } from "object-to-formdata";
import { Formik, Form } from "formik";
import {
  Col,
  Row,
  Button,
  Spinner,
  Tabs,
  Tab,
} from "@themesberg/react-bootstrap";
import useCreateTournaments from "../hooks/useCreateTournaments";
import {
  convertToUTC,
  getDateTime,
  getDateTimeByYMD,
} from "../../../utils/dateFormatter";
import { toast } from "../../../components/Toast";
import LeaderBoard from "./LeaderBoard";
import { isEqual, pickBy } from "lodash";
import TournamentPayout from "./TournamentPayout";
import { useNavigate } from "react-router-dom";
import { AdminRoutes } from "../../../routes";
import useProviderSubcategoryFilter from "../hooks/useProviderSubcategoryFIlter";
import useTournamentDashboardDetails from "../hooks/useTournamentDashboardDetails";
import usePayoutTournamentDetails from "../hooks/usePayoutTournamentDetails";
import BasicDetailsForm from "./TouranamentForm/BasicDetailsForm";
import AmountDetailsForm from "./TouranamentForm/AmountDetailsForm";
import PlayerLimitForm from "./TouranamentForm/PlayerLimitForm";
import TournamentAccordionForm from "./TouranamentForm/TournamentAccordionForm";
import AddGamesForm from "./TouranamentForm/GamesTournamentForm/AddGamesForm";
import NumberOfWinnerForm from "./TouranamentForm/WinnerTournamentForm/NumberOfWinnerForm";
import VIPTournamentForm from "./TouranamentForm/VIPTournamentForm/VIPTournamentForm";
import TournamentDashboard from "./TournamentDashboard/TournamentDashboard";

const TOURNAMENT_STATUS = {
  UPCOMING: 0,
  ON_GOING: 1,
  COMPLETED: 2,
  CANCELLED: 3,
};

const CreateTournament = ({
  data,
  details,
  refetchTournament,
  page,
  setPage,
  totalPages,
  limit,
  setLimit,
  getCsvDownloadUrl,
  type,
  selectedTournamentData,
  isDuplicate,
  search,
  setSearch
}) => {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState("TournamentForm");


  const { t, loading, updateTournament, createTournamentList } = useCreateTournaments();

  const {
    tournamentSummaryData = {},
    tournamentGameIds = {},
    tournamentTotalPlayers = {},
    tournamentWinnerBootedSummary = {},
    tournamentBootedLoading,
  } = useTournamentDashboardDetails({ type });

  const tournamentData = data?.tournament || null;

  const { payoutTournamentList, refetch } = usePayoutTournamentDetails({
    type,
    tournamentData,
  });

  const sourceData = selectedTournamentData || tournamentData;

  const [formData, setFormData] = useState({
    title: sourceData ? sourceData.title : "",
    entryAmount: sourceData ? sourceData.entryAmount : "",
    endDate: sourceData
      ? sourceData.endDate
        ? getDateTime(sourceData.endDate)
        : ""
      : "",
    startDate: sourceData
      ? sourceData.startDate
        ? getDateTime(sourceData.startDate)
        : ""
      : "",
    playerLimit: sourceData ? sourceData.playerLimit : "",
    winSc: sourceData ? sourceData.winSc : "",
    winGc: sourceData ? sourceData.winGc : "",
    gameId: sourceData?.games?.length > 0
      ? sourceData?.games?.map((item) => {
        return Number(item.masterCasinoGameId);
      })
      : [],
    description: sourceData ? sourceData.description : "",
    entryCoin: sourceData ? sourceData.entryCoin : "SC",
    winnerPercentage: sourceData ? sourceData.winnerPercentage : [],
    numberOfWinners: sourceData
      ? sourceData?.winnerPercentage?.length
      : "",
    playerLimitIsActive: sourceData
      ? sourceData?.playerLimit
        ? true
        : false
      : false,
    tournamentImg: sourceData ? sourceData?.tournamentImg : "",
    vipTournament: sourceData ? sourceData?.vipTournament : false,
    isSubscriberOnly: sourceData ? sourceData?.isSubscriberOnly : false,
    allowedUsers: sourceData ? sourceData?.allowedUsers || [] : [],
    vipTournamentTitle: sourceData ? sourceData?.vipTournamentTitle : ''
  });


  const [formattedTournamentData, setFormattedTournamentData] = useState({});
  // Thumbnail Image
  // const [image, setImage] = useState(null);
  const [imageDimensionError, setImageDimensionError] = useState(null);

  const fileInputRef = useRef();

  useEffect(() => {
    if (tournamentData) {
      const formattedData = {
        title: tournamentData ? tournamentData.title : "",
        entryAmount: tournamentData ? tournamentData.entryAmount : "",
        endDate: tournamentData.endDate
          ? getDateTime(tournamentData.endDate)
          : "",
        startDate: tournamentData.startDate
          ? getDateTime(tournamentData.startDate)
          : "",
        playerLimit: tournamentData ? tournamentData.playerLimit : "",
        winSc: tournamentData ? tournamentData.winSc : "",
        winGc: tournamentData ? tournamentData.winGc : "",
        gameId: tournamentData
          ? tournamentData?.games?.length > 0 &&
          tournamentData?.games?.map((item) => {
            return Number(item.masterCasinoGameId);
          })
          : [],
        description: tournamentData ? tournamentData.description : "",
        entryCoin: tournamentData ? tournamentData.entryCoin : "SC",
        winnerPercentage: tournamentData ? tournamentData.winnerPercentage : [],
        numberOfWinners: tournamentData
          ? tournamentData?.winnerPercentage?.length
          : "",
        playerLimitIsActive: tournamentData
          ? tournamentData?.playerLimit
            ? true
            : false
          : false,
        tournamentImg: tournamentData ? tournamentData?.tournamentImg : "",
        vipTournament: tournamentData ? tournamentData?.vipTournament : false,
        isSubscriberOnly: tournamentData ? tournamentData?.isSubscriberOnly : false,
        allowedUsers: tournamentData ? tournamentData?.allowedUsers || [] : [],
        vipTournamentTitle: tournamentData ? tournamentData?.vipTournamentTitle : ''
      };
      setFormData(formattedData);
      setFormattedTournamentData(formattedData);
    }
  }, [tournamentData]);

  useEffect(() => {
    if (selectedTournamentData) {
      const formattedData = {
        title: selectedTournamentData ? selectedTournamentData.title : "",
        entryAmount: selectedTournamentData ? selectedTournamentData.entryAmount : "",
        endDate: selectedTournamentData.endDate
          ? getDateTime(selectedTournamentData.endDate)
          : "",
        startDate: selectedTournamentData.startDate
          ? getDateTime(selectedTournamentData.startDate)
          : "",
        playerLimit: selectedTournamentData ? selectedTournamentData.playerLimit : "",
        winSc: selectedTournamentData ? selectedTournamentData.winSc : "",
        winGc: selectedTournamentData ? selectedTournamentData.winGc : "",
        gameId: selectedTournamentData
          ? selectedTournamentData?.games?.length > 0 &&
          selectedTournamentData?.games?.map((item) => {
            return Number(item.masterCasinoGameId);
          })
          : [],
        description: selectedTournamentData ? selectedTournamentData.description : "",
        entryCoin: selectedTournamentData ? selectedTournamentData.entryCoin : "SC",
        winnerPercentage: selectedTournamentData ? selectedTournamentData.winnerPercentage : [],
        numberOfWinners: selectedTournamentData
          ? selectedTournamentData?.winnerPercentage?.length
          : "",
        playerLimitIsActive: selectedTournamentData
          ? selectedTournamentData?.playerLimit
            ? true
            : false
          : false,
        tournamentImg: selectedTournamentData ? selectedTournamentData?.tournamentImg : "",
        vipTournament: selectedTournamentData ? selectedTournamentData?.vipTournament : false,
        isSubscriberOnly: selectedTournamentData ? selectedTournamentData?.isSubscriberOnly : false,
        allowedUsers: selectedTournamentData ? selectedTournamentData?.allowedUsers || [] : [],
        vipTournamentTitle: selectedTournamentData ? selectedTournamentData.vipTournamentTitle : "",
      };
      setFormData(formattedData);
      setFormattedTournamentData(formattedData);
    }
  }, [selectedTournamentData]);


  useEffect(() => {
    if (details) {
      setActiveKey("Dashboard");
    }
  }, []);

  const tournamentLeaderBoard = data?.tournamentLeaderBoard || [];
  const yesterday = new Date(Date.now() - 86400000);

  const { allProviders, subCategories } = useProviderSubcategoryFilter({
    details,
  });

  const [activeAccordion, setActiveAccordion] = useState({});

  const formErrors = useRef({});

  const checkErrorsInAccordion = (errors) => {
    const KEY_MAP = {
      BASIC_DETAILS: [
        "description",
        "title",
        "tournamentImg",
        "startDate",
        "endDate",
      ],
      AMOUNT_DETAILS: ["entryAmount", "winSc", "winGc"],
      PLAYER_DETAILS: ["playerLimit"],
      VIP_DETAILS: ["allowedUsers"],
      GAMES_DETAILS: ["gameId"],
      WINNERS_DETAILS: ["numberOfWinners"],
    };

    let updatedAccordionState = {};

    Object.keys(KEY_MAP).forEach((key) => {
      const accordionFormKeys = KEY_MAP[key];
      let isErrorExistInAccordion = false;
      accordionFormKeys.every((formKey) => {
        if (errors[formKey]) {
          isErrorExistInAccordion = true;
        }
        return !isErrorExistInAccordion;
      });
      updatedAccordionState = {
        ...updatedAccordionState,
        [key]: isErrorExistInAccordion,
      };
    });
    setActiveAccordion(updatedAccordionState);
    return updatedAccordionState;
  };

  const ACCORDION_CONSTANTS = {
    BASIC_DETAILS: "BASIC_DETAILS",
    AMOUNT_DETAILS: "AMOUNT_DETAILS",
    WINNERS_DETAILS: "WINNERS_DETAILS",
    GAMES_DETAILS: "GAMES_DETAILS",
    PLAYER_DETAILS: "PLAYER_DETAILS",
    VIP_DETAILS: "VIP_DETAILS",
  };

  const handleToggleAccordian = (accordionKey) => {
    if (activeAccordion[accordionKey]) {
      setActiveAccordion({
        ...activeAccordion,
        [accordionKey]: false,
      });
    } else {
      setActiveAccordion({
        ...activeAccordion,
        [accordionKey]: true,
      });
    }
  };

  // Thumbnail Image
  const handleFileChange = (event, setFieldValue, field) => {
    const file = event.currentTarget.files[0];
    // setImage(file);
    // Validate file dimensions
    validateFileDimensions(file, field);

    // Optionally, you can update form field value
    setFieldValue(field, file);
  };

  const handleCancelImage = (setFieldValue) => {
    setFieldValue("tournamentImg", null);
    fileInputRef.current.value = null;
  };

  const validateFileDimensions = (file, field) => {
    if (file) {
      console.log(field);      
      const img = new Image();
      img.onload = function () {
        if (img.width === 582 && img.height === 314) {
          setImageDimensionError(false);
          // setImage(null);
        } else {
          setImageDimensionError(true);
        }
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const month = d.getMonth() + 1; // months are 0-indexed
    const day = d.getDate();
    const year = d.getFullYear();
    return `${month < 10 ? "0" + month : month}/${day < 10 ? "0" + day : day
      }/${year}`;
  };

  return (
    <>
      <Row>
        <Col sm={12} md={6}>
          <h3>
            {type === "CREATE_DUPLICATE" ? (
              "Create Duplicate Tournament"
            ) : tournamentData ? (
              details ? (
                `${tournamentData?.title} `
              ) : (
                "Edit"
              )
            ) : (
              "Create"
            )}
            {!details && type !== "CREATE_DUPLICATE" && (
              <span style={{ marginLeft: '8px' }}>
                {t("tournaments.createCategory.label")}
              </span>
            )}
          </h3>
        </Col>
        <Col sm={12} md={6}>
          {tournamentData && details && (
            <div className="tournament-detail">
              <div className="d-flex align-items-center gap-3">
                <h3>{`${formatDate(tournamentData?.startDate)}`}</h3>
                <h3>-</h3>
                <h3>{`${formatDate(tournamentData?.endDate)}`}</h3>
              </div>
            </div>
          )}
        </Col>
      </Row>


      <Tabs
        activeKey={activeKey}
        // defaultActiveKey={
        //   tournamentData ? (details ? "Dashboard" : "Edit") : "Create"
        // }
        onSelect={(k) => setActiveKey(k)}
        id="justify-tab-example"
        className={`${tournamentData && details ? "mt-5 ms-2" : "mt-2"} m-3`}

      // justify
      >
        {tournamentData && details && (
          <Tab eventKey="Dashboard" title="Dashboard">
            <TournamentDashboard
              tournamentData={tournamentData}
              tournamentSummaryData={tournamentSummaryData}
              tournamentGameIds={tournamentGameIds}
              tournamentTotalPlayers={tournamentTotalPlayers}
              tournamentWinnerBootedSummary={tournamentWinnerBootedSummary}
              tournamentBootedLoading={tournamentBootedLoading}
            />
          </Tab>
        )}

        {tournamentData && details && (
          <Tab eventKey="LeaderBoard" title="LeaderBoard">
            <LeaderBoard
              list={tournamentLeaderBoard}
              tournamentData={tournamentData}
              refetchTournament={refetchTournament}
              page={page}
              setPage={setPage}
              totalPages={totalPages}
              limit={limit}
              setLimit={setLimit}
              getCsvDownloadUrl={getCsvDownloadUrl}
              payoutTournamentList={payoutTournamentList}
              search={search}
              setSearch={setSearch}
            />
          </Tab>
        )}
        <Tab
          eventKey="TournamentForm"
          title={tournamentData ? (details ? "View" : null) : null}
        >
          <Formik
            enableReinitialize
            initialValues={formData}
            validateOnChange={false}
            validateOnBlur={false}
            validationSchema={casinoCategorySchema(
              t,
              tournamentData,
              TOURNAMENT_STATUS
            )}
            onSubmit={(formValues) => {
              // Get the number of winners from form values
              const numberOfWinners = formValues.numberOfWinners;

              const playerCountFromRankPercentSelector =
                formValues?.winnerPercentage?.length;

              const updatedAccordionState = { ...activeAccordion };

              if (
                Number(numberOfWinners) !== playerCountFromRankPercentSelector
              ) {
                toast(
                  `Number of winners should match the player count in the Rank Percent Selector.`,
                  "error"
                );
                updatedAccordionState[
                  ACCORDION_CONSTANTS.WINNERS_DETAILS
                ] = true;
                setActiveAccordion(updatedAccordionState);
                return;
              }

              let sum =
                formValues?.winnerPercentage?.length > 0 &&
                formValues?.winnerPercentage?.reduce(
                  (acc, o) => acc + parseFloat(o),
                  0
                );
              sum = sum && Math.round(sum);
              if (sum !== 100) {
                toast(
                  "Sum of all winner player percentage should be 100",
                  "error"
                );
                return null;
              }
              const data = {
                title: formValues.title,
                entryAmount: formValues.entryAmount,
                endDate: convertToUTC(formValues.endDate),
                startDate: convertToUTC(formValues.startDate),
                playerLimit: formValues?.playerLimitIsActive
                  ? formValues?.playerLimit
                    ? formValues.playerLimit
                    : null
                  : null,
                winSc: formValues.winSc,
                winGc: formValues.winGc,
                gameId: formValues?.gameId || [],
                description: formValues.description,
                entryCoin: formValues.entryCoin,
                winnerPercentage: formValues?.winnerPercentage || [],
                tournamentImg: formValues.tournamentImg,
                vipTournament: formValues.vipTournament,
                isSubscriberOnly: formValues.isSubscriberOnly,
                allowedUsers: formValues.allowedUsers?.map(({ userId }) => userId) || [],
                vipTournamentTitle: formValues.vipTournamentTitle?.trim() || '',
              }

              if (tournamentData) {

                // Check if allowedUsers is an empty array
                if (formValues?.allowedUsers?.length === 0 || !formValues?.vipTournament) {
                  data.removeAllAllowedUsers = true;
                }

                const changedData = pickBy(data, (value, key) => {
                  if (key === "endDate" || key === "startDate") {
                    return !isEqual(
                      moment(value).format("YYYY-MM-DD hh:mm:ss"),
                      moment(formattedTournamentData[key]).format(
                        "YYYY-MM-DD hh:mm:ss"
                      )
                    );
                  }
                  if (key === "allowedUsers") {
                    return !isEqual(value, formattedTournamentData[key]?.map(({ userId }) => userId))
                  }
                  return !isEqual(value, formattedTournamentData[key]);
                });

                if (Object.keys(changedData).length) {
                  updateTournament(
                    serialize({
                      ...changedData,
                      tournamentId: tournamentData?.tournamentId,
                    })
                  );
                } else {
                  toast("No changes available to update.", "error");
                }
              } else {
                const payload = {
                  ...data,
                  ...(type === "CREATE_DUPLICATE" && selectedTournamentData?.imageUrl
                    ? { imageUrl: selectedTournamentData.imageUrl }
                    : {}),
                };

                createTournamentList(serialize(payload));
              }
            }}
          >
            {(props) => {
              const {
                values,
                handleChange,
                handleSubmit,
                errors = {},
                handleBlur,
                setFieldValue,
                setFieldTouched,
              } = props;

              if (
                !isEqual(errors, formErrors.current) &&
                !Object.keys(formErrors.current).length
              ) {
                formErrors.current = errors;
                checkErrorsInAccordion(errors);
              }

              return (
                <Form>
                  {/* Basic Details Accordion */}
                  <TournamentAccordionForm
                    activeKey={activeAccordion[ACCORDION_CONSTANTS.BASIC_DETAILS] ? ACCORDION_CONSTANTS.BASIC_DETAILS : ""}
                    eventKey={ACCORDION_CONSTANTS.BASIC_DETAILS}
                    title="Basic Details"
                    onToggle={() => handleToggleAccordian(ACCORDION_CONSTANTS.BASIC_DETAILS)}
                  >
                    <BasicDetailsForm
                      t={t}
                      values={values}
                      setFieldValue={setFieldValue}
                      handleBlur={handleBlur}
                      handleFileChange={handleFileChange}
                      handleCancelImage={handleCancelImage}
                      imageDimensionError={imageDimensionError}
                      tournamentData={selectedTournamentData || tournamentData}
                      details={details}
                      fileInputRef={fileInputRef}
                      yesterday={yesterday}
                      getDateTime={getDateTime}
                      getDateTimeByYMD={getDateTimeByYMD}
                      TOURNAMENT_STATUS={TOURNAMENT_STATUS}
                      setFieldTouched={setFieldTouched}
                      isDuplicate={isDuplicate}
                    />
                  </TournamentAccordionForm>

                  {/* Amount Details Accordion */}
                  <TournamentAccordionForm
                    activeKey={activeAccordion[ACCORDION_CONSTANTS.AMOUNT_DETAILS] ? ACCORDION_CONSTANTS.AMOUNT_DETAILS : ""}
                    eventKey={ACCORDION_CONSTANTS.AMOUNT_DETAILS}
                    title="Amount Section"
                    onToggle={() => handleToggleAccordian(ACCORDION_CONSTANTS.AMOUNT_DETAILS)}
                  >
                    <AmountDetailsForm
                      t={t}
                      values={values}
                      handleBlur={handleBlur}
                      details={details}
                      handleChange={handleChange}
                    />
                  </TournamentAccordionForm>

                  {/* Player Limit Accordion */}
                  <TournamentAccordionForm
                    activeKey={activeAccordion[ACCORDION_CONSTANTS.PLAYER_DETAILS] ? ACCORDION_CONSTANTS.PLAYER_DETAILS : ""}
                    eventKey={ACCORDION_CONSTANTS.PLAYER_DETAILS}
                    title="Player Limit"
                    onToggle={() => handleToggleAccordian(ACCORDION_CONSTANTS.PLAYER_DETAILS)}
                  >
                    <PlayerLimitForm
                      t={t}
                      values={values}
                      handleBlur={handleBlur}
                      details={details}
                      handleChange={handleChange}
                    />
                  </TournamentAccordionForm>

                  {/* Games Accordion */}
                  <TournamentAccordionForm
                    activeKey={activeAccordion[ACCORDION_CONSTANTS.GAMES_DETAILS] ? ACCORDION_CONSTANTS.GAMES_DETAILS : ""}
                    eventKey={ACCORDION_CONSTANTS.GAMES_DETAILS}
                    title="Games"
                    onToggle={() => handleToggleAccordian(ACCORDION_CONSTANTS.GAMES_DETAILS)}
                    errorMessage={errors?.gameId}
                  >
                    <Row className="mt-0">
                      <AddGamesForm
                        providerList={allProviders?.rows}
                        subCategoryList={subCategories?.rows}
                        selectedGames={Array.isArray(values?.gameId) ? values.gameId : []}
                        setSelectedGames={(selectedGames) => {
                          setFieldValue("gameId", selectedGames || []);
                        }}
                        isViewMode={details}
                        disabled={details}
                        tournamentData={selectedTournamentData || tournamentData}
                        type={type}
                      />
                    </Row>
                  </TournamentAccordionForm>

                  {/* VIP Tournament Accordion */}
                  <TournamentAccordionForm
                    activeKey={activeAccordion[ACCORDION_CONSTANTS.VIP_DETAILS] ? ACCORDION_CONSTANTS.VIP_DETAILS : ""}
                    eventKey={ACCORDION_CONSTANTS.VIP_DETAILS}
                    title="Exclusive Tournament"
                    onToggle={() => handleToggleAccordian(ACCORDION_CONSTANTS.VIP_DETAILS)}
                  >
                    <VIPTournamentForm
                      values={values}
                      setFieldValue={setFieldValue}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type={type}
                      tournamentData={selectedTournamentData || tournamentData}
                      details={details}
                      refetchTournament={refetchTournament}
                      loading={loading}
                    />
                  </TournamentAccordionForm>

                  {/* Number of Winners Accordion */}
                  <TournamentAccordionForm
                    activeKey={activeAccordion[ACCORDION_CONSTANTS.WINNERS_DETAILS] ? ACCORDION_CONSTANTS.WINNERS_DETAILS : ""}
                    eventKey={ACCORDION_CONSTANTS.WINNERS_DETAILS}
                    title="Number of Winners"
                    onToggle={() => handleToggleAccordian(ACCORDION_CONSTANTS.WINNERS_DETAILS)}
                  >
                    <NumberOfWinnerForm
                      t={t}
                      values={values}
                      setFieldValue={setFieldValue}
                      handleBlur={handleBlur}
                      tournamentData={selectedTournamentData || tournamentData}
                      details={details}
                      errors={errors}
                    />
                  </TournamentAccordionForm>

                  <div className="w-100 d-flex justify-content-end gap-2 mt-4">
                    <Button
                      variant="warning"
                      onClick={() => navigate(AdminRoutes.Tournament)}
                    >
                      Cancel
                    </Button>
                    <Button
                      hidden={details}
                      variant="success"
                      onClick={(event) => {
                        handleSubmit(event);
                        checkErrorsInAccordion(errors);
                        formErrors.current = errors;
                      }}
                      className="ml-2"
                      disabled={loading}
                    >
                      {t("tournaments.createCategory.submit")}
                      {loading && (
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      )}
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </Tab>

        {tournamentData &&
          details &&
          (tournamentData?.status === "2" ||
            tournamentData?.status === "3") && (
            <Tab eventKey="PayoutTournament" title="Payout">
              <TournamentPayout
                list={tournamentLeaderBoard}
                tournamentData={tournamentData}
                payoutTournamentList={payoutTournamentList}
                refetch={refetch}
              />
            </Tab>
          )}
      </Tabs>
    </>
  );
};

export default CreateTournament;
