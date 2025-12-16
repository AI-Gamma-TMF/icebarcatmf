export const providersTableHeaders = [
  { labelKey: "Aggregator", value: "aggregatorName" },
  { labelKey: "Provider", value: "providerName" },
  // { labelKey: "Provider Id", value: "providerId" },
  // { labelKey: "GGR Minimum", value: "ggrMinimum" },
  // { labelKey: "GGR Maximum", value: "ggrMaximum" },
  // { labelKey: "Rate (%)", value: "rate" },
  { labelKey: "Action", value: "action" },
];


export const providerRateTableHeaders = [
  // { labelKey: "Provider Id", value: "providerId" },
  { labelKey: "GGR Minimum", value: "ggrMinimum" },
  { labelKey: "GGR Maximum", value: "ggrMaximum" },
  { labelKey: "Rate (%)", value: "rate" },
  { labelKey: "Action", value: "action" },
];

export const providerDashboardTableHeaders = [
  { labelKey: "Provider", value: "masterCasinoProviderName" },
  { labelKey: "Aggregator", value: "masterGameAggregatorName" },
  { labelKey: "Rate (%)", value: "rate" },

  { labelKey: "Total GGR", value: "totalGGR" },
  { labelKey: "Net GGR", value: "netGGR" },
  { labelKey: "Avg Ggr % Discount", value: "avgGgrDiscountPercentage" },
  // { labelKey: "Last Month GGR", value: "lastMonthGGR" },
  { labelKey: "Total NGR", value: "totalNGR" },
  // { labelKey: "Last Month NGR", value: "lastMonthNGR" },

  { labelKey: "GGR % (Total)", value: "percentageTotalGGR" },
  // { labelKey: "GGR % (Last Month)", value: "percentageLastMonthGGR" },
  { labelKey: "RTP Version", value: "rtpVersion" },
  { labelKey: "Actual RTP", value: "actualRTP" }
];
