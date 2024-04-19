// Carousel.js
import React from 'react';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import axios from 'axios';
import './Carousel.css'; // Your custom CSS for carousel styling

const Carousel = () => {
  const navigate = useNavigate();
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };
  const apiKey = import.meta.env.VITE_REACT_APP_SPOONACULAR_API_KEY;

  const openRecipeDetails = async (id) => {
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/${id}/information`,
        {
          params: {
            apiKey: apiKey,
            addTasteData: true,
          },
        }
      );

      navigate(`/recipe/${id}`, {
        state: {
          recipe: response.data,
        },
      });
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            width: '80%',
          }}
        >
          <Slider {...settings}>
            <div className="carousel-img">
              <h2 className="carousel-h2">
                Delectable Oreo Cheesecakes...right at your fingertips!
              </h2>
              <button
                onClick={() => openRecipeDetails(654028)}
                className="carousel-btn"
              >
                View Recipe
              </button>
            </div>
            <div className="carousel-img2">
              <h2 className="carousel-h2">Enjoy Chewy Choco-Chip Cookies</h2>
              <button
                onClick={() => openRecipeDetails(654028)}
                className="carousel-btn"
              >
                View Recipe
              </button>
            </div>
            <div className="carousel-img3">
              <h2 className="carousel-h2">
                Experience the Salmon Caesar Salad
              </h2>
              <button
                className="carousel-btn"
                onClick={() => openRecipeDetails(646512)}
              >
                View Recipe
              </button>
            </div>
          </Slider>
        </div>
      </div>
    </>
  );
};

export default Carousel;
