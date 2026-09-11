import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/AdminLayout.css";

function AdminLayout() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("admin_user");

        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("User data error:", error);
            }
        }
    }, []);

    const handleLogout = async () => {
        try {
            await api.post("/logout");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem("admin_token");
            localStorage.removeItem("admin_user");

            navigate("/admin/login");
        }
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <h2>Portfolio Admin</h2>
                </div>

                <nav className="admin-sidebar-nav">
                    <NavLink
                        to="/admin"
                        end
                        className={({ isActive }) =>
                            `admin-nav-item ${
                                isActive ? "active" : ""
                            }`
                        }
                    >
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/admin/projects"
                        className={({ isActive }) =>
                            `admin-nav-item ${
                                isActive ? "active" : ""
                            }`
                        }
                    >
                        Projects
                    </NavLink>

                    <NavLink
                        to="/admin/skills"
                        className={({ isActive }) =>
                            `admin-nav-item ${
                                isActive ? "active" : ""
                            }`
                        }
                    >
                        Skills
                    </NavLink>

                    <NavLink
                        to="/admin/experience"
                        className={({ isActive }) =>
                            `admin-nav-item ${
                                isActive ? "active" : ""
                            }`
                        }
                    >
                        Experience
                    </NavLink>

                    <NavLink
                        to="/admin/messages"
                        className={({ isActive }) =>
                            `admin-nav-item ${
                                isActive ? "active" : ""
                            }`
                        }
                    >
                        Messages
                    </NavLink>

                    <NavLink
                        to="/admin/profile"
                        className={({ isActive }) =>
                            `admin-nav-item ${
                                isActive ? "active" : ""
                            }`
                        }
                    >
                        Profile
                    </NavLink>
                </nav>

                <div className="admin-sidebar-footer">
                    <div className="admin-sidebar-user">
                        <strong>
                            {user?.name || "Administrator"}
                        </strong>

                        <span>
                            {user?.email || "Admin Account"}
                        </span>
                    </div>

                    <button
                        type="button"
                        className="admin-logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </aside>

            <main className="admin-layout-content">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;