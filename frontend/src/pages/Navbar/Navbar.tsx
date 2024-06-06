import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);
  const [scrollTarget, setScrollTarget] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setOpenMenu(!openMenu);
  };

  const handleMenuItemClick = (id: string) => {
    if (location.pathname === "/") {
      scrollToSection(id);
    } else {
      setScrollTarget(id);
      navigate("/");
    }
  };

  const scrollToSection = (id: string) => {
    const targetSection = document.getElementById(id);
    const navbar = document.querySelector(".navbar-section") as HTMLElement;
    if (targetSection && navbar) {
      const navbarHeight = navbar.offsetHeight;
      const offsetTop = targetSection.offsetTop - navbarHeight;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
      setOpenMenu(false);
    }
  };

  useEffect(() => {
    if (scrollTarget) {
      scrollToSection(scrollTarget);
      setScrollTarget(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    const closeMenuOnClickOutside = (event: MouseEvent) => {
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
