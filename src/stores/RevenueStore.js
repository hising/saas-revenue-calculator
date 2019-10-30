import { action, computed, observable } from "mobx";
import { simulateEngagement } from "../core/functions";

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

  @computed get reactivationMonthly() {}
  @computed get activationCostMonthly() {}
  @computed get userRevenueMonthly() {}
  @computed get revenueMonthly() {}
  @computed get totalRevenue() {}
  @computed get data() {
    return this.simulateEngagement();
  }
  @computed get totalIncome() {
    let totalIncome = 0;
    this.data.forEach((item) => {
      let acquisitionCost = item.monthlyNew * this.acquisitionCost;
      let reactivationCost = item.reactivated * this.reactivationCost;
      let userRevenue = this.income * item.totalUsers;
      totalIncome += userRevenue - (acquisitionCost + reactivationCost);
    });
    return totalIncome;
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
}
