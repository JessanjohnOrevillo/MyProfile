import { useState } from "react";
import api from "../services/api";
import "../styles/Contact.css";

function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [customSubject, setCustomSubject] = useState("");
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const subjectOptions = [
        "Job Opportunity",
        "Freelance Project",
        "Development Project",
        "Collaboration",
        "Internship Opportunity",
        "General Inquiry",
        "Other",
    ];

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setSuccess("");
        setError("");
    };

    const handleSubjectChange = (event) => {
        const value = event.target.value;

        setFormData((previous) => ({
            ...previous,
            subject: value,
        }));

        if (value !== "Other") {
            setCustomSubject("");
        }

        setSuccess("");
        setError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSending(true);
        setSuccess("");
        setError("");

        const finalSubject =
            formData.subject === "Other"
                ? customSubject.trim()
                : formData.subject;

        if (!finalSubject) {
            setError("Please provide a subject for your message.");
            setSending(false);
            return;
        }

        try {
            const response = await api.post("/messages", {
                ...formData,
                subject: finalSubject,
            });

            setSuccess(
                response.data.message ||
                    "Your message has been sent successfully."
            );

            setFormData({
                name: "",
                email: "",
                subject: "",
                message: "",
            });

            setCustomSubject("");
        } catch (error) {
            console.error("Contact form error:", error);

            if (error.response?.data?.errors) {
                const validationErrors =
                    error.response.data.errors;

                const firstError = Object.values(
                    validationErrors
                )[0]?.[0];

                setError(
                    firstError ||
                        "Please check the form and try again."
                );
            } else if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError(
                    "Unable to send your message. Please try again."
                );
            }
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="contact-page">
            <div className="contact-container">
                <div className="contact-header">
                    <span className="contact-label">
                        GET IN TOUCH
                    </span>

                    <h1>Let's Work Together</h1>

                    <p>
                        Have a project in mind, an opportunity to discuss,
                        or simply want to connect? I'd be happy to hear
                        from you.
                    </p>
                </div>

                <div className="contact-content">
                    <div className="contact-info">
                        <div className="contact-info-heading">
                            <span>CONTACT</span>

                            <h2>
                                Let's start a conversation.
                            </h2>

                            <p>
                                Whether you have a project, job opportunity,
                                or an idea you'd like to discuss, feel free
                                to reach out.
                            </p>
                        </div>

                        <div className="contact-info-card">
                            <div className="contact-info-icon">
                                ✉
                            </div>

                            <div>
                                <h3>Email</h3>

                                <p>
                                    Send me a message through the contact
                                    form and I'll get back to you as soon
                                    as possible.
                                </p>
                            </div>
                        </div>

                        <div className="contact-info-card">
                            <div className="contact-info-icon">
                                ↗
                            </div>

                            <div>
                                <h3>Opportunities</h3>

                                <p>
                                    I'm interested in discussing full-stack
                                    development projects and career
                                    opportunities.
                                </p>
                            </div>
                        </div>

                        <div className="contact-info-card">
                            <div className="contact-info-icon">
                                +
                            </div>

                            <div>
                                <h3>Collaboration</h3>

                                <p>
                                    Have an idea? Tell me what you're working
                                    on and how I can help bring it to life.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="contact-form-card">
                        <div className="contact-form-heading">
                            <span>SEND A MESSAGE</span>

                            <h2>Tell me what you have in mind.</h2>

                            <p>
                                Fill out the form below and your message will
                                be sent directly to my portfolio inbox.
                            </p>
                        </div>

                        {success && (
                            <div
                                className="contact-success"
                                role="status"
                            >
                                <span>✓</span>

                                <div>
                                    <strong>Message sent</strong>

                                    <p>{success}</p>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div
                                className="contact-error"
                                role="alert"
                            >
                                <span>!</span>

                                <div>
                                    <strong>Something went wrong</strong>

                                    <p>{error}</p>
                                </div>
                            </div>
                        )}

                        <form
                            className="contact-form"
                            onSubmit={handleSubmit}
                        >
                            <div className="contact-form-row">
                                <div className="contact-field">
                                    <label htmlFor="name">
                                        Your Name
                                    </label>

                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                        autoComplete="name"
                                        maxLength="255"
                                        required
                                    />
                                </div>

                                <div className="contact-field">
                                    <label htmlFor="email">
                                        Email Address
                                    </label>

                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        maxLength="255"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="contact-field">
                                <label htmlFor="subject">
                                    What would you like to discuss?
                                </label>

                                <div className="contact-select-wrapper">
                                    <select
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleSubjectChange}
                                        required
                                    >
                                        <option value="" disabled>
                                            Select an inquiry type
                                        </option>

                                        {subjectOptions.map((option) => (
                                            <option
                                                key={option}
                                                value={option}
                                            >
                                                {option}
                                            </option>
                                        ))}
                                    </select>

                                    <span className="contact-select-arrow">
                                        ▼
                                    </span>
                                </div>
                            </div>

                            {formData.subject === "Other" && (
                                <div className="contact-field">
                                    <label htmlFor="customSubject">
                                        Subject
                                    </label>

                                    <input
                                        id="customSubject"
                                        type="text"
                                        value={customSubject}
                                        onChange={(event) => {
                                            setCustomSubject(
                                                event.target.value
                                            );
                                            setSuccess("");
                                            setError("");
                                        }}
                                        placeholder="Enter your subject"
                                        maxLength="255"
                                        required
                                    />
                                </div>
                            )}

                            <div className="contact-field">
                                <div className="contact-message-label">
                                    <label htmlFor="message">
                                        Message
                                    </label>

                                    <span>
                                        {formData.message.length}/2000
                                    </span>
                                </div>

                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Tell me about your project, opportunity, or question..."
                                    rows="7"
                                    maxLength="2000"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="contact-submit-button"
                                disabled={sending}
                            >
                                {sending ? (
                                    <>
                                        <span className="contact-spinner"></span>
                                        Sending Message...
                                    </>
                                ) : (
                                    <>
                                        Send Message
                                        <span>→</span>
                                    </>
                                )}
                            </button>

                            <p className="contact-form-note">
                                Your information will only be used to respond
                                to your message.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;