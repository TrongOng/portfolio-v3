import "./Email.css";
import { getMessages, setFavoriteMessages } from "../../../api/message";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../../Navbar/Navbar";
import Login from "../Login/Login";

interface FormFields {
  id: number;
  title: string;
  name: string;
  email: string;
  message: string;
  is_open: boolean;
  is_favorite: boolean;
}

function Email() {
  const [messages, setMessages] = useState<FormFields[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const userMessages = await getMessages();
        setMessages(userMessages);
      } catch (err) {
        setError("Failed to load messages");
      }
    };
    fetchMessages();
  }, []);

  const handleFavoriteToggle = async (id: number) => {
    const message = messages.find((email) => email.id === id);
    if (!message) return;

    const updatedFavoriteStatus = !message.is_favorite;
    try {
      await setFavoriteMessages(id, updatedFavoriteStatus);
      setMessages((prevMessages) =>
        prevMessages.map((email) =>
          email.id === id
            ? { ...email, is_favorite: updatedFavoriteStatus }
            : email
        )
      );
    } catch (error) {
      console.error("Failed to update favorite status");
    }
  };

  const handleMessageNavigation = async (id: number) => {
    const message = messages.find((email) => email.id === id);
    if (!message) return;
    navigate(`/message/${id}`);
  };

  return (
    <section id="email" className="email-section">
      <form className="email-search-bar">
        <span className="material-symbols-outlined">search</span>
        <input
          className="search-input"
          type="search"
          placeholder="Search Mail"
        ></input>
      </form>
      <div className="email-list-container">
        {error ? (
          <div>{error}</div>
        ) : (
          messages.map((email) => (
            <div
              className="email-list"
              onClick={() => handleMessageNavigation(email.id)}
            >
              <label className="email-icon">
                <input className="box-checkbox" type="checkbox" />
                <input
                  className="star-checkbox"
                  type="checkbox"
                  checked={email.is_favorite}
                  onChange={() => handleFavoriteToggle(email.id)}
                />
              </label>
              <div className="email-list-title">
                <p>{email.title}</p>
              </div>
              <div className="email-list-description">
                <p>{email.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default Email;
