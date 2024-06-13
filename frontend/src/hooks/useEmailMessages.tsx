import {
  getMessages,
  getSearchMessages,
  setFavoriteMessages,
  setIsOpen,
  deleteMessages,
} from "../api/message";
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
  created_at: string;
}
export const useEmailMessages = () => {
  // State to hold the list of email messages
  const [messages, setMessages] = useState<FormFields[]>([]);
  // State to hold search input
  const [searchInput, setSearchInput] = useState("");
  // State to hold the submitted search query
  const [searchQuery, setSearchQuery] = useState("");
  // State to hold any error
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchMessages = async () => {
      setError(null);
      try {
        let fetchedMessages;
        let total;
        if (searchQuery) {
          [fetchedMessages, total] = await getSearchMessages(
            searchQuery,
            currentPage,
            itemsPerPage
          );
        } else {
          [fetchedMessages, total] = await getMessages(
            currentPage,
            itemsPerPage
          );
        }
        setMessages(fetchedMessages);
        setTotalMessages(total);
        const newIndividualCheckedState = fetchedMessages.reduce(
          (acc, message) => {
            acc[message.id] = false;
            return acc;
          },
          {} as { [key: number]: boolean }
        );
        setIndividualCheckedState(newIndividualCheckedState);
      } catch (err) {
        console.error("Error fetching messages", err);
        setError("Error fetching messages");
      }
    };
    fetchMessages();
  }, [currentPage, searchQuery, itemsPerPage]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

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
      .filter(([isChecked]) => isChecked)
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
    // Toggle the is_open status
    const email = messages.find((email) => email.id === id);
    if (!email) {
      console.error("Email not found");
      return;
    }

    const updatedIsOpenStatus = !email.is_open;
    try {
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
  return {
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
  };
};
