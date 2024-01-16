import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App';
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from './ErrorPage';
import './styles/index.css'


const logError = (error, info) => {
  console.log("Error is ", error );
  console.log("Info is ", info.componentStack );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary fallback={<ErrorPage/>} onError={logError}>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
