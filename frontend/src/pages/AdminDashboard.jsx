import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState({
        projects: 0,
        skills: 0,
        experiences: 0,
        messages: 0,
        unread_messages: 0,
        recent_messages: [],
        recent_projects: [],
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/dashboard");

            setDashboard(response.data);
        } catch (error) {
            console.error(
                "Dashboard error:",
                error
            );

            if (error.response?.status === 401) {
                localStorage.removeItem("admin_token");
                localStorage.removeItem("admin_user");

                navigate("/admin/login");
                return;
            }

            if (error.response?.status === 403) {
                setError(
                    "You do not have permission to access the dashboard."
                );
                return;
            }

            setError(
                "Unable to load dashboard data."
            );
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return "";
        }

        return new Date(date).toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric",
            }
        );
    };

    if (loading) {
        return (
            <div className="dashboard-page">
                <div className="dashboard-message">
                    Loading dashboard...
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div>
                    <h1>Dashboard</h1>

                    <p>
                        Overview of your portfolio system.
                    </p>
                </div>
            </div>

            {error && (
                <div className="dashboard-error">
                    {error}
                </div>
            )}

            <div className="dashboard-stats">
                <div className="dashboard-stat-card">
                    <div className="dashboard-stat-icon">
                        📁
                    </div>

                    <div>
                        <span>Projects</span>
                        <strong>
                            {dashboard.projects}
                        </strong>
                    </div>
                </div>

                <div className="dashboard-stat-card">
                    <div className="dashboard-stat-icon">
                        💻
                    </div>

                    <div>
                        <span>Skills</span>
                        <strong>
                            {dashboard.skills}
                        </strong>
                    </div>
                </div>

                <div className="dashboard-stat-card">
                    <div className="dashboard-stat-icon">
                        💼
                    </div>

                    <div>
                        <span>Experiences</span>
                        <strong>
                            {dashboard.experiences}
                        </strong>
                    </div>
                </div>

                <div className="dashboard-stat-card">
                    <div className="dashboard-stat-icon">
                        ✉️
                    </div>

                    <div>
                        <span>Messages</span>
                        <strong>
                            {dashboard.messages}
                        </strong>
                    </div>
                </div>

                <div className="dashboard-stat-card dashboard-unread-card">
                    <div className="dashboard-stat-icon">
                        🔔
                    </div>

                    <div>
                        <span>Unread Messages</span>
                        <strong>
                            {dashboard.unread_messages}
                        </strong>
                    </div>
                </div>
            </div>

            <div className="dashboard-content-grid">
                <section className="dashboard-section">
                    <div className="dashboard-section-header">
                        <div>
                            <h2>Recent Messages</h2>

                            <p>
                                Latest messages from visitors.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/admin/messages"
                                )
                            }
                        >
                            View All
                        </button>
                    </div>

                    {dashboard.recent_messages.length ===
                    0 ? (
                        <div className="dashboard-empty">
                            No messages yet.
                        </div>
                    ) : (
                        <div className="dashboard-list">
                            {dashboard.recent_messages.map(
                                (message) => (
                                    <div
                                        className="dashboard-list-item"
                                        key={message.id}
                                    >
                                        <div className="dashboard-list-main">
                                            <h3>
                                                {
                                                    message.subject
                                                }
                                            </h3>

                                            <p>
                                                {
                                                    message.name
                                                }{" "}
                                                •{" "}
                                                {
                                                    message.email
                                                }
                                            </p>
                                        </div>

                                        <div className="dashboard-list-meta">
                                            <span
                                                className={`dashboard-status ${message.status}`}
                                            >
                                                {
                                                    message.status
                                                }
                                            </span>

                                            <small>
                                                {formatDate(
                                                    message.created_at
                                                )}
                                            </small>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </section>

                <section className="dashboard-section">
                    <div className="dashboard-section-header">
                        <div>
                            <h2>Recent Projects</h2>

                            <p>
                                Latest projects in your portfolio.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/admin/projects"
                                )
                            }
                        >
                            View All
                        </button>
                    </div>

                    {dashboard.recent_projects.length ===
                    0 ? (
                        <div className="dashboard-empty">
                            No projects yet.
                        </div>
                    ) : (
                        <div className="dashboard-list">
                            {dashboard.recent_projects.map(
                                (project) => (
                                    <div
                                        className="dashboard-list-item"
                                        key={project.id}
                                    >
                                        <div className="dashboard-list-main">
                                            <h3>
                                                {
                                                    project.title
                                                }
                                            </h3>

                                            <p>
                                                Project
                                                added{" "}
                                                {formatDate(
                                                    project.created_at
                                                )}
                                            </p>
                                        </div>

                                        <div className="dashboard-list-meta">
                                            <span
                                                className={`dashboard-status ${project.status}`}
                                            >
                                                {
                                                    project.status
                                                }
                                            </span>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default AdminDashboard;