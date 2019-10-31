export const toPercentage = (number) => {
  return `${number * 100}%`;
};

export const roundedPercentage = (num) => Math.round(num * 10000) / 10000;

export const simulateEngagement = (monthlyIncomePerUser = 9, months = 36, userOptions = {}) => {
  const defaultOptions = {
    monthlyNew: 20,
    growthFactor: 0.03,
    monthlyChurn: 0.04,
    reactivationRate: 0.08
  };

  const options = { ...defaultOptions, ...userOptions };

  let totalUsers = 0;
  let totalInactive = 0;
  let currentMonthly = options.monthlyNew;
  let lastMonth = 0;
  let result = [];

  for (let i = 0; i < months; i++) {
    let growth = lastMonth * options.growthFactor;
    lastMonth = lastMonth === 0 ? options.monthlyNew + growth : lastMonth + growth;
    currentMonthly = parseInt((currentMonthly * (1 + options.growthFactor)).toFixed());
    totalInactive += parseInt(options.monthlyChurn * totalUsers);
    let reactivated = parseInt(totalInactive * options.reactivationRate);
    totalInactive -= reactivated;
    let churnedUsers = i > 0 ? parseInt(1 - options.monthlyChurn * totalUsers) : 0;
    totalUsers = parseInt(totalUsers + lastMonth + reactivated + churnedUsers);
    result.push({
      totalUsers,
      totalInactive,
      reactivated,
      monthlyNew: parseInt(lastMonth),
      churnedUsers,
      growth
    });
  }
  return result;
};

export const moneyFormatter = (money, digits = 2) => {
  return (money < 0 ? "-" : "") + "$" + Math.abs(money).toLocaleString("en-US");
};

export const toInt = (number) => (typeof number === "string" ? parseInt(number) : Math.round(number));
export const toFloat = (number) => (typeof number === "string" ? parseFloat(number) : number);
