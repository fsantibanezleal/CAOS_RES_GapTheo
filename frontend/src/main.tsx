import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fasl-work/caos-app-shell/styles.css';
import './styles.css';
import App from './App';

const redirect = new URLSearchParams(window.location.search).get('redirect');
if (redirect) {
  window.history.replaceState(null, '', decodeURIComponent(redirect));
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
