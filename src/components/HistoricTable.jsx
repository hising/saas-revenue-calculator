import {moneyFormatter} from "../core/functions";
import React from "react";

export class HistoricTable extends React.Component {
    render() {
        return (
            <div className="table-responsive">
                <table>
                    <thead>
                    <tr>
                        <th>Month</th>
                        <th>New Users</th>
                        <th className={"text-right"}>Churned</th>
                        <th className={"text-right"}>Reactivated</th>
                        <th className={"text-right"}>Active Users</th>
                        <th className={"text-right"}>Inactive Users</th>
                        <th className={"text-right"}>Profit</th>
                    </tr>
                    </thead>
                    <tbody>{this.getRows()}</tbody>
                </table>
            </div>
        );
    }

    getRows() {
        let totalRevenue = 0;
        return this.props.data.map((item, index) => {
            let reactivationCost = item.reactivated * this.props.money.reactivationCost;
            let acquisitionCost = item.monthlyNew * this.props.money.acquisitionCost;
            let userRevenue = item.totalUsers * this.props.money.monthlyRevenuePerUser;
            let monthlyRevenue = userRevenue - (acquisitionCost + reactivationCost);
            totalRevenue += monthlyRevenue;

            let reactivationInfo =
              item.reactivated > 0 ? <small><span className={"text-muted"}>Cost:</span> -{moneyFormatter(reactivationCost)}</small> : null;
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                        {item.monthlyNew}
                      <small><span className={"text-muted"}>Cost:</span> -{moneyFormatter(acquisitionCost)}</small>
                    </td>
                    <td>{item.churnedUsers * -1}</td>
                    <td>
                        {item.reactivated}
                        {reactivationInfo}
                    </td>
                    <td>
                        {item.totalUsers}
                        <small>{moneyFormatter(userRevenue)}</small>
                    </td>
                    <td>{item.totalInactive}</td>
                    <td>
                      <span className={"text-muted"}>Acc:</span> {moneyFormatter(totalRevenue)}
                      <small><span className={"text-muted"}>Monthly:</span> {moneyFormatter(monthlyRevenue)}</small>
                    </td>
                </tr>
            );
        });
    }
}
