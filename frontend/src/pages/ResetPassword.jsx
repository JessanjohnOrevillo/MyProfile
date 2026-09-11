import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import "../styles/ResetPassword.css";

function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] =
        useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");

        if (!token || !email) {
            setError(
                "This password reset link is invalid or incomplete."
            );
            return;
        }

        if (password !== passwordConfirmation) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post(
                "/reset-password",
                {
                    token,
                    email,
                    password,
                    password_confirmation:
                        passwordConfirmation,
                }
            );

            setMessage(
                response.data.message ||
                    "Password reset successfully."
            );

            setPassword("");
            setPasswordConfirmation("");

            setTimeout(() => {
                navigate("/admin/login");
            }, 2000);
        } catch (error) {
            console.error(
                "Password reset error:",
                error
            );

            if (error.response?.data?.errors) {
                const validationErrors =
                    error.response.data.errors;

                const firstError = Object.values(
                    validationErrors
                )[0]?.[0];

                setError(
                    firstError ||
                        "Unable to reset your password."
                );
            } else if (error.response?.data?.message) {
                setError(
                    error.response.data.message
                );
            } else {
                setError(
                    "Unable to reset your password. The link may have expired."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-password-page">
            <div className="reset-password-card">
                <div className="reset-password-header">
                    <h1>Reset Password</h1>

                    <p>
                        Create a new password for your
                        administrator account.
                    </p>
                </div>

                {message && (
                    <div className="reset-password-success">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="reset-password-error">
                        {error}
                    </div>
                )}

                <form
                    className="reset-password-form"
                    onSubmit={handleSubmit}
                >
                    <div className="reset-password-field">
                        <label htmlFor="password">
                            New Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            placeholder="Enter new password"
                            minLength={8}
                            required
                        />
                    </div>

                    <div className="reset-password-field">
                        <label htmlFor="password_confirmation">
                            Confirm New Password
                        </label>

                        <input
                            id="password_confirmation"
                            type="password"
                            value={passwordConfirmation}
                            onChange={(event) =>
                                setPasswordConfirmation(
                                    event.target.value
                                )
                            }
                            placeholder="Confirm new password"
                            minLength={8}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="reset-password-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Resetting..."
                            : "Reset Password"}
                    </button>
                </form>

                <button
                    type="button"
                    className="reset-password-back"
                    onClick={() =>
                        navigate("/admin/login")
                    }
                >
                    Back to Login
                </button>
            </div>
        </div>
    );
}

export default ResetPassword;