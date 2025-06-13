import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mailingAddress: "",
    billingInfo: "",
  });
  const [sameAsMailing, setSameAsMailing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: "",
      email: "",
      password: "",
      mailingAddress: "",
      billingInfo: "",
    });
    setSameAsMailing(false);
    setErrorMessage("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (sameAsMailing && name === "mailingAddress") {
      setFormData((prev) => ({
        ...prev,
        mailingAddress: value,
        billingInfo: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCheckboxChange = () => {
    setSameAsMailing(!sameAsMailing);
    if (!sameAsMailing) {
      setFormData((prev) => ({
        ...prev,
        billingInfo: prev.mailingAddress,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLogin ? "/auth/login" : "/users";
    const payload = isLogin
      ? {
          email: formData.email,
          password: formData.password,
        }
      : {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          mailingAddress: formData.mailingAddress || undefined,
          billingInfo: formData.billingInfo || undefined,
        };

    try {
      const response = await fetch(`${API_URL}${url}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        login(result.user, result.token);
        setErrorMessage("");

        if (result.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/products");
        }
      } else if (response.status === 409) {
        setErrorMessage("That email is already in use.");
      } else {
        setErrorMessage(result.error || "Something went wrong.");
      }
    } catch (err) {
      console.error("Error:", err);
      setErrorMessage("Network error. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>{isLogin ? "Login" : "Create Account"}</h2>

      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              name="name"
              type="text"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            name="email"
            type="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            name="password"
            type="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {!isLogin && (
          <>
            <div className="mb-3">
              <label className="form-label">Mailing Address (Optional)</label>
              <input
                name="mailingAddress"
                type="text"
                className="form-control"
                value={formData.mailingAddress}
                onChange={handleChange}
              />
            </div>

            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                checked={sameAsMailing}
                onChange={handleCheckboxChange}
                id="sameAsMailing"
              />
              <label className="form-check-label" htmlFor="sameAsMailing">
                Billing info same as mailing address
              </label>
            </div>

            <div className="mb-3">
              <label className="form-label">Billing Address (Optional)</label>
              <input
                name="billingInfo"
                type="text"
                className="form-control"
                value={formData.billingInfo}
                onChange={handleChange}
                disabled={sameAsMailing}
              />
            </div>
          </>
        )}

        <button className="btn btn-primary" type="submit">
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>

      <button className="btn btn-link mt-2" onClick={toggleForm}>
        {isLogin
          ? "Don't have an account? Sign up"
          : "Already have an account? Log in"}
      </button>
    </div>
  );
}

export default Login;
