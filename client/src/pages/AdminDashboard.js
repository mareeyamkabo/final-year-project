// src/pages/AdminDashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import useAuth from "../hooks/useAuth";
import {
  FaBox,
  FaChartPie,
  FaFolder,
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaSearch,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ItemsTable from "../components/ItemsTable";
import "../App.css";

export default function AdminDashboard() {
  useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    dateLost: "",
    type: "",
    status: "pending",
    category: "general",
    image: null,
  });
  const [editMode, setEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await API.get("/items", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(res.data);
      } catch {
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

  // Form change handler
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Form submit
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
        category: "general",
        image: null,
      });
      setEditMode(false);
      setEditItemId(null);

      const res = await API.get("/items", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data);
    } catch {
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
      category: item.category || "general",
      image: null,
    });
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
    } catch {
      setError("Failed to delete item.");
    }
  };

  // Filter search
  const filteredItems = items.filter((item) => {
    const term = search.toLowerCase();
    return (
      item.name?.toLowerCase().includes(term) ||
      item.description?.toLowerCase().includes(term) ||
      item.location?.toLowerCase().includes(term) ||
      item.uploader?.name?.toLowerCase().includes(term)
    );
  });

  // Stats
  const totalItems = items.length;
  const totalLost = items.filter((i) => i.type === "missing").length;
  const totalFound = items.filter((i) => i.type === "found").length;
  const totalPending = items.filter((i) => i.status === "pending").length;

  const pieData = [
    { name: "Lost", value: totalLost },
    { name: "Found", value: totalFound },
  ];
  const barData = [
    { name: "Pending", value: totalPending },
    { name: "Approved", value: items.filter((i) => i.status === "approved").length },
    { name: "Resolved", value: items.filter((i) => i.status === "resolved").length },
  ];

  const COLORS = ["#FF6B6B", "#4ECDC4", "#FFD93D"];

  const categories = [...new Set(items.map((i) => i.category || "general"))];

  return (
    <div className={`d-flex ${darkMode ? "bg-dark text-light" : "bg-light text-dark"}`} style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div className={`p-3 shadow ${darkMode ? "bg-secondary" : "bg-white"}`} style={{ width: "240px" }}>
        <h3 className="fw-bold mb-4">⚡ Admin</h3>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <button className="btn w-100 text-start" onClick={() => setActiveTab("dashboard")}>
              <FaChartPie className="me-2" /> Dashboard
            </button>
          </li>
          <li className="nav-item mb-2">
            <button className="btn w-100 text-start" onClick={() => setActiveTab("items")}>
              <FaBox className="me-2" /> All Items
            </button>
          </li>
          <li className="nav-item mb-2">
            <button className="btn w-100 text-start" onClick={() => setActiveTab("categories")}>
              <FaFolder className="me-2" /> Categories
            </button>
          </li>
        </ul>
        <hr />
        <button className="btn btn-outline-secondary w-100 mb-2" onClick={toggleDark}>
          {darkMode ? <FaSun /> : <FaMoon />} {darkMode ? "Light" : "Dark"}
        </button>
        <button className="btn btn-danger w-100" onClick={logout}>
          <FaSignOutAlt className="me-2" /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        {activeTab === "dashboard" && (
          <>
            <h2 className="fw-bold mb-4">📊 Dashboard Overview</h2>
            {/* Stats Cards */}
            <div className="row g-3 mb-4">
              <div className="col-md-3">
                <div className="card shadow text-center p-3 bg-primary text-light">
                  <h4>Total Items</h4>
                  <h2>{totalItems}</h2>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card shadow text-center p-3 bg-danger text-light">
                  <h4>Lost Items</h4>
                  <h2>{totalLost}</h2>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card shadow text-center p-3 bg-success text-light">
                  <h4>Found Items</h4>
                  <h2>{totalFound}</h2>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card shadow text-center p-3 bg-warning text-dark">
                  <h4>Pending</h4>
                  <h2>{totalPending}</h2>
                </div>
              </div>
            </div>
            {/* Charts */}
            <div className="row g-4">
              <div className="col-md-6">
                <div className="card shadow p-3">
                  <h5>Lost vs Found</h5>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        dataKey="value"
                        label
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card shadow p-3">
                  <h5>Status Overview</h5>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#36A2EB" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "items" && (
          <>
            <h2 className="fw-bold mb-4">📦 All Items</h2>
            {/* Add/Edit Form */}
            <form onSubmit={handleSubmit} className="card shadow p-3 mb-4">
              <div className="row g-3">
                <div className="col-md-6">
                  <input type="text" name="name" className="form-control" placeholder="Item Name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <input type="text" name="location" className="form-control" placeholder="Location" value={formData.location} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <input type="date" name="dateLost" className="form-control" value={formData.dateLost} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <select name="type" className="form-control" value={formData.type} onChange={handleChange} required>
                    <option value="">Select Type</option>
                    <option value="missing">Missing</option>
                    <option value="found">Found</option>
                  </select>
                </div>
                <div className="col-12">
                  <textarea name="description" className="form-control" placeholder="Description" value={formData.description} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <select name="category" className="form-control" value={formData.category} onChange={handleChange}>
                    <option value="general">General</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="documents">Documents</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <input type="file" name="image" className="form-control" onChange={handleChange} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary mt-3">
                {editMode ? "Update Item" : "Add Item"}
              </button>
            </form>

            {/* Search */}
            <div className="input-group mb-3">
              <span className="input-group-text"><FaSearch /></span>
              <input type="text" className="form-control" placeholder="Search items..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>

            {/* Items Table */}
            <ItemsTable items={filteredItems} onEdit={loadEdit} onDelete={deleteItem} />
          </>
        )}

        {activeTab === "categories" && (
          <>
            <h2 className="fw-bold mb-4">📁 Categories</h2>
            {categories.map((cat) => (
              <div key={cat} className="mb-4">
                <h5 className="text-capitalize">{cat}</h5>
                <ItemsTable
                  items={items.filter((i) => (i.category || "general") === cat)}
                  onEdit={loadEdit}
                  onDelete={deleteItem}
                />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
