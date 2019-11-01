import React, { Component } from "react";
import "./App.css";
import { moneyFormatter, toFloat, toInt, toPercentage } from "./core/functions";
import { Chart } from "./components/Chart";
import { Slider } from "./components/Slider";
import { HistoricTable } from "./components/HistoricTable";
import { RevenueStore } from "./stores/RevenueStore";
import { observer } from "mobx-react";
import { Tabs } from "./components/Tabs";
import { Changes } from "./components/Changes";
import ReactGA from "react-ga";
import { Header } from "./components/Header";

const revenueStore = new RevenueStore();

@observer
class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      active: "users"
    };
  }

  componentDidMount() {
    ReactGA.pageview(window.location.pathname);
  }

  render() {
    let percentageFormatter = (val) => {
      return toInt(val * 100) + "%";
    };

    let monthlies = revenueStore.simulateTotalIncome({ monthlyNew: revenueStore.monthlyNew * 1.05 });
    let growhties = revenueStore.simulateTotalIncome({
      growthFactor: revenueStore.growthFactor * 1.01
    });
    let churnies = revenueStore.simulateTotalIncome({
      monthlyChurn: revenueStore.monthlyChurn * 0.99
    });
    let recRaties = revenueStore.simulateTotalIncome({
      reactivationRate: revenueStore.reactivationRate * 1.01
    });
    let incomies = revenueStore.simulateTotalIncome({
      income: revenueStore.income * 1.01
    });
    let acquies = revenueStore.simulateTotalIncome({
      acquisitionCost: revenueStore.acquisitionCost * 0.99
    });
    let reccies = revenueStore.simulateTotalIncome({
      reactivationCost: revenueStore.reactivationCost * 0.99
    });
    return (
      <div className="App">
        <Header>
          SaaS Revenue Calculator by Yetric AB
          <a
            href={"#share"}
            onClick={(event) => {
              event.preventDefault();
              alert("not done yet, copy the url and share!");
            }}
            className={"action"}>
            Share this Chart!
          </a>
        </Header>
        <div className="main-content">
          <h1 className={"h2"}>
            SaaS Revenue Calculator <small className={"text-muted"}>by Yetric AB</small>
          </h1>
          <h2 className={"h5 mb-3"}>
            <small className={"text-muted"}>How will different metrics effect your bottom line?</small>
          </h2>
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

                  <p>Months to break even: {revenueStore.getBreakEvenInMonth}</p>
                  <h6>What would happen if we would...</h6>
                  <dl className={"total-insights"}>
                    <dt>Increase nr of new users with 5%</dt>
                    <dd>
                      <Changes data={monthlies} />
                    </dd>

                    <dt>Increase growth factor with 1%</dt>
                    <dd>
                      <Changes data={growhties} />
                    </dd>

                    <dt>Reduce churn rate with 1%</dt>
                    <dd>
                      <Changes data={churnies} />
                    </dd>

                    <dt>Increase reactivation rate with 1%</dt>
                    <dd>
                      <Changes data={recRaties} />
                    </dd>

                    <dt>Increase income per user with 1%</dt>
                    <dd>
                      <Changes data={incomies} />
                    </dd>

                    <dt>Reduce acquisition cost with 1%</dt>
                    <dd>
                      <Changes data={acquies} />
                    </dd>

                    <dt>Reduce reactivation cost with 1%</dt>
                    <dd>
                      <Changes data={reccies} />
                    </dd>
                  </dl>
                </div>
              </div>
              <Slider
                label={"How many customers do you have?"}
                value={revenueStore.startWithCustomers}
                onChange={(event) => {
                  revenueStore.setStartWithCustomers(toInt(event.target.value));
                }}
                refName={"monthlyNewRef"}
                step={1}
                min={0}
                max={1000}
              />
              <Slider
                label={"New customers per month"}
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
