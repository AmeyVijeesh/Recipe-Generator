import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import RecipeDetails from './recipeDetails';
import './Recipes.css';
import { db } from './firebase.js';

import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { TextField, Button, IconButton, Icon } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FormGroup from '@mui/material/FormGroup';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import NativeSelect from '@mui/material/NativeSelect';
import InputLabel from '@mui/material/InputLabel';

const Recipe = ({ user, healthScore, setHealthScore }) => {
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
  const [favName, setFavName] = useState('');
  const [randomRecipes, setRandomRecipes] = useState([]);
  const [displayedRecipes, setDisplayedRecipes] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [searchIngredients, setSearchIngredients] = useState('');

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const loadMoreRecipes = async () => {
    try {
      const response = await axios.get(
        'https://api.spoonacular.com/recipes/random',
        {
          params: {
            apiKey: apiKey2,
            number: 8,
          },
        }
      );
      const newRecipes = response.data.recipes;
      setDisplayedRecipes([...displayedRecipes, ...newRecipes]);
    } catch (error) {
      console.error('Error fetching more recipes:', error);
    }
  };

  const randomDescriptions = (recipeName) => {
    const sentences = [
      `Indulge in the divine flavors of ${recipeName}, meticulously crafted and expertly seasoned, just for your culinary delight.`,
      `Embark on a gastronomic journey like no other with ${recipeName}, bursting with an array of tantalizing flavors and aromatic sensations to tantalize your taste buds.`,
      `Elevate your dining experience to unprecedented heights with ${recipeName}, meticulously crafted to perfection, ensuring each bite is a symphony of culinary excellence.`,
      `Savor the rich textures and harmonious blend of hand-selected ingredients in ${recipeName}, a true feast for the senses that promises an unforgettable dining experience.`,
      `Experience culinary bliss with ${recipeName}, a symphony of flavors meticulously orchestrated to perfection, leaving you irresistibly yearning for more with every tantalizing bite.`,
      `Delight your taste buds with ${recipeName}, a fusion of tradition and innovation meticulously woven into every aspect, ensuring each bite is an unforgettable culinary journey.`,
      `Treat yourself to an unforgettable culinary adventure with ${recipeName}, a culinary ode to gastronomic excellence that promises to awaken your palate and leave you craving for more.`,
      `Unleash your inner chef and embark on a journey of culinary magic with ${recipeName}, meticulously crafted with precision and care, fit for royalty and destined to impress.`,
      `Dive into a world of culinary wonders with ${recipeName}, a culinary masterpiece that defies expectations and promises an extraordinary dining experience beyond compare.`,
      `Experience culinary nirvana with this exquisite creation, ${recipeName}, meticulously curated and expertly prepared to transcend ordinary dining experiences and elevate them to extraordinary heights.`,
      `Elevate your dining experience to unparalleled levels of sophistication with ${recipeName}, a true testament to culinary artistry and innovation that promises to leave a lasting impression.`,
      `Discover the true essence of flavor with this exceptional creation, ${recipeName}, a culinary journey meticulously crafted to delight the senses and leave you craving for more with each indulgent bite.`,
      `Prepare to be amazed by the culinary prowess of ${recipeName}, a culinary masterpiece meticulously prepared with precision and care, designed to dazzle and delight even the most discerning palate.`,
      `Immerse yourself in a culinary adventure with ${recipeName}, meticulously prepared with passion and creativity, a culinary delight that captivates the palate and leaves a lasting impression.`,
      `Experience the magic of culinary creativity with ${recipeName}, a culinary masterpiece meticulously crafted with innovation and expertise, redefining the boundaries of gastronomy with each exquisite bite.`,
    ];

    const randomIndex = Math.floor(Math.random() * sentences.length);
    return sentences[randomIndex];
  };

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

  const handleSearchByIngredients = () => {
    // Make API request to Spoonacular using searchIngredients
    // Example: You need to replace YOUR_API_KEY with your actual Spoonacular API key
    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${searchIngredients}&apiKey=${apiKey}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setSearchResults(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
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

  const handleSearchIngredientSearch = (event) => {
    setSearchIngredients(event.target.value);
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
            apiKey: apiKey3,
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
            apiKey: apiKey2,
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
    console.log('Health Score:', healthScore);
  }, [healthScore]);

  useEffect(() => {
    const fetchRandomRecipes = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          'https://api.spoonacular.com/recipes/random',
          {
            params: {
              apiKey: apiKey3,
              number: 16,
            },
          }
        );
        console.log('API Response:', response.data);
        setDisplayedRecipes(response.data.recipes.slice(0, 8));
        setRandomRecipes(response.data.recipes.slice(8));
      } catch (error) {
        console.error('Error fetching random recipes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRandomRecipes();
  }, []);

  const getStars = (healthScore) => {
    if (healthScore >= 0 && healthScore < 10) {
      return <span class="recipe-rating">★</span>;
    } else if (healthScore >= 10 && healthScore < 30) {
      return <span class="recipe-rating">★★</span>;
    } else if (healthScore >= 30 && healthScore < 50) {
      return <span class="recipe-rating">★★★</span>;
    } else if (healthScore >= 50 && healthScore < 80) {
      return <span class="recipe-rating">★★★★</span>;
    } else if (healthScore >= 80 && healthScore <= 100) {
      return <span class="recipe-rating">★★★★★</span>;
    } else {
      return <span class="recipe-rating">☆</span>;
    }
  };

  return (
    <>
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '2%',
          }}
        >
          <TextField
            id="standard-basic"
            className="search-input"
            label="Search for recipes here..."
            variant="standard"
            value={searchQuery}
            onChange={handleChange}
          />
          <IconButton onClick={handleSearch} disabled={isLoading}>
            <SearchIcon />
          </IconButton>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="filter-interface">
            <h3 className="filter-title">Filters</h3>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
              }}
            >
              <div className="filter-div">
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Vegetarian"
                    checked={isVegetarian}
                    onClick={handleVegetarianChange}
                  />
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Vegan"
                    checked={isVegan}
                    onClick={handleVeganChange}
                  />
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Gluten-free"
                    checked={isGlutenFree}
                    onClick={handleGlutenFreeChange}
                  />{' '}
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Dairy-free"
                    checked={isDairyFree}
                    onClick={handleDairyFreeChange}
                  />
                </FormGroup>
              </div>
              <div className="filter-div">
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div>
                    <TextField
                      type="text"
                      value={searchIngredients}
                      variant="outlined"
                      onChange={handleSearchIngredientSearch}
                      helperText="Enter Ingredients seperated by commas"
                      placeholder="Enter ingredients"
                    />{' '}
                    <IconButton onClick={handleSearchByIngredients}>
                      <SearchIcon></SearchIcon>
                    </IconButton>
                  </div>
                  <TextField
                    type="text"
                    value={cuisine}
                    variant="outlined"
                    onChange={handleCuisineChange}
                    placeholder="Enter Cuisine"
                    style={{ margin: '2%' }}
                  />
                </div>
              </div>
              <div className="filter-div">
                <FormControl fullWidth>
                  <InputLabel variant="standard" htmlFor="uncontrolled-native">
                    Meal Type
                  </InputLabel>
                  <NativeSelect
                    defaultValue={''}
                    inputProps={{
                      name: 'Meal Type',
                      id: 'uncontrolled-native',
                    }}
                    value={type}
                    onChange={handleTypeChange}
                  >
                    <option value=""></option>
                    <option value="main course">Main Course</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="salad">Salad</option>
                    <option value="appetizer">Appetizer</option>
                    <option value="dessert">Dessert</option>
                    <option value="bread">Bread</option>
                    <option value="soup">Soup</option>
                  </NativeSelect>
                </FormControl>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Button
                onClick={handleSearch}
                variant="contained"
                sx={{
                  color: '#fff',
                  backgroundColor: '#000',
                  '&:hover': {
                    backgroundColor: '#fff',
                    color: '#000',
                  },
                }}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </div>
      {searchResults.length > 0 ? (
        <div>
          <h2 className="recipes-title">Search Results</h2>
          <ul>
            {searchResults.map((recipe) => (
              <div class="recipe" key={recipe.id}>
                <div className="container">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    width="1500"
                    height="1368"
                    className="recipe-img"
                  />
                  <div class="pizza-box"></div>
                  <div
                    class="recipe-content"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <h2 class="title">
                        <NavLink
                          className="recipe-title"
                          onClick={() => openRecipeDetails(recipe)}
                        >
                          {recipe.title}
                        </NavLink>
                      </h2>
                    </div>
                    <p class="recipe-metadata">
                      <span class="recipe-votes">
                        Health Score: {recipe.healthScore} <br />
                      </span>
                      <span> {getStars(recipe.healthScore)}</span>
                    </p>
                    <p class="recipe-desc">
                      {randomDescriptions(recipe.title)}
                    </p>
                    <button
                      onClick={() => toggleFavorite(recipe.id, recipe.title)}
                      className="favorites-button"
                    >
                      {favorites[recipe.id]
                        ? 'Remove from Favorites'
                        : 'Add to Favorites'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </ul>
        </div>
      ) : (
        ''
      )}
      <div>
        <h1 className="recipes-title">Recipes</h1>
        <center>
          <div>
            {displayedRecipes.map((recipe) => (
              <div class="recipe" key={recipe.id}>
                <div className="container">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    width="1500"
                    height="1368"
                    className="recipe-img"
                  />
                  <div class="pizza-box"></div>
                  <div
                    class="recipe-content"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <h2 class="title">
                        <NavLink
                          className="recipe-title"
                          onClick={() => openRecipeDetails(recipe)}
                        >
                          {recipe.title}
                        </NavLink>
                      </h2>
                    </div>
                    <p class="recipe-metadata">
                      <span class="recipe-votes">
                        Health Score: {recipe.healthScore} <br />
                      </span>
                      <span> {getStars(recipe.healthScore)}</span>
                    </p>
                    <p class="recipe-desc">
                      {randomDescriptions(recipe.title)}
                    </p>
                    <button
                      onClick={() => toggleFavorite(recipe.id, recipe.title)}
                      className="favorites-button"
                    >
                      {favorites[recipe.id]
                        ? 'Remove from Favorites'
                        : 'Add to Favorites'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </center>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            onClick={loadMoreRecipes}
            className="add-more"
            variant="outlined"
            sx={{
              color: 'black',
              border: '1px solid black',
              '&:hover': {
                backgroundColor: '#000',
                color: '#fff',
              },
            }}
          >
            Add more
          </Button>
        </div>
      </div>

      {selectedRecipe && (
        <RecipeDetails
          recipe={selectedRecipe}
          onClose={closeRecipeDetails}
          isVegan={isVegan}
          isGlutenFree={isGlutenFree}
          tasteData={bitterness}
          isHealthy={isHealthy}
          ins={ins}
        />
      )}
    </>
  );
};

export default Recipe;
