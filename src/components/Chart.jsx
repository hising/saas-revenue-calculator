import {Line} from "react-chartjs-2";
import React from "react";

export class Chart extends React.Component {
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
