import { toast } from '../components/Toast';

export const searchRegEx = /[^\w\s+@.]/gi;
export const emailTemplateRegEx = /{{{ *[A-Za-z0-9]* *}}}/g;

const timeZoneMappings = {
  IDLW: 'Etc/GMT+12',
  NT: 'America/Nome',
  HST: 'Pacific/Honolulu',
  AKST: 'America/Anchorage',
  PST: 'America/Los_Angeles',
  MST: 'America/Denver',
  CST: 'America/Chicago',
  EST: 'America/New_York',
  AST: 'America/Halifax',
  NST: 'America/St_Johns',
  BRT: 'America/Sao_Paulo',
  'GST-2': 'Etc/GMT+2',
  AZOT: 'Atlantic/Azores',
  GMT: 'Etc/GMT',
  CET: 'Europe/Paris',
  EET: 'Europe/Bucharest',
  MSK: 'Europe/Moscow',
  IRST: 'Asia/Tehran',
  GST: 'Asia/Dubai',
  IST: 'Asia/Kolkata',
  BST: 'Asia/Dhaka',
  ICT: 'Asia/Bangkok',
  'CST+8': 'Asia/Shanghai',
  JST: 'Asia/Tokyo',
  ACST: 'Australia/Darwin',
  AEST: 'Australia/Sydney',
  SBT: 'Pacific/Guadalcanal',
  NZST: 'Pacific/Auckland',
  NZDT: 'Pacific/Auckland',
  LINT: 'Pacific/Kiritimati',
};

export const permissionLabel = (label, t) => {
  switch (label) {
    case 'C':
      return t('permissions.create', { ns: 'translation' });
    case 'R':
      return t('permissions.read', { ns: 'translation' });
    case 'DR':
      return t('permissions.dashBoardReports', { ns: 'translation' });
    case 'U':
      return t('permissions.update', { ns: 'translation' });
    case 'D':
      return t('permissions.delete', { ns: 'translation' });
    case 'T':
      return t('permissions.toggleStatus', { ns: 'translation' });
    case 'A':
      return t('permissions.apply', { ns: 'translation' });
    case 'GC':
      return t('permissions.createCustom', { ns: 'translation' });
    case 'SR':
      return t('permissions.limit', { ns: 'translation' });
    case 'AB':
      return t('permissions.manageWallet', { ns: 'translation' });
    case 'TE':
      return t('permissions.testEmail', { ns: 'translation' });
    case 'CR':
      return t('permissions.commissionReports',{ns: 'translation'})
    default:
      return label;
  }
};

export const customLabel = (label, t) => {
  switch (label) {
    case 'C':
      return t('permissions.assign', { ns: 'translation' });
    case 'R':
      return t('permissions.read', { ns: 'translation' });
    case 'U':
      return t('permissions.resolve', { ns: 'translation' });
    default:
      return label;
  }
};

export const isJson = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const commonDateTimeFormat = {
  date: 'MM/DD/YYYY',
  dateWithTime: 'MM/DD/YYYY hh:mm A',
};

export const removeHTMLTags = (s) => {
  const pattern = new RegExp('\\<.*?\\>');
  s = new String(s).replace(pattern, '');
  return s;
};

export const downloadCSVFromApiResponse = (apiResponse) => {
  const csvData = apiResponse.csvData;
  const blob = new Blob([csvData], { type: 'text/csv' });
  const blobURL = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobURL;
  a.download = apiResponse.fileName;
  a.click();
  URL.revokeObjectURL(blobURL);
};

export async function onDownloadCsvDirectClick(downloadURL, fileName) {
  const apiUrl = downloadURL;
  const response = await fetch(apiUrl, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    toast('Failed to fetch data from the server', 'error');
    return;
  }

  // toast(message,'success');
  const reader = response.body.getReader();
  const chunks = [];

  let result;
  while (!(result = await reader.read()).done) {
    const { value } = result;
    chunks.push(value);
  }
  // Concatenate the chunks into a single Blob
  const blob = new Blob(chunks, { type: 'text/csv' });

  // Create and download the CSV file
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function onDownloadCsvClick(downloadURL, _fileName) {
  const apiUrl = downloadURL;
  const response = await fetch(apiUrl, {
    method: 'GET',
    credentials: 'include',
  });
  if (response.ok) {
    const data = await response.json();
    toast(data?.data?.message, 'success');
  } else {
    toast('Failed to fetch data from the server', 'error');
  }
}

export function formatPriceWithCommas(price) {
  if (price) {
    // Convert the price to a string
    const priceString = price.toString();

    // Split the price into whole and decimal parts
    const parts = priceString.split('.');

    // Regex to add commas for thousands separator
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Join the whole and decimal parts with a dot
    return parts.join('.');
  }
  return 0;
}

export const formatAmountWithCommas = (price) => {
  if (price) {
    const roundedPrice = parseFloat(price).toFixed(2); // Round to 2 decimal places
    const finalPrice = roundedPrice.endsWith('.00') ? parseInt(roundedPrice) : roundedPrice; // Remove .00 if whole number
    return finalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas
  }
  return '0';
};

export function getFormattedTimeZoneOffset() {
  const offset = new Date().getTimezoneOffset();
  const absOffset = Math.abs(offset);
  const hours = String(Math.floor(absOffset / 60)).padStart(2, '0');
  const minutes = String(absOffset % 60).padStart(2, '0');
  const sign = offset <= 0 ? '+' : '-';
  return `${sign}${hours}:${minutes}`;
}

export const convertToTimeZone = (dateString, offsetString) => {
  const date = new Date(dateString);
  // Extract hours and minutes from the offset string
  const [offsetSign, offsetHours, offsetMinutes] = offsetString.match(/([+-])(\d{2}):(\d{2})/).slice(1);
  const offset = (parseInt(offsetHours, 10) * 60 + parseInt(offsetMinutes, 10)) * (offsetSign === '+' ? 1 : -1);

  // Calculate the local time by adjusting the UTC time
  const localTime = new Date(date.getTime() + offset * 60000);

  return localTime?.toISOString()?.slice(0, 19)?.replace('T', ' ');
};

import moment from 'moment-timezone';
export const convertTimeZone = (dateStr, timeZoneCode) => {
  
  const defaultSourceTimeZone = 'Asia/Kolkata'; // Default source time zone (e.g., IST)

  const inputDate = moment.tz(dateStr, defaultSourceTimeZone);
  const targetTimeZone = timeZoneMappings[timeZoneCode];

  if (!targetTimeZone) {
    throw new Error(`Invalid target time zone: ${timeZoneCode}`);
  }

  //const convertedTime = inputDate.clone().tz(targetTimeZone).format('ddd MMM DD YYYY HH:mm:ss [GMT]Z (z)');
  const convertedTime = inputDate.clone().tz(targetTimeZone).format('MM/DD/YYYY');
  return convertedTime;
};

export const convertTimeZoneDateTime = (dateStr, timeZoneCode) =>{
  const defaultSourceTimeZone = 'Asia/Kolkata'; // Default source time zone (e.g., IST)

  const inputDate = moment.tz(dateStr, defaultSourceTimeZone);
  const targetTimeZone = timeZoneMappings[timeZoneCode];

  if (!targetTimeZone) {
    throw new Error(`Invalid target time zone: ${timeZoneCode}`);
  }

  //const convertedTime = inputDate.clone().tz(targetTimeZone).format('ddd MMM DD YYYY HH:mm:ss [GMT]Z (z)');
  const convertedTime = inputDate.clone().tz(targetTimeZone)
  return convertedTime;
}
const momentDate = require('moment');
export const convertToUtc = (date) => {
  if (!date || !momentDate(date).isValid()) {
    return null;
  }
  return momentDate(date).format('YYYY-MM-DD');
};

export const utcFormat = (date) => {
  if (!date || !momentDate(date).isValid()) {
    return null;
  }
  return momentDate(date).utc().format('YYYY-MM-DDTHH:mm:ss[Z]');
};


export const capitalizeFirstLetter = (str) => {
  if (typeof str !== 'string' || str.length === 0) return '';
  const [first, ...rest] = str.toLowerCase();
  return first.toUpperCase() + rest.join('');
};

export const appendCurrentTime = (date) => {
  if (!date || !momentDate(date).isValid()) {
    return null;
  }
  const currentDate = new Date();
  const hours = currentDate.getHours().toString().padStart(2, '0');
  const minutes = currentDate.getMinutes().toString().padStart(2, '0');
  const seconds = currentDate.getSeconds().toString().padStart(2, '0');
  const currentTime = `${hours}:${minutes}:${seconds}`;
  return `${date} ${currentTime}`;
};

export function formatNumber(value, options = { isDecimal: false, decimalPlaces: 2 }) {
  if (value !== undefined && value !== null) {
    if (typeof value === 'string') {
      value = options.isDecimal ? parseFloat(value) : parseInt(value, 10);
    }

    if (isNaN(value)) {
      throw new Error('Input is not a valid number');
    }

    const formatOptions = options.isDecimal
      ? {
        style: 'decimal',
        minimumFractionDigits: options.decimalPlaces,
        maximumFractionDigits: options.decimalPlaces,
      }
      : {};

    return value.toLocaleString('en-US', formatOptions);
  } else {
    return options.isDecimal ? '0.00' : '0';
  }
}
