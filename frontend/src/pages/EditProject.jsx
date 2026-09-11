import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/ProjectForm.css";

function EditProject() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingSkills, setLoadingSkills] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        description: "",
        image: null,
        github_url: "",
        demo_url: "",
        status: "draft",
        skills: [],
    });

    const [currentImage, setCurrentImage] = useState("");
    const [imagePreview, setImagePreview] = useState("");

    useEffect(() => {
        fetchProject();
        fetchSkills();
    }, [id]);

    const fetchProject = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(`/projects/${id}`);

            const project = response.data;

            setFormData({
                title: project.title || "",
                slug: project.slug || "",
                description: project.description || "",
                image: null,
                github_url: project.github_url || "",
                demo_url: project.demo_url || "",
                status: project.status || "draft",
                skills: project.skills
                    ? project.skills.map((skill) => skill.id)
                    : [],
            });

            if (project.image) {
                setCurrentImage(
                    `${import.meta.env.VITE_API_URL.replace("/api", "")}/storage/${project.image}`
                );
            }
        } catch (error) {
            console.error("Project error:", error);

            if (error.response?.status === 401) {
                localStorage.removeItem("admin_token");
                localStorage.removeItem("admin_user");

                navigate("/admin/login");
                return;
            }

            if (error.response?.status === 404) {
                setError("Project not found.");
                return;
            }

            if (error.response?.status === 403) {
                setError(
                    "You do not have permission to view this project."
                );
                return;
            }

            setError("Unable to load project.");
        } finally {
            setLoading(false);
        }
    };

    const fetchSkills = async () => {
        try {
            setLoadingSkills(true);

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

            setError("Unable to load skills.");
        } finally {
            setLoadingSkills(false);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (!file) {
            setFormData((previous) => ({
                ...previous,
                image: null,
            }));

            setImagePreview("");

            return;
        }

        setFormData((previous) => ({
            ...previous,
            image: file,
        }));

        const previewUrl = URL.createObjectURL(file);

        setImagePreview(previewUrl);
    };

    const handleSkillChange = (skillId) => {
        const id = Number(skillId);

        setFormData((previous) => {
            const alreadySelected = previous.skills.includes(id);

            return {
                ...previous,
                skills: alreadySelected
                    ? previous.skills.filter(
                          (selectedId) => selectedId !== id
                      )
                    : [...previous.skills, id],
            };
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSaving(true);

        try {
            const data = new FormData();

            data.append("_method", "PUT");

            data.append("title", formData.title);
            data.append("slug", formData.slug);
            data.append("description", formData.description);
            data.append("github_url", formData.github_url);
            data.append("demo_url", formData.demo_url);
            data.append("status", formData.status);

            if (formData.image) {
                data.append("image", formData.image);
            }

            formData.skills.forEach((skillId) => {
                data.append("skills[]", skillId);
            });

            await api.post(`/projects/${id}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            navigate("/admin/projects");
        } catch (error) {
            console.error("Update project error:", error);

            if (error.response?.status === 401) {
                localStorage.removeItem("admin_token");
                localStorage.removeItem("admin_user");

                navigate("/admin/login");
                return;
            }

            if (error.response?.status === 403) {
                setError(
                    "You do not have permission to update projects."
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

            setError("Unable to update project.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="project-form-page">
                <div className="project-form-card">
                    <div className="project-form-message">
                        Loading project...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="project-form-page">
            <div className="project-form-header">
                <div>
                    <h1>Edit Project</h1>

                    <p>
                        Update your project information.
                    </p>
                </div>

                <button
                    type="button"
                    className="project-form-back-button"
                    onClick={() =>
                        navigate("/admin/projects")
                    }
                >
                    ← Back to Projects
                </button>
            </div>

            <div className="project-form-card">
                {error && (
                    <div className="project-form-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="project-form-grid">
                        <div className="project-form-field">
                            <label htmlFor="title">
                                Project Title
                            </label>

                            <input
                                id="title"
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter project title"
                                required
                            />
                        </div>

                        <div className="project-form-field">
                            <label htmlFor="slug">
                                Slug
                            </label>

                            <input
                                id="slug"
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                placeholder="project-slug"
                                required
                            />
                        </div>

                        <div className="project-form-field project-form-full">
                            <label htmlFor="description">
                                Description
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe your project..."
                                rows="6"
                                required
                            />
                        </div>

                        <div className="project-form-field project-form-full">
                            <label htmlFor="image">
                                Project Image
                            </label>

                            {currentImage && !imagePreview && (
                                <div className="project-current-image">
                                    <p className="project-form-help">
                                        Current image:
                                    </p>

                                    <img
                                        src={currentImage}
                                        alt={formData.title}
                                    />
                                </div>
                            )}

                            <input
                                id="image"
                                type="file"
                                name="image"
                                accept="image/jpeg,image/png,image/jpg,image/webp"
                                onChange={handleImageChange}
                            />

                            <p className="project-form-help">
                                Leave empty to keep the current image.
                                JPG, JPEG, PNG, or WEBP. Maximum size:
                                5 MB.
                            </p>

                            {imagePreview && (
                                <div className="project-image-preview">
                                    <p className="project-form-help">
                                        New image preview:
                                    </p>

                                    <img
                                        src={imagePreview}
                                        alt="New project preview"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="project-form-field">
                            <label htmlFor="github_url">
                                GitHub URL
                            </label>

                            <input
                                id="github_url"
                                type="url"
                                name="github_url"
                                value={formData.github_url}
                                onChange={handleChange}
                                placeholder="https://github.com/username/project"
                            />
                        </div>

                        <div className="project-form-field">
                            <label htmlFor="demo_url">
                                Live Demo URL
                            </label>

                            <input
                                id="demo_url"
                                type="url"
                                name="demo_url"
                                value={formData.demo_url}
                                onChange={handleChange}
                                placeholder="https://example.com"
                            />
                        </div>

                        <div className="project-form-field">
                            <label htmlFor="status">
                                Status
                            </label>

                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="draft">
                                    Draft
                                </option>

                                <option value="published">
                                    Published
                                </option>
                            </select>
                        </div>

                        <div className="project-form-field project-form-full">
                            <label>Skills</label>

                            {loadingSkills ? (
                                <p className="project-form-info">
                                    Loading skills...
                                </p>
                            ) : skills.length === 0 ? (
                                <p className="project-form-info">
                                    No skills available yet. Add skills
                                    first.
                                </p>
                            ) : (
                                <div className="project-skills">
                                    {skills.map((skill) => (
                                        <label
                                            key={skill.id}
                                            className="project-skill-option"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.skills.includes(
                                                    skill.id
                                                )}
                                                onChange={() =>
                                                    handleSkillChange(
                                                        skill.id
                                                    )
                                                }
                                            />

                                            <span>
                                                {skill.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="project-form-actions">
                        <button
                            type="button"
                            className="project-form-cancel-button"
                            onClick={() =>
                                navigate("/admin/projects")
                            }
                            disabled={saving}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="project-form-save-button"
                            disabled={saving}
                        >
                            {saving
                                ? "Updating..."
                                : "Update Project"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProject;