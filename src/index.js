import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';
// Require Sass file so webpack can build it
import 'bootstrap/dist/css/bootstrap.css';
import './styles/style.css';

ReactDOM.render(<App />, document.getElementById('App'));
