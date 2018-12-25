import React, { Component } from 'react';
import './WeatherContainer.css';
import WeatherDayItem from './WeatherDayItem.js';
import WeatherHourItem from './WeatherHourItem.js';
import {Line} from 'react-chartjs-2';
require("datejs");

class WeatherContainer extends Component {
    constructor(props) {
        super(props)
        this.updateStateFromProps = this.updateStateFromProps.bind(this);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.handleDayMouseEnter = this.handleDayMouseEnter.bind(this);
        this.handleHourMouseEnter = this.handleHourMouseEnter.bind(this);
        this.handleWeatherHoverMouseClick = this.handleWeatherHoverMouseClick.bind(this);

        this.weatherHoverArea = React.createRef();

        // initial expectations for objects rendered on screen
        this.state = {
            weatherDayItems: [], // react components for days
            weatherHourItems: [], // react components for hours
            weatherHover: [], // specific information about a day rendered on hover
            chartData: {
                labels: [],
                datasets: [
                    {
                        data: [],
                        label: "Forecasted Temperature",
                        borderColor: "#3e95cd",
                        fill: false
                    }
                ]
            } // used for chartjs line chart
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
                <div id="chartjs-container">
                    <Line data={this.state.chartData}/>
                </div>
            </div>
        );
    }

    // construct new WeatherDayItem objects from new dataArray prop
    updateStateFromProps(props) {
        // construct helper variables
        var date = "";
        var index = -1;
        var dateObjects = []; // group items in the dataArray based on if they are in the same day
        var weatherDayItems = []; // collection of react components
        var chartData = {
            labels: [],
            datasets: [
                {
                    data: [],
                    label: "Forecasted Temperature",
                    borderColor: "#3e95cd",
                    fill: false
                }
            ]
        } // used for chartjs line chart

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

            // add to the line chart's label if we haven't yet found this day
            if (!chartData.labels.includes(Date.parse(props.dataArray.list[obj].dt_txt).toString().substring(0,10))) {
                chartData.labels.push(Date.parse(props.dataArray.list[obj].dt_txt).toString().substring(0,10));
            }

            // add the temperature to the line chart
            chartData.datasets[0].data.push(props.dataArray.list[obj].main.temp);
        }

        // for each collection of a day, create a WeatherDayItem and pass it that collection
        for (var arr in dateObjects) {
            weatherDayItems.push(<WeatherDayItem dataArray={dateObjects[arr]} location={props.dataArray.city.name} handleClick={this.handleDayClick} handleMouseEnter={this.handleDayMouseEnter} handleMouseLeave={this.handleDayMouseLeave} key={arr} />);
        }

        // update the state with the new day items and clear out all hour items (since we have new day data)
        this.setState({
            weatherDayItems: weatherDayItems,
            weatherHourItems: [],
            chartData: chartData
        });
    }

    // when user clicks a weatherDayItem, add WeatherHourItem objects based on that day
    handleDayClick(dataArray) {
        var newArray = []; // new collection of weather hour items
        var chartData = {
            labels: [],
            datasets: [
                {
                    data: [],
                    label: "Forecasted Temperature",
                    borderColor: "#3e95cd",
                    fill: false
                }
            ]
        } // used for chartjs line chart

        // for each item in the array, add a weather hour item and add the temperature to the chart
        for (var i in dataArray) {
            newArray.push(<WeatherHourItem obj={dataArray[i]} handleMouseEnter={this.handleHourMouseEnter} handleMouseLeave={this.handleDayMouseLeave} key={i} />)

            // format the time
            var time = parseInt(Date.parse(dataArray[i].dt_txt).toString("H"));

            if (time === 0) {
                time = "12AM"
            }
            else if (time < 12) {
                time = time.toString() + "AM";
            }
            else if (time === 12) {
                time = time.toString() + "PM";
            }
            else if (time > 12) {
                time = (time - 12).toString() + "PM";
            }

            // add the time to the line chart's label and graph the temperature
            chartData.labels.push(time);
            chartData.datasets[0].data.push(dataArray[i].main.temp);
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

        // if user requested same day and hours as before, don't show any hours and refresh the chart
        if (match) {
            this.setState({
                weatherHourItems: []
            }, () => {
                this.updateStateFromProps(this.props);
            });
        }

        // otherwise, add specific day items and change chart to be hourly
        else {
            this.setState({
                weatherHourItems: newArray,
                chartData: chartData
            });
        }
    }

    // if the user hovers over a day, give specific information about the weather for that day
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

    // if the user hovers over an hour, give specific information about the weather for that hour
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

    // if the user clicks on the hover area, make it go away
    handleWeatherHoverMouseClick() {
        this.weatherHoverArea.current.style.backgroundColor = "white";

        this.setState({
            weatherHover: []
        })
    }

}

export default WeatherContainer;
