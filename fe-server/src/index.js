import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './language/i18n'; // Import the i18n configuration
import { DarkModeProvider } from './context/DarkModeContext';

const Root = () => {

    return (
        <DarkModeProvider>
            <App />
        </DarkModeProvider>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Root />);
