import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RecipeDetails from './recipeDetails';
import { Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from './firebase.js';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  deleteDoc,
  getFirestore,
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Home = ({
  user,
  setUser,
  name,
  setName,
  profilePicture,
  setProfilePicture,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [type, setType] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [isVegan, setIsVegan] = useState(false);
  const [isGlutenFree, setIsGlutenFree] = useState(false);
  const [isDairyFree, setIsDairyFree] = useState(false);
  const [bitterness, setBitterness] = useState(0.1);
  const [isHealthy, setIsHealthy] = useState(false);
  const [ins, setIns] = useState(null);
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState({});
  const [favName, setFavName] = useState('');
  const [healthScore, setHealthScore] = useState(0);

  const [todos, setTodos] = useState([]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const storageRef = ref(
      storage,
      `profile_pictures/${user.uid}/${file.name}`
    );
    try {
      await uploadBytes(storageRef, file);

      const downloadURL = await getDownloadURL(storageRef);

      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { profilePic: downloadURL }, { merge: true });

      setProfilePicture(downloadURL);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  };

  const fetchProfilePicture = async () => {
    try {
      if (user && user.uid) {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnapshot = await getDoc(userDocRef);
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          setProfilePicture(userData.profilePic);
        }
      } else {
        setProfilePicture(
          'https://th.bing.com/th/id/OIP.hmLglIuAaL31MXNFuTGBgAAAAA?rs=1&pid=ImgDetMain'
        );
      }
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfilePicture();
    }
  }, [user]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        if (user && user.uid) {
          const favoritesRef = doc(db, 'favorites', user.uid);
          const favoritesSnapshot = await getDoc(favoritesRef);
          if (favoritesSnapshot.exists()) {
            setFavorites(favoritesSnapshot.data());
          } else {
            setFavorites({});
          }
        } else {
          setFavorites({});
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        if (user && user.uid) {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          const userData = userDocSnapshot.data();
          setName(userData.name || user.email);
          console.log(userData);
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    };

    fetchUserName();
  }, [user]);

  const toggleFavorite = async (recipeId, recipeName) => {
    if (!user) return;

    const userFavoritesRef = doc(db, 'favorites', user.uid);
    let updatedFavorites = { ...favorites };

    if (updatedFavorites[recipeId]) {
      delete updatedFavorites[recipeId];
    } else {
      updatedFavorites[recipeId] = recipeName;
    }

    if (Object.keys(updatedFavorites).length === 0) {
      await deleteDoc(userFavoritesRef);
    } else {
      await setDoc(userFavoritesRef, updatedFavorites);
    }
    setFavorites(updatedFavorites);
  };

  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCuisineChange = (event) => {
    setCuisine(event.target.value);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleVegetarianChange = (event) => {
    setIsVegetarian(event.target.checked);
  };

  const handleVeganChange = (event) => {
    setIsVegan(event.target.checked);
  };

  const handleGlutenFreeChange = (event) => {
    setIsGlutenFree(event.target.checked);
  };

  const handleDairyFreeChange = (event) => {
    setIsDairyFree(event.target.checked);
  };

  const apiKey = import.meta.env.VITE_REACT_APP_SPOONACULAR_API_KEY;
  const apiKey2 = import.meta.env.VITE_REACT_APP_SPOONACULAR_API_KEY2;
  const apiKey3 = import.meta.env.VITE_REACT_APP_SPOONACULAR_API_KEY_BALANCE;
  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        'https://api.spoonacular.com/recipes/complexSearch',
        {
          params: {
            apiKey: apiKey,
            query: searchQuery,
            cuisine: cuisine,
            type: type,
            diet: `${isVegetarian ? 'vegetarian,' : ''}${
              isVegan ? 'vegan,' : ''
            }${isGlutenFree ? 'gluten free,' : ''}${
              isDairyFree ? 'dairy free,' : ''
            }`,
          },
        }
      );
      console.log('API Response:', response.data); // Log the response data to check for extendedIngredients and instructions
      setSearchResults(response.data.results);
    } catch (error) {
      console.error('Error searching recipes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openRecipeDetails = async (recipe) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/${recipe.id}/information`,
        {
          params: {
            apiKey: apiKey,
            addTasteData: true,
          },
        }
      );
      setSelectedRecipe(response.data);
      setIsHealthy(response.data.veryHealthy);
      setIsVegan(response.data.vegan);
      setHealthScore(response.data.healthScore);
      setIsGlutenFree(response.data.glutenFree);
      console.log(JSON.stringify(response.data, null, 2));
      console.log(response.data.healthScore);
      console.log(healthScore);
      navigate(`/recipe/${recipe.id}`, {
        state: {
          recipe: response.data,
        },
      });
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedRecipe) {
      setHealthScore(selectedRecipe.healthScore);
    }
  }, [selectedRecipe]);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'todos')); // Change 'todos' to your actual collection name
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setTodos(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            item: doc.data(),
          }))
        );
      });

      return () => unsubscribe();
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          navigate('/auth');
        }}
      >
        Auth
      </button>
      <div>
        {user ? (
          <div>
            <h2>Yo {name}!</h2>
            <Button
              onClick={handleSignOut}
              variant="contained"
              color="secondary"
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <h1>Sign in please</h1>
        )}
      </div>
      <h2>
        {' '}
        favs "{' '}
        {Object.keys(favorites).length > 0 ? (
          <ul>
            {Object.entries(favorites).map(([recipeId, recipeName]) => (
              <li key={recipeId}>
                <p>{recipeName}</p>
                <button onClick={() => toggleFavorite(recipeId, recipeName)}>
                  Remove from Favorites
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No favorites added yet.</p>
        )}
      </h2>
      <button>Open it!</button>{' '}
      <input type="file" accept="image/*" onChange={handleFileUpload} />
      <div>
        <h1>Recipe Search</h1>
        <input
          type="text"
          value={searchQuery}
          onChange={handleChange}
          placeholder="Enter ingredients or keywords..."
        />
        <input
          type="text"
          value={cuisine}
          onChange={handleCuisineChange}
          placeholder="Enter Cuisine"
        />

        <select value={type} onChange={handleTypeChange}>
          {' '}
          {/* Use a select dropdown for meal type */}
          <option value="">Select Meal Type</option>
          <option value="breakfast">Breakfast</option>
          <option value="brunch">Brunch</option>
          <option value="pancake">Pancake</option>
          <option value="waffle">Waffle</option>
          <option value="lunch">Lunch</option>
          {/* Add more options as needed */}
        </select>

        <div>
          <input
            type="checkbox"
            checked={isVegetarian}
            onChange={handleVegetarianChange}
          />
          <label>Vegetarian</label>
        </div>

        <div>
          <input
            type="checkbox"
            checked={isVegan}
            onChange={handleVeganChange}
          />
          <label>Vegan</label>
        </div>

        <div>
          <input
            type="checkbox"
            checked={isGlutenFree}
            onChange={handleGlutenFreeChange}
          />
          <label>Gluten-Free</label>
        </div>

        <div>
          <input
            type="checkbox"
            checked={isDairyFree}
            onChange={handleDairyFreeChange}
          />
          <label>Dairy-Free</label>
        </div>

        <button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search Recipes'}
        </button>
        {searchResults.length > 0 ? (
          <div>
            <h2>Search Results:</h2>
            <ul>
              {searchResults.map((recipe) => (
                <li key={recipe.id}>
                  <h3>{recipe.title}</h3>
                  <img src={recipe.image} alt={recipe.title} />
                  <p onClick={() => openRecipeDetails(recipe)}>
                    Click here for instructions and details
                  </p>
                  <button
                    onClick={() => toggleFavorite(recipe.id, recipe.title)}
                  >
                    {favorites[recipe.id]
                      ? 'Remove from Favorites'
                      : 'Add to Favorites'}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No results available.</p>
        )}
      </div>
      {selectedRecipe && (
        <RecipeDetails
          recipe={selectedRecipe}
          onClose={closeRecipeDetails}
          isVegan={isVegan}
          isGlutenFree={isGlutenFree}
          tasteData={bitterness}
          isHealthy={isHealthy}
          healthScore={healthScore}
          ins={ins} // Pass ins instead of inst
        />
      )}
    </>
  );
};

export default Home;
