import React, { Component } from 'react';
import './WeatherDayItem.css';

class WeatherDayItem extends Component {
    constructor(props) {
        super(props)
        this.updateStateFromProps = this.updateStateFromProps.bind(this);
        this.handleClick = this.handleClick.bind(this);

        // set expected properties in the state -- will be filled in by updateStateFromProps after initial render
        this.state = {
            date: "",
            dateNum: "",
            dayOfWeek: "",
            avgTemp: "",
            maxTemp: "",
            minTemp: "",
            weatherType: "Clear",
            weatherIcon: ""
        }
    }

    // on initial mount, calculate temps and day name
    componentDidMount() {
        this.updateStateFromProps(this.props);
    }

    // if we are receiving new data, first update the state (temperatures, etc.) before rendering
    componentWillReceiveProps(nextProps) {
        this.updateStateFromProps(nextProps);
    }

    // calculate temperatures and weather data from new data and store in state
    updateStateFromProps(props) {
        // make sure we aren't getting a dummy call -- handle bad request
        if (props.dataArray.length > 0) {
            // sum temp, temp_max, and temp_min -- will use for constructing averages
            var sums = [0,0,0];
            for (var obj in props.dataArray) {
                sums[0] += props.dataArray[obj].main.temp;
                sums[1] += props.dataArray[obj].main.temp_max;
                sums[2] += props.dataArray[obj].main.temp_min;
            }
            this.setState({
                date: new Date(props.dataArray[0].dt_txt.substring(0,10)), // date object
                dateNum: parseInt(props.dataArray[0].dt_txt.substring(8,11)), // i.e. 14 for September 14th
                dayOfWeek: (new Date(props.dataArray[0].dt_txt.substring(0,10))).toString().substring(0,3), // i.e. Mon for Monday December 17th
                avgTemp: Math.round((sums[0] / props.dataArray.length)), // average temperature over the 8 given hours
                maxTemp: Math.round((sums[1] / props.dataArray.length)), // average high temperature over the 8 given hours
                minTemp: Math.round((sums[2] / props.dataArray.length)), // average low temperature over the 8 given hours
                weatherType: props.dataArray[Math.floor(props.dataArray.length / 2)].weather[0].main
            });
        }
        // if there was a bad request or dummy data, set each value of the state to "Error"
        else {
            Object.keys(this.state.item).map(i => this.setState({ [i]: "Error"}));
        }
    }

    // if user clicks on the day, call the passed callback function
    handleClick() {
        this.props.handleClick(this.props.dataArray);
    }

    render() {
        return (
            <div className="day-item" onClick={this.handleClick}>
                <p className="day-of-week">{this.state.dayOfWeek + " " + this.state.dateNum.toString()}</p>
                <img src={require("../assets/weather/active/" + this.state.weatherType + ".png")} className="weather-icon-day" alt={this.state.weatherType}></img>
                <p className="day-weather">{this.state.weatherType}</p>
                <p className="temps"><span className="max-temp">{this.state.maxTemp + "°F"}</span> <span className="min-temp">{this.state.minTemp + "°F"}</span></p>
            </div>
        );
    }
}

export default WeatherDayItem;
