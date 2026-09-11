import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Experience.css";

function Experience() {
    const navigate = useNavigate();

    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingExperience, setEditingExperience] = useState(null);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        position: "",
        company: "",
        description: "",
        start_date: "",
        end_date: "",
        is_current: false,
    });

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/experiences");

            setExperiences(response.data);
        } catch (error) {
            console.error("Experiences error:", error);

            if (error.response?.status === 401) {
                localStorage.removeItem("admin_token");
                localStorage.removeItem("admin_user");

                navigate("/admin/login");
                return;
            }

            if (error.response?.status === 403) {
                setError(
                    "You do not have permission to view experiences."
                );
                return;
            }

            setError("Unable to load experiences.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const openAddForm = () => {
        setEditingExperience(null);

        setFormData({
            position: "",
            company: "",
            description: "",
            start_date: "",
            end_date: "",
            is_current: false,
        });

        setError("");
        setShowForm(true);
    };

    const openEditForm = (experience) => {
        setEditingExperience(experience);

        setFormData({
            position: experience.position || "",
            company: experience.company || "",
            description: experience.description || "",
            start_date: experience.start_date
                ? experience.start_date.substring(0, 10)
                : "",
            end_date: experience.end_date
                ? experience.end_date.substring(0, 10)
                : "",
            is_current: Boolean(experience.is_current),
        });

        setError("");
        setShowForm(true);
    };

    const closeForm = () => {
        if (saving) {
            return;
        }

        setShowForm(false);
        setEditingExperience(null);

        setFormData({
            position: "",
            company: "",
            description: "",
            start_date: "",
            end_date: "",
            is_current: false,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSaving(true);

        try {
            const data = {
                position: formData.position,
                company: formData.company,
                description: formData.description,
                start_date: formData.start_date,
                end_date: formData.is_current
                    ? null
                    : formData.end_date || null,
                is_current: formData.is_current,
            };

            if (editingExperience) {
                const response = await api.put(
                    `/experiences/${editingExperience.id}`,
                    data
                );

                setExperiences((previousExperiences) =>
                    previousExperiences.map((experience) =>
                        experience.id === editingExperience.id
                            ? response.data.experience
                            : experience
                    )
                );
            } else {
                const response = await api.post(
                    "/experiences",
                    data
                );

                setExperiences((previousExperiences) => [
                    response.data.experience,
                    ...previousExperiences,
                ]);
            }

            closeForm();
        } catch (error) {
            console.error("Save experience error:", error);

            if (error.response?.status === 401) {
                localStorage.removeItem("admin_token");
                localStorage.removeItem("admin_user");

                navigate("/admin/login");
                return;
            }

            if (error.response?.status === 403) {
                setError(
                    "You do not have permission to manage experiences."
                );
                return;
            }

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
                return;
            }

            setError("Unable to save experience.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (experience) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete your experience at "${experience.company}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(
                `/experiences/${experience.id}`
            );

            setExperiences((previousExperiences) =>
                previousExperiences.filter(
                    (item) => item.id !== experience.id
                )
            );
        } catch (error) {
            console.error(
                "Delete experience error:",
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
                    "You do not have permission to delete experiences."
                );
                return;
            }

            setError("Unable to delete experience.");
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
                year: "numeric",
            }
        );
    };

    return (
        <div className="experience-page">
            <div className="experience-header">
                <div>
                    <h1>Experience</h1>

                    <p>
                        Manage your professional and work
                        experience.
                    </p>
                </div>

                <button
                    type="button"
                    className="experience-add-button"
                    onClick={openAddForm}
                >
                    + Add Experience
                </button>
            </div>

            {error && (
                <div className="experience-error">
                    {error}
                </div>
            )}

            {showForm && (
                <div className="experience-form-card">
                    <div className="experience-form-header">
                        <div>
                            <h2>
                                {editingExperience
                                    ? "Edit Experience"
                                    : "Add Experience"}
                            </h2>

                            <p>
                                {editingExperience
                                    ? "Update your experience information."
                                    : "Add a new experience to your portfolio."}
                            </p>
                        </div>

                        <button
                            type="button"
                            className="experience-close-button"
                            onClick={closeForm}
                            disabled={saving}
                        >
                            ×
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="experience-form-grid">
                            <div className="experience-form-field">
                                <label htmlFor="position">
                                    Position
                                </label>

                                <input
                                    id="position"
                                    type="text"
                                    name="position"
                                    value={formData.position}
                                    onChange={handleChange}
                                    placeholder="e.g. Full Stack Developer"
                                    required
                                />
                            </div>

                            <div className="experience-form-field">
                                <label htmlFor="company">
                                    Company / Organization
                                </label>

                                <input
                                    id="company"
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    placeholder="e.g. ABC Company"
                                    required
                                />
                            </div>

                            <div className="experience-form-field">
                                <label htmlFor="start_date">
                                    Start Date
                                </label>

                                <input
                                    id="start_date"
                                    type="date"
                                    name="start_date"
                                    value={formData.start_date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="experience-form-field">
                                <label htmlFor="end_date">
                                    End Date
                                </label>

                                <input
                                    id="end_date"
                                    type="date"
                                    name="end_date"
                                    value={formData.end_date}
                                    onChange={handleChange}
                                    disabled={formData.is_current}
                                />
                            </div>

                            <div className="experience-form-field experience-form-full">
                                <label htmlFor="description">
                                    Description
                                </label>

                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe your responsibilities, achievements, and work..."
                                    rows="6"
                                    required
                                />
                            </div>

                            <div className="experience-current-field experience-form-full">
                                <label className="experience-current-option">
                                    <input
                                        type="checkbox"
                                        name="is_current"
                                        checked={
                                            formData.is_current
                                        }
                                        onChange={handleChange}
                                    />

                                    <span>
                                        This is my current
                                        experience
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="experience-form-actions">
                            <button
                                type="button"
                                className="experience-cancel-button"
                                onClick={closeForm}
                                disabled={saving}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="experience-save-button"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : editingExperience
                                    ? "Update Experience"
                                    : "Save Experience"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="experience-card">
                {loading ? (
                    <div className="experience-message">
                        Loading experiences...
                    </div>
                ) : experiences.length === 0 ? (
                    <div className="experience-message">
                        <h3>No experience yet</h3>

                        <p>
                            Add your first professional
                            experience to your portfolio.
                        </p>

                        <button
                            type="button"
                            className="experience-add-button"
                            onClick={openAddForm}
                        >
                            + Add Experience
                        </button>
                    </div>
                ) : (
                    <div className="experience-table-wrapper">
                        <table className="experience-table">
                            <thead>
                                <tr>
                                    <th>Position</th>
                                    <th>Company</th>
                                    <th>Duration</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {experiences.map(
                                    (experience) => (
                                        <tr
                                            key={
                                                experience.id
                                            }
                                        >
                                            <td>
                                                <strong>
                                                    {
                                                        experience.position
                                                    }
                                                </strong>
                                            </td>

                                            <td>
                                                {
                                                    experience.company
                                                }
                                            </td>

                                            <td>
                                                <div className="experience-duration">
                                                    <span>
                                                        {formatDate(
                                                            experience.start_date
                                                        )}
                                                    </span>

                                                    <span>
                                                        -
                                                    </span>

                                                    <span>
                                                        {experience.is_current
                                                            ? "Present"
                                                            : formatDate(
                                                                  experience.end_date
                                                              )}
                                                    </span>
                                                </div>
                                            </td>

                                            <td>
                                                <span
                                                    className={`experience-status ${
                                                        experience.is_current
                                                            ? "current"
                                                            : "past"
                                                    }`}
                                                >
                                                    {experience.is_current
                                                        ? "Current"
                                                        : "Past"}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="experience-actions">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openEditForm(
                                                                experience
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                experience
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
        </div>
    );
}

export default Experience;