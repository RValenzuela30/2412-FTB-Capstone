import React, { useState } from "react";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", email: "", password: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLogin ? "/api/auth/login" : "/api/users";
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : { ...formData }; // for signup, includes name/email/password

    try {
      const response = await fetch(`http://localhost:3001${url}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        alert(isLogin ? "Login successful!" : "Account created!");
        console.log(result);
      } else {
        alert(result.error || "Something went wrong");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="container mt-5">
      <h2>{isLogin ? "Login" : "Create Account"}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input name="name" type="text" className="form-control" value={formData.name} onChange={handleChange} required />
          </div>
        )}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input name="email" type="email" className="form-control" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input name="password" type="password" className="form-control" value={formData.password} onChange={handleChange} required />
        </div>
        <button className="btn btn-primary" type="submit">{isLogin ? "Login" : "Sign Up"}</button>
      </form>
      <button className="btn btn-link mt-2" onClick={toggleForm}>
        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
      </button>
    </div>
  );
}

export default Login;
