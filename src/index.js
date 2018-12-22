import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';

// this file performs an HTTP GET request and passes the loaded data to the App component using ReactJS
const API_KEY = "bb70572a70f792c2983109cb5339ef07";
ReactDOM.render(<App api_key={API_KEY} />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
