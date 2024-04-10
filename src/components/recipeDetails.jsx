import React from 'react';

const RecipeDetails = ({ recipe, onClose, isVegan, bitterness, isHealthy }) => {
  return (
    <div>
      <h2>{recipe.title}</h2>
      {recipe.author && <p>Author: {recipe.author}</p>}
      <img src={recipe.image} alt={recipe.title} />
      <h3>Ingredients:</h3>
      <ul>
        {recipe.extendedIngredients &&
          recipe.extendedIngredients.map((ingredient, index) => (
            <li key={index}>{ingredient.original}</li>
          ))}
      </ul>
      <h2>Is Healthy : {isHealthy ? 'Yes' : 'No'}</h2>
      <span>{isVegan ? 'Vegan' : ' '}</span>
      <h3>Instructions:</h3>
      {recipe.instructions && (
        <ul>
          {recipe.instructions
            .replace(/<\/?[^>]+(>|$)/g, '') // Remove HTML tags
            .split('.')
            .map((instruction, index) => (
              <li key={index}>{instruction.trim()}</li>
            ))}
        </ul>
      )}

      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default RecipeDetails;
