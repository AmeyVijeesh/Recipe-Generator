import React, { useState } from 'react';
import Home from './components/home';
import SignUp from './components/SignUp';
import RecipeDetails from './components/recipeDetails';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import Recipe from './components/Recipes';
import SignIn from './components/signIn';
import ResetPassword from './components/ResetPassword';
import { auth } from './components/firebase';
import { signOut } from 'firebase/auth';
import LoginForm from './components/fav';
import Favorites from './components/Favorites';
import Settings from './components/settings';
import About from './components/about';

const App = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [profilePicture, setProfilePicture] = useState(
    'https://th.bing.com/th/id/OIP.hmLglIuAaL31MXNFuTGBgAAAAA?rs=1&pid=ImgDetMain'
  );
  const [healthScore, setHealthScore] = useState(0);
  const [favorites, setFavorites] = useState({});
  const [itemId, setItemId] = useState(764752);

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
        <Navbar
          isAuthenticated={user !== null}
          handleSignOut={handleSignOut}
          profilePicture={profilePicture}
        />
        <Routes>
          <Route
            path="/favorites"
            element={
              <Favorites
                favorites={favorites}
                setFavorites={setFavorites}
                user={user}
                healthScore={healthScore}
              />
            }
          />{' '}
          <Route element={<About />}> </Route>
          <Route path="/signin" element={<SignIn setUser={setUser} />} />{' '}
          <Route
            path="/signup"
            element={<SignUp setUser={setUser} setName={setName} />}
          />
          <Route path="/recipe/:id" element={<RecipeDetails />} />
          <Route
            path="/recipes"
            element={
              <Recipe
                user={user}
                setUser={setUser}
                favorites={favorites}
                setFavorites={setFavorites}
                healthScore={healthScore}
                setHealthScore={setHealthScore}
              />
            }
          />
          <Route
            path="/"
            element={
              <Home
                user={user}
                setUser={setUser}
                setName={setName}
                name={name}
                profilePicture={profilePicture}
                setProfilePicture={setProfilePicture}
                healthScore={healthScore}
                setHealthScore={setHealthScore}
                itemId={itemId}
                setItemId={setItemId}
              />
            }
          />
          <Route path="/test" element={<LoginForm />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route
            path="/settings"
            element={
              <Settings
                profilePicture={profilePicture}
                setProfilePicture={setProfilePicture}
                user={user}
              />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
