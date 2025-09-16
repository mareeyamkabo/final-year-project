import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { Card, Form, Button, Alert, Image } from "react-bootstrap";
import fudLogo from "../assets/fud logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // reset errors
    try {
      const res = await API.post("/auth/login", { email, password });
      console.log("Login response:", res.data);
  
      const { token, user } = res.data;
      if (!token || !user?.role) {
        throw new Error("Invalid server response");
      }
  
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));
  
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/student", { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || err.message || "Login failed");
    }
  };
  
  

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center bg-light">
      <Card style={{ width: "420px" }} className="shadow-lg rounded-4 p-4">
        <div className="text-center mb-3">
          <Image src={fudLogo} alt="FUD Logo" height={80} />
          <h4 className="mt-3 fw-bold text-success">
            Welcome to FUD Lost & Found
          </h4>
          <p className="text-muted small">Knowledge, Excellence & Service</p>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" variant="success" className="w-100 rounded-pill">
            Login
          </Button>
        </Form>

        <p className="mt-3 text-center">
          Don’t have an account?{" "}
          <Link to="/register" className="fw-bold text-primary">
            Register
          </Link>
        </p>
      </Card>
    </div>
  );
}
