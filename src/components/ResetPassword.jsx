import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const forgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Password reset email sent. Check your inbox.');
      navigate('/signin');
    } catch (error) {
      console.error('Error sending reset email:', error);
    }
  };
  return (
    <>
      {' '}
      <div className="bady">
        <div>
          <div className="box-form">
            <div className="left">
              <div className="overlay">
                <h1>Password</h1>
                <p
                  style={{
                    textAlign: 'center',
                  }}
                >
                  Enter your email, and a password reset mail will be sent.
                </p>
                <span>
                  <a
                    onClick={() => {
                      navigate('/signup');
                    }}
                  >
                    Don't have an account? Create one!
                  </a>
                </span>
              </div>
            </div>
            <div className="right">
              <h5>Reset</h5>
              <p>
                <span
                  onClick={() => {
                    navigate('/signin');
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  Go back{' '}
                </span>{' '}
              </p>
              <div className="inputs">
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  placeholder="Email address"
                  value={email}
                  onChange={onEmailChange}
                />
                <br />

                <br />
              </div>
              <br />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <button onClick={forgotPassword}>Get Email</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
