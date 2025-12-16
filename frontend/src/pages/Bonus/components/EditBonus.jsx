import CreateBonus from "./CreateBonus";
import Preloader from "../../../components/Preloader";
import useBonusDetails from "../hooks/useBonusDetail";

const EditBonus = () => {
  const { bonusByPageData, loading } = useBonusDetails();
  if (loading) return <Preloader />;
  return <CreateBonus bonusData={bonusByPageData?.rows[0]} />;
};

export default EditBonus;
