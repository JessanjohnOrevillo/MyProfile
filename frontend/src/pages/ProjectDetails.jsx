import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/ProjectDetails.css";

function ProjectDetails() {
    const { id } = useParams();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchProject();
    }, [id]);

    const fetchProject = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(`/projects/${id}`);

            setProject(response.data);
        } catch (error) {
            console.error("Project details error:", error);
            setError("Unable to load this project.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="project-details-page">
                <div className="project-details-loading">
                    Loading project...
                </div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="project-details-page">
                <nav className="project-details-navbar">
                    <div className="project-details-navbar-container">
                        <Link
                            to="/"
                            className="project-details-logo"
                        >
                            Portfolio<span>.</span>
                        </Link>

                        <div className="project-details-nav">
                            <Link to="/">
                                Home
                            </Link>

                            <Link to="/projects">
                                Projects
                            </Link>

                            <Link to="/contact">
                                Contact
                            </Link>

                            <Link
                                to="/contact"
                                className="project-details-talk"
                            >
                                Let's Talk
                            </Link>
                        </div>
                    </div>
                </nav>

                <div className="project-details-error">
                    <div>
                        <h1>Project Not Found</h1>

                        <p>
                            {error || "This project does not exist."}
                        </p>

                        <Link
                            to="/projects"
                            className="project-details-button project-details-button-primary"
                        >
                            ← Back to Projects
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="project-details-page">
            {/* NAVBAR */}
            <nav className="project-details-navbar">
                <div className="project-details-navbar-container">
                    <Link
                        to="/"
                        className="project-details-logo"
                    >
                        Portfolio<span>.</span>
                    </Link>

                    <div className="project-details-nav">
                        <Link to="/">
                            Home
                        </Link>

                        <Link to="/projects">
                            Projects
                        </Link>

                        <Link to="/contact">
                            Contact
                        </Link>

                        <Link
                            to="/contact"
                            className="project-details-talk"
                        >
                            Let's Talk
                        </Link>
                    </div>
                </div>
            </nav>

            {/* PROJECT HEADER */}
            <header className="project-details-header">
                <div className="project-details-container">
                    <Link
                        to="/projects"
                        className="project-details-back"
                    >
                        ← Back to Projects
                    </Link>

                    <span className="project-details-eyebrow">
                        PROJECT DETAILS
                    </span>

                    <h1>
                        {project.title}
                    </h1>

                    <p>
                        {project.description}
                    </p>
                </div>
            </header>

            {/* PROJECT CONTENT */}
            <main>
                <div className="project-details-container">
                    <div className="project-details-content">
                        {/* PROJECT IMAGE */}
                        <div className="project-details-image">
                            {project.image ? (
                                <img
                                    src={`${import.meta.env.VITE_API_URL.replace("/api", "")}/storage/${project.image}`}
                                    alt={project.title}
                                />
                            ) : (
                                <div className="project-details-placeholder">
                                    PROJECT
                                </div>
                            )}
                        </div>

                        {/* PROJECT INFORMATION */}
                        <div className="project-details-info">
                            <section className="project-details-section">
                                <span className="project-details-label">
                                    ABOUT THE PROJECT
                                </span>

                                <h2>
                                    What I built.
                                </h2>

                                <p>
                                    {project.description}
                                </p>
                            </section>

                            {/* TECHNOLOGIES */}
                            {project.skills?.length > 0 && (
                                <section className="project-details-section">
                                    <span className="project-details-label">
                                        TECHNOLOGIES
                                    </span>

                                    <div className="project-details-skills">
                                        {project.skills.map((skill) => (
                                            <span
                                                className="project-details-skill"
                                                key={skill.id}
                                            >
                                                {skill.name}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* PROJECT LINKS */}
                            {(project.github_url ||
                                project.demo_url) && (
                                <section className="project-details-section">
                                    <span className="project-details-label">
                                        PROJECT LINKS
                                    </span>

                                    <div className="project-details-actions">
                                        {project.github_url && (
                                            <a
                                                href={project.github_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="project-details-button project-details-button-primary"
                                            >
                                                View on GitHub ↗
                                            </a>
                                        )}

                                        {project.demo_url && (
                                            <a
                                                href={project.demo_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="project-details-button project-details-button-secondary"
                                            >
                                                Open Live Demo ↗
                                            </a>
                                        )}
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>

                    {/* CTA */}
                    <section className="project-details-cta">
                        <h2>
                            Let's build your next project.
                        </h2>

                        <p>
                            I'm open to development opportunities,
                            collaborations, and new projects.
                        </p>

                        <Link to="/contact">
                            Get In Touch →
                        </Link>
                    </section>
                </div>
            </main>

            {/* FOOTER */}
            <footer className="project-details-footer">
                <div className="project-details-container">
                    <p>
                        © {new Date().getFullYear()} Jessan John B. Orevillo.
                        All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default ProjectDetails;