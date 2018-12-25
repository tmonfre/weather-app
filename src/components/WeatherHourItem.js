import React, { Component } from 'react';
import './WeatherHourItem.css';
require("datejs");

class WeatherHourItem extends Component {
    constructor(props) {
        super(props)
        this.updateStateFromProps = this.updateStateFromProps.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);

        // set expected properties in the state -- will be filled in by updateStateFromProps after initial render
        this.state = {
            date: Date.today(),
            time: "03:00",
            temp: 0,
            maxTemp: 0,
            minTemp: 0,
            weatherType: "Clear",
            weatherDescription: "clear sky"
        }
    }

    // on initial mount, calculate temps and time
    componentDidMount() {
        this.updateStateFromProps(this.props);
    }

    // if we are receiving new data, first update the state (temperatures, etc.) before rendering
    componentWillReceiveProps(nextProps) {
        this.updateStateFromProps(nextProps);
    }

    // TODO: change all of this -- will need to see data in order to know what the state should be
    // I'm thinking we won't have to loop through dataArray and we can just set the state
    updateStateFromProps(props) {
        if (props.obj !== undefined && props.obj != null) {
            // format the time in 12-hour format
            let time12;
            if (props.obj.dt_txt.substring(11,13) === "00") {
                time12 = "12AM";
            }
            else if (parseInt(props.obj.dt_txt.substring(11,13)) >= 1 && parseInt(props.obj.dt_txt.substring(11,13)) <=9) {
                time12 = props.obj.dt_txt.substring(12,13) + "AM";
            }
            else if (parseInt(props.obj.dt_txt.substring(11,13)) === 11) {
                time12 = props.obj.dt_txt.substring(11,13) + "AM";
            }
            else if (parseInt(props.obj.dt_txt.substring(11,13)) === 12) {
                time12 = props.obj.dt_txt.substring(11,13) + "PM";
            }
            else {
                time12 = (parseInt(props.obj.dt_txt.substring(11,13)) - 12).toString() + "PM";
            }
            // update the state
            this.setState({
                date: Date.parse(props.obj.dt_txt), // date object
                dayOfWeek: Date.parse(props.obj.dt_txt).toString().substring(0,3), // i.e. Mon, Tue, Wed, etc.
                time: props.obj.dt_txt.substring(11,16), // in 24-hour format
                time12: time12, // in 12-hour format
                temp: Math.round(parseInt(props.obj.main.temp)), // temperature
                maxTemp: Math.round(parseInt(props.obj.main.temp_max)),
                minTemp: Math.round(parseInt(props.obj.main.temp_min)),
                humidity: props.obj.main.humidity,
                pressure: props.obj.main.pressure,
                weatherType: props.obj.weather[0].main, // i.e. Clear, Snow, etc. -- also used to get image
                weatherDescription: props.obj.weather[0].description
            });
        }
        // if no object, set everything to error
        else {
            Object.keys(this.state.item).map(i => this.setState({ [i]: "Error"}));
        }
    }

    handleMouseEnter() {
        this.props.handleMouseEnter(this.state)
    }

    render() {
        return (
            <div className="hour-item" onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
                <p className="hour">{this.state.time12}</p>
                <img src={require("../assets/weather/active/" + this.state.weatherType + ".png")} className="weather-icon-hour" alt={this.state.weatherType}></img>
                <p className="hour-weather">{this.state.weatherType}</p>
                <p className="hour-temp">{this.state.temp + "°F"}</p>
            </div>
        );
    }
}

export default WeatherHourItem;
