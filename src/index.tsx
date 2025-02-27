import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VerifyEmail from './component/verifyEmail'; // Your component to handle verification
import ReferalLoginPage from './component/referalLogin'; // Your component to handle verification



import './index.css';
import App from './App';

// Polyfill for Buffer and process
import { Buffer } from 'buffer';
import process from 'process';
import { Provider } from './GameContextProvider';

global.Buffer = Buffer;
global.process = process;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  
  <React.StrictMode>
    <Router> 
      <Provider>
          <Routes> {/* Add Routes */}
          <Route path="/verify" element={<VerifyEmail />} />
          <Route path="/referalLogin" element={<ReferalLoginPage />} />
          <Route path="/*" element={<App />} />
         
        </Routes>       
      </Provider>
    </Router>
  </React.StrictMode>         
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
