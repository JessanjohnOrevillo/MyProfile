import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Messages.css";

function Messages() {
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/messages");

            setMessages(response.data);
        } catch (error) {
            console.error("Messages error:", error);

            if (error.response?.status === 401) {
                localStorage.removeItem("admin_token");
                localStorage.removeItem("admin_user");

                navigate("/admin/login");
                return;
            }

            if (error.response?.status === 403) {
                setError(
                    "You do not have permission to view messages."
                );
                return;
            }

            setError("Unable to load messages.");
        } finally {
            setLoading(false);
        }
    };

    const openMessage = async (message) => {
        setSelectedMessage(message);

        if (message.status === "unread") {
            try {
                const response = await api.patch(
                    `/messages/${message.id}`,
                    {
                        status: "read",
                    }
                );

                setMessages((previousMessages) =>
                    previousMessages.map((item) =>
                        item.id === message.id
                            ? response.data.data
                            : item
                    )
                );

                setSelectedMessage(response.data.data);
            } catch (error) {
                console.error(
                    "Update message status error:",
                    error
                );

                if (error.response?.status === 401) {
                    localStorage.removeItem("admin_token");
                    localStorage.removeItem("admin_user");

                    navigate("/admin/login");
                    return;
                }

                setError(
                    "Unable to mark the message as read."
                );
            }
        }
    };

    const closeMessage = () => {
        setSelectedMessage(null);
    };

    const toggleMessageStatus = async (message) => {
        const newStatus =
            message.status === "unread"
                ? "read"
                : "unread";

        try {
            const response = await api.patch(
                `/messages/${message.id}`,
                {
                    status: newStatus,
                }
            );

            setMessages((previousMessages) =>
                previousMessages.map((item) =>
                    item.id === message.id
                        ? response.data.data
                        : item
                )
            );

            if (selectedMessage?.id === message.id) {
                setSelectedMessage(response.data.data);
            }
        } catch (error) {
            console.error(
                "Toggle message status error:",
                error
            );

            if (error.response?.status === 401) {
                localStorage.removeItem("admin_token");
                localStorage.removeItem("admin_user");

                navigate("/admin/login");
                return;
            }

            setError("Unable to update message status.");
        }
    };

    const handleDelete = async (message) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete the message from "${message.name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/messages/${message.id}`);

            setMessages((previousMessages) =>
                previousMessages.filter(
                    (item) => item.id !== message.id
                )
            );

            if (selectedMessage?.id === message.id) {
                setSelectedMessage(null);
            }
        } catch (error) {
            console.error(
                "Delete message error:",
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
                    "You do not have permission to delete messages."
                );
                return;
            }

            setError("Unable to delete message.");
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return "";
        }

        return new Date(date).toLocaleString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
            }
        );
    };

    const unreadCount = useMemo(() => {
        return messages.filter(
            (message) => message.status === "unread"
        ).length;
    }, [messages]);

    const readCount = useMemo(() => {
        return messages.filter(
            (message) => message.status === "read"
        ).length;
    }, [messages]);

    const filteredMessages = useMemo(() => {
        if (filter === "unread") {
            return messages.filter(
                (message) => message.status === "unread"
            );
        }

        if (filter === "read") {
            return messages.filter(
                (message) => message.status === "read"
            );
        }

        return messages;
    }, [messages, filter]);

    return (
        <div className="messages-page">
            <div className="messages-header">
                <div>
                    <h1>Messages</h1>

                    <p>
                        Manage messages received from your
                        portfolio contact form.
                    </p>
                </div>

                <button
                    type="button"
                    className="messages-refresh-button"
                    onClick={fetchMessages}
                    disabled={loading}
                >
                    {loading ? "Refreshing..." : "Refresh"}
                </button>
            </div>

            {error && (
                <div className="messages-error">
                    {error}
                </div>
            )}

            {!loading && messages.length > 0 && (
                <div className="messages-summary">
                    <button
                        type="button"
                        className={
                            filter === "all"
                                ? "message-filter active"
                                : "message-filter"
                        }
                        onClick={() => setFilter("all")}
                    >
                        <span>All</span>
                        <strong>
                            {messages.length}
                        </strong>
                    </button>

                    <button
                        type="button"
                        className={
                            filter === "unread"
                                ? "message-filter active"
                                : "message-filter"
                        }
                        onClick={() =>
                            setFilter("unread")
                        }
                    >
                        <span>Unread</span>
                        <strong>
                            {unreadCount}
                        </strong>
                    </button>

                    <button
                        type="button"
                        className={
                            filter === "read"
                                ? "message-filter active"
                                : "message-filter"
                        }
                        onClick={() => setFilter("read")}
                    >
                        <span>Read</span>
                        <strong>
                            {readCount}
                        </strong>
                    </button>
                </div>
            )}

            <div className="messages-card">
                {loading ? (
                    <div className="messages-message">
                        Loading messages...
                    </div>
                ) : messages.length === 0 ? (
                    <div className="messages-message">
                        <h3>No messages yet</h3>

                        <p>
                            Messages submitted through your
                            contact form will appear here.
                        </p>
                    </div>
                ) : filteredMessages.length === 0 ? (
                    <div className="messages-message">
                        <h3>No {filter} messages</h3>

                        <p>
                            There are currently no messages
                            in this category.
                        </p>
                    </div>
                ) : (
                    <div className="messages-table-wrapper">
                        <table className="messages-table">
                            <thead>
                                <tr>
                                    <th>Status</th>
                                    <th>Sender</th>
                                    <th>Subject</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredMessages.map(
                                    (message) => (
                                        <tr
                                            key={message.id}
                                            className={
                                                message.status ===
                                                "unread"
                                                    ? "message-unread"
                                                    : ""
                                            }
                                        >
                                            <td>
                                                <span
                                                    className={`message-status ${message.status}`}
                                                >
                                                    {
                                                        message.status
                                                    }
                                                </span>
                                            </td>

                                            <td>
                                                <div className="message-sender">
                                                    <strong>
                                                        {
                                                            message.name
                                                        }
                                                    </strong>

                                                    <span>
                                                        {
                                                            message.email
                                                        }
                                                    </span>
                                                </div>
                                            </td>

                                            <td>
                                                <strong>
                                                    {
                                                        message.subject
                                                    }
                                                </strong>
                                            </td>

                                            <td>
                                                <span className="message-date">
                                                    {formatDate(
                                                        message.created_at
                                                    )}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="messages-actions">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openMessage(
                                                                message
                                                            )
                                                        }
                                                    >
                                                        View
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            toggleMessageStatus(
                                                                message
                                                            )
                                                        }
                                                    >
                                                        {message.status ===
                                                        "unread"
                                                            ? "Mark Read"
                                                            : "Mark Unread"}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                message
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {selectedMessage && (
                <div
                    className="message-modal-overlay"
                    onClick={closeMessage}
                >
                    <div
                        className="message-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="message-modal-header">
                            <div>
                                <h2>
                                    {
                                        selectedMessage.subject
                                    }
                                </h2>

                                <p>
                                    {formatDate(
                                        selectedMessage.created_at
                                    )}
                                </p>
                            </div>

                            <button
                                type="button"
                                className="message-modal-close"
                                onClick={closeMessage}
                            >
                                ×
                            </button>
                        </div>

                        <div className="message-modal-sender">
                            <div>
                                <span>Name</span>

                                <strong>
                                    {
                                        selectedMessage.name
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>Email</span>

                                <strong>
                                    {
                                        selectedMessage.email
                                    }
                                </strong>
                            </div>
                        </div>

                        <div className="message-modal-content">
                            <span>Message</span>

                            <p>
                                {
                                    selectedMessage.message
                                }
                            </p>
                        </div>

                        <div className="message-modal-actions">
                            <button
                                type="button"
                                className="message-modal-status-button"
                                onClick={() =>
                                    toggleMessageStatus(
                                        selectedMessage
                                    )
                                }
                            >
                                {selectedMessage.status ===
                                "unread"
                                    ? "Mark as Read"
                                    : "Mark as Unread"}
                            </button>

                            <button
                                type="button"
                                className="message-modal-delete-button"
                                onClick={() =>
                                    handleDelete(
                                        selectedMessage
                                    )
                                }
                            >
                                Delete
                            </button>

                            <button
                                type="button"
                                className="message-modal-close-button"
                                onClick={closeMessage}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Messages;