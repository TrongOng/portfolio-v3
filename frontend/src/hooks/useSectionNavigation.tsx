import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Utility function to scroll to a section
const scrollToSection = (id: string) => {
  const targetSection = document.getElementById(id);
  const navbar = document.querySelector(".navbar-section") as HTMLElement;
  if (targetSection && navbar) {
    const navbarHeight = navbar.offsetHeight;
    const offsetTop = targetSection.offsetTop - navbarHeight;
    window.scrollTo({ top: offsetTop, behavior: "smooth" });
  }
};

// Custom hook for handling menu state
const useMenuState = (initialState = false) => {
  const [openMenu, setOpenMenu] = useState(initialState);

  const toggleMenu = useCallback(() => {
    setOpenMenu((prevOpen) => !prevOpen);
  }, []);

  const closeMenu = useCallback(() => {
    setOpenMenu(false);
  }, []);

  useEffect(() => {
    const closeMenuOnClickOutside = (event: MouseEvent) => {
      const navbar = document.querySelector(".navbar-section");
      if (navbar && !navbar.contains(event.target as Node)) {
        closeMenu();
      }
    };
    document.addEventListener("click", closeMenuOnClickOutside);
    return () => {
      document.removeEventListener("click", closeMenuOnClickOutside);
    };
  }, [closeMenu]);

  return { openMenu, toggleMenu, closeMenu };
};

// Custom hook for handling scroll behavior
const useScrollBehavior = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrollTarget, setScrollTarget] = useState<string | null>(null);

  const handleMenuItemClick = (id: string) => {
    if (location.pathname === "/") {
      scrollToSection(id);
    } else {
      setScrollTarget(id);
      navigate("/");
    }
  };

  useEffect(() => {
    if (scrollTarget) {
      scrollToSection(scrollTarget);
      setScrollTarget(null);
    }
  }, [location.pathname, scrollTarget]);

  return { handleMenuItemClick };
};

export const useSectionNavigation = () => {
  return {
    useMenuState,
    useScrollBehavior,
  };
};
