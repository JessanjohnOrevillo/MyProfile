import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/Home.css";

function Home() {
    const [profile, setProfile] = useState(null);
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPortfolioData();
    }, []);

    const fetchPortfolioData = async () => {
        try {
            setLoading(true);

            const [
                profileResponse,
                projectsResponse,
                skillsResponse,
                experiencesResponse,
            ] = await Promise.all([
                api.get("/profile"),
                api.get("/projects"),
                api.get("/skills"),
                api.get("/experiences"),
            ]);

            setProfile(profileResponse.data);
            setProjects(projectsResponse.data);
            setSkills(skillsResponse.data);
            setExperiences(experiencesResponse.data);
        } catch (error) {
            console.error("Portfolio data error:", error);
        } finally {
            setLoading(false);
        }
    };

    // Only show the first project on the Home page.
    // All projects are still available on /projects.
    const featuredProjects = projects.slice(0, 1);

    const groupedSkills = skills.reduce((groups, skill) => {
        if (!groups[skill.category]) {
            groups[skill.category] = [];
        }

        groups[skill.category].push(skill);

        return groups;
    }, {});

    return (
        <div className="home-page">
            {/* NAVBAR */}
            <nav className="home-navbar">
                <div className="home-navbar-container">
                    <Link to="/" className="home-logo">
                        Portfolio<span>.</span>
                    </Link>

                    <div className="home-nav-links">
                        <Link to="/">Home</Link>
                        <a href="#about">About</a>
                        <a href="#skills">Skills</a>
                        <a href="#experience">Experience</a>
                        <a href="#projects">Projects</a>
                        <a href="#contact">Contact</a>
                    </div>

                    <Link to="/contact" className="home-nav-button">
                        Let's Talk
                    </Link>
                </div>
            </nav>

            {/* HERO */}
            <section className="home-hero">
                <div className="home-container home-hero-container">
                    <div className="home-hero-content">
                        <div className="home-availability">
                            <span></span>
                            Available for opportunities
                        </div>

                        <span className="home-hero-label">
                            FULL-STACK DEVELOPER
                        </span>

                        <h1>
                            {profile?.name || "Jessan John Orevillo"}
                        </h1>

                        <h2>
                            I build web applications that
                            <span> solve real problems.</span>
                        </h2>

                        <p>
                            I develop modern, responsive, and practical web
                            applications using React, Laravel, PHP, MySQL,
                            and REST APIs.
                        </p>

                        <div className="home-hero-actions">
                            <Link
                                to="/projects"
                                className="home-primary-button"
                            >
                                View My Projects
                            </Link>

                            <Link
                                to="/contact"
                                className="home-secondary-button"
                            >
                                Contact Me
                            </Link>
                        </div>

                        <div className="home-hero-stack">
                            <span>React</span>
                            <span>Laravel</span>
                            <span>PHP</span>
                            <span>MySQL</span>
                            <span>REST API</span>
                        </div>
                    </div>

                    <div className="home-hero-profile">
                        <div className="home-profile-frame">
                            <div className="home-profile-accent"></div>

                            {profile?.profile_photo_url ? (
                                <img
                                    src={profile.profile_photo_url}
                                    alt={profile.name || "Profile"}
                                    className="home-profile-photo"
                                />
                            ) : (
                                <div className="home-profile-placeholder">
                                    {profile?.name
                                        ? profile.name
                                              .charAt(0)
                                              .toUpperCase()
                                        : "J"}
                                </div>
                            )}
                        </div>

                        <div className="home-profile-card">
                            <strong>
                                {profile?.name || "Jessan John Orevillo"}
                            </strong>

                            <span>Full-Stack Developer</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* TECHNOLOGY STRIP */}
            <section className="home-tech-strip">
                <div className="home-container">
                    <span className="home-tech-title">
                        TECHNOLOGIES I WORK WITH
                    </span>

                    <div className="home-tech-list">
                        <span>React</span>
                        <span>JavaScript</span>
                        <span>Laravel</span>
                        <span>PHP</span>
                        <span>MySQL</span>
                        <span>Git</span>
                        <span>REST API</span>
                    </div>
                </div>
            </section>

            {/* FEATURED PROJECTS */}
            <section
                id="projects"
                className="home-section home-projects"
            >
                <div className="home-container">
                    <div className="home-section-heading home-project-heading">
                        <div>
                            <span>FEATURED WORK</span>

                            <h2>
                                Projects that show what I can build.
                            </h2>

                            <p>
                                A selection of applications and systems I've
                                worked on using modern web technologies.
                            </p>
                        </div>

                        <Link
                            to="/projects"
                            className="home-view-all"
                        >
                            View All Projects →
                        </Link>
                    </div>

                    {loading ? (
                        <div className="home-loading">
                            Loading projects...
                        </div>
                    ) : featuredProjects.length === 0 ? (
                        <div className="home-empty">
                            No projects available yet.
                        </div>
                    ) : (
                        <div className="home-project-grid">
                            {featuredProjects.map((project, index) => (
                                <article
                                    className="home-project-card home-project-featured"
                                    key={project.id}
                                >
                                    <div className="home-project-image">
                                        {project.image ? (
                                            <img
                                                src={`${import.meta.env.VITE_API_URL.replace("/api", "")}/storage/${project.image}`}
                                                alt={project.title}
                                            />
                                        ) : (
                                            <div className="home-project-placeholder">
                                                PROJECT
                                            </div>
                                        )}

                                        <span className="home-project-number">
                                            0{index + 1}
                                        </span>
                                    </div>

                                    <div className="home-project-content">
                                        <span className="home-project-label">
                                            FEATURED PROJECT
                                        </span>

                                        <h3>{project.title}</h3>

                                        <p>{project.description}</p>

                                        {project.skills?.length > 0 && (
                                            <div className="home-project-skills">
                                                {project.skills
                                                    .slice(0, 5)
                                                    .map((skill) => (
                                                        <span key={skill.id}>
                                                            {skill.name}
                                                        </span>
                                                    ))}
                                            </div>
                                        )}

                                        <div className="home-project-links">
                                            {project.github_url && (
                                                <a
                                                    href={project.github_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    GitHub ↗
                                                </a>
                                            )}

                                            {project.demo_url && (
                                                <a
                                                    href={project.demo_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    Live Demo ↗
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* SKILLS */}
            <section
                id="skills"
                className="home-section home-skills"
            >
                <div className="home-container">
                    <div className="home-section-heading">
                        <span>TECHNICAL SKILLS</span>

                        <h2>
                            Tools I use to turn ideas into applications.
                        </h2>
                    </div>

                    {loading ? (
                        <div className="home-loading">
                            Loading skills...
                        </div>
                    ) : (
                        <div className="home-skills-grid">
                            {Object.entries(groupedSkills).map(
                                ([category, categorySkills], index) => (
                                    <div
                                        className="home-skill-category"
                                        key={category}
                                    >
                                        <div className="home-skill-category-header">
                                            <span>
                                                {String(index + 1).padStart(
                                                    2,
                                                    "0"
                                                )}
                                            </span>

                                            <h3>{category}</h3>
                                        </div>

                                        <div className="home-skill-list">
                                            {categorySkills.map((skill) => (
                                                <div
                                                    className="home-skill-item"
                                                    key={skill.id}
                                                >
                                                    <div className="home-skill-info">
                                                        <strong>
                                                            {skill.name}
                                                        </strong>

                                                        <span>
                                                            {skill.proficiency}%
                                                        </span>
                                                    </div>

                                                    <div className="home-skill-bar">
                                                        <div
                                                            className="home-skill-progress"
                                                            style={{
                                                                width: `${skill.proficiency}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* EXPERIENCE */}
            <section
                id="experience"
                className="home-section home-experience"
            >
                <div className="home-container">
                    <div className="home-section-heading">
                        <span>EXPERIENCE</span>

                        <h2>My professional journey.</h2>
                    </div>

                    {loading ? (
                        <div className="home-loading">
                            Loading experience...
                        </div>
                    ) : experiences.length === 0 ? (
                        <div className="home-empty">
                            No experience available yet.
                        </div>
                    ) : (
                        <div className="home-timeline">
                            {experiences.map((experience) => (
                                <div
                                    className="home-timeline-item"
                                    key={experience.id}
                                >
                                    <div className="home-timeline-marker">
                                        <span></span>
                                    </div>

                                    <div className="home-experience-card">
                                        <div className="home-experience-date">
                                            {new Date(
                                                experience.start_date
                                            ).toLocaleDateString("en-US", {
                                                month: "short",
                                                year: "numeric",
                                            })}

                                            {" — "}

                                            {experience.is_current
                                                ? "Present"
                                                : experience.end_date
                                                ? new Date(
                                                      experience.end_date
                                                  ).toLocaleDateString(
                                                      "en-US",
                                                      {
                                                          month: "short",
                                                          year: "numeric",
                                                      }
                                                  )
                                                : "Present"}
                                        </div>

                                        <h3>{experience.position}</h3>

                                        <h4>{experience.company}</h4>

                                        <p>{experience.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ABOUT */}
            <section
                id="about"
                className="home-section home-about"
            >
                <div className="home-container">
                    <div className="home-about-grid">
                        <div className="home-about-heading">
                            <span>ABOUT ME</span>

                            <h2>
                                More than just
                                <strong> writing code.</strong>
                            </h2>
                        </div>

                        <div className="home-about-content">
                            <p>
                                I'm a developer who enjoys building practical
                                and user-friendly web applications. I focus on
                                creating systems that are reliable, responsive,
                                and easy to use.
                            </p>

                            <p>
                                My development experience covers frontend
                                interfaces, backend APIs, database management,
                                authentication, CRUD systems, and full-stack
                                application development.
                            </p>

                            <Link
                                to="/contact"
                                className="home-text-link"
                            >
                                Let's work together →
                            </Link>
                        </div>
                    </div>

                    <div className="home-stat-grid">
                        <div className="home-stat">
                            <strong>{projects.length}</strong>
                            <span>Projects</span>
                        </div>

                        <div className="home-stat">
                            <strong>{skills.length}</strong>
                            <span>Technologies</span>
                        </div>

                        <div className="home-stat">
                            <strong>{experiences.length}</strong>
                            <span>Experiences</span>
                        </div>

                        <div className="home-stat">
                            <strong>100%</strong>
                            <span>Commitment</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CONTACT */}
            <section
                id="contact"
                className="home-contact"
            >
                <div className="home-container">
                    <div className="home-contact-box">
                        <div>
                            <span>HAVE A PROJECT IN MIND?</span>

                            <h2>
                                Let's build something
                                <strong> great together.</strong>
                            </h2>

                            <p>
                                I'm open to discussing projects, development
                                opportunities, and new ideas.
                            </p>
                        </div>

                        <Link
                            to="/contact"
                            className="home-contact-button"
                        >
                            Get In Touch →
                        </Link>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="home-footer">
                <div className="home-container home-footer-container">
                    <div className="home-footer-brand">
                        <strong>
                            Portfolio<span>.</span>
                        </strong>

                        <span>Full-Stack Developer</span>
                    </div>

                    <div className="home-footer-links">
                        <a href="#about">About</a>
                        <a href="#skills">Skills</a>
                        <a href="#projects">Projects</a>
                        <a href="#contact">Contact</a>
                    </div>

                    <p>
                        © {new Date().getFullYear()} Jessan John Orevillo.
                        All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default Home;