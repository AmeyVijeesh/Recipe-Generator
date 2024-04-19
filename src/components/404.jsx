import React from 'react';
import { NavLink } from 'react-router-dom';

const PNF = () => {
  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <h1>404</h1>
        <p>
          That page does not exist. <NavLink to="/">Go home</NavLink>
        </p>
      </div>
    </>
  );
};

export default PNF;
