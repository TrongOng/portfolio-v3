import "./Login.css";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../../api/auth";
import { useAsync } from "@react-hookz/web";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthProvider";

type FormFields = {
  email: string;
  password: string;
};

function Login() {
  const { session, authenticated } = useAuth();
  const navigate = useNavigate();
  const [loginState, loginActions] = useAsync(login);
  const [status, setStatus] = useState<"not-executed" | "loading">(
    "not-executed"
  );
  const [error, setError] = useState<boolean>(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    setError(false);
    loginActions.execute(data.email, data.password);
  };

  useEffect(() => {
    if (authenticated) {
      navigate("/email");
    }
  }, [authenticated, navigate]);

  useEffect(() => {
    if (loginState.status === "success" && loginState.result) {
      if (status === "not-executed") {
        setStatus("loading");
        session.create(loginState.result.access_token);
      }
    }
    if (loginState.status === "error") {
      setError(true);
    }
  }, [loginState, navigate, session, status]);

  return (
    <section id="login" className="login-section">
      <div className="login-container">
        <h1 className="login-title">Login</h1>
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
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
              name="email"
              placeholder="Email"
            />
            {errors.email && <div>{errors.email.message}</div>}
          </div>
          <div>
            <input
              {...register("password", {
                required: "Password is required",
              })}
              type="password"
              name="password"
              placeholder="Password"
            />
            {errors.password && <div>{errors.password.message}</div>}
          </div>
          <div className="forgot-password">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
          <button disabled={loginState.status === "loading"} type="submit">
            {loginState.status === "loading" ? "Loading..." : "Submit"}
          </button>
          {error && <div>Login failed, please try again.</div>}
        </form>
      </div>
    </section>
  );
}

export default Login;
