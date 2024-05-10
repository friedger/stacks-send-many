import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
// Require Sass file so webpack can build it
import 'bootstrap/dist/css/bootstrap.css';
import './styles/style.css';
import './styles/floating-label.css';

const container = document.getElementById('App')!;
const root = createRoot(container);
root.render(<App />);
