import "./ForgotPassword.css";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../../../api/auth";
import { useAsync } from "@react-hookz/web";
import { useEffect, useState } from "react";

type FormFields = {
  email: string;
};

function ForgotPassword() {
  const [forgotPasswordState, forgotPasswordActions] = useAsync(forgotPassword);
  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    setError(false);
    setSuccess(false);
    forgotPasswordActions.execute(data.email);
  };

  useEffect(() => {
    if (forgotPasswordState.status === "success") {
      setSuccess(true);
    }
    if (forgotPasswordState.status === "error") {
      setError(true);
    }
  }, [forgotPasswordState]);

  return (
    <section id="forgot-password" className="forgot-password-section">
      <div className="forgot-password-container">
        <h1 className="forgot-password-title">Forgot Password</h1>
        <form
          className="forgot-password-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              type="text"
              placeholder="Email"
            />
            {errors.email && <div>{errors.email.message}</div>}
          </div>
          <button
            disabled={forgotPasswordState.status === "loading"}
            type="submit"
          >
            {forgotPasswordState.status === "loading" ? "Loading..." : "Send"}
          </button>
          {success && (
            <div className="success-message">
              Password reset email sent successfully! Check your email!
            </div>
          )}
          {error && (
            <div className="error-message">
              An error occurred. Please try again.
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

export default ForgotPassword;
