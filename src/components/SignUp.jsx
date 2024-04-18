import React, { useState, useEffect } from 'react';
import { Button, TextField } from '@mui/material';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  getAuth,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, db } from './firebase.js';
import { useNavigate } from 'react-router-dom';
import { setDoc, doc } from 'firebase/firestore';

const SignUp = ({ setUser }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsEmailVerified(user.emailVerified);
      }
    });
    return () => unsubscribe();
  }, []);

  const signUp = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const userId = userCredential.user.uid;

      await setDoc(doc(db, 'users', userId), {
        name: name,
        email: email,
      });

      setUser(userCredential.user);
      navigate('/'); // Directly navigate to the desired route
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
    <div>
      <div className="bady">
        <div>
          <div className="box-form">
            <div className="left">
              <div className="overlay">
                <h1>Recipes</h1>
                <p style={{ textAlign: 'center' }}>
                  Create an account and start cooking delicious recipies.
                  <br /> <br />
                  By creating an account, you agree to abide by our terms and
                  conditions.
                </p>{' '}
                <span>
                  <a
                    onClick={() => {
                      navigate('/signin');
                    }}
                  >
                    Already have an account? Login!
                  </a>
                </span>
              </div>
            </div>
            <div className="right">
              <h5>Register</h5>
              <div className="inputs">
                <input
                  id="name"
                  name="name"
                  type="name"
                  required
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
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
              <button onClick={() => signUp(email, password)}>
                Create an Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
