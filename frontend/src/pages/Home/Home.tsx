import "./Home.css";
import LinkedinSvg from "../../images/linkedin";
import GithubSvg from "../../images/github";
import Profile from "../../images/trong-profile.png";

function Home() {
  return (
    <>
      <section id="home" className="home-section">
        <div className="home-profile">
          <div className="home-profile-pic-container">
            <img src={Profile} alt="John Doe profile picture" />
          </div>
          <div className="home-text">
            <p className="home-text-p1">Hello, I'm</p>
            <h1 className="home-title">John Doe</h1>
            <p className="home-text-p2">Software Developer</p>
            <div className="home-btn-container">
              <button className="btn btn-color-1">Download CV</button>
              <button className="btn btn-color-2">Contact Info</button>
            </div>
            <div className="home-socials-container">
              <LinkedinSvg />
              <GithubSvg />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export default Home;
