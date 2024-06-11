import { Link } from "react-router-dom";
import { useSectionNavigation } from "../../hooks/useSectionNavigation";
import "./Navbar.css";

function Navbar() {
  const { useMenuState, useScrollBehavior } = useSectionNavigation();
  const { openMenu, toggleMenu } = useMenuState();
  const { handleMenuItemClick } = useScrollBehavior();

  return (
    <section className="navbar-section">
      <nav className={`navbar-container ${openMenu ? "active" : ""}`}>
        <div className="nav-logo">
          <span>Trong Ong</span>
        </div>
        <button
          className={`nav-btn ${openMenu ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined">
            {openMenu ? "close" : "menu"}
          </span>
        </button>
        <div className={`navbar-items ${openMenu ? "active" : ""}`}>
          <ul>
            <li>
              <a onClick={() => handleMenuItemClick("home")}>Home</a>
            </li>
            <li>
              <a onClick={() => handleMenuItemClick("about")}>About</a>
            </li>
            <li>
              <a onClick={() => handleMenuItemClick("experience")}>
                Experience
              </a>
            </li>
            <li>
              <a onClick={() => handleMenuItemClick("contact")}>Contact Me</a>
            </li>
            <li>
              <Link to="/login">Admin Portal</Link>
            </li>
          </ul>
        </div>
      </nav>
    </section>
  );
}

export default Navbar;
