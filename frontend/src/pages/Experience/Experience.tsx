import "./Experience.css";
import ExperienceCard from "./ExperienceCard/ExperienceCard";
import { WORK_EXPERIENCE, PROJECT_EXPERIENCE } from "../../utils/data";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Custom arrow component
function CustomArrow(props: any) {
  const { className, onClick, type } = props;
  const materialIcon = type === "prev" ? "chevron_left" : "chevron_right";
  return (
    <div className={className} onClick={onClick}>
      <span className="material-symbols-outlined">{materialIcon}</span>
    </div>
  );
}

function Experience() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    nextArrow: <CustomArrow type="next" />,
    prevArrow: <CustomArrow type="prev" />,
    responsive: [
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <>
      <section id="experience" className="experience-section">
        <div>
          <h1 className="experience-title">Experience</h1>
        </div>
        <div className="experience-content">
          <p className="experience-subtitle">Work</p>
          <Slider {...settings}>
            {WORK_EXPERIENCE.map((item) => (
              <ExperienceCard key={item.title} details={item} />
            ))}
          </Slider>
        </div>
        <div className="experience-content">
          <p className="experience-subtitle">Projects</p>
          <div>
            <Slider {...settings}>
              {PROJECT_EXPERIENCE.map((item) => (
                <ExperienceCard key={item.title} details={item} />
              ))}
            </Slider>
          </div>
        </div>
      </section>
    </>
  );
}

export default Experience;
