import './footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div>
      <footer className="footer">
        <div className="footer__addr">
          <h1 className="footer__logo">Recipes</h1>

          <h2>Contact</h2>
          <a>Amey Vijeesh. </a>
          <a
            style={{ textDecoration: 'underline' }}
            href="https://ameyvijeesh.netlify.com"
          >
            Website
          </a>

          <address>
            Bengaluru, India
            <br />
            <a className="footer__btn" href="mailto:ameyvijeesh@gmail.com">
              <u>My Email</u>
            </a>
          </address>
        </div>

        <ul className="footer__nav">
          <li className="nav__item">
            <h2 className="nav__title">Content</h2>

            <ul className="nav__ul">
              <li>
                <a href="#">
                  <Link to="/">Home</Link>
                </a>
              </li>
              <li>
                <a href="#">
                  <Link to="/recipes">Recipe</Link>
                </a>
              </li>

              <li>
                <a href="#">
                  <Link to="/about">About</Link>
                </a>
              </li>

              <li>
                <a href="#">
                  <Link to="/favorites">Favorite Recipes</Link>
                </a>
              </li>
            </ul>
          </li>

          <li className="nav__item nav__item--extra">
            <h2 className="nav__title">Your Account</h2>

            <ul className="nav__ul nav__ul--extra">
              <li>
                <a href="#">
                  <Link to="/favorites">Your Favorites</Link>
                </a>
              </li>

              <li>
                <a href="#">
                  <Link to="/profile">Your Profile</Link>
                </a>
              </li>

              <li>
                <a href="#">
                  <Link to="/settings">Account Settings</Link>
                </a>
              </li>
            </ul>
          </li>

          <li className="nav__item">
            <h2 className="nav__title">Others</h2>

            <ul className="nav__ul">
              <li>
                <a href="#">
                  <Link to="">Sitemap</Link>
                </a>
              </li>
            </ul>
          </li>
        </ul>

        <div className="legal">
          <p>&copy; 2024. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
