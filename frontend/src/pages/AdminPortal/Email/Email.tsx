import "./Email.css";
import { getMessages, setFavoriteMessages } from "../../../api/message";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { format } from "date-fns";

interface FormFields {
  id: number;
  title: string;
  name: string;
  email: string;
  message: string;
  is_open: boolean;
  is_favorite: boolean;
  created_at: string;
}

function Email() {
  const [messages, setMessages] = useState<FormFields[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // useState for Select All
  const [isChecked, setIsChecked] = useState(false);
  // useState for Select Individual
  const [isIndividualChecked, setIsIndividualChecked] = useState(false);

  // Messages
  const [totalMessages, setTotalMessages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 50;

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };
  const toggleIndividualCheckbox = async (id: number) => {
    setIsIndividualChecked(!isIndividualChecked);
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const [fetchedMessages, total] = await getMessages(
          currentPage,
          itemsPerPage
        );
        setMessages(fetchedMessages);
        setTotalMessages(total);
      } catch (error) {
        console.error("Error fetching messages", error);
      }
    };

    fetchMessages();
  }, [currentPage]);

  const handleFavoriteToggle = async (id: number) => {
    const message = messages.find((email) => email.id === id);
    if (!message) return;

    const updatedFavoriteStatus = !message.is_favorite;
    try {
      // Update the Favorite Call
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
    navigate(`/email/message/${id}`);
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
              {`${currentPage}-${Math.min(
                currentPage * itemsPerPage,
                totalMessages
              )} of ${totalMessages}`}
            </div>
            <div className="arrow-selector">
              <span
                className="material-symbols-outlined"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                arrow_back_ios
              </span>
              <span
                className="material-symbols-outlined"
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, Math.ceil(totalMessages / itemsPerPage))
                  )
                }
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
                key={email.id}
                className="email-list"
                onClick={() => handleMessageClick(email.id)}
              >
                <label className="email-icon">
                  <div
                    className="box-checkbox"
                    onClick={(event) => {
                      event.stopPropagation(); // Stop event propagation
                      toggleIndividualCheckbox(email.id); // Invoke toggleIndividualCheckbox
                    }}
                  >
                    <span
                      className={`material-symbols-outlined ${
                        isIndividualChecked ? "checked" : ""
                      }`}
                    >
                      {isIndividualChecked
                        ? "check_box"
                        : "check_box_outline_blank"}
                    </span>
                  </div>
                  <div
                    className="star-checkbox"
                    onChange={() => {}}
                    onClick={(event) => {
                      event.stopPropagation(); // Stop event propagation
                      handleFavoriteToggle(email.id); // Invoke handleFavoriteToggle
                    }}
                  >
                    {" "}
                    <span
                      className={`material-symbols-outlined checkbox-icon ${
                        email.is_favorite ? "checked" : ""
                      }`}
                    >
                      {email.is_favorite ? "star_rate_half" : "star"}
                    </span>
                  </div>
                </label>
                <div className="email-list-title">
                  <p>{email.title}</p>
                </div>
                <div className="email-list-description">
                  <p>{email.message}</p>
                </div>
                <div>
                  <p>{format(new Date(email.created_at), "MM-dd-yyyy")}</p>
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
