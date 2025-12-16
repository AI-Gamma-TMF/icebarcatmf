import moment from 'moment'
import { BONUS_TYPE_COLOR_MAP, getRandomColor } from "./constant";

const formatLabel = (date, dateFormat) => {
    if (!date || !moment(date).isValid()) {
        return null;
    }

    let finalFormat = dateFormat;

    if (dateFormat?.includes('hh') || dateFormat?.includes('h')) {
        finalFormat = dateFormat
            .replace(/hh/g, 'HH')
            .replace(/h/g, 'HH')
            .replace(/A|a/, '');
    }

    return moment(date).format(finalFormat);
};


export const formateBonusGraphData = (responseData = [], selectedMetric = 'scBonus', dateFormat) => {
    const labels = [];
    const bonusTypeMap = {};
    responseData.forEach(({ intervals, casinoBonusData }) => {
        labels.push(formatLabel(intervals, dateFormat));
        Object.entries(casinoBonusData).forEach(([bonusType, data]) => {
            if (!bonusTypeMap[bonusType]) {
                bonusTypeMap[bonusType] = [];
            }
            bonusTypeMap[bonusType].push(data?.[selectedMetric] ?? 0);
        });
    });

    const datasets = Object.entries(bonusTypeMap).map(([bonusType, data], index) => ({
        label: bonusType,
        data,
        borderColor: BONUS_TYPE_COLOR_MAP[bonusType] || getRandomColor(index),
        borderWidth: 2,
        fill: false,
        tension: 0.1,
    }));

    return { labels, datasets };
};

export const getDateRange = (selectedRange, customStart, customEnd) => {
    const now = new Date();
    let startDate, endDate;

    switch (selectedRange) {
        case "1h":
            startDate = new Date(now.getTime() - 1 * 60 * 60 * 1000);
            endDate = now;
            break;
        case "3h":
            startDate = new Date(now.getTime() - 3 * 60 * 60 * 1000);
            endDate = now;
            break;
        case "12h":
            startDate = new Date(now.getTime() - 12 * 60 * 60 * 1000);
            endDate = now;
            break;
        case "1d":
            startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            endDate = now;
            break;
        case "3d":
            startDate = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
            endDate = now;
            break;
        case "1w":
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            endDate = now;
            break;
        case "Custom":
            if (!customStart || !customEnd) {
                throw new Error("Custom range requires start and end dates");
            }
            startDate = new Date(customStart);
            endDate = new Date(customEnd);
            break;
        default:
            throw new Error("Unsupported range selected");
    }

    return { startDate, endDate };
};

