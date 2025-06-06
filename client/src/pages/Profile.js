import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function Profile() {
  const { user, token, setUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mailingAddress: "",
    billingInfo: "",
  });

  useEffect(() => {
    if (!user || user.role !== "customer") {
      navigate("/");
    } else {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        mailingAddress: user.mailingAddress || "",
        billingInfo: user.billingInfo || "",
      });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFields = {
      name: formData.name,
      email: formData.email,
      mailingAddress: formData.mailingAddress,
      billingInfo: formData.billingInfo,
    };
    if (formData.password) updatedFields.password = formData.password;

    try {
      const res = await fetch(`http://localhost:3001/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFields),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        alert("Profile updated successfully");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Server error");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} className="row g-3 mt-3">
        <div className="col-md-6">
          <label className="form-label">Name</label>
          <input
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">New Password (leave blank to keep current)</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Mailing Address</label>
          <input
            className="form-control"
            name="mailingAddress"
            value={formData.mailingAddress}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-12">
          <label className="form-label">Billing Info</label>
          <textarea
            className="form-control"
            name="billingInfo"
            rows="2"
            value={formData.billingInfo}
            onChange={handleChange}
          />
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
