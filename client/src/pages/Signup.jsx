import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Message from "../components/Message.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getApiError } from "../services/api";

function Signup() {
  const { signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "member"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup(form);
      navigate("/dashboard");
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Signup</h1>
        <Message error={error} />

        <label>
          Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            minLength="6"
            required
          />
        </label>

        <label>
          Role
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p>
          Have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </main>
  );
}

export default Signup;
