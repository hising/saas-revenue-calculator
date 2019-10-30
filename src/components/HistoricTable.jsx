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
                        <th>Churned</th>
                        <th>Reactivated</th>
                        <th>Active Users</th>
                        <th>Inactive Users</th>
                        <th>Income</th>
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
