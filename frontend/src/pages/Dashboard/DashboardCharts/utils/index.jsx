const calculateTotal = (obj) => {
  let total = 0;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && typeof obj[key] === 'number') {
      total += obj[key];
    }
  }
  return total;
};

const addNameAndTotalKey = (parentKey, object, startKey) => {
  return {
    label: `${startKey}.${parentKey}`,
    total: calculateTotal(object),
    ...object,
  };
};

export const prepareGroupedObject = (originalObject,customerData, loginData,transactionData,economyData) => {
  const groupedObject = {
    Login_Data: [
      addNameAndTotalKey('CURRENT_LOGIN', loginData?.CURRENT_LOGIN, 'loginKeys'),
      addNameAndTotalKey('UNIQ_LOGIN', loginData?.UNIQ_LOGIN, 'loginKeys'),
      addNameAndTotalKey(
        'TOTAL_LOGIN',
        loginData?.TOTAL_LOGIN,
        'loginKeys'
      ),
      
    ],
    Customers_Data: [
      addNameAndTotalKey(
        'NEW REGISTRATION',
        customerData?.NEW_REGISTRATION,
        'customerDataKeys'
      ),
      addNameAndTotalKey(
        'PHONE_VERIFIED',
        customerData?.PHONE_VERIFIED,
        'customerDataKeys'
      ),
      addNameAndTotalKey(
        'FIRST_DEPOSIT',
        customerData?.FIRST_DEPOSIT,
        'customerDataKeys'
      ),
      addNameAndTotalKey(
        'FIRST_DEPOSIT_AMOUNT_SUM',
        customerData?.FIRST_DEPOSIT_AMOUNT_SUM,
        'customerDataKeys'
      ),
      addNameAndTotalKey(
        'PURCHASE_AMOUNT_SUM',
        customerData?.PURCHASE_AMOUNT_SUM,
        'customerDataKeys'
      ),
      addNameAndTotalKey(
        'PURCHASE_AMOUNT_COUNT',
        customerData?.PURCHASE_AMOUNT_COUNT,
        'customerDataKeys'
      ),
      addNameAndTotalKey(
        'AVERAGE_PURCHASE_AMOUNT',
        customerData?.AVERAGE_PURCHASE_AMOUNT,
        'customerDataKeys'
      ),
      addNameAndTotalKey(
        'APPROVAL_REDEMPTION_AMOUNT_SUM',
        customerData?.APPROVAL_REDEMPTION_AMOUNT_SUM,
        'customerDataKeys'
      ),
      addNameAndTotalKey(
        'REQUEST_REDEMPTION_AMOUNT_SUM',
        customerData?.REQUEST_REDEMPTION_AMOUNT_SUM,
        'customerDataKeys'
      ),
      addNameAndTotalKey(
        'REQUEST_REDEMPTION_COUNT_SUM',
        customerData?.REQUEST_REDEMPTION_COUNT_SUM,
        'customerDataKeys'
      ),
      addNameAndTotalKey(
        'PENDING_REDEMPTION_COUNT_SUM',
        customerData?.PENDING_REDEMPTION_COUNT_SUM,
        'customerDataKeys'
      ),
      addNameAndTotalKey(
        'GROSS_REVENUE',
        customerData?.GROSS_REVENUE,
        'customerDataKeys'
      )
    ],
    Transactions_Data: [
      addNameAndTotalKey(
        'ACTIVE_GC_PLAYER',
        transactionData?.ACTIVE_GC_PLAYER,
        'transactionDataKeys'
      ),
      addNameAndTotalKey(
        'ACTIVE_SC_PLAYER',
        transactionData?.ACTIVE_SC_PLAYER,
        'transactionDataKeys'
      ),
      addNameAndTotalKey(
        'RETURN_TO_PLAYER',
        transactionData?.RETURN_TO_PLAYER,
        'transactionDataKeys'
      ),
      addNameAndTotalKey(
        'HOUSE_EDGE',
        transactionData?.HOUSE_EDGE,
        'transactionDataKeys'
      ),
      addNameAndTotalKey(
        'SC_STAKED_TOTAL',
        transactionData?.SC_STAKED_TOTAL,
        'transactionDataKeys'
      ),
      addNameAndTotalKey(
        'SC_WIN_TOTAL',
        transactionData?.SC_WIN_TOTAL,
        'transactionDataKeys'
      ),
      addNameAndTotalKey(
        'SC_GGR_TOTAL',
        transactionData?.SC_GGR_TOTAL,
        'transactionDataKeys'
      ),
      addNameAndTotalKey(
        'SC_NEW_ACTIVE_PLAYER',
        transactionData?.SC_NEW_ACTIVE_PLAYER,
        'transactionDataKeys'
      ),
    ],
    Coin_Economy_Data: [
      addNameAndTotalKey(
        'GC_CREDITED_PURCHASE',
        economyData?.GC_CREDITED_PURCHASE,
        'coinEcoDataKeys'
      ),
      addNameAndTotalKey(
        'SC_CREDITED_PURCHASE',
        economyData?.SC_CREDITED_PURCHASE,
        'coinEcoDataKeys'
      ),
      addNameAndTotalKey(
        'GC_AWARDED_TOTAL',
        economyData?.GC_AWARDED_TOTAL,
        'coinEcoDataKeys'
      ),
      addNameAndTotalKey(
        'SC_AWARDED_TOTAL',
        economyData?.SC_AWARDED_TOTAL,
        'coinEcoDataKeys'
      ),
    ],
  };

  return groupedObject;
};

export const transformDataArray = (dataArray) => {
  const result = {
    label: [],
    TODAY: [],
    YESTERDAY: [],
    MONTH_TO_DATE: [],
    LAST_MONTH: [],
    CUSTOM: [],
  };

  dataArray.forEach((item) => {
    result.label.push(item.label);
    result.TODAY.push(item.TODAY);
    result.YESTERDAY.push(item.YESTERDAY);
    result.MONTH_TO_DATE.push(item.MONTH_TO_DATE);
    result.LAST_MONTH.push(item.LAST_MONTH);
    result.CUSTOM.push(item.CUSTOM);
  });

  return result;
};

export const formatLabel = (label) => {
  return label
    .replace(/_/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};


