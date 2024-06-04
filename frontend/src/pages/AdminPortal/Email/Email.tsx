import "./Email.css";
import { useEmailMessages } from "../../../hooks/useEmailMessages";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

function Email() {
  const {
    messages,
    searchInput,
    setSearchInput,
    handleSearchSubmit,
    error,
    isChecked,
    toggleCheckbox,
    individualCheckedState,
    toggleIndividualCheckbox,
    toggleDeleteMessages,
    handleFavoriteToggle,
    handleMessageClick,
    totalMessages,
    currentPage,
    setCurrentPage,
    itemsPerPage,
  } = useEmailMessages();

  return (
    <section id="email" className="email-section">
      <form className="email-search-bar" onSubmit={handleSearchSubmit}>
        <button className="search-button-icon" type="submit">
          <span className="material-symbols-outlined">search</span>
        </button>
        <input
          className="search-input"
          type="search"
          placeholder="Search Mail"
          value={searchInput}
          onChange={(e) => setSearchInput(e.currentTarget.value)}
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
          {error ? (
            <div>{error}</div>
          ) : messages ? (
            messages.map((email) => (
              <div
                key={email.id}
                className={`email-item ${email.is_open ? "open" : "closed"}`}
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
