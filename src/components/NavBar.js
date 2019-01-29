import React, { Component } from 'react';
import './NavBar.css';

class NavBar extends Component {
    // simple navbar with title and links
    render() {
        return (
			<div id="navbar-container">
                <div id="title-area">
                    <a href="index.html"><h1>Local Weather Forecast</h1></a>
                </div>
                <div id="button-area">
                    <a href="http://tmonfre.surge.sh" target="_blank" rel="noopener noreferrer"><h3 id="reset-button">ABOUT ME</h3></a>
                    <a href="https://github.com/tmonfre" target="_blank" rel="noopener noreferrer"><img src={require("../assets/github.svg")} alt="GitHub logo"></img></a>
                    <a href="https://www.linkedin.com/in/thomas-monfre/" target="_blank" rel="noopener noreferrer"><img src={require("../assets/linkedin.png")} alt="LinkedIn logo"></img></a>
                </div>
                <div style={{clear: "both"}}></div>
			</div>
        );
    }
}

export default NavBar;
