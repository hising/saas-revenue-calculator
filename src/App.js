import React, { Component } from "react";
import "./App.css";
import { moneyFormatter, toFloat, toInt, toPercentage } from "./core/functions";
import { Chart } from "./components/Chart";
import { Slider } from "./components/Slider";
import { HistoricTable } from "./components/HistoricTable";
import { RevenueStore } from "./stores/RevenueStore";
import { observer } from "mobx-react";
import { Tabs } from "./components/Tabs";

const revenueStore = new RevenueStore();

@observer
class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      active: "users"
    };
  }

  render() {
    let percentageFormatter = (val) => {
      return toInt(val * 100) + "%";
    };
    return (
      <div className="App">
        <div className="row">
          <div className="col-lg-8">
            <Tabs
              items={[{ key: "users", label: "Users" }, { key: "income", label: "Income" }]}
              onChange={(key) => {
                this.setState({
                  active: key
                });
              }}
              active={this.state.active}
            />
            <div className={this.state.active === "users" ? "tab-show" : "tab-hidden"}>
              <Chart data={revenueStore.data} />
            </div>
            <div className={this.state.active === "income" ? "tab-show" : "tab-hidden"}>
              <Chart data={revenueStore.getIncomeData} />
            </div>
            <HistoricTable
              data={revenueStore.data}
              money={{
                reactivationCost: revenueStore.reactivationCost,
                acquisitionCost: revenueStore.acquisitionCost,
                monthlyRevenuePerUser: revenueStore.income
              }}
            />
          </div>
          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Total Income after {revenueStore.months} months</h5>
                <p className="card-subtitle mb-2 text-muted">
                  <small>
                    ${revenueStore.income}/user/month - MoM Acq Growth: {toPercentage(revenueStore.growthFactor)} -
                    Churn-rate: {toPercentage(revenueStore.monthlyChurn)} - Reactivation:{" "}
                    {toPercentage(revenueStore.reactivationRate)} - Acquisition Cost: ${revenueStore.acqusitionCost} -
                    Reactivation Cost: ${revenueStore.reactivationCost}
                  </small>
                </p>
                <p className={"total-income"}>{this.showMoney(revenueStore.totalIncome, 0)}</p>
                <p>
                  <small className={"text-muted"}>
                    TODO: Show what one change in either prop would do to bottom line
                  </small>
                </p>
              </div>
            </div>
            <Slider
              label={"First Month New Customers"}
              value={revenueStore.monthlyNew}
              onChange={(event) => {
                revenueStore.setMonthlyNew(toInt(event.target.value));
              }}
              refName={"monthlyNewRef"}
              step={5}
              min={0}
              max={100}
              info="TODO: Add possibility to start with base number"
            />
            <Slider
              label={"Monthly Growth Factor"}
              value={revenueStore.growthFactor}
              onChange={(event) => {
                revenueStore.setGrowthFactor(toFloat(event.target.value));
              }}
              refName={"growthFactorRef"}
              step={0.01}
              min={-0.5}
              max={0.5}
              formatter={percentageFormatter}
              info="TODO: Decay over time as optional"
            />
            <Slider
              label={"Monthly Churn Rate"}
              value={revenueStore.monthlyChurn}
              onChange={(event) => {
                revenueStore.setMonthlyChurn(toFloat(event.target.value));
              }}
              refName={"churnFactorRef"}
              step={0.01}
              min={0}
              max={0.5}
              formatter={percentageFormatter}
              info="TODO: Decay over time as optional"
            />

            <Slider
              label={"Reactivation Rate"}
              value={revenueStore.reactivationRate}
              onChange={(event) => {
                revenueStore.setReactivationRate(toFloat(event.target.value));
              }}
              refName={"reactivationRateRef"}
              step={0.01}
              min={0}
              max={0.99}
              formatter={percentageFormatter}
              info="TODO: Decay or improve over time as optional"
            />

            <Slider
              label={"Months"}
              value={revenueStore.months}
              onChange={(event) => {
                revenueStore.setMonths(toInt(event.target.value));
              }}
              refName={"changeMonthsRef"}
              step={12}
              min={0}
              max={120}
            />

            <Slider
              label={"Monthly Income Per User"}
              value={revenueStore.income}
              onChange={(event) => {
                revenueStore.setIncome(toInt(event.target.value));
              }}
              refName={"changeIncomeRef"}
              step={1}
              min={1}
              max={200}
              info="TODO: Add a function to increase this over time"
            />

            <Slider
              label={"Acquisition Cost"}
              value={revenueStore.acquisitionCost}
              onChange={(event) => {
                revenueStore.setAcquisitionCost(toInt(event.target.value));
              }}
              refName={"changeAcqusitionCostRef"}
              step={5}
              min={0}
              max={200}
              info="TODO: Lower over time as optional"
            />

            <Slider
              label={"Reactivation Cost"}
              value={revenueStore.reactivationCost}
              onChange={(event) => {
                revenueStore.setReactivationCost(toInt(event.target.value));
              }}
              refName={"changeReactivationCostRef"}
              step={5}
              min={0}
              max={200}
              info="TODO: Lower over time as optional"
            />
          </div>
        </div>
        <div className={"mt-3 mb-3 text-center text-muted"}>
          Built by <a href={"https://yetric.com"}>Yetric AB</a>
        </div>
      </div>
    );
  }

  showMoney(money, digits = 2) {
    return moneyFormatter(money, digits);
  }
}

export default App;
