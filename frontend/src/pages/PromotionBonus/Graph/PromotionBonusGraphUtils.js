import moment from "moment";
import { YAxisOptions } from "../../Jackpot/constant";
import { BONUS_TYPE_COLOR_MAP, getRandomColor } from "../../ScratchCard/Graph/constant";
//import { YAxisOptions } from "./constant";

const formatLabel = (date, dateFormat) => {
  if (!date || !moment(date).isValid()) {
    return null;
  }

  let finalFormat = dateFormat;

  if (dateFormat?.includes("hh") || dateFormat?.includes("h")) {
    finalFormat = dateFormat
      .replace(/hh/g, "HH")
      .replace(/h/g, "HH")
      .replace(/A|a/, "");
  }

  return moment(date).format(finalFormat);
};

export const createLineChartDataSet = (responseData = [],   selectedMetric = "scBonus", dateFormat) => {
  const labels = [];
  const bonusTypeMap = {};

  responseData.forEach((dataItem) => {
    labels.push(formatLabel(dataItem.intervals, dateFormat));

    Object.entries(dataItem).forEach(([key, value]) => {
      console.log(key,'key',value,'value')
      if (key === "intervals") return; // skip the date field
      if (!bonusTypeMap[key]) {
        bonusTypeMap[key] = [];
      }
      bonusTypeMap[key].push(value ?? 0);
    });
  });

  const datasets = Object.entries(bonusTypeMap).map(([bonusType, data], index) => ({
      label: bonusType,
      data,
      borderColor: BONUS_TYPE_COLOR_MAP[bonusType] || getRandomColor(index),
      borderWidth: 2,
      fill: false,
      tension: 0.1,
    })
  );

  return { labels, datasets };
};

export const getYAxisLabel = (promotionBonusMetrics) => {
  if (!promotionBonusMetrics || promotionBonusMetrics.length === 0) return '';
  if (promotionBonusMetrics.length === 1) { 
    if(promotionBonusMetrics[0].value === 'all')
       return 'Metric Value' 
    else return promotionBonusMetrics[0].label
  }
  return 'Metric Value';
};
export const getGraphTitle = (promotionBonusMetrics) => {
  if (!promotionBonusMetrics || promotionBonusMetrics.length === 0) return 'PromotionBonus Analytics - No Metrics Selected';
  if (promotionBonusMetrics.length === 1) return `PromotionBonus Analytics - ${promotionBonusMetrics[0].label} Over Time`;
  if (promotionBonusMetrics.length === 5) return `PromotionBonus Analytics - All Metrics Over Time`;
  return `PromotionBonus Analytics - ${promotionBonusMetrics.map(m => m.label).join(', ')} Over Time`;
};