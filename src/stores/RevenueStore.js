import { computed, observable } from "mobx";

export class RevenueStore {
  @observable monthly = [];
  @observable monthlyNew = 25;
  @observable growthFactor = 0.04;
  @observable monthlyChurn = 0.4;
  @observable reactivationRate = 0.2;
  @observable months = 36;
  @observable income = 19;
  @observable acqusitionCost = 50;
  @observable reactivationCost = 35;

  @computed get reactivationMonthly() {}
  @computed get activationCostMonthly() {}
  @computed get userRevenueMonthly() {}
  @computed get revenueMonthly() {}
  @computed get totalRevenue() {}
}
