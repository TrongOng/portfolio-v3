import "./Email.css";
import { getMessages, setFavoriteMessages } from "../../../api/message";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const [isChecked, setIsChecked] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalEmails, setTotalEmails] = useState(0);

  const emailsPerPage = 50;

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };

  const handleNextPage = () => {
    if (currentPage * emailsPerPage < totalEmails) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const [userMessages, totalCount] = await getMessages(
          (currentPage - 1) * emailsPerPage,
          emailsPerPage
        );
        console.log("Fetched messages:", userMessages); // Log fetched messages
        console.log("Total count:", totalCount); // Log total count
        setMessages(userMessages);
        setTotalEmails(totalCount);
      } catch (err) {
        setError("Failed to load messages");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [currentPage]);

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

  const handleMessageClick = async (id: number) => {
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
        <div className="email-tools">
          <div className="checkbox-selector" onClick={toggleCheckbox}>
            <span
              className={`material-symbols-outlined checkbox-icon ${
                isChecked ? "checked" : ""
              }`}
            >
              {isChecked ? "check_box" : "check_box_outline_blank"}
            </span>
          </div>
          <div>
            <div>
              {`${(currentPage - 1) * emailsPerPage + 1}-${Math.min(
                currentPage * emailsPerPage,
                totalEmails
              )} of ${totalEmails}`}
            </div>
            <div className="arrow-selector">
              <span
                className="material-symbols-outlined"
                onClick={handlePreviousPage}
              >
                arrow_back_ios
              </span>
              <span
                className="material-symbols-outlined"
                onClick={handleNextPage}
              >
                arrow_forward_ios
              </span>
            </div>
          </div>
        </div>
        <div className="email-list-body">
          {isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>{error}</div>
          ) : messages ? (
            messages.map((email) => (
              <div
                className="email-list"
                onClick={() => handleMessageClick(email.id)}
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
          ) : (
            <div>No Emails To Display</div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Email;
