import "./Home.css";
import LinkedinSvg from "../../images/linkedin";
import GithubSvg from "../../images/github";
import Profile from "../../images/trong-profile.png";

function Home() {
  return (
    <>
      <section id="home" className="home-section">
        <div className="home-container">
          <div className="home-picture">
            <img src={Profile} alt="John Doe profile picture" />
          </div>
          <div className="home-text">
            <p className="home-text-p1">Hello, I'm</p>
            <h1 className="home-name">John Doe</h1>
            <p className="home-text-p2">Software Developer</p>
            <div className="home-btn-container">
              <button>Download CV</button>
              <button>Contact Info</button>
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
