import "./ExperienceCard.css";

interface ExperienceDetails {
  title: string;
  date: string;
  responsibilities?: string[];
  description?: string[];
  link?: string;
}

function ExperienceCard({ details }: { details: ExperienceDetails }) {
  return (
    <section className="experience-card">
      <div className="experience-card-content">
        <h1>{details.title}</h1>
        <time className="experience-card-duration">{details.date}</time>
        {(details.responsibilities || details.description) && (
          <ul>
            {details.responsibilities?.map((item, index) => (
              <li key={`responsibility-${index}`}>{item}</li>
            ))}
            {details.description?.map((item, index) => (
              <li key={`description-${index}`}>{item}</li>
            ))}
          </ul>
        )}
        {details.link && (
          <a
            href={details.link}
            target="_blank"
            rel="noopener noreferrer"
            className="experience-card-button"
          >
            View Project
          </a>
        )}
      </div>
    </section>
  );
}

export default ExperienceCard;
