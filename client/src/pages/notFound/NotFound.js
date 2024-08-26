// src/pages/NotFound.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css'; // Import your CSS file for styling

const NotFound = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1); // This will navigate to the previous page
    };

    return (
        <div className="not-found-container">
            <h1>404</h1>
            <p>Page Not Found</p>
            <button onClick={goBack} className="back-previous">
                Go Back to Previous Page
            </button>
        </div>
    );
};

export default NotFound;
