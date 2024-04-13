import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RecipeDetails from './recipeDetails';
import { Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase.js';
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
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

const Home = () => {
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

  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  // Listen for changes in favorites when user changes
  useEffect(() => {
    const fetchFavorites = async () => {
      if (user) {
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
    };

    fetchFavorites();
  }, [user]);

  const toggleFavorite = async (recipeId, recipeName) => {
    if (!user) return; // Check if user is authenticated

    const userFavoritesRef = doc(db, 'favorites', user.uid);
    let updatedFavorites = { ...favorites };

    if (updatedFavorites[recipeId]) {
      delete updatedFavorites[recipeId];
    } else {
      updatedFavorites[recipeId] = recipeName;
    }

    // Update favorites in Firestore
    if (Object.keys(updatedFavorites).length === 0) {
      // If updatedFavorites is empty, delete the entire document
      await deleteDoc(userFavoritesRef);
    } else {
      // Otherwise, update the document with the modified favorites
      await setDoc(userFavoritesRef, updatedFavorites);
    }

    // Update local state
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

  useEffect(() => {
    console.log('ins:', ins);
  }, [ins]); // Run this effect whenever ins changes

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
      setIsGlutenFree(response.data.glutenFree);
      setBitterness(response.data.tasteScore);
      console.log(JSON.stringify(response.data, null, 2));
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

  const signUp = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

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
      <div>
        {user ? (
          <Button onClick={handleSignOut} variant="contained" color="secondary">
            Sign Out
          </Button>
        ) : (
          <h1>Sign in plz</h1>
        )}

        <div>
          <TextField
            id="outlined-basic"
            label="Email"
            variant="outlined"
            style={{ margin: '0px 5px' }}
            size="small"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            id="outlined-basic"
            label="Password"
            variant="outlined"
            style={{ margin: '0px 5px' }}
            size="small"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            onClick={() => signIn(email, password)}
            variant="contained"
            color="primary"
          >
            Sign In
          </Button>
          <Button
            onClick={() => signUp(email, password)}
            variant="contained"
            color="primary"
          >
            Sign Up
          </Button>
        </div>
      </div>
      <h2>
        {' '}
        favs "{' '}
        {Object.keys(favorites).length > 0 ? (
          <ul>
            {Object.entries(favorites).map(([recipeId, recipeName]) => (
              <li key={recipeId}>
                <p>{recipeName}</p>
                {/* Add a button to remove the favorite */}
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
      <button>Open it!</button>

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
          ins={ins} // Pass ins instead of inst
        />
      )}
    </>
  );
};

export default Home;
