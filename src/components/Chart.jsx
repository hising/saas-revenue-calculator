import { Line } from "react-chartjs-2";
import React from "react";
import { colors } from "../core/utils";
export class Chart extends React.Component {
  getLabels() {
    let index = 1;
    return this.props.data.map((data) => {
      return index++;
    });
  }

  getDataSets() {
    let datasets = {};
    this.props.data.forEach((dataPoint) => {
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
        pointHoverBorderWidth: 1,
        pointRadius: 1,
        pointHitRadius: 10,
        borderWidth: 1,
        data: datasets[dataset],
        ...colors[i]
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
