import React, { Component } from 'react';
import './WeatherDayItem.css';

class WeatherDayItem extends Component {
    constructor(props) {
        super(props)
        this.updateStateFromProps = this.updateStateFromProps.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);

        // set expected properties in the state -- will be filled in by updateStateFromProps after initial render
        this.state = {
            date: "",
            dateNum: "",
            dayOfWeek: "",
            avgTemp: "",
            maxTemp: "",
            minTemp: "",
            humidity: "",
            pressure: "",
            weatherType: "Clear",
            weatherDescription: "clear sky"
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
            var sums = {
                temp: 0,
                temp_max: 0,
                temp_min: 0,
                humidity: 0,
                pressure: 0
            }
            for (var obj in props.dataArray) {
                sums.temp += props.dataArray[obj].main.temp;
                sums.temp_max += props.dataArray[obj].main.temp_max;
                sums.temp_min += props.dataArray[obj].main.temp_min;
                sums.humidity += props.dataArray[obj].main.humidity;
                sums.pressure += props.dataArray[obj].main.pressure;
            }
            this.setState({
                date: new Date(props.dataArray[0].dt_txt), // date object
                dateNum: parseInt(new Date(props.dataArray[0].dt_txt).toString().substring(8,10)), // i.e. 14 for September 14th
                dayOfWeek: new Date(props.dataArray[0].dt_txt).toString().substring(0,3), // i.e. Mon for Monday December 17th
                avgTemp: Math.round((sums.temp / props.dataArray.length)), // average temperature over the 8 given hours
                maxTemp: Math.round((sums.temp_max / props.dataArray.length)), // average high temperature over the 8 given hours
                minTemp: Math.round((sums.temp_min / props.dataArray.length)), // average low temperature over the 8 given hours
                humidity: Math.round((sums.humidity / props.dataArray.length)),
                pressure: Math.round((sums.pressure / props.dataArray.length)),
                weatherType: props.dataArray[Math.floor(props.dataArray.length / 2)].weather[0].main,
                weatherDescription: props.dataArray[Math.floor(props.dataArray.length / 2)].weather[0].description
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

    handleMouseEnter() {
        this.props.handleMouseEnter(this.state)
    }

    render() {
        return (
            <div className="day-item" onClick={this.handleClick} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
                <p className="day-of-week">{this.state.dayOfWeek + " " + this.state.dateNum.toString()}</p>
                <img src={require("../assets/weather/active/" + this.state.weatherType + ".png")} className="weather-icon-day" alt={this.state.weatherType}></img>
                <p className="day-weather">{this.state.weatherType}</p>
                <p className="temps"><span className="max-temp">{this.state.maxTemp + "°F"}</span> <span className="min-temp">{this.state.minTemp + "°F"}</span></p>
            </div>
        );
    }
}

export default WeatherDayItem;
