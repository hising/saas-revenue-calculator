import { action, computed, observable } from "mobx";
import { roundedPercentage, simulateEngagement, toInt, toPercentage } from "../core/functions";

export class RevenueStore {
  @observable monthly = [];
  @observable monthlyNew = 25;
  @observable growthFactor = 0.04;
  @observable monthlyChurn = 0.4;
  @observable reactivationRate = 0.2;
  @observable months = 36;
  @observable income = 19;
  @observable acquisitionCost = 50;
  @observable reactivationCost = 35;

  monthlyIncomeByItem = (item) => {
    return this.userRevenueByItem(item) - (this.acquisitionCostByItem(item) + this.reactivationCostByItem(item));
  };

  reactivationCostByItem = (item) => {
    return item.reactivated * this.reactivationCost;
  };

  acquisitionCostByItem = (item) => {
    return item.monthlyNew * this.acquisitionCost;
  };

  userRevenueByItem = (item) => {
    return this.income * item.totalUsers;
  };

  totalIncomeCalculator = (data, income = null, acquisitionCost = null, reactivationCost = null) => {
    let totalIncome = 0;

    let inc = income || this.income;
    let acq = acquisitionCost || this.acquisitionCost;
    let rec = reactivationCost || this.reactivationCost;

    data.forEach((item) => {
      let acquisitionCost = item.monthlyNew * acq;
      let reactivationCost = item.reactivated * rec;
      let userRevenue = inc * item.totalUsers;
      totalIncome += userRevenue - (acquisitionCost + reactivationCost);
    });
    return totalIncome;
  };

  @computed get reactivationMonthly() {}
  @computed get activationCostMonthly() {}
  @computed get userRevenueMonthly() {
    return this.data.map(this.monthlyIncomeByItem);
  }
  @computed get revenueMonthly() {}
  @computed get totalRevenue() {}
  @computed get getIncomeData() {
    return this.data.map((item) => {
      return {
        monthlyProfit: this.monthlyIncomeByItem(item),
        acquisitionCost: this.acquisitionCostByItem(item),
        reactivationCost: this.reactivationCostByItem(item),
        totalRevenue: this.userRevenueByItem(item)
      };
    });
  }
  @computed get data() {
    return this.simulateEngagement();
  }
  @computed get totalIncome() {
    return this.totalIncomeCalculator(this.data);
  }

  @action setMonthlyNew(monthlyNew) {
    this.monthlyNew = monthlyNew;
  }

  @action setGrowthFactor(growthFactor) {
    this.growthFactor = growthFactor;
  }

  @action setMonthlyChurn(monthlyChurn) {
    this.monthlyChurn = monthlyChurn;
  }

  @action setReactivationRate(reactivationRate) {
    this.reactivationRate = reactivationRate;
  }

  @action setMonths(months) {
    this.months = months;
  }

  @action setIncome(income) {
    this.income = income;
  }

  @action setAcquisitionCost(cost) {
    this.acquisitionCost = cost;
  }

  @action setReactivationCost(cost) {
    this.reactivationCost = cost;
  }

  simulateEngagement() {
    return simulateEngagement(this.income, this.months, {
      monthlyNew: this.monthlyNew,
      growthFactor: this.growthFactor,
      monthlyChurn: this.monthlyChurn,
      reactivationRate: this.reactivationRate
    });
  }

  simulateTotalIncome({
    monthlyNew,
    acquisitionCost,
    reactivationCost,
    income,
    growthFactor,
    monthlyChurn,
    reactivationRate
  }) {
    let simulatedData = simulateEngagement(income || this.income, this.months, {
      monthlyNew: monthlyNew || this.monthlyNew,
      growthFactor: growthFactor || this.growthFactor,
      monthlyChurn: monthlyChurn || this.monthlyChurn,
      reactivationRate: reactivationRate || this.reactivationRate
    });
    let total = toInt(
      this.totalIncomeCalculator(
        simulatedData,
        income || this.income,
        acquisitionCost || this.acquisitionCost,
        reactivationCost || this.reactivationCost
      )
    );
    let diff = total - this.totalIncome;
    let percentage = roundedPercentage(diff / this.totalIncome);
    return {
      total,
      diff,
      percentage,
      percentageStr: `${(percentage * 100).toFixed(1)}%`
    };
  }
}
