import React, { useState } from 'react';

import { NavLink, useNavigate } from 'react-router-dom';
import './test.css';

const Test = () => {
  return (
    <>
      <div className="bady">
        <div>
          <div className="box-form">
            <div className="left">
              <div className="overlay">
                <h1>AmExpro</h1>
                <p
                  style={{
                    textAlign: 'center',
                    textTransform: 'upperCase',
                    fontSize: '1.8rem',
                  }}
                >
                  Login to your account to start shopping!
                </p>
                <span>
                  <a href="#">Login with Google</a>
                  <a href="#">Create an Account</a>
                </span>
              </div>
            </div>
            <div className="right">
              <h5>Login</h5>
              <p>Forgot Password? Reset it </p>
              <div className="inputs">
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  placeholder="Email address"
                />
                <br />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Password"
                />
                <br />
                {/* Render error message if error is present */}
              </div>
              <br />
              <button>Login</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Test;
