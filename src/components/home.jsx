import React, { useState } from 'react';
import axios from 'axios';
import RecipeDetails from './recipeDetails';

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
      console.log(JSON.stringify(response.data, null, 2));
      setBitterness(response.data.tasteScore);
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeRecipeDetails = () => {
    setSelectedRecipe(null);
  };

  return (
    <>
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
                <li key={recipe.id} onClick={() => openRecipeDetails(recipe)}>
                  <h3>{recipe.title}</h3>
                  <img src={recipe.image} alt={recipe.title} />
                  <p>Click here for instructions and details</p>
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
        />
      )}
    </>
  );
};

export default Home;
