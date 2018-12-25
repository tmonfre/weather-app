import React, { Component } from 'react';
import './DropDownArea.css';
import DropDownMenu from './DropDownMenu.js';

class DropDownArea extends Component {
    constructor(props) {
        super(props);
        this.handleLatLon = this.handleLatLon.bind(this);
        this.setLatLon = this.setLatLon.bind(this);
        this.handleLocationError = this.handleLocationError.bind(this);
        this.currLocRef = React.createRef();
    }
    // holding container for city name and zip code inputs
    render() {
        return (
			<div id="drop-down-area">
                <div className="drop-down-menu">
                    <p>Enter City Name</p>
                    <DropDownMenu updateFunction={this.props.updateCityName} defaultValue={this.props.defaultCityName} searchType="City Name" setQueryState={this.props.setQueryState} />
                </div>
                <div className="drop-down-menu">
                    <p>Enter Zip Code</p>
                    <DropDownMenu updateFunction={this.props.updateZipCode} defaultValue={this.props.defaultZip} searchType="Zip Code" setQueryState={this.props.setQueryState} />
                </div>
                <button id="curr-location-button" onClick={this.handleLatLon} ref={this.currLocRef}>Current Location</button>
                <div style={{clear: "both"}}></div>
			</div>
        );
    }

    // handle user request to use their current location
    handleLatLon() {
        // check if their location is available
        if (navigator.geolocation) {
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
        this.props.setQueryState("lat-lon");
        this.props.updateLatLon(position.coords.latitude, position.coords.longitude);
    }

    // if there is a problem accessing the user's current location, set the button to inactive
    handleLocationError() {
        this.currLocRef.current.innerHTML = "Cannot Access Current Location";
        this.currLocRef.current.style.backgroundColor = "#ffb3b3";
    }
}

export default DropDownArea;
