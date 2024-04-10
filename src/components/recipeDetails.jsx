// RecipeDetails.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const RecipeDetails = ({ onClose, isVegan, isGlutenFree, isHealthy, ins }) => {
  const { state } = useLocation();
  const recipe = state && state.recipe;

  if (!recipe) {
    // Handle if recipe data is not available
    return <div>Recipe not found.</div>;
  }

  const { instructions, extendedIngredients } = recipe; // Destructure instructions and extendedIngredients from recipe object

  return (
    <div>
      <h2>{recipe.title}</h2>
      <button
        onClick={() => {
          console.log(ins);
        }}
      >
        debug
      </button>
      {recipe.author && <p>Author: {recipe.author}</p>}
      <img src={recipe.image} alt={recipe.title} />
      <h3>Ingredients:</h3>
      <ul>
        {extendedIngredients &&
          extendedIngredients.map((ingredient, index) => (
            <li key={index}>{ingredient.original}</li>
          ))}
      </ul>
      <h2>Is Healthy : {isHealthy ? 'Yes' : 'No'}</h2>
      <span>{isVegan ? 'Vegan' : 'No '}</span>
      <h3>Instructions:</h3>
      {instructions && (
        <ul>
          {instructions
            .replace(/<\/?[^>]+(>|$)/g, '') // Remove HTML tags
            .split('.')
            .map((instructions, index) => (
              <li key={index}>{instructions.trim()}</li>
            ))}
        </ul>
      )}

      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default RecipeDetails;
