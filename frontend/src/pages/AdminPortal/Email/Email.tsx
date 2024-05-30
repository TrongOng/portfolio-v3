import "./Email.css";
import {
  getMessages,
  setFavoriteMessages,
  setIsOpen,
  deleteMessages,
} from "../../../api/message";
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
  // State to hold the list of email messages
  const [messages, setMessages] = useState<FormFields[]>([]);
  // State to hold any error + loading messages
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // State to manage the select-all checkbox
  const [isChecked, setIsChecked] = useState(false);
  // State to manage individual checkboxes
  const [individualCheckedState, setIndividualCheckedState] = useState<{
    [key: number]: boolean;
  }>({});

  // message pagination states
  const [totalMessages, setTotalMessages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 50;

  const navigate = useNavigate();

  // Effect to fetch email messages when the current page changes
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const [fetchedMessages, total] = await getMessages(
          currentPage,
          itemsPerPage
        );
        setMessages(fetchedMessages);
        setTotalMessages(total);
        // Reset individual checked state when messages change
        const newIndividualCheckedState = fetchedMessages.reduce(
          (acc, message) => {
            acc[message.id] = false;
            return acc;
          },
          {} as { [key: number]: boolean }
        );
        setIndividualCheckedState(newIndividualCheckedState);
      } catch (error) {
        console.error("Error fetching messages", error);
        setError("Error fetching messages");
      }
    };

    fetchMessages();
  }, [currentPage]);

  // Function to toggle the select-all checkbox
  const toggleCheckbox = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    // Update the state for all individual checkboxes
    const newIndividualCheckedState = messages.reduce((acc, message) => {
      acc[message.id] = newCheckedState;
      return acc;
    }, {} as { [key: number]: boolean });
    setIndividualCheckedState(newIndividualCheckedState);
  };

  // Function to toggle an individual checkbox
  const toggleIndividualCheckbox = (id: number) => {
    setIndividualCheckedState((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  // Function to delete messages
  const toggleDeleteMessages = async () => {
    // Retrieve selected message IDs
    const selectedIds = Object.entries(individualCheckedState)
      .filter(([id, isChecked]) => isChecked)
      .map(([id]) => parseInt(id));

    // If no messages are selected, return
    if (selectedIds.length === 0) {
      console.log("No messages selected for deletion.");
      return;
    }

    try {
      // Delete the selected messages
      const deletedMessages = await deleteMessages(selectedIds);
      console.log("Messages deleted:", deletedMessages);

      // Refetch messages after deletion
      const [fetchedMessages, total] = await getMessages(
        currentPage,
        itemsPerPage
      );
      setMessages(fetchedMessages);
      setTotalMessages(total);
      // Reset individual checked state when messages change
      const newIndividualCheckedState = fetchedMessages.reduce(
        (acc, message) => {
          acc[message.id] = false;
          return acc;
        },
        {} as { [key: number]: boolean }
      );
      setIndividualCheckedState(newIndividualCheckedState);
    } catch (error) {
      console.error("Failed to delete messages:", error);
    }
  };

  // Function to handle the favorite status toggle for an email
  const handleFavoriteToggle = async (id: number) => {
    try {
      // Toggle the favorite status
      const message = messages.find((email) => email.id === id);
      if (!message) return;

      const updatedFavoriteStatus = !message.is_favorite;

      // Update the favorite status in the backend
      await setFavoriteMessages(id, updatedFavoriteStatus);

      // Update the favorite status in the local state
      setMessages((prevMessages) =>
        prevMessages.map((email) =>
          email.id === id
            ? { ...email, is_favorite: updatedFavoriteStatus }
            : email
        )
      );
    } catch (error) {
      console.error("Failed to update favorite status:", error);
    }
  };

  // Function to navigate to the email details page when an email is clicked
  const handleMessageClick = async (id: number) => {
    try {
      // Toggle the is_open status
      const updatedIsOpenStatus = !messages.find((email) => email.id === id)
        ?.is_open;

      // Update the is_open status in the backend
      await setIsOpen(id, updatedIsOpenStatus);

      // Update the is_open status in the local state
      setMessages((prevMessages) =>
        prevMessages.map((email) =>
          email.id === id ? { ...email, is_open: updatedIsOpenStatus } : email
        )
      );

      // Navigate to the email details page
      navigate(`/email/message/${id}`);
    } catch (error) {
      console.error("Failed to navigate to email:", error);
    }
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
          <div>
            <span
              onClick={toggleCheckbox}
              className={`material-symbols-outlined checkbox-icon ${
                isChecked ? "checked" : ""
              }`}
            >
              {isChecked ? "check_box" : "check_box_outline_blank"}
            </span>
            <span
              onClick={toggleDeleteMessages}
              className="material-symbols-outlined"
            >
              delete
            </span>
          </div>
          <div>
            <p>
              {`${currentPage}-${Math.min(
                currentPage * itemsPerPage,
                totalMessages
              )} of ${totalMessages}`}
            </p>
            <div>
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
                className="email-item"
                onClick={() => handleMessageClick(email.id)}
              >
                <div className="email-icon">
                  <div
                    className="box-checkbox"
                    onChange={() => {}}
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleIndividualCheckbox(email.id);
                    }}
                  >
                    <span
                      className={`material-symbols-outlined ${
                        individualCheckedState[email.id] ? "checked" : ""
                      }`}
                    >
                      {individualCheckedState[email.id]
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
                </div>
                <div className="email-content">
                  <p>{email.title}</p>
                  <p>{email.message}</p>
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
