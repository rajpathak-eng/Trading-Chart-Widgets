import 'react-app-polyfill/ie11'; // For IE 11 support (if needed)
import 'react-app-polyfill/stable'; // For other modern JavaScript features

import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
