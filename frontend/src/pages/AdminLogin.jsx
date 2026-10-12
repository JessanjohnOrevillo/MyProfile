import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/AdminLogin.css";

function AdminLogin() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await api.post("/login", formData);

            const { token, user } = response.data;

            if (user.role !== "admin") {
                setError("You do not have administrator access.");
                setLoading(false);
                return;
            }

            localStorage.setItem("admin_token", token);
            localStorage.setItem(
                "admin_user",
                JSON.stringify(user)
            );

            navigate("/admin");
        } catch (error) {
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("Unable to connect to the server.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-background">
                <div className="admin-login-glow admin-login-glow-one"></div>
                <div className="admin-login-glow admin-login-glow-two"></div>
            </div>

            <div className="admin-login-container">
                <div className="admin-login-card">
                    <div className="admin-login-header">
                        <div className="admin-login-logo">
                            <span>P</span>
                        </div>

                        <span className="admin-login-badge">
                            ADMIN PANEL
                        </span>

                        <h1>Welcome back.</h1>

                        <p>
                            Sign in to manage your portfolio.
                        </p>
                    </div>

                    <form
                        className="admin-login-form"
                        onSubmit={handleSubmit}
                    >
                        {error && (
                            <div className="admin-login-error">
                                <span className="admin-login-error-icon">
                                    !
                                </span>

                                <span>{error}</span>
                            </div>
                        )}

                        <div className="admin-login-field">
                            <label htmlFor="email">
                                Email address
                            </label>

                            <div className="admin-login-input-wrapper">
                                <span className="admin-login-input-icon">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    >
                                        <rect
                                            x="3"
                                            y="5"
                                            width="18"
                                            height="14"
                                            rx="2"
                                        />
                                        <path d="m3 7 9 6 9-6" />
                                    </svg>
                                </span>

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="admin-login-field">
                            <div className="admin-login-label-row">
                                <label htmlFor="password">
                                    Password
                                </label>

                                <Link
                                    to="/reset-password"
                                    className="admin-login-forgot"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <div className="admin-login-input-wrapper">
                                <span className="admin-login-input-icon">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    >
                                        <rect
                                            x="5"
                                            y="10"
                                            width="14"
                                            height="10"
                                            rx="2"
                                        />
                                        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                                    </svg>
                                </span>

                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    required
                                />

                                <button
                                    type="button"
                                    className="admin-login-password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                        >
                                            <path d="M3 3l18 18" />
                                            <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                                            <path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c5 0 8.5 4 9.8 6a17.7 17.7 0 0 1-3.1 3.7" />
                                            <path d="M6.6 6.6C4.5 8 3.1 9.8 2.2 11c1.3 2 4.8 6 9.8 6 1.4 0 2.7-.3 3.8-.8" />
                                        </svg>
                                    ) : (
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                        >
                                            <path d="M2.2 12s3.5-6 9.8-6 9.8 6 9.8 6-3.5 6-9.8 6-9.8-6-9.8-6Z" />
                                            <circle
                                                cx="12"
                                                cy="12"
                                                r="2.5"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="admin-login-button"
                            disabled={loading}
                        >
                            <span>
                                {loading
                                    ? "Signing in..."
                                    : "Sign in to dashboard"}
                            </span>

                            {!loading && (
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path d="M5 12h14" />
                                    <path d="m13 6 6 6-6 6" />
                                </svg>
                            )}

                            {loading && (
                                <span className="admin-login-spinner"></span>
                            )}
                        </button>
                    </form>

                    <div className="admin-login-footer">
                        <span className="admin-login-footer-line"></span>

                        <span>Portfolio Management</span>

                        <span className="admin-login-footer-line"></span>
                    </div>

                    <Link
                        to="/"
                        className="admin-login-back"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                        >
                            <path d="M19 12H5" />
                            <path d="m12 19-7-7 7-7" />
                        </svg>

                        Back to portfolio
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;