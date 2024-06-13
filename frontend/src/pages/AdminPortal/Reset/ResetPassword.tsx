import "./Reset.css";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../../api/auth";
import { useAsync } from "@react-hookz/web";
import { useEffect } from "react";

type FormFields = {
  new_password: string;
};

function ResetPassword() {
  const navigate = useNavigate();
  const [resetPasswordState, resetPasswordActions] = useAsync(resetPassword);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    resetPasswordActions.execute(token, data.new_password);
  };

  useEffect(() => {
    if (resetPasswordState.status === "success") {
      navigate("/login");
    } else if (resetPasswordState.status === "error") {
      alert(
        "An error occurred while resetting your password. Please try again."
      );
    }
  }, [resetPasswordState, navigate]);

  return (
    <section id="reset-password" className="reset-section">
      <div className="reset-container">
        <h1 className="reset-title">Reset Password</h1>
        <form className="reset-form" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input
              {...register("new_password", {
                required: "Password is required",
              })}
              type="password"
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
