import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import useAuth from "../hooks/useAuth";
import "../App.css"; // include neumorphic/glassmorphism styles

export default function AdminDashboard() {
  useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    dateLost: "",
    type: "",
    status: "pending",
    image: null,
  });
  const [editMode, setEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  // fetch items (inline to avoid ESLint warnings)
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await API.get("/items", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(res.data);
      } catch (err) {
        setError("Failed to fetch items.");
      }
    };
    fetchItems();
  }, [token]);

  const toggleDark = () => setDarkMode(!darkMode);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

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

      if (editMode) {
        await API.put(`/items/${editItemId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await API.post("/items", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setFormData({
        name: "",
        description: "",
        location: "",
        dateLost: "",
        type: "",
        status: "pending",
        image: null,
      });
      setEditMode(false);
      setEditItemId(null);
      // refetch items
      const res = await API.get("/items", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data);
    } catch (err) {
      setError("Failed to save item.");
    }
  };

  const loadEdit = (item) => {
    setEditMode(true);
    setEditItemId(item.id);
    setFormData({
      name: item.name,
      description: item.description,
      location: item.location,
      dateLost: item.dateLost?.split("T")[0],
      type: item.type,
      status: item.status,
      image: null,
    });
  };

  const toggleStatus = async (item) => {
    const next =
      item.status === "pending"
        ? "approved"
        : item.status === "approved"
        ? "resolved"
        : "pending";

    try {
      await API.put(
        `/items/${item.id}`,
        { status: next },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const res = await API.get("/items", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data);
    } catch (err) {
      setError("Failed to update status.");
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await API.delete(`/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await API.get("/items", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data);
    } catch (err) {
      setError("Failed to delete item.");
    }
  };

  // search filter
  const filteredItems = items.filter((item) => {
    const term = search.toLowerCase();
    return (
      item.name?.toLowerCase().includes(term) ||
      item.description?.toLowerCase().includes(term) ||
      item.location?.toLowerCase().includes(term) ||
      item.User?.name?.toLowerCase().includes(term)
    );
  });

  return (
    <div
      className={`min-vh-100 p-4 ${
        darkMode ? "bg-dark text-light" : "bg-light text-dark"
      }`}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">📋 Admin Dashboard</h1>
        <div>
          <button className="btn btn-neumorphic me-3" onClick={toggleDark}>
            {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
          </button>
          <button className="btn btn-danger btn-neumorphic" onClick={logout}>
            🚪 Logout
          </button>
        </div>
      </div>

      {error && <p className="text-danger">{error}</p>}

      {/* Search bar */}
      <div
        className="glassmorphism p-3 mb-4 rounded-4 shadow-sm"
        style={{ backdropFilter: "blur(12px)", border: "1px solid #ffffff20" }}
      >
        <input
          type="text"
          placeholder="🔍 Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-control"
        />
      </div>

      {/* Item Form (kept your form, wrapped in glass effect) */}
      <form
        onSubmit={handleSubmit}
        className={`p-4 mb-5 glassmorphism rounded-4 shadow-sm ${
          darkMode ? "neumorphic-dark" : ""
        }`}
        encType="multipart/form-data"
        style={{ backdropFilter: "blur(16px)", border: "1px solid #ffffff20" }}
      >
        <div className="row g-3">
          <div className="col-md-4">
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
          <div className="col-md-4">
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-4">
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
          <div className="col-md-3">
            <input
              type="date"
              name="dateLost"
              value={formData.dateLost}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-3">
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Type</option>
              <option value="found">Found</option>
              <option value="missing">Missing</option>
            </select>
          </div>
          <div className="col-md-3">
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <div className="col-md-3">
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-3 btn-neumorphic">
          {editMode ? "Update Item" : "Create Item"}
        </button>
      </form>

      {/* Items Table with glass effect */}
      <div
        className="table-responsive glassmorphism p-3 rounded-4 shadow-sm"
        style={{ backdropFilter: "blur(20px)", border: "1px solid #ffffff20" }}
      >
        <table className="table table-bordered align-middle text-center mb-0">
          <thead className="table-primary">
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Location</th>
              <th>Date Lost</th>
              <th>Status</th>
              <th>Type</th>
              <th>Uploader</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan="10">No items found</td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>
                    {item.image ? (
                      <img
                        src={`http://localhost:5000/uploads/${item.image}`}
                        alt={item.name}
                        style={{
                          width: 50,
                          height: 50,
                          objectFit: "cover",
                          borderRadius: 8,
                          cursor: "pointer",
                        }}
                        onClick={() => setPreviewImage(item.image)}
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>{item.location}</td>
                  <td>
                    {item.dateLost
                      ? new Date(item.dateLost).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        item.status === "approved"
                          ? "bg-success"
                          : item.status === "resolved"
                          ? "bg-info"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td>{item.type}</td>
                  <td>{item.User?.name || "N/A"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={() => loadEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-info me-2"
                      onClick={() => toggleStatus(item)}
                    >
                      Toggle
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteItem(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Full Image Preview */}
      {previewImage && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center"
          style={{ zIndex: 9999 }}
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={`http://localhost:5000/uploads/${previewImage}`}
            alt="Full"
            className="img-fluid rounded"
            style={{ maxHeight: "90vh" }}
          />
        </div>
      )}
    </div>
  );
}
