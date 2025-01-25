import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n'; // Import the i18n configuration

const Root = () => {

    return (
        <App />
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Root />);
