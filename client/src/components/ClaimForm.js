import React, { useState } from "react";
import API from "../services/api";
import { Form, Button, Alert, Card } from "react-bootstrap";

export default function ClaimForm({ itemId, onSuccess }) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const res = await API.post(
        "/claims",
        { itemId, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Claim submitted successfully ✅");
      setReason("");
      if (onSuccess) onSuccess(res.data.claim);
    } catch (err) {
      setError(err.response?.data?.message || "Error submitting claim");
    }
  };

  return (
    <Card className="shadow-sm p-3 rounded-3">
      <h5>Claim this Item</h5>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Why is this your item?</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Provide a short explanation"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit" variant="success" className="w-100 rounded-pill">
          Submit Claim
        </Button>
      </Form>
    </Card>
  );
}
