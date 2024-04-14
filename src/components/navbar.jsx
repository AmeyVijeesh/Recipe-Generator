import React from 'react';
import './navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink } from 'react-router-dom';
import { signOut } from 'firebase/auth';

const Navbar = ({ isAuthenticated, handleSignOut }) => {
  return (
    <>
      <nav className="navbar navbar-expand-lg fixed-top navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <span>Recipes</span>
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
                  <NavLink to="/">Home</NavLink>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  Recipes
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  Featured
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  About
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
                <img
                  src="https://mdbootstrap.com/img/Photos/Avatars/img%20(2).jpg"
                  class="rounded-circle img-fluid"
                  height="25"
                  width="25"
                />
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <a class="dropdown-item" href="#">
                    Action
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#">
                    Another action
                  </a>
                </li>
                <li>
                  <hr class="dropdown-divider" />
                </li>
                <li>
                  <a class="dropdown-item" href="#">
                    Something else here
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
