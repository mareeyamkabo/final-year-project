// src/pages/Register.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { Card, Form, Button, Alert, Image } from "react-bootstrap";
import fudLogo from "../assets/fud logo.png"; 

export default function Register() {
  const [name, setName] = useState("");
  const [nin, setNin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side name validation (letters only)
    if (!/^[A-Za-z\s]+$/.test(name)) {
      setError("Name must contain only letters");
      return;
    }

    // Optional: Validate NIN format (e.g., must be digits and 11 chars)
    if (!/^\d{11}$/.test(nin)) {
      setError("NIN must be exactly 11 digits");
      return;
    }

    try {
      const res = await API.post("/auth/register", {
        name,
        email,
        password,
        nin,
      });

      if (res.status === 201 || res.status === 200) {
        navigate("/login", { replace: true });
      }
    } catch (err) {
      console.error("Register error:", err);
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center bg-light">
      <Card style={{ width: "420px" }} className="shadow-lg rounded-4 p-4">
        <div className="text-center mb-3">
          <Image src={fudLogo} alt="FUD Logo" height={80} />
          <h4 className="mt-3 fw-bold text-success">Create Account</h4>
          <p className="text-muted small">
            Federal University Dutse – Lost & Found
          </p>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          {/* Full Name */}
          <Form.Group className="mb-3" controlId="formName">
            <Form.Control
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          {/* NIN */}
          <Form.Group className="mb-3" controlId="formNIN">
            <Form.Control
              type="text"
              placeholder="NIN (11-digit National ID Number)"
              value={nin}
              onChange={(e) => setNin(e.target.value)}
              required
            />
          </Form.Group>

          {/* Email */}
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Control
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          {/* Password */}
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button
            type="submit"
            variant="success"
            className="w-100 rounded-pill"
          >
            Register
          </Button>
        </Form>

        <p className="mt-3 text-center">
          Already have an account?{" "}
          <Link to="/login" className="fw-bold text-primary">
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
}
