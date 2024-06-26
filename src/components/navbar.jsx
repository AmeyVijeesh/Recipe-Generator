import React from 'react';
import './navbar.css';
import { NavLink } from 'react-router-dom';
import { signOut } from 'firebase/auth';

const Navbar = ({ isAuthenticated, handleSignOut, profilePicture }) => {
  return (
    <>
      <nav className="navbar navbar-expand-lg fixed-top navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <NavLink to="/">Recipes</NavLink>
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="fas fa-bars"></i>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="#">
                  <NavLink to="/" className="navbar-link">
                    Home
                  </NavLink>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  <NavLink className="navbar-link" to={'/recipes'}>
                    Recipes
                  </NavLink>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  <NavLink className="navbar-link" to={'/favorites'}>
                    Favorites
                  </NavLink>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  <NavLink className="navbar-link" to={'/about'}>
                    About
                  </NavLink>
                </a>
              </li>
            </ul>

            <ul class="navbar-nav mb-2 mb-lg-0">
              {isAuthenticated ? (
                <li class="nav-item">
                  <a class="nav-link" href="#" onClick={handleSignOut}>
                    Sign Out
                  </a>
                </li>
              ) : (
                <li class="nav-item">
                  <a class="nav-link" href="#">
                    <NavLink to="/signin">Sign In</NavLink>
                  </a>
                </li>
              )}
            </ul>

            <div class="dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    class="rounded-circle img-fluid"
                    height="25"
                    width="25"
                  />
                ) : (
                  <img
                    src={
                      profilePicture ? (
                        <img src={profilePicture} />
                      ) : (
                        <img src="https://th.bing.com/th/id/OIP.hmLglIuAaL31MXNFuTGBgAAAAA?rs=1&pid=ImgDetMain" />
                      )
                    }
                    class="rounded-circle img-fluid"
                    height="25px"
                    width="25px"
                  />
                )}
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <a class="dropdown-item" href="#">
                    <NavLink className="navbar-link" to="/profile">
                      Your Profile
                    </NavLink>{' '}
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#">
                    <NavLink className="navbar-link" to="/favorites">
                      Your Favorites
                    </NavLink>
                  </a>
                </li>
                <li>
                  <hr class="dropdown-divider" />
                </li>
                <li>
                  <a class="dropdown-item">
                    <NavLink to="/settings">Your Settings</NavLink>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
      <div style={{ height: '3.5rem' }}></div>
    </>
  );
};

export default Navbar;
