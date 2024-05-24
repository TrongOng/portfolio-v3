import "./ExperienceCard.css";

interface ExperienceDetails {
  title: string;
  date: string;
  responsibilities?: string[];
  description?: string[];
}

function ExperienceCard({ details }: { details: ExperienceDetails }) {
  return (
    <div className="work-experience-card">
      <h6>{details.title}</h6>
      <div className="work-duration">{details.date}</div>
      {details.responsibilities && ( // Conditionally render responsibilities
        <ul>
          {details.responsibilities.map((item: string) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      {details.description && ( // Conditionally render description
        <ul>
          {details.description.map((item: string) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ExperienceCard;
