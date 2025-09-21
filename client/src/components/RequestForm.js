import React, { useState } from "react";
import API from "../services/api";

export default function RequestForm() {
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    dateLost: "",
    type: "missing",
    category: "general",
    image: null,
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) form.append(key, formData[key]);
      });

      await API.post("/items", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("✅ Request submitted successfully!");
      setFormData({
        name: "",
        description: "",
        location: "",
        dateLost: "",
        type: "missing",
        category: "general",
        image: null,
      });
    } catch (err) {
      console.error("❌ Failed to submit request", err);
      setMessage("❌ Failed to submit request");
    }
  };

  return (
    <div>
      <h2 className="fw-bold mb-4">📝 Request Item</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit} className="card p-3 shadow-sm">
        <div className="row g-3">
          <div className="col-md-6">
            <input
              type="text"
              name="name"
              placeholder="Item Name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-12">
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
              required
            ></textarea>
          </div>
          <div className="col-md-4">
            <input
              type="date"
              name="dateLost"
              value={formData.dateLost}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-4">
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="form-control"
            >
              <option value="missing">Missing</option>
              <option value="found">Found</option>
            </select>
          </div>
          <div className="col-md-4">
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-control"
            >
              <option value="general">General</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="books">Books</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="col-md-6">
            <input type="file" name="image" onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-6">
            <button type="submit" className="btn btn-success w-100">
              Submit Request
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
