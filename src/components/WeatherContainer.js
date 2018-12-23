import React, { Component } from 'react';
import './WeatherContainer.css';
import WeatherDayItem from './WeatherDayItem.js';
import WeatherHourItem from './WeatherHourItem.js';

class WeatherContainer extends Component {
    constructor(props) {
        super(props)
        this.updateStateFromProps = this.updateStateFromProps.bind(this);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.handleDayMouseEnter = this.handleDayMouseEnter.bind(this);
        this.handleHourMouseEnter = this.handleHourMouseEnter.bind(this);
        this.handleWeatherHoverMouseClick = this.handleWeatherHoverMouseClick.bind(this);

        this.weatherHoverArea = React.createRef();

        // hold collections of WeatherDayItem and WeatherHourItem objects
        this.state = {
            weatherDayItems: [],
            weatherHourItems: [],
            weatherHover: []
        }
    }

    // on initial mount, create WeatherDayItems from dataArray prop
    componentDidMount() {
        this.updateStateFromProps(this.props);
    }

    // if we are receiving new data, first update the state (new WeatherDayItem objects) before rendering
    componentWillReceiveProps(nextProps) {
        if (this.props.dataArray !== nextProps.dataArray) {
            this.updateStateFromProps(nextProps);
        }
    }

    render() {
        return (
            <div id="weather-container">
                <h2>{"Showing Weather for " + this.props.queryType}</h2>
                <p id="helper-info">Hover over each day for more information or click for an hourly report.</p>
                <div id="weather-days-grid">{this.state.weatherDayItems}</div>
                <div id="weather-hours-grid">{this.state.weatherHourItems}</div>
                <div id="weather-hover-area" ref={this.weatherHoverArea} onClick={this.handleWeatherHoverMouseClick}>{this.state.weatherHover}</div>
            </div>
        );
    }

    // construct new WeatherDayItem objects from new dataArray prop
    updateStateFromProps(props) {
        // construct helper variables
        var date = "";
        var index = -1;
        var dateObjects = [];
        var weatherDayItems = [];

        // collect elements of the dataArray based on date -- i.e. keep all hours of the day together
        for (var obj in props.dataArray.list) {
            if (props.dataArray.list[obj].dt_txt.substring(0,10) === date) {
                dateObjects[index].push(props.dataArray.list[obj]);
            }
            else {
                date = props.dataArray.list[obj].dt_txt.substring(0,10);
                index += 1;
                dateObjects[index] = [];
                dateObjects[index].push(props.dataArray.list[obj]);
            }
        }

        // for each collection of a day, create a WeatherDayItem and pass it that collection
        for (var arr in dateObjects) {
            weatherDayItems.push(<WeatherDayItem dataArray={dateObjects[arr]} location={props.dataArray.city.name} handleClick={this.handleDayClick} handleMouseEnter={this.handleDayMouseEnter} handleMouseLeave={this.handleDayMouseLeave} key={arr} />);
        }

        // update the state with the new day items and clear out all hour items (since we have new day data)
        this.setState({
            weatherDayItems: weatherDayItems,
            weatherHourItems: []
        });
    }

    // when user clicks a weatherDayItem, add WeatherHourItem objects based on that day
    // TODO: figure out how to handle user wanting it to go away
    handleDayClick(dataArray) {
        var newArray = [];

        for (var i in dataArray) {
            newArray.push(<WeatherHourItem obj={dataArray[i]} handleMouseEnter={this.handleHourMouseEnter} handleMouseLeave={this.handleDayMouseLeave} key={i} />)
        }

        // check to see if the user clicked the same day as before
        if (this.state.weatherHourItems.length === newArray.length) {
            var match = true;
            for (var j in dataArray) {
                if (dataArray[j].dt_txt !== this.state.weatherHourItems[j].props.obj.dt_txt) {
                    match = false;
                }
            }
        }

        // if user requested same day and hours as before, don't show any hours
        if (match) {
            this.setState({
                weatherHourItems: []
            });
        }

        else {
            this.setState({
                weatherHourItems: newArray
            });
        }
    }

    handleDayMouseEnter(state) {
        var newComponents = [];

        newComponents.push(<p key={0} className="datestring">{state.date.toString().substring(0,15)}</p>)
        newComponents.push(<p key={1} >{state.weatherDescription.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')}</p>)
        newComponents.push(<p key={2}>{"High: " + state.maxTemp + "°F"}</p>)
        newComponents.push(<p key={3}>{"Low: " + state.minTemp + "°F"}</p>)
        newComponents.push(<p key={4}>{"Humidity: " + state.humidity + "%"}</p>)
        newComponents.push(<p key={5}>{"Pressure: " + state.pressure + " hPa"}</p>)

        this.weatherHoverArea.current.style.backgroundColor = "#e3e9ed";

        this.setState({
            weatherHover: newComponents
        })
    }

    handleHourMouseEnter(obj) {
        var newComponents = [];

        newComponents.push(<p key={0} className="datestring">{obj.date.toString().substring(0,15) + " " + obj.time12}</p>)
        newComponents.push(<p key={1} >{obj.weatherDescription.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')}</p>)
        newComponents.push(<p key={2}>{"High: " + obj.maxTemp + "°F"}</p>)
        newComponents.push(<p key={3}>{"Low: " + obj.minTemp + "°F"}</p>)
        newComponents.push(<p key={4}>{"Humidity: " + obj.humidity + "%"}</p>)
        newComponents.push(<p key={5}>{"Pressure: " + obj.pressure + " hPa"}</p>)

        this.weatherHoverArea.current.style.backgroundColor = "#e3e9ed";

        this.setState({
            weatherHover: newComponents
        })
    }

    handleWeatherHoverMouseClick() {
        this.weatherHoverArea.current.style.backgroundColor = "white";

        this.setState({
            weatherHover: []
        })
    }

}

export default WeatherContainer;
