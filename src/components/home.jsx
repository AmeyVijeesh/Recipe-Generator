import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RecipeDetails from './recipeDetails';
import { useNavigate } from 'react-router-dom';
import Carousel from './Carousel.jsx';
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
  deleteDoc,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import img4 from './img4.jpeg';
import img5 from './img5.jpeg';
import img6 from './img6.jpeg';
import img7 from './img7.jpeg';
import img8 from './img8.jpeg';
import img9 from './img9.jpeg';
import img10 from './img10.jpeg';
import img11 from './img11.webp';
import img12 from './img12.jpeg';
import img13 from './img13.jpeg';
import img14 from './img14.jpeg';
const Home = ({
  user,
  setUser,
  name,
  setName,
  profilePicture,
  setProfilePicture,
  itemId,
  setItemId,
}) => {
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
  const [healthScore, setHealthScore] = useState(0);

  const [todos, setTodos] = useState([]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2, // Number of cards visible at a time
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '100px', // Adjust this value for space between cards
    responsive: [
      {
        breakpoint: 768, // Adjust breakpoints as needed
        settings: {
          slidesToShow: 1,
          centerPadding: '50px',
        },
      },
    ],
  };

  const fetchProfilePicture = async () => {
    try {
      if (user && user.uid) {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnapshot = await getDoc(userDocRef);
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          setProfilePicture(userData.profilePic);
        }
      } else {
        setProfilePicture(
          'https://th.bing.com/th/id/OIP.hmLglIuAaL31MXNFuTGBgAAAAA?rs=1&pid=ImgDetMain'
        );
      }
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfilePicture();
    }
  }, [user]);

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        if (user && user.uid) {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          const userData = userDocSnapshot.data();
          setName(userData.name || user.email);
          console.log(userData);
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    };

    fetchUserName();
  }, [user]);

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
  const apiKey2 = import.meta.env.VITE_REACT_APP_SPOONACULAR_API_KEY2;
  const apiKey3 = import.meta.env.VITE_REACT_APP_SPOONACULAR_API_KEY_BALANCE;
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

  useEffect(() => {
    if (selectedRecipe) {
      setHealthScore(selectedRecipe.healthScore);
    }
  }, [selectedRecipe]);

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

  return (
    <>
      <Carousel
        itemId={itemId}
        setItemId={setItemId}
        selectedRecipe={selectedRecipe}
      />

      <h1
        style={{
          color: 'grey',
          textAlign: 'center',
          textDecoration: 'underline',
          margin: '5%',
        }}
      >
        Featured Recipes
      </h1>
      <Slider {...settings}>
        <div className="card" style={{ width: '10px' }}>
          <div className="card-inner">
            <div>
              <img src={img5} className="card-img" />
            </div>
            <h3>Pasta with Breadcrumbs</h3>
            <button
              className="featured-btn"
              onClick={() => openRecipeDetails(650482)}
            >
              View Recipe
            </button>
          </div>
        </div>
        <div className="card">
          <div className="card-inner">
            <img src={img6} className="card-img" />
            <h3>Beef Bourguignon</h3>
            <button
              className="featured-btn"
              onClick={() => openRecipeDetails(641842)}
            >
              View Recipe
            </button>
          </div>
        </div>
        <div className="card">
          <div className="card-inner">
            <img src={img9} className="card-img" />
            <h3>Cherry Ice Cream</h3>
            <button
              className="featured-btn"
              onClick={() => {
                openRecipeDetails(637761);
              }}
            >
              View Recipe
            </button>
          </div>
        </div>
        <div className="card">
          <div className="card-inner">
            <img src={img8} className="card-img" />
            <h3>Eggs Benedict</h3>
            <button
              className="featured-btn"
              onClick={() => {
                openRecipeDetails(639594);
              }}
            >
              View Recipe
            </button>
          </div>
        </div>
        <div className="card">
          <div className="card-inner">
            <img src={img4} className="card-img" />
            <h3>Turkish Chicken Salad</h3>
            <button
              className="featured-btn"
              onClick={() => openRecipeDetails(664090)}
            >
              View Recipe
            </button>
          </div>
        </div>
        <div className="card">
          <div className="card-inner">
            <img src={img7} className="card-img" />
            <h3>Garlic Bread</h3>
            <button
              className="featured-btn"
              onClick={() => {
                openRecipeDetails(715559);
              }}
            >
              View Recipe
            </button>
          </div>
        </div>
      </Slider>

      <h1
        style={{
          color: 'grey',
          textAlign: 'center',
          textDecoration: 'underline',
          margin: '5%',
        }}
      >
        Latest Recipes
      </h1>
      <Slider {...settings}>
        <div className="card" style={{ width: '10px' }}>
          <div className="card-inner">
            <div>
              <img src={img10} className="card-img" />
            </div>
            <h3>Pasta with Breadcrumbs</h3>
            <button
              className="featured-btn"
              onClick={() => openRecipeDetails(716429)}
            >
              View Recipe
            </button>
          </div>
        </div>
        <div className="card">
          <div className="card-inner">
            <img src={img12} className="card-img" />
            <h3>Fish Fillets in Coconut Curry</h3>
            <button
              className="featured-btn"
              onClick={() => openRecipeDetails(642941)}
            >
              View Recipe
            </button>
          </div>
        </div>
        <div className="card">
          <div className="card-inner">
            <img src={img14} className="card-img" />
            <h3>Banana Creme Brulee</h3>
            <button
              className="featured-btn"
              onClick={() => {
                openRecipeDetails(634070);
              }}
            >
              View Recipe
            </button>
          </div>
        </div>
        <div className="card">
          <div className="card-inner">
            <img src={img8} className="card-img" />
            <h3>Eggs Benedict</h3>
            <button
              className="featured-btn"
              onClick={() => {
                openRecipeDetails(639594);
              }}
            >
              View Recipe
            </button>
          </div>
        </div>
        <div className="card">
          <div className="card-inner">
            <img src={img13} className="card-img" />
            <h3>Peppermint Brookie Pie</h3>
            <button
              className="featured-btn"
              onClick={() => openRecipeDetails(655668)}
            >
              View Recipe
            </button>
          </div>
        </div>
        <div className="card">
          <div className="card-inner">
            <img src={img11} className="card-img" />
            <h3>Oatmeal Pancake</h3>
            <button
              className="featured-btn"
              onClick={() => {
                openRecipeDetails(653472);
              }}
            >
              View Recipe
            </button>
          </div>
        </div>
      </Slider>
      {selectedRecipe && (
        <RecipeDetails
          recipe={selectedRecipe}
          onClose={closeRecipeDetails}
          isVegan={isVegan}
          isGlutenFree={isGlutenFree}
          tasteData={bitterness}
          isHealthy={isHealthy}
          healthScore={healthScore}
          ins={ins} // Pass ins instead of inst
        />
      )}
    </>
  );
};

export default Home;
