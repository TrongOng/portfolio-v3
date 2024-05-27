import "./Message.css";
import { useParams } from "react-router-dom";
import { getMessage } from "../../../../api/message";
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

function Message() {
  const { id } = useParams();
  const [message, setMessage] = useState<FormFields | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("ID:", id);
    const fetchMessage = async () => {
      try {
        const messageData = await getMessage(Number(id));
        console.log("Message Data:", messageData);
        setMessage(messageData);
      } catch (err) {
        console.error("Error fetching message:", err);
        setError("Failed to load message details");
      }
    };
    fetchMessage();
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!message) {
    return <div>Loading...</div>;
  }

  return (
    <section id="message" className="message-section">
      <div className="message-container">
        <div className="message-body">
          <h1>Title: {message.title}</h1>
          <h3>Email: {message.email}</h3>
          <h3>User's Name: {message.name}</h3>
          <p>{message.message}</p>
        </div>
        <button onClick={() => navigate("/email")}>Go back to Email</button>
      </div>
    </section>
  );
}

export default Message;
