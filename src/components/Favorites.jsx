import React, { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
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

const Favorites = ({ favorites, setFavorites, user, healthScore }) => {
  const [recipeImages, setRecipeImages] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        if (user && user.uid) {
          const favoritesRef = doc(db, 'favorites', user.uid);
          const favoritesSnapshot = await getDoc(favoritesRef);
          if (favoritesSnapshot.exists()) {
            setFavorites(favoritesSnapshot.data());
            fetchRecipeImages(favoritesSnapshot.data());
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

  const apiKey = import.meta.env.VITE_REACT_APP_SPOONACULAR_API_KEY;
  const apiKey3 = import.meta.env.VITE_REACT_APP_SPOONACULAR_API_KEY3;

  const fetchRecipeImages = async (favoritesData) => {
    const recipesWithImages = {};
    for (const [recipeId, _] of Object.entries(favoritesData)) {
      try {
        const response = await fetch(
          `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey3}`
        );
        const data = await response.json();
        recipesWithImages[recipeId] = data.image;
      } catch (error) {
        console.error(`Error fetching image for recipe ID ${recipeId}:`, error);
      }
    }
    setRecipeImages(recipesWithImages);
  };

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

  const handleRecipeClick = async (recipeId) => {
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`
      );
      const data = await response.json();
      navigate(`/recipe/${recipeId}`, { state: { recipe: data } });
    } catch (error) {
      console.error(
        `Error fetching recipe details for recipe ID ${recipeId}:`,
        error
      );
    }
  };

  return (
    <>
      <div>
        <h1 className="recipe-title" style={{ textAlign: 'center' }}>
          Favorites
        </h1>
        <div>
          <center>
            {Object.keys(favorites).length > 0 ? (
              Object.keys(favorites).map((recipeId) => (
                <div key={recipeId}>
                  <ul>
                    <div className="recipe">
                      <div className="container">
                        <img
                          src={recipeImages[recipeId]}
                          alt={favorites[recipeId]}
                          width="1500"
                          height="1368"
                          className="recipe-img"
                        />
                        <div
                          className="recipe-content"
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            textAlign: 'center',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <h2
                              className="title"
                              style={{ textAlign: 'center' }}
                            >
                              <NavLink
                                className="recipe-title"
                                onClick={() => handleRecipeClick(recipeId)}
                                style={{ textAlign: 'center' }}
                              >
                                {favorites[recipeId]}
                              </NavLink>
                            </h2>
                          </div>
                          <button
                            onClick={() =>
                              toggleFavorite(recipeId, favorites[recipeId])
                            }
                            className="favorites-button"
                            style={{ marginTop: '10px' }}
                          >
                            {favorites[recipeId]
                              ? 'Remove from Favorites'
                              : 'Add to Favorites'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </ul>
                </div>
              ))
            ) : (
              <p>No favorites added yet.</p>
            )}
          </center>
        </div>
      </div>
    </>
  );
};
export default Favorites;
