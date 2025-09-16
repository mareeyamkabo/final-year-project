import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function StudentDashboard() {
  const [items, setItems] = useState([]);
  const [myItems, setMyItems] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    dateLost: "",
    type: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // fetch items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await API.get("/items");
        console.log("Items from backend:", res.data);
        const data = res.data;

        // only show approved/resolved in "All Items"
        setItems(data.filter((i) => i.status !== "pending"));

        // show only current student's submissions
        setMyItems(
          data.filter(
            (i) => i.uploaderId === user.id || i.uploader?.id === user.id
          )
        );
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };

    fetchItems();
  }, [user?.id]);

  // dark mode toggle
  const toggleDark = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode);
  };

  // logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  // form change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("description", formData.description);
      form.append("location", formData.location);
      form.append("dateLost", formData.dateLost);
      form.append("type", formData.type);
      form.append("status", "pending"); // always pending for students
      form.append("image", formData.image);

      await API.post("/items", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Item submitted successfully (pending approval).");
      setFormData({
        name: "",
        description: "",
        location: "",
        dateLost: "",
        type: "",
        image: null,
      });
      window.location.reload(); // refresh items list
    } catch (err) {
      console.error("Error submitting item:", err);
    }
  };

  // card component
  const ItemCard = ({ item }) => (
    <div
      className={`card shadow-sm h-100 ${
        darkMode ? "bg-dark text-light" : "bg-white text-dark"
      }`}
    >
      {item.image && (
        <img
          src={`http://localhost:5000/uploads/${item.image}`}
          className="card-img-top"
          alt={item.name}
          style={{ height: "180px", objectFit: "cover", cursor: "pointer" }}
          onClick={() =>
            setPreviewImage(`http://localhost:5000/uploads/${item.image}`)
          }
        />
      )}
      <div className="card-body">
        <h5 className="card-title">{item.name}</h5>
        <p className="card-text">{item.description}</p>
        <p className="card-text">
          <small className="text-muted">
            {item.location} •{" "}
            {item.dateLost
              ? new Date(item.dateLost).toLocaleDateString()
              : "N/A"}
          </small>
        </p>
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
      </div>
    </div>
  );

  return (
    <div
      className={`min-vh-100 p-4 ${
        darkMode ? "bg-dark text-light" : "bg-light text-dark"
      }`}
    >
      {/* header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">🎓 Student Dashboard</h1>
        <div className="d-flex gap-2">
          <button onClick={toggleDark} className="btn btn-primary">
            {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
          </button>
          <button onClick={handleLogout} className="btn btn-danger">
            🚪 Logout
          </button>
        </div>
      </div>

      {/* upload form */}
      <form
        onSubmit={handleSubmit}
        className={`p-4 mb-5 rounded shadow ${
          darkMode ? "bg-secondary" : "bg-white"
        }`}
        encType="multipart/form-data"
      >
        <h4 className="mb-3">Submit Lost/Found Item</h4>
        <div className="row g-3">
          <div className="col-md-6">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Item Name"
              className="form-control"
              required
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
              className="form-control"
              required
            />
          </div>
          <div className="col-md-6">
            <input
              type="date"
              name="dateLost"
              value={formData.dateLost}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-6">
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
          <div className="col-12">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="form-control"
              required
            />
          </div>
          <div className="col-12">
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>
        <button type="submit" className="btn btn-success mt-3">
          Submit Item
        </button>
      </form>

      {/* tabs */}
      <ul className="nav nav-pills mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Items
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "mine" ? "active" : ""}`}
            onClick={() => setActiveTab("mine")}
          >
            My Submissions
          </button>
        </li>
      </ul>

      {/* items grid */}
      <div className="row g-4">
        {(activeTab === "all" ? items : myItems).length === 0 ? (
          <p>No items to show.</p>
        ) : (
          (activeTab === "all" ? items : myItems).map((item) => (
            <div className="col-sm-6 col-md-4 col-lg-3" key={item.id}>
              <ItemCard item={item} />
            </div>
          ))
        )}
      </div>

      {/* image preview modal */}
      {previewImage && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
          onClick={() => setPreviewImage(null)}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-transparent border-0">
              <img
                src={previewImage}
                alt="Preview"
                className="img-fluid rounded"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                type="button"
                className="btn btn-light mt-3"
                onClick={() => setPreviewImage(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
