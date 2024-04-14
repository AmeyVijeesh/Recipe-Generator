import React, { useState } from 'react';
import Home from './components/home';
import SignUp from './components/SignUp';
import RecipeDetails from './components/recipeDetails';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import SignIn from './components/signIn';
import ResetPassword from './components/ResetPassword';
import { auth } from './components/firebase';
import { signOut } from 'firebase/auth';
import LoginForm from './components/fav';

const App = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <BrowserRouter>
      <div>
        <Navbar isAuthenticated={user !== null} handleSignOut={handleSignOut} />
        <Routes>
          <Route path="/signin" element={<SignIn setUser={setUser} />} />{' '}
          <Route
            path="/signup"
            element={<SignUp setUser={setUser} setName={setName} />}
          />
          <Route path="/recipe/:id" element={<RecipeDetails />} />
          <Route
            path="/"
            element={
              <Home
                user={user}
                setUser={setUser}
                setName={setName}
                name={name}
              />
            }
          />
          <Route path="/test" element={<LoginForm />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
