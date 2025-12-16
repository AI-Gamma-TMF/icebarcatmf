import moment from "moment";
import { YAxisOptions } from "./constant";

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

export const createLineChartDataSet = (responseData = [], graphType ={}, dateFormat) => {
  const selectedKeys = graphType.some((opt) => opt.value === 'all')
  ? YAxisOptions.map((opt) => opt.value)
  : graphType.map((opt) => opt.value);


  const labels = responseData.map((item) =>
    formatLabel(item.intervals, dateFormat)
  );
  const datasets = YAxisOptions
  .filter((opt) => selectedKeys.includes(opt.value))
  .map((opt) => ({
    label: opt.label,
    data: responseData.map((item) => item[opt.value]),
    borderColor: opt.color,
    tension: 0.4,
    fill: false,
  }));
  
  return { labels, datasets };
};

export const getYAxisLabel = (jackpotMetrics) => {
  if (!jackpotMetrics || jackpotMetrics.length === 0) return '';
  if (jackpotMetrics.length === 1) { 
    if(jackpotMetrics[0].value === 'all')
       return 'Metric Value' 
    else return jackpotMetrics[0].label
  }
  return 'Metric Value';
};
export const getGraphTitle = (jackpotMetrics) => {
  if (!jackpotMetrics || jackpotMetrics.length === 0) return 'Jackpot Analytics - No Metrics Selected';
  if (jackpotMetrics.length === 1) return `Jackpot Analytics - ${jackpotMetrics[0].label} Over Time`;
  if (jackpotMetrics.length === 5) return `Jackpot Analytics - All Metrics Over Time`;
  return `Jackpot Analytics - ${jackpotMetrics.map(m => m.label).join(', ')} Over Time`;
};