import React, { Component } from 'react';
import NavBar from './NavBar.js';
import DropDownArea from './DropDownArea.js';
import WeatherContainer from './WeatherContainer.js';

class App extends Component {
    constructor(props) {
          super(props);

          // determine initial state variables based on cookies
          // default without cookies: Madison, WI
          var cityName = (this.getCookie("cityName") !== null) ? this.getCookie("cityName") : "Madison";
          var countryCode = (this.getCookie("countryCode") !== null) ? this.getCookie("countryCode") : "us";
          var zip = (this.getCookie("zip") !== null) ? this.getCookie("zip") : "53706";
          var lat = (this.getCookie("lat") !== null) ? parseFloat(this.getCookie("lat")) : 43.0731;
          var lon = (this.getCookie("lon") !== null) ? parseFloat(this.getCookie("lon")) : 89.4012;
          var lastQueryType = (this.getCookie("lastQueryType") !== null) ? this.getCookie("lastQueryType") : "city-name";
          var units = (this.getCookie("units") !== null) ? this.getCookie("units") : "imperial";
          var unitsText = (this.getCookie("unitsText") !== null) ? this.getCookie("unitsText") : "°F";

          // initialize state
          this.state = {
              cityName: cityName,
              countryCode: countryCode,
              zip: zip,
              lat: lat,
              lon: lon,
              dataArray: [],
              url: "",
              lastQueryType: lastQueryType,
              units: units,
              unitsText: unitsText
          }

          // bind this to below functions
          this.fetchData = this.fetchData.bind(this);
          this.setURL = this.setURL.bind(this);
          this.setQueryState = this.setQueryState.bind(this);
          this.setCityName = this.setCityName.bind(this);
          this.setZipCode = this.setZipCode.bind(this);
          this.setLatLon = this.setLatLon.bind(this);
          this.changeUnits = this.changeUnits.bind(this);

          // set references
          this.dropDownAreaRef = React.createRef();
          this.weatherContainerRef = React.createRef();

          // set cookies
          this.setCookie("cityName", this.state.cityName, 365);
          this.setCookie("countryCode", this.state.countryCode, 365);
          this.setCookie("zip", this.state.zip, 365);
          this.setCookie("lat", this.state.lat, 365);
          this.setCookie("lon", this.state.lon, 365);
          this.setCookie("lastQueryType", this.state.lastQueryType, 365);
          this.setCookie("units", this.state.units, 365);
          this.setCookie("unitsText", this.state.unitsText, 365);
      }

      render() {
          return (
              <div className="app">
                  <NavBar />
                  <DropDownArea updateCityName={this.setCityName} updateZipCode={this.setZipCode} updateLatLon={this.setLatLon} defaultCityName={this.state.cityName} defaultZip={this.state.zip} setQueryState={this.setQueryState} changeUnits={this.changeUnits} ref={this.dropDownAreaRef}/>
                  <WeatherContainer dataArray={this.state.dataArray} cityName={this.state.cityName} unitsText={this.state.unitsText} ref={this.weatherContainerRef} />
              </div>
          );
      }

      // after component mounts, construct the url and query the api
      componentDidMount() {
          // set styling
          this.setURL();
          document.getElementById(this.state.units).style.color = "#3e95cd";
      }

      // update the api url and call fetchData
      setURL() {
          var url = "https://api.openweathermap.org/data/2.5/forecast?";

          // change api parameters based on if user entered city name, zip code, or latitude/longitude
          if (this.state.lastQueryType === "city-name") {
              url += "q=" + this.state.cityName + "," + this.state.countryCode;
          }
          else if (this.state.lastQueryType === "zip-code") {
              url += "zip=" + this.state.zip + "," + this.state.countryCode;
          }
          else if (this.state.lastQueryType === "lat-lon") {
              url += "lat=" + this.state.lat + "&lon=" + this.state.lon;
          }

          // add api key and update the state
          url += "&APPID=" + this.props.api_key + "&units=" + this.state.units;
          this.setState({url: url}, () => {this.fetchData(this.state.url);}); // calls fetchData after state is set
      }

      // update the way we are calling the api -- i.e. city name, zip code, or lat-long
      setQueryState(queryMethod) {
          this.setState({lastQueryType: queryMethod});
          this.setCookie("lastQueryType", queryMethod, 365);
      }

      // user wants new city name -- triggers new fetch
      setCityName(name) {
          this.setState({
              cityName: name,
              zip: ""
          }, () => {
              this.setQueryState("city-name");
              this.setURL();
              this.setCookie("cityName", name, 365);
              this.setCookie("zip", "", 365);
              this.dropDownAreaRef.current.setCityNameText(name); // change the text in the input field (safe guard for if request comes from current location)
              this.dropDownAreaRef.current.setZipCodeText(""); // clear zip code field since we no longer know the zip code field
          });
      }

      // user wants new zip code -- triggers new fetch
      setZipCode(code) {
          this.setState({
              zip: code.toString()
          }, () => {
              this.setQueryState("zip-code");
              this.setURL();
              this.setCookie("zip", code, 365);
              this.dropDownAreaRef.current.setZipCodeText(code); // change the text in the input field (safe guard for if request comes from current location)
          });
      }

      // user wants new lat-long -- triggers new fetch
      setLatLon(lat, lon) {
          this.setState({
              lat: lat,
              lon: lon,
              zip: ""
          }, () => {
              this.setQueryState("lat-lon");
              this.setURL();
              this.setCookie("lat", lat, 365);
              this.setCookie("lon", lon, 365);
              this.setCookie("zip", "", 365);
              this.dropDownAreaRef.current.setZipCodeText(""); // clear zip code field since we no longer know the zip code field
          });
      }

      // change the temperature units we request from the api
      changeUnits(type) {
          if (type === "imperial") {
              this.setState({
                  units: "imperial",
                  unitsText: "°F"
              }, () => {
                  this.setURL();
                  this.setCookie("units", "imperial", 365);
                  this.setCookie("unitsText", "°F", 365);
              });
          }
          else {
              this.setState({
                  units: "metric",
                  unitsText: "°C"
              }, () => {
                  this.setURL();
                  this.setCookie("units", "metric", 365);
                  this.setCookie("unitsText", "°C", 365);
              });
          }
      }

      // make an HTTP GET request using Ajax
      fetchData(url) {
          var xmlHttp = new XMLHttpRequest();

          xmlHttp.onload = function() {
              // if the request was successful hold onto the data and update the input field text
              if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                  this.setState({
                      dataArray: xmlHttp.response,
                      cityName: xmlHttp.response.city.name
                  }, () => {
                      this.dropDownAreaRef.current.setCityNameText(xmlHttp.response.city.name);
                      this.weatherContainerRef.current.handleWeatherHoverMouseClick(); // hide the hover area
                  });
              }
              // if the request failed, clear the data and notify the user
              else {
                  this.setState({
                      dataArray: []
                  }, () => {
                      // change the "Showing Weather For" field to failed
                      if (this.state.lastQueryType === "city-name") {
                          this.weatherContainerRef.current.handleAPIFailure(this.state.cityName);
                      }
                      else if (this.state.lastQueryType === "zip-code") {
                          this.weatherContainerRef.current.handleAPIFailure("Zip Code " + this.state.zip);
                      }
                      else if (this.state.lastQueryType === "lat-lon") {
                          this.weatherContainerRef.current.handleAPIFailure("Current Location");
                      }
                      else {
                          this.weatherContainerRef.current.handleAPIFailure(this.state.cityName);
                      }

                      // hide the graph if it is visible
                      if (this.weatherContainerRef.current.state.chartActive) {
                          this.weatherContainerRef.current.toggleGraph();
                      }

                      // hide the hover area
                      this.weatherContainerRef.current.handleWeatherHoverMouseClick();
                  });
              }
          }.bind(this);

          xmlHttp.open("GET", url, true);
          xmlHttp.responseType = 'json';
          xmlHttp.send(null);
      }

      // source: https://www.w3schools.com/js/js_cookies.asp
      setCookie(cname, cvalue, exdays) {
          var d = new Date();
          d.setTime(d.getTime() + (exdays*24*60*60*1000));
          var expires = "expires="+ d.toUTCString();
          document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
      }

      // source: https://www.w3schools.com/js/js_cookies.asp
      getCookie(cname) {
          var name = cname + "=";
          var decodedCookie = decodeURIComponent(document.cookie);
          var ca = decodedCookie.split(';');
          for(var i = 0; i <ca.length; i++) {
              var c = ca[i];
              while (c.charAt(0) === ' ') {
                  c = c.substring(1);
              }
              if (c.indexOf(name) === 0) {
                  return c.substring(name.length, c.length);
              }
          }
          return null;
      }
}

export default App;
