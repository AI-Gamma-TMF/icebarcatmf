import moment from "moment";

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

export const createLineChartDataSet = (responseData = [], graphType ={}, dateFormat, rawScratchCardList) => {
  const selectedKeys = graphType.some((opt) => opt.value === 'all')
  ? rawScratchCardList.map((opt) => opt.value)
  : graphType.map((opt) => opt.value);


  const labels = responseData.map((item) =>
    formatLabel(item.intervals, dateFormat)
  );
  const datasets = rawScratchCardList
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

export const getYAxisLabel = (scratchCardMetrics) => {
  if (!scratchCardMetrics || scratchCardMetrics.length === 0) return '';
  if (scratchCardMetrics.length === 1) { 
    if(scratchCardMetrics[0].value === 'all')
       return 'Metric Value' 
    else return scratchCardMetrics[0].label
  }
  return 'Metric Value';
};
export const getGraphTitle = (scratchCardMetrics) => {
  if (!scratchCardMetrics || scratchCardMetrics.length === 0) return 'ScratchCard Analytics - No Metrics Selected';
  if (scratchCardMetrics.length === 1) return `ScratchCard Analytics - ${scratchCardMetrics[0].label} Over Time`;
  if (scratchCardMetrics.length === 5) return `ScratchCard Analytics - All Metrics Over Time`;
  return `ScratchCard Analytics - ${scratchCardMetrics.map(m => m.label).join(', ')} Over Time`;
};