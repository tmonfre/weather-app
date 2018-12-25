import React, { Component } from 'react';
import NavBar from './NavBar.js';
import DropDownArea from './DropDownArea.js';
import WeatherContainer from './WeatherContainer.js';

class App extends Component {
    constructor(props) {
          super(props);

          // default initial: Madison, WI
          this.state = {
              cityName: "Madison",
              countryCode: "us",
              zip: 53714,
              lat: 43.0731,
              lon: 89.4012,
              dataArray: [],
              url: "",
              lastQueryType: "city-name",
              units: "imperial",
              unitsText: "°F"
          }

          // bind this to below functions
          this.fetchData = this.fetchData.bind(this);
          this.setURL = this.setURL.bind(this);
          this.setQueryState = this.setQueryState.bind(this);
          this.setCityName = this.setCityName.bind(this);
          this.setZipCode = this.setZipCode.bind(this);
          this.setLatLon = this.setLatLon.bind(this);
          this.changeUnits = this.changeUnits.bind(this);
      }

      render() {
          var lastQueryType = (this.state.lastQueryType === "zip-code") ? ("Zip Code " + this.state.zip) : this.state.cityName; // last way the user asked for data -- i.e. city or zip code field
          return (
              <div className="app">
                  <NavBar />
                  <DropDownArea updateCityName={this.setCityName} updateZipCode={this.setZipCode} updateLatLon={this.setLatLon} defaultCityName={this.state.cityName} defaultZip={this.state.zip} setQueryState={this.setQueryState} changeUnits={this.changeUnits} />
                  <WeatherContainer dataArray={this.state.dataArray} queryType={lastQueryType} unitsText={this.state.unitsText}/>
              </div>
          );
      }

      // after component mounts, construct the url and query the api
      componentDidMount() {
          this.setURL();
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
      }

      // user wants new city name -- triggers new fetch
      setCityName(name) {
          this.setState({cityName: name}, () => {
              this.setQueryState("city-name");
              this.setURL();
          });
      }

      // user wants new zip code -- triggers new fetch
      setZipCode(code) {
          this.setState({zip: code}, () => {
              this.setQueryState("zip-code");
              this.setURL();
          });
      }

      // user wants new lat-long -- triggers new fetch
      setLatLon(lat, lon) {
          this.setState({
              lat: lat,
              lon: lon
          }, () => {
              this.setQueryState("lat-lon");
              this.setURL();
          });
      }

      // make an HTTP GET request using Ajax
      fetchData(url) {
          var xmlHttp = new XMLHttpRequest();

          xmlHttp.onload = function() {
              if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                  this.setState({
                      dataArray: xmlHttp.response,
                      cityName: xmlHttp.response.city.name
                  });

                  // console.log(this.state.dataArray);
              }
          }.bind(this);

          xmlHttp.open("GET", url, true);
          xmlHttp.responseType = 'json';
          xmlHttp.send(null);
      }

      // change the temperature units we request from the api
      changeUnits(type) {
          if (type === "imperial") {
              this.setState({
                  units: "imperial",
                  unitsText: "°F"
              }, () => {
                  this.setURL();
              });
          }
          else {
              this.setState({
                  units: "metric",
                  unitsText: "°C"
              }, () => {
                  this.setURL();
              });
          }
      }
}

export default App;
