import { useEffect, useRef, useState } from "react";
import api from "../services/api";
import "../styles/Profile.css";

function Profile() {
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        profile_photo: null,
    });

    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/user");

            const user = response.data.user;

            setProfile({
                name: user.name || "",
                email: user.email || "",
                profile_photo: user.profile_photo || null,
            });
        } catch (error) {
            console.error("Profile error:", error);

            setError(
                error.response?.data?.message ||
                    "Unable to load profile."
            );
        } finally {
            setLoading(false);
        }
    };

    const getPhotoUrl = (photo) => {
        if (!photo) {
            return null;
        }

        return `${import.meta.env.VITE_API_URL.replace("/api", "")}/storage/${photo}`;
    };

    const handlePhotoChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setSelectedPhoto(file);

        const previewUrl = URL.createObjectURL(file);

        setPhotoPreview(previewUrl);

        setMessage("");
        setError("");
    };

    const handleRemovePhoto = () => {
        setSelectedPhoto(null);
        setPhotoPreview(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        setMessage("");
        setError("");
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setProfile((previous) => ({
            ...previous,
            [name]: value,
        }));

        setMessage("");
        setError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setMessage("");
            setError("");

            const formData = new FormData();

            formData.append("name", profile.name);
            formData.append("email", profile.email);

            if (selectedPhoto) {
                formData.append(
                    "profile_photo",
                    selectedPhoto
                );
            }

            const response = await api.post(
                "/profile",
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );

            const updatedUser = response.data.user;

            setProfile({
                name: updatedUser.name || "",
                email: updatedUser.email || "",
                profile_photo:
                    updatedUser.profile_photo || null,
            });

            setSelectedPhoto(null);
            setPhotoPreview(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            setMessage(
                "Profile updated successfully."
            );
        } catch (error) {
            console.error(
                "Profile update error:",
                error
            );

            if (error.response?.status === 422) {
                const validationErrors =
                    error.response?.data?.errors;

                if (validationErrors) {
                    const firstError = Object.values(
                        validationErrors
                    )[0]?.[0];

                    setError(
                        firstError ||
                            "Please check your information."
                    );
                } else {
                    setError(
                        "Please check your information."
                    );
                }
            } else {
                setError(
                    error.response?.data?.message ||
                        "Unable to update profile."
                );
            }
        } finally {
            setSaving(false);
        }
    };

    const displayedPhoto =
        photoPreview ||
        getPhotoUrl(profile.profile_photo);

    if (loading) {
        return (
            <div className="profile-page">
                <div className="profile-loading">
                    Loading profile...
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="profile-header">
                <div>
                    <span className="profile-label">
                        ACCOUNT
                    </span>

                    <h1>Profile</h1>

                    <p>
                        Manage your administrator
                        profile information.
                    </p>
                </div>
            </div>

            {message && (
                <div className="profile-success">
                    {message}
                </div>
            )}

            {error && (
                <div className="profile-error">
                    {error}
                </div>
            )}

            <form
                className="profile-form"
                onSubmit={handleSubmit}
            >
                {/* PROFILE PHOTO */}

                <section className="profile-card">
                    <div className="profile-card-header">
                        <div>
                            <h2>Profile Photo</h2>

                            <p>
                                This photo will be used
                                on your public portfolio.
                            </p>
                        </div>
                    </div>

                    <div className="profile-photo-section">
                        <div className="profile-photo-wrapper">
                            {displayedPhoto ? (
                                <img
                                    src={displayedPhoto}
                                    alt="Profile"
                                    className="profile-photo"
                                />
                            ) : (
                                <div className="profile-photo-placeholder">
                                    <span>
                                        {profile.name
                                            ? profile.name
                                                  .charAt(0)
                                                  .toUpperCase()
                                            : "A"}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="profile-photo-actions">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/jpg,image/webp"
                                onChange={
                                    handlePhotoChange
                                }
                                className="profile-file-input"
                            />

                            <button
                                type="button"
                                className="profile-upload-button"
                                onClick={() =>
                                    fileInputRef.current?.click()
                                }
                            >
                                {displayedPhoto
                                    ? "Change Photo"
                                    : "Upload Photo"}
                            </button>

                            {(selectedPhoto ||
                                profile.profile_photo) && (
                                <button
                                    type="button"
                                    className="profile-remove-button"
                                    onClick={
                                        handleRemovePhoto
                                    }
                                >
                                    Cancel Selection
                                </button>
                            )}

                            <span className="profile-photo-help">
                                JPG, PNG, or WEBP. Maximum
                                5 MB.
                            </span>
                        </div>
                    </div>
                </section>

                {/* PROFILE INFORMATION */}

                <section className="profile-card">
                    <div className="profile-card-header">
                        <div>
                            <h2>Profile Information</h2>

                            <p>
                                Update the information
                                associated with your
                                administrator account.
                            </p>
                        </div>
                    </div>

                    <div className="profile-fields">
                        <div className="profile-field">
                            <label htmlFor="name">
                                Name
                            </label>

                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={profile.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="profile-field">
                            <label htmlFor="email">
                                Email
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={profile.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </section>

                {/* SAVE */}

                <div className="profile-form-actions">
                    <button
                        type="submit"
                        className="profile-save-button"
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : "Save Changes"}
                    </button>
                </div>
            </form>

            {/* PASSWORD */}
        </div>
    );
}

export default Profile;