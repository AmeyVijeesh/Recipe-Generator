import React from 'react';
import Home from './components/home';
import RecipeDetails from './components/recipeDetails';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Define a new route for the recipe details page */}
        <Route path="/recipe/:id" element={<RecipeDetails />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
