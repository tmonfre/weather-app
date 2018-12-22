import React, { Component } from 'react';
import './DropDownArea.css';
import DropDownMenu from './DropDownMenu.js';

class DropDownArea extends Component {
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
                <div style={{clear: "both"}}></div>
			</div>
        );
    }
}

export default DropDownArea;
