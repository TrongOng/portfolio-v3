import "./Contact.css";
import { SubmitHandler, useForm } from "react-hook-form";
import { createMessage } from "../../api/message";
import { useAsync } from "@react-hookz/web";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

interface FormFields {
  title: string;
  name: string;
  email: string;
  message: string;
  honeypot: string;
}

function Contact() {
  const [recaptcha, setRecaptcha] = useState<string | null>(null);
  const [messageState, messageActions] = useAsync(createMessage);
  const [status, setStatus] = useState<
    "not-executed" | "loading" | "success" | "error"
  >("not-executed");
  const [error, setError] = useState<string | null>(null);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    setError(null);
    setStatus("loading");
    // Check the honeypot field before proceeding
    if (data.honeypot) {
      setError("Spam detected.");
      setStatus("error");
      return;
    }
    if (!recaptcha) {
      setError("Please complete the reCAPTCHA.");
      setStatus("error");
      return;
    }
    try {
      const token = await recaptchaRef.current.executeAsync();
      await messageActions.execute(data);
      setStatus("success");
    } catch (err) {
      setError("Failed to send message. Please try again.");
      setStatus("error");
    }
  };

  return (
    <>
      <section id="contact" className="homepage-section">
        <div className="contact-container">
          <h1 className="contact-title">Contact Me</h1>
          <form className="contact-form" onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              {...register("title", { required: "Title is required" })}
              placeholder="Title"
            />
            {errors.title && (
              <div className="error-message">{errors.title.message}</div>
            )}
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              placeholder="Full Name"
            />
            {errors.name && (
              <div className="error-message">{errors.name.message}</div>
            )}
            <input
              type="text"
              {...register("email", {
                required: "Email is required",
              })}
              placeholder="Email"
            />
            {errors.email && (
              <div className="error-message">{errors.email.message}</div>
            )}
            <textarea
              id="message"
              {...register("message", { required: "Message is required" })}
              placeholder="Message"
              rows={6}
            />
            {errors.message && (
              <div className="error-message">{errors.message.message}</div>
            )}
            {/* Honeypot field */}
            <input
              type="text"
              {...register("honeypot")}
              style={{ display: "none" }}
            />
            <button type="submit" disabled={status === "loading"}>
              SEND
            </button>
            {status === "success" && (
              <div className="success-message">Message sent successfully!</div>
            )}
            {status === "error" && <div className="error-message">{error}</div>}
          </form>
        </div>
      </section>
    </>
  );
}

export default Contact;
