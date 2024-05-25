import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setOpenMenu(!openMenu);
  };

  const handleMenuItemClick = (id: string) => {
    const targetSection = document.getElementById(id);
    const navbar = document.querySelector(".navbar-section") as HTMLElement;
    const currentPath = location.pathname;

    if (currentPath === "/") {
      if (targetSection && navbar) {
        const navbarHeight = navbar.offsetHeight;
        const offsetTop = targetSection.offsetTop - navbarHeight;
        window.scrollTo({ top: offsetTop, behavior: "smooth" });
        setOpenMenu(false); // Close the menu if it's open
      }
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    const closeMenuOnClickOutside = (event: MouseEvent) => {
      console.log("Clicked outside");
      const navbar = document.querySelector(".navbar-section");
      if (navbar && !navbar.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("click", closeMenuOnClickOutside);
    return () => {
      document.removeEventListener("click", closeMenuOnClickOutside);
    };
  }, []);

  return (
    <>
      <section className="navbar-section">
        <nav className={`navbar-container ${openMenu ? "active" : ""}`}>
          <div className="nav-logo">John Doe</div>
          <button
            className={`nav-btn ${openMenu ? "active" : ""}`}
            onClick={toggleMenu}
          >
            <span className="material-symbols-outlined">
              {openMenu ? "close" : "menu"}
            </span>
          </button>
          <div className={`navbar-items ${openMenu ? "active" : ""}`}>
            <ul>
              <li>
                <a
                  onClick={() => handleMenuItemClick("home")}
                  className="navbar-content"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  onClick={() => handleMenuItemClick("about")}
                  className="navbar-content"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  onClick={() => handleMenuItemClick("experience")}
                  className="navbar-content"
                >
                  Experience
                </a>
              </li>
              <li>
                <a
                  onClick={() => handleMenuItemClick("contact")}
                  className="navbar-content"
                >
                  Contact Me
                </a>
              </li>
              <li>
                <Link to="/login" className="navbar-content">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </section>
    </>
  );
}

export default Navbar;
