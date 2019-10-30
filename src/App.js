import React, { Component } from "react";
import "./App.css";
import { Line } from "react-chartjs-2";

function toPercentage(number, precision = 0) {
  return `${number * 100}%`;
}

function simulateEngagement(monthlyIncomePerUser = 9, months = 36, userOptions = {}) {
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
}

class Chart extends Component {
  colors = [
    {
      backgroundColor: "rgba(75,192,192,0.4)",
      borderColor: "rgba(75,192,192,1)",
      pointBorderColor: "rgba(75,192,192,1)",
      pointHoverBackgroundColor: "rgba(75,192,192,1)",
      pointHoverBorderColor: "rgba(220,220,220,1)"
    },
    {
      backgroundColor: "rgba(44,105,167,0.4)",
      borderColor: "rgba(44,105,167,1)",
      pointBorderColor: "rgba(44,105,167,1)",
      pointHoverBackgroundColor: "rgba(44,105,167,1)",
      pointHoverBorderColor: "rgba(220,220,220,1)"
    },
    {
      backgroundColor: "rgba(172,44,89,0.4)",
      borderColor: "rgba(172,44,89,1)",
      pointBorderColor: "rgba(172,44,89,1)",
      pointHoverBackgroundColor: "rgba(172,44,89,1)",
      pointHoverBorderColor: "rgba(220,220,220,1)"
    },
    {
      backgroundColor: "rgba(172,101,192,0.4)",
      borderColor: "rgba(172,101,192,1)",
      pointBorderColor: "rgba(172,101,192,1)",
      pointHoverBackgroundColor: "rgba(172,101,192,1)",
      pointHoverBorderColor: "rgba(220,220,220,1)"
    }
  ];

  getLabels() {
    let index = 1;
    return this.props.data.map(data => {
      return index++;
    });
  }

  getDataSets() {
    let datasets = {};
    this.props.data.forEach(dataPoint => {
      for (let dataType in dataPoint) {
        if (!datasets.hasOwnProperty(dataType)) {
          datasets[dataType] = [];
        }
        datasets[dataType].push(dataPoint[dataType]);
      }
    });

    let data = [];
    let i = 0;
    for (let dataset in datasets) {
      data.push({
        label: dataset,
        fill: false,
        lineTension: 0.1,
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: datasets[dataset],
        ...this.colors[i]
      });
      i++;
    }
    return data;
  }

  render() {
    const data = {
      labels: this.getLabels(),
      datasets: this.getDataSets()
    };
    return (
      <div className={"chart"}>
        <Line data={data} />
      </div>
    );
  }
}

class Slider extends Component {
  render() {
    let value = this.props.formatter ? this.props.formatter(this.props.value) : this.props.value;
    let slideInfo = this.props.info ? <p className="slideinfo">{this.props.info}</p> : null;
    return (
      <div className="slidecontainer">
        <label htmlFor={this.props.refName}>{this.props.label}</label>
        <input
          type="range"
          min={this.props.min}
          max={this.props.max}
          onChange={this.props.onChange}
          value={this.props.value}
          step={this.props.step}
          className="slider"
          ref={this.props.refName}
        />
        <span>{value}</span>
        {slideInfo}
      </div>
    );
  }
}

class HistoricTable extends Component {
  render() {
    return (
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>New Users</th>
            <th>Churned</th>
            <th>Reactivated</th>
            <th>Active Users</th>
            <th>Inactive Users</th>
            <th>Income</th>
          </tr>
        </thead>
        <tbody>{this.getRows()}</tbody>
      </table>
    );
  }

  getRows() {
    let totalRevenue = 0;
    return this.props.data.map((item, index) => {
      let reactivationCost = item.reactivated * this.props.money.reactivationCost;
      let acquisitionCost = item.monthlyNew * this.props.money.acqusitionCost;
      let userRevenue = item.totalUsers * this.props.money.monthlyRevenuePerUser;
      let monthlyRevenue = userRevenue - (acquisitionCost + reactivationCost);
      totalRevenue += monthlyRevenue;

      let reactivationInfo =
        item.reactivated > 0 ? <small>-${moneyFormatter(reactivationCost)}</small> : null;
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>
            {item.monthlyNew}
            <small>-${moneyFormatter(acquisitionCost)} / month</small>
          </td>
          <td>{item.churnedUsers * -1}</td>
          <td>
            {item.reactivated}
            {reactivationInfo}
          </td>
          <td>
            {item.totalUsers}
            <small>${moneyFormatter(userRevenue)}</small>
          </td>
          <td>{item.totalInactive}</td>
          <td>
            <span className={"text-muted"}>&Sigma;</span>
            {moneyFormatter(totalRevenue)}
            <small>${moneyFormatter(monthlyRevenue)}</small>
          </td>
        </tr>
      );
    });
  }
}

function moneyFormatter(money) {
  return money.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
}

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
    let data = simulateEngagement(this.state.income, this.state.months, {
      monthlyNew: this.state.monthlyNew,
      growthFactor: this.state.growthFactor,
      monthlyChurn: this.state.monthlyChurn,
      reactivationRate: this.state.reactivationRate
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
