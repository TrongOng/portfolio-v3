import "./ResetPassword.css";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../../../api/auth";
import { useAsync } from "@react-hookz/web";
import { useEffect, useState } from "react";

type FormFields = {
  token: string;
  new_password: string;
};

function ResetPassword() {
  const navigate = useNavigate();
  const [resetPasswordState, resetPasswordActions] = useAsync(resetPassword);
  const [status, setStatus] = useState<"not-executed" | "loading">(
    "not-executed"
  );
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [error, setError] = useState<boolean>(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    setError(false);
    resetPasswordActions.execute(token, data.new_password);
  };

  useEffect(() => {
    if (resetPasswordState.status === "success" && resetPasswordState.result) {
      if (status === "not-executed") {
        setStatus("loading");
      }
      navigate("/login");
    }
    if (resetPasswordState.status === "error") {
      setError(true);
    }
  }, [resetPasswordState, navigate, status]);

  return (
    <section id="reset-password" className="reset-password-section">
      <div className="reset-password-container">
        <h1 className="reset-password-title">Reset Password</h1>
        <form className="reset-password-form" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input
              {...register("new_password", {
                required: "Password is required",
              })}
              type="password"
              name="new_password"
              placeholder="New Password"
            />
            {errors.new_password && <div>{errors.new_password.message}</div>}
          </div>
          <button
            disabled={resetPasswordState.status === "loading"}
            type="submit"
          >
            {resetPasswordState.status === "loading" ? "Loading..." : "Submit"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default ResetPassword;
