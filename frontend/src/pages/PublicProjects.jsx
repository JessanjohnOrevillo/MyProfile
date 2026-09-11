import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/PublicProjects.css";

function PublicProjects() {
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

            const response = await api.get("/projects");

            setProjects(response.data);
        } catch (error) {
            console.error("Projects error:", error);
            setError("Unable to load projects.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="public-projects-page">
            {/* NAVBAR */}
            <nav className="public-projects-navbar">
                <div className="public-projects-navbar-container">
                    <Link
                        to="/"
                        className="public-projects-logo"
                    >
                        Portfolio<span>.</span>
                    </Link>

                    <div className="public-projects-nav-links">
                        <Link to="/">Home</Link>
                        <a href="/#about">About</a>
                        <a href="/#skills">Skills</a>
                        <a href="/#experience">Experience</a>
                        <Link to="/projects">Projects</Link>
                        <a href="/#contact">Contact</a>
                    </div>

                    <Link
                        to="/contact"
                        className="public-projects-contact-button"
                    >
                        Let's Talk
                    </Link>
                </div>
            </nav>

            {/* PAGE HEADER */}
            <section className="public-projects-header">
                <div className="public-projects-container">
                    <span className="public-projects-eyebrow">
                        MY WORK
                    </span>

                    <h1>
                        Projects I've built.
                    </h1>

                    <p>
                        A collection of web applications and systems
                        I've developed using modern frontend, backend,
                        and database technologies.
                    </p>
                </div>
            </section>

            {/* PROJECTS */}
            <main className="public-projects-main">
                <div className="public-projects-container">
                    {loading && (
                        <div className="public-projects-state">
                            <span className="public-projects-loader"></span>
                            <p>Loading projects...</p>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="public-projects-state public-projects-error">
                            <h3>Something went wrong.</h3>
                            <p>{error}</p>

                            <button
                                onClick={fetchProjects}
                                className="public-projects-retry"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {!loading &&
                        !error &&
                        projects.length === 0 && (
                            <div className="public-projects-state">
                                <h3>No projects yet.</h3>
                                <p>
                                    Projects will appear here once they
                                    are published.
                                </p>
                            </div>
                        )}

                    {!loading &&
                        !error &&
                        projects.length > 0 && (
                            <div className="public-projects-grid">
                                {projects.map((project, index) => (
                                    <article
                                        className="public-project-card"
                                        key={project.id}
                                    >
                                        {/* IMAGE */}
                                        <div className="public-project-image">
                                            {project.image ? (
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL.replace("/api", "")}/storage/${project.image}`}
                                                    alt={project.title}
                                                />
                                            ) : (
                                                <div className="public-project-placeholder">
                                                    <span>PROJECT</span>
                                                </div>
                                            )}

                                            <span className="public-project-number">
                                                {String(index + 1).padStart(
                                                    2,
                                                    "0"
                                                )}
                                            </span>
                                        </div>

                                        {/* CONTENT */}
                                        <div className="public-project-content">
                                            <div className="public-project-top">
                                                <span className="public-project-label">
                                                    PROJECT
                                                </span>

                                                <span className="public-project-status">
                                                    Published
                                                </span>
                                            </div>

                                            <h2>
                                                {project.title}
                                            </h2>

                                            <p className="public-project-description">
                                                {project.description}
                                            </p>

                                            {/* SKILLS */}
                                            {project.skills?.length > 0 && (
                                                <div className="public-project-skills">
                                                    {project.skills.map(
                                                        (skill) => (
                                                            <span
                                                                key={skill.id}
                                                            >
                                                                {skill.name}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            )}

                                            {/* LINKS */}
                                            <div className="public-project-actions">
                                                <Link
                                                    to={`/projects/${project.id}`}
                                                    className="public-project-details"
                                                >
                                                    View Details
                                                    <span>→</span>
                                                </Link>

                                                <div className="public-project-external-links">
                                                    {project.github_url && (
                                                        <a
                                                            href={
                                                                project.github_url
                                                            }
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            GitHub ↗
                                                        </a>
                                                    )}

                                                    {project.demo_url && (
                                                        <a
                                                            href={
                                                                project.demo_url
                                                            }
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            Demo ↗
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                </div>
            </main>

            {/* CTA */}
            <section className="public-projects-cta">
                <div className="public-projects-container">
                    <div className="public-projects-cta-box">
                        <div>
                            <span>
                                HAVE A PROJECT IN MIND?
                            </span>

                            <h2>
                                Let's build something
                                <strong> useful.</strong>
                            </h2>

                            <p>
                                I'm open to development opportunities,
                                collaborations, and interesting projects.
                            </p>
                        </div>

                        <Link
                            to="/contact"
                            className="public-projects-cta-button"
                        >
                            Get In Touch →
                        </Link>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="public-projects-footer">
                <div className="public-projects-container public-projects-footer-container">
                    <div className="public-projects-footer-brand">
                        <strong>
                            Portfolio<span>.</span>
                        </strong>

                        <span>
                            Full-Stack Developer
                        </span>
                    </div>

                    <div className="public-projects-footer-links">
                        <Link to="/">Home</Link>
                        <Link to="/projects">Projects</Link>
                        <Link to="/contact">Contact</Link>
                    </div>

                    <p>
                        © {new Date().getFullYear()} Jessan John B. Orevillo.
                        All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default PublicProjects;