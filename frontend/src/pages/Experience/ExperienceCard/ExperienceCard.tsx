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
    <section className="work-experience-card">
      <h6>{details.title}</h6>
      <time className="work-duration">{details.date}</time>
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
          className="project-link"
        >
          (View Project)
        </a>
      )}
    </section>
  );
}

export default ExperienceCard;
