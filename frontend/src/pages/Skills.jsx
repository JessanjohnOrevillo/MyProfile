import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Skills.css";

function Skills() {
    const navigate = useNavigate();

    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingSkill, setEditingSkill] = useState(null);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        category: "",
        proficiency: 80,
    });

    const categoryOptions = [
        "Frontend",
        "Backend",
        "Database",
        "Tools",
        "IoT / Embedded",
        "Design",
    ];

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/skills");

            setSkills(response.data);
        } catch (error) {
            console.error("Skills error:", error);

            if (error.response?.status === 401) {
                localStorage.removeItem("admin_token");
                localStorage.removeItem("admin_user");

                navigate("/admin/login");
                return;
            }

            if (error.response?.status === 403) {
                setError(
                    "You do not have permission to view skills."
                );
                return;
            }

            setError("Unable to load skills.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const openAddForm = () => {
        setEditingSkill(null);

        setFormData({
            name: "",
            category: "",
            proficiency: 80,
        });

        setError("");
        setShowForm(true);
    };

    const openEditForm = (skill) => {
        setEditingSkill(skill);

        setFormData({
            name: skill.name || "",
            category: skill.category || "",
            proficiency: skill.proficiency ?? 80,
        });

        setError("");
        setShowForm(true);
    };

    const closeForm = () => {
        if (saving) {
            return;
        }

        setShowForm(false);
        setEditingSkill(null);

        setFormData({
            name: "",
            category: "",
            proficiency: 80,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSaving(true);

        try {
            const data = {
                name: formData.name,
                category: formData.category,
                proficiency: Number(formData.proficiency),
            };

            if (editingSkill) {
                const response = await api.put(
                    `/skills/${editingSkill.id}`,
                    data
                );

                setSkills((previousSkills) =>
                    previousSkills.map((skill) =>
                        skill.id === editingSkill.id
                            ? response.data.skill
                            : skill
                    )
                );
            } else {
                const response = await api.post(
                    "/skills",
                    data
                );

                setSkills((previousSkills) => [
                    ...previousSkills,
                    response.data.skill,
                ]);
            }

            closeForm();
        } catch (error) {
            console.error("Save skill error:", error);

            if (error.response?.status === 401) {
                localStorage.removeItem("admin_token");
                localStorage.removeItem("admin_user");

                navigate("/admin/login");
                return;
            }

            if (error.response?.status === 403) {
                setError(
                    "You do not have permission to manage skills."
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

            setError("Unable to save skill.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (skill) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${skill.name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/skills/${skill.id}`);

            setSkills((previousSkills) =>
                previousSkills.filter(
                    (item) => item.id !== skill.id
                )
            );
        } catch (error) {
            console.error("Delete skill error:", error);

            if (error.response?.status === 401) {
                localStorage.removeItem("admin_token");
                localStorage.removeItem("admin_user");

                navigate("/admin/login");
                return;
            }

            if (error.response?.status === 403) {
                setError(
                    "You do not have permission to delete skills."
                );
                return;
            }

            setError("Unable to delete skill.");
        }
    };

    return (
        <div className="skills-page">
            <div className="skills-header">
                <div>
                    <h1>Skills</h1>

                    <p>
                        Manage the technical skills displayed on
                        your portfolio.
                    </p>
                </div>

                <button
                    type="button"
                    className="skills-add-button"
                    onClick={openAddForm}
                >
                    + Add Skill
                </button>
            </div>

            {error && (
                <div className="skills-error">
                    {error}
                </div>
            )}

            {showForm && (
                <div className="skills-form-card">
                    <div className="skills-form-header">
                        <div>
                            <h2>
                                {editingSkill
                                    ? "Edit Skill"
                                    : "Add Skill"}
                            </h2>

                            <p>
                                {editingSkill
                                    ? "Update the skill information."
                                    : "Add a new skill to your portfolio."}
                            </p>
                        </div>

                        <button
                            type="button"
                            className="skills-close-button"
                            onClick={closeForm}
                            disabled={saving}
                        >
                            ×
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="skills-form-grid">
                            <div className="skills-form-field">
                                <label htmlFor="name">
                                    Skill Name
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. React.js"
                                    required
                                />
                            </div>

                            <div className="skills-form-field">
                                <label htmlFor="category">
                                    Category
                                </label>

                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>
                                        Select a category
                                    </option>

                                    {categoryOptions.map(
                                        (category) => (
                                            <option
                                                key={category}
                                                value={category}
                                            >
                                                {category}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="skills-form-field">
                                <label htmlFor="proficiency">
                                    Proficiency
                                </label>

                                <div className="skills-proficiency-input">
                                    <input
                                        id="proficiency"
                                        type="number"
                                        name="proficiency"
                                        value={
                                            formData.proficiency
                                        }
                                        onChange={handleChange}
                                        min="0"
                                        max="100"
                                        required
                                    />

                                    <span>%</span>
                                </div>
                            </div>
                        </div>

                        <div className="skills-form-actions">
                            <button
                                type="button"
                                className="skills-cancel-button"
                                onClick={closeForm}
                                disabled={saving}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="skills-save-button"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : editingSkill
                                    ? "Update Skill"
                                    : "Save Skill"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="skills-card">
                {loading ? (
                    <div className="skills-message">
                        Loading skills...
                    </div>
                ) : skills.length === 0 ? (
                    <div className="skills-message">
                        <h3>No skills yet</h3>

                        <p>
                            Add your first technical skill to your
                            portfolio.
                        </p>

                        <button
                            type="button"
                            className="skills-add-button"
                            onClick={openAddForm}
                        >
                            + Add Skill
                        </button>
                    </div>
                ) : (
                    <div className="skills-table-wrapper">
                        <table className="skills-table">
                            <thead>
                                <tr>
                                    <th>Skill</th>
                                    <th>Category</th>
                                    <th>Proficiency</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {skills.map((skill) => (
                                    <tr key={skill.id}>
                                        <td>
                                            <strong>
                                                {skill.name}
                                            </strong>
                                        </td>

                                        <td>
                                            <span className="skill-category">
                                                {skill.category}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="skill-proficiency">
                                                <div className="skill-progress">
                                                    <div
                                                        className="skill-progress-bar"
                                                        style={{
                                                            width: `${skill.proficiency}%`,
                                                        }}
                                                    ></div>
                                                </div>

                                                <span>
                                                    {
                                                        skill.proficiency
                                                    }
                                                    %
                                                </span>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="skills-actions">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openEditForm(
                                                            skill
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            skill
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Skills;