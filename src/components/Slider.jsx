import React from "react";

export class Slider extends React.Component {
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
