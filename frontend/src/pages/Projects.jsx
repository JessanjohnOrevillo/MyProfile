import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Projects.css";

function Projects() {
    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/admin/projects");

            setProjects(response.data);
        } catch (error) {
            console.error("Projects error:", error);

            if (error.response?.status === 401) {
                localStorage.removeItem("admin_token");
                localStorage.removeItem("admin_user");

                navigate("/admin/login");
                return;
            }

            if (error.response?.status === 403) {
                setError(
                    "You do not have permission to view projects."
                );
                return;
            }

            setError("Unable to load projects.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (project) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${project.title}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/projects/${project.id}`);

            setProjects((previousProjects) =>
                previousProjects.filter(
                    (item) => item.id !== project.id
                )
            );
        } catch (error) {
            console.error("Delete project error:", error);

            if (error.response?.status === 401) {
                localStorage.removeItem("admin_token");
                localStorage.removeItem("admin_user");

                navigate("/admin/login");
                return;
            }

            if (error.response?.status === 403) {
                setError(
                    "You do not have permission to delete projects."
                );
                return;
            }

            setError("Unable to delete project.");
        }
    };

    return (
        <div className="projects-page">
            <div className="projects-header">
                <div>
                    <h1>Projects</h1>

                    <p>
                        Manage the projects displayed on your portfolio.
                    </p>
                </div>

                <button
                    className="projects-add-button"
                    onClick={() =>
                        navigate("/admin/projects/create")
                    }
                >
                    + Add Project
                </button>
            </div>

            {error && (
                <div className="projects-error">
                    {error}
                </div>
            )}

            <div className="projects-card">
                {loading ? (
                    <div className="projects-message">
                        Loading projects...
                    </div>
                ) : projects.length === 0 ? (
                    <div className="projects-message">
                        <h3>No projects yet</h3>

                        <p>
                            Add your first project to your portfolio.
                        </p>

                        <button
                            className="projects-add-button"
                            onClick={() =>
                                navigate(
                                    "/admin/projects/create"
                                )
                            }
                        >
                            + Add Project
                        </button>
                    </div>
                ) : (
                    <div className="projects-table-wrapper">
                        <table className="projects-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Status</th>
                                    <th>Skills</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {projects.map((project) => (
                                    <tr key={project.id}>
                                        <td>
                                            <strong>
                                                {project.title}
                                            </strong>
                                        </td>

                                        <td>
                                            <span
                                                className={`project-status ${project.status}`}
                                            >
                                                {project.status}
                                            </span>
                                        </td>

                                        <td>
                                            {project.skills &&
                                            project.skills.length > 0
                                                ? project.skills
                                                      .map(
                                                          (skill) =>
                                                              skill.name
                                                      )
                                                      .join(", ")
                                                : "No skills"}
                                        </td>

                                        <td>
                                            <div className="project-actions">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/projects/edit/${project.id}`
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            project
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

export default Projects;
