import "./Home.css";
import LinkedinSvg from "../../images/linkedin";
import GithubSvg from "../../images/github";
import Profile from "../../images/trong-profile.png";

import { useRef, useEffect, useState } from "react";
import { useSectionNavigation } from "../../hooks/useSectionNavigation";

function Home() {
  const myRef = useRef<HTMLHeadingElement>(null);
  const [myElementIsVisible, setMyElementIsVisible] = useState(false);
  console.log("myElementIsVisible", myElementIsVisible);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      setMyElementIsVisible(entry.isIntersecting);
    });
    if (myRef.current) {
      observer.observe(myRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, []);
  const { useScrollBehavior } = useSectionNavigation();
  const { handleMenuItemClick } = useScrollBehavior();
  return (
    <>
      <section id="home" className="homepage-section">
        <div className="home-container">
          <div className="home-picture">
            <img src={Profile} alt="profile picture" />
          </div>
          <div className="home-text">
            <p className="home-text-p1">Hello, I'm</p>
            <h1 ref={myRef} className={myElementIsVisible ? "home-name" : ""}>
              {myElementIsVisible ? "Trong Ong" : ""}
            </h1>
            <p className="home-text-p2"> Software Developer</p>
            <div className="home-btn-container">
              <button>Download CV</button>
              <button>
                <a onClick={() => handleMenuItemClick("contact")}>Contact Me</a>
              </button>
            </div>
            <div className="home-socials-container">
              <LinkedinSvg className="home-icon" />
              <GithubSvg className="home-icon" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export default Home;
