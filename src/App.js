import React, { Component } from "react";
import "./App.css";
import { moneyFormatter, simulateEngagement, toPercentage } from "./core/functions";
import { Chart } from "./components/Chart";
import { Slider } from "./components/Slider";
import { HistoricTable } from "./components/HistoricTable";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      monthlyNew: 25,
      growthFactor: 0.04,
      monthlyChurn: 0.4,
      reactivationRate: 0.2,
      months: 36,
      income: 19,
      acqusitionCost: 50,
      reactivationCost: 35
    };
    this.changeMonthlyNew = this.changeMonthlyNew.bind(this);
    this.changeGrowthFactor = this.changeGrowthFactor.bind(this);
    this.changeChurnFactor = this.changeChurnFactor.bind(this);
    this.changeReactivationRate = this.changeReactivationRate.bind(this);
    this.changeMonths = this.changeMonths.bind(this);
    this.changeIncome = this.changeIncome.bind(this);
    this.changeAcqusitionCost = this.changeAcqusitionCost.bind(this);
    this.changeReactivationCost = this.changeReactivationCost.bind(this);
  }

  render() {
    let { monthlyNew, growthFactor, monthlyChurn, reactivationRate } = this.state;
    let data = simulateEngagement(this.state.income, this.state.months, {
      monthlyNew,
      growthFactor,
      monthlyChurn,
      reactivationRate
    });
    let totalIncome = this.getTotalIncome(data);
    let percentageFormatter = val => {
      return parseInt(val * 100) + "%";
    };
    return (
      <div className="App">
        <div className="row">
          <div className="col-lg-8">
            <Chart data={data} />
            <HistoricTable
              data={data}
              money={{
                reactivationCost: this.state.reactivationCost,
                acqusitionCost: this.state.acqusitionCost,
                monthlyRevenuePerUser: this.state.income
              }}
            />
          </div>
          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Total Income after {this.state.months} months</h5>
                <p className="card-subtitle mb-2 text-muted">
                  <small>
                    ${this.state.income}/user/month - MoM Acq Growth:{" "}
                    {toPercentage(this.state.growthFactor)} - Churn-rate:{" "}
                    {toPercentage(this.state.monthlyChurn)} - Reactivation:{" "}
                    {toPercentage(this.state.reactivationRate)} - Acquisition Cost: $
                    {this.state.acqusitionCost} - Reactivation Cost: ${this.state.reactivationCost}
                  </small>
                </p>
                <h1 className={"display-3"}>{this.showMoney(totalIncome)}</h1>
                <p>
                  <small className={"text-muted"}>
                    TODO: Show what one change in either prop would do to bottom line
                  </small>
                </p>
              </div>
            </div>
            <Slider
              label={"First Month New Customers"}
              value={this.state.monthlyNew}
              onChange={this.changeMonthlyNew}
              refName={"monthlyNewRef"}
              step={5}
              min={0}
              max={100}
              info="TODO: Add possibility to start with base number"
            />
            <Slider
              label={"Monthly Growth Factor"}
              value={this.state.growthFactor}
              onChange={this.changeGrowthFactor}
              refName={"growthFactorRef"}
              step={0.01}
              min={-0.5}
              max={0.5}
              formatter={percentageFormatter}
              info="TODO: Decay over time as optional"
            />
            <Slider
              label={"Monthly Churn Rate"}
              value={this.state.monthlyChurn}
              onChange={this.changeChurnFactor}
              refName={"churnFactorRef"}
              step={0.01}
              min={0}
              max={0.5}
              formatter={percentageFormatter}
              info="TODO: Decay over time as optional"
            />

            <Slider
              label={"Reactivation Rate"}
              value={this.state.reactivationRate}
              onChange={this.changeReactivationRate}
              refName={"reactivationRateRef"}
              step={0.01}
              min={0}
              max={0.99}
              formatter={percentageFormatter}
              info="TODO: Decay or improve over time as optional"
            />

            <Slider
              label={"Months"}
              value={this.state.months}
              onChange={this.changeMonths}
              refName={"changeMonthsRef"}
              step={12}
              min={0}
              max={120}
            />

            <Slider
              label={"Monthly Income Per User"}
              value={this.state.income}
              onChange={this.changeIncome}
              refName={"changeIncomeRef"}
              step={1}
              min={1}
              max={200}
              info="TODO: Add a function to increase this over time"
            />

            <Slider
              label={"Acquisition Cost"}
              value={this.state.acqusitionCost}
              onChange={this.changeAcqusitionCost}
              refName={"changeAcqusitionCostRef"}
              step={5}
              min={0}
              max={200}
              info="TODO: Lower over time as optional"
            />

            <Slider
              label={"Reactivation Cost"}
              value={this.state.reactivationCost}
              onChange={this.changeReactivationCost}
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

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log(prevState, this.state);
  }

  changeMonthlyNew(event) {
    let val = event.target.value;
    console.log(val);
    this.setState({
      monthlyNew: parseInt(val)
    });
  }

  changeGrowthFactor(event) {
    let val = event.target.value;
    this.setState({
      growthFactor: parseFloat(val)
    });
  }

  changeChurnFactor(event) {
    let val = event.target.value;
    this.setState({
      monthlyChurn: parseFloat(val)
    });
  }

  changeReactivationRate(event) {
    let val = event.target.value;
    this.setState({
      reactivationRate: parseFloat(val)
    });
  }

  changeMonths(event) {
    let val = event.target.value;
    this.setState({
      months: parseInt(val)
    });
  }

  changeIncome(event) {
    let val = event.target.value;
    this.setState({
      income: parseInt(val)
    });
  }

  changeAcqusitionCost(event) {
    let val = event.target.value;
    this.setState({
      acqusitionCost: parseInt(val)
    });
  }

  changeReactivationCost(event) {
    let val = event.target.value;
    this.setState({
      reactivationCost: parseInt(val)
    });
  }

  showMoney(money) {
    return moneyFormatter(money);
  }

  getTotalIncome(data) {
    let totalIncome = 0;
    data.forEach(item => {
      let acquisitionCost = item.monthlyNew * this.state.acqusitionCost;
      let reactivationCost = item.reactivated * this.state.reactivationCost;
      let userRevenue = this.state.income * item.totalUsers;
      totalIncome += userRevenue - (acquisitionCost + reactivationCost);
    });
    return totalIncome;
  }
}

export default App;
