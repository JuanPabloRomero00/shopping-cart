import React from 'react';

const Loader = ({ message = 'Loading...', size = 'medium' }) => {
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'loader-small';
      case 'large':
        return 'loader-large';
      default:
        return 'loader-medium';
    }
  };

  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <div className={`loader-spinner ${getSizeClass()}`}>
          <div className="loader-circle"></div>
          <div className="loader-circle"></div>
          <div className="loader-circle"></div>
        </div>
        <p className="loader-message">{message}</p>
      </div>
    </div>
  );
};

export default Loader;