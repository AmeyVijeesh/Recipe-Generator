import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './recipeDetails.css';
import Chip from '@mui/material/Chip';

const RecipeDetails = ({ isVegan, isGlutenFree, isHealthy, healthScore }) => {
  const { state } = useLocation();
  const recipe = state && state.recipe;
  const navigate = useNavigate();

  if (!recipe) {
    return <div>Recipe not found.</div>;
  }

  const { instructions, extendedIngredients } = recipe;

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <h2 className="rd-title">{recipe.title}</h2>{' '}
        {recipe.author && <p>Author: By {recipe.author}</p>}{' '}
        <div className="rd-badges">
          <span className="rd-badge">
            {recipe.veryHealthy ? (
              <Chip label="Very Healthy" color="success" />
            ) : (
              ''
            )}
          </span>
          <span className="rd-badge">
            {recipe.vegan ? <Chip label="Vegan" color="success" /> : ''}{' '}
          </span>
          <span className="rd-badge">
            {recipe.vegetarian ? (
              <Chip label="Vegetarian" color="success" />
            ) : (
              ''
            )}
          </span>
          <span className="rd-badge">
            {recipe.glutenFree ? (
              <Chip label="Gluten Free" color="primary" />
            ) : (
              ''
            )}
          </span>
          <Chip
            label={`Health Score: ${recipe.healthScore}`}
            color="secondary"
          ></Chip>
        </div>
        <img src={recipe.image} alt={recipe.title} className="rd-img" />
      </div>

      <div>
        <h3 className="rd-title" style={{ margin: '5%' }}>
          Ingredients:
        </h3>
        <ol>
          {extendedIngredients &&
            extendedIngredients.map((ingredient, index) => (
              <li key={index} className="rd-ol">
                {ingredient.original}
              </li>
            ))}
        </ol>
      </div>

      <h3 className="rd-title" style={{ margin: '5%' }}>
        Instructions:
      </h3>
      {instructions && (
        <ol>
          {instructions
            .replace(/<\/?[^>]+(>|$)/g, '')
            .split('.')
            .map((instructions, index) => (
              <li key={index} className="rd-ol">
                {instructions.trim()}
              </li>
            ))}
        </ol>
      )}
    </div>
  );
};

export default RecipeDetails;
