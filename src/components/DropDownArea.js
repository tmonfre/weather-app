import React, { Component } from 'react';
import './DropDownArea.css';
import DropDownMenu from './DropDownMenu.js';

class DropDownArea extends Component {
    constructor(props) {
        super(props);
        this.handleLatLon = this.handleLatLon.bind(this);
        this.setLatLon = this.setLatLon.bind(this);
        this.handleLocationError = this.handleLocationError.bind(this);
        this.setImperial = this.setImperial.bind(this);
        this.setMetric = this.setMetric.bind(this);

        this.cityNameRef = React.createRef();
        this.zipCodeRef = React.createRef();
        this.currLocRef = React.createRef();
        this.imperial = React.createRef();
        this.metric = React.createRef();
    }
    // holding container for city name and zip code inputs
    render() {
        return (
			<div id="drop-down-area">
                <div className="drop-down-menu">
                    <p>Enter City Name</p>
                    <DropDownMenu updateFunction={this.props.updateCityName} defaultValue={this.props.defaultCityName} searchType="City Name" setQueryState={this.props.setQueryState} ref={this.cityNameRef}/>
                </div>
                <div className="drop-down-menu">
                    <p>Enter Zip Code</p>
                    <DropDownMenu updateFunction={this.props.updateZipCode} defaultValue={this.props.defaultZip} searchType="Zip Code" setQueryState={this.props.setQueryState} ref={this.zipCodeRef}/>
                </div>
                <button id="curr-location-button" onClick={this.handleLatLon} ref={this.currLocRef}>Current Location</button>
                <div id="units-area">
                    <h3><span id="imperial" onClick={this.setImperial} ref={this.imperial}>°F</span> <span id="metric" onClick={this.setMetric} ref={this.metric}>°C</span></h3>
                </div>
                <div style={{clear: "both"}}></div>
			</div>
        );
    }

    // handle user request to use their current location
    handleLatLon() {
        // check if their location is available
        if (navigator.geolocation) {
            this.currLocRef.current.innerHTML = "Finding Current Location...";
            this.currLocRef.current.style.backgroundColor = "#3e95cd";
            // request the user's current location -- if successful set the current latitude and longitude, if unsuccessful make the button inactive
            navigator.geolocation.getCurrentPosition(this.setLatLon, this.handleLocationError);
        }
        // if no available location, set button to inactive
        else {
            this.handleLocationError();
        }
    }

    // tell the App component that we are intending to query by latitude and longitude then update the latitude and longitude
    setLatLon(position) {
        this.currLocRef.current.innerHTML = "Current Location";
        this.currLocRef.current.style.backgroundColor = "#f1f1f1";
        this.props.setQueryState("lat-lon");
        this.props.updateLatLon(position.coords.latitude, position.coords.longitude);
    }

    // if there is a problem accessing the user's current location, set the button to inactive
    handleLocationError() {
        this.currLocRef.current.innerHTML = "Cannot Access Current Location";
        this.currLocRef.current.style.backgroundColor = "#ffb3b3";
    }

    // use imperial temperature units (F)
    setImperial() {
        this.imperial.current.style.fontWeight = "bold";
        this.metric.current.style.fontWeight = "normal";
        this.imperial.current.style.color = "#3e95cd";
        this.metric.current.style.color = "black";
        this.props.changeUnits("imperial")
        // SET COOKIE HERE
    }

    // use metric temperature units (C)
    setMetric() {
        this.imperial.current.style.fontWeight = "normal";
        this.metric.current.style.fontWeight = "bold";
        this.imperial.current.style.color = "black";
        this.metric.current.style.color = "#3e95cd";
        this.props.changeUnits("metric")
        // SET COOKIE HERE
    }

    // set the text of the input field
    setCityNameText(val) {
        this.cityNameRef.current.setValue(val);
    }

    // set the text of the zip code field
    setZipCodeText(val) {
        this.zipCodeRef.current.setValue(val);
    }
}

export default DropDownArea;
