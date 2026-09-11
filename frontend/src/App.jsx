import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Projects from "./pages/Projects";
import ProjectForm from "./pages/ProjectForm";
import EditProject from "./pages/EditProject";
import Skills from "./pages/Skills";
import Experience from "./pages/Experience";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";
import Contact from "./pages/Contact";
import PublicProjects from "./pages/PublicProjects";
import Home from "./pages/Home";
import ProjectDetails from "./pages/ProjectDetails";

import AdminLayout from "./layouts/AdminLayout";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public Home */}
                <Route
                    path="/"
                    element={<Home />}
                />

                {/* Admin Login */}
                <Route
                    path="/admin/login"
                    element={<AdminLogin />}
                />

                {/* Password Reset */}
                <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                />

                {/* Public Contact */}
                <Route
                    path="/contact"
                    element={<Contact />}
                />

                {/* Public Projects */}
                <Route
                    path="/projects"
                    element={<PublicProjects />}
                />

                <Route
                        path="/projects/:id"
                        element={<ProjectDetails />}
                    />

                {/* Admin */}
                <Route
                    path="/admin"
                    element={<AdminLayout />}
                >
                    <Route
                        index
                        element={<AdminDashboard />}
                    />

                    <Route
                        path="projects"
                        element={<Projects />}
                    />

                    <Route
                        path="projects/create"
                        element={<ProjectForm />}
                    />

                    <Route
                        path="projects/edit/:id"
                        element={<EditProject />}
                    />

                    <Route
                        path="skills"
                        element={<Skills />}
                    />

                    <Route
                        path="experience"
                        element={<Experience />}
                    />

                    <Route
                        path="messages"
                        element={<Messages />}
                    />

                    <Route
                        path="profile"
                        element={<Profile />}
                    />
                </Route>

                {/* Unknown Routes */}
                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/admin/login"
                            replace
                        />
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;