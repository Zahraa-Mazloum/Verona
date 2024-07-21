import React from 'react';
import loader from './loading.gif';

const Loading = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <img src={loader} alt="Loading..." />
  </div>
);

export default Loading;
