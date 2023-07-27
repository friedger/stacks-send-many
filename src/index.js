import React from 'react';
import App from './App.js';
import {createRoot} from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/style.css';
import './styles/floating-label.css';
import './styles/fonts.css';

const root = createRoot(document.getElementById("App"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);