import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail, // Add this import
} from 'firebase/auth';
import { auth, db } from './firebase.js';
import { useNavigate } from 'react-router-dom';
import { setDoc, doc } from 'firebase/firestore';

const SignIn = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
      navigate('/');
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      navigate('/');
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <>
      <div className="bady">
        <div>
          <div className="box-form">
            <div className="left">
              <div className="overlay">
                <h1>Recipes</h1>
                <p
                  style={{
                    textAlign: 'center',
                    textTransform: 'upperCase',
                    fontSize: '1.8rem',
                  }}
                >
                  Sign In to Recipes
                </p>
                <span>
                  <a onClick={signInWithGoogle} className="btns">
                    Login with Google
                  </a>

                  <a
                    onClick={() => {
                      navigate('/signup');
                    }}
                    className="btns"
                  >
                    Create an Account
                  </a>
                </span>
              </div>
            </div>
            <div className="right">
              <h5>Login</h5>
              <p>
                Forgot Password?{' '}
                <span
                  onClick={() => {
                    navigate('/resetpassword');
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  Reset it
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
                  onChange={(e) => setEmail(e.target.value)}
                />
                <br />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <br />
              </div>
              <br />
              <button onClick={() => signIn(email, password)}>Login</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
