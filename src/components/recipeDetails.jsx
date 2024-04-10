import React from 'react';

const RecipeDetails = ({ recipe, onClose }) => {
  console.log(recipe); // Add this line for debugging

  return (
    <div>
      <h2>{recipe.title}</h2>{' '}
      <h1>Author: {recipe.author && <p>Author: {recipe.author}</p>}</h1>
      <img src={recipe.image} alt={recipe.title} />
      <h3>Ingredients:</h3>
      <ul>
        {recipe.extendedIngredients &&
          recipe.extendedIngredients.map((ingredient, index) => (
            <li key={index}>{ingredient.original}</li>
          ))}
      </ul>
      <h3>Instructions:</h3>
      {recipe.instructions && (
        <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
      )}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default RecipeDetails;
