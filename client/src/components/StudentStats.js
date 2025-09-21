import React, { useEffect, useState } from "react";
import API from "../services/api";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";

export default function StudentStats() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // For lightbox
  const [reason, setReason] = useState(""); // Claim form state
  const [submitting, setSubmitting] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await API.get("/items", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch stats", err);
      }
    };
    fetchItems();
  }, [token]);

  const totalItems = items.length;
  const totalLost = items.filter((i) => i.type === "missing").length;
  const totalFound = items.filter((i) => i.type === "found").length;

  const pieData = [
    { name: "Lost", value: totalLost },
    { name: "Found", value: totalFound },
  ];
  const COLORS = ["#FF6B6B", "#4ECDC4"];

  // ✅ Claim item
  const handleClaim = async (e) => {
    e.preventDefault();
    if (!reason.trim()) return alert("Please provide a reason");

    try {
      setSubmitting(true);
      await API.post(
        "/claims",
        { itemId: selectedItem.id, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Claim submitted successfully!");
      setSelectedItem(null);
      setReason("");
    } catch (err) {
      console.error("❌ Failed to submit claim", err);
      alert("Failed to submit claim");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="fw-bold mb-4">📊 Dashboard Overview</h2>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card shadow text-center p-3 bg-primary text-light">
            <h4>Total Items</h4>
            <h2>{totalItems}</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow text-center p-3 bg-danger text-light">
            <h4>Lost Items</h4>
            <h2>{totalLost}</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow text-center p-3 bg-success text-light">
            <h4>Found Items</h4>
            <h2>{totalFound}</h2>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="card shadow p-3 mb-4">
        <h5>Lost vs Found</h5>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Latest Items Grid */}
      <h4 className="fw-bold mb-3">🆕 Latest Items</h4>
      <div className="row g-3">
        {items.slice(0, 8).map((item) => (
          <div className="col-md-3" key={item.id}>
            <div className="card shadow-sm h-100">
              {item.image ? (
                <img
                  src={`http://localhost:5000/uploads/${item.image}`}
                  alt={item.name}
                  className="card-img-top"
                  style={{ height: "150px", objectFit: "cover", cursor: "pointer" }}
                  onClick={() => setSelectedItem(item)} // open modal
                />
              ) : (
                <div
                  className="bg-light d-flex align-items-center justify-content-center"
                  style={{ height: "150px" }}
                >
                  <span className="text-muted">No Image</span>
                </div>
              )}
              <div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text small">{item.description}</p>
                <span
                  className={`badge ${
                    item.type === "missing" ? "bg-danger" : "bg-success"
                  }`}
                >
                  {item.type}
                </span>{" "}
                <span className="badge bg-secondary">{item.category}</span>
              </div>
              <div className="card-footer text-muted small">
                📍 {item.location} <br />
                📅 {new Date(item.dateLost).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal + Claim Form */}
      {selectedItem && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.8)" }}
          tabIndex="-1"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <div className="modal-content bg-dark">
              <div className="modal-header border-0">
                <h5 className="modal-title text-light">{selectedItem.name}</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedItem(null)}
                ></button>
              </div>
              <div className="modal-body text-center">
                <img
                  src={`http://localhost:5000/uploads/${selectedItem.image}`}
                  alt={selectedItem.name}
                  className="img-fluid rounded"
                />
                <p className="text-light mt-3">{selectedItem.description}</p>
                <span
                  className={`badge ${
                    selectedItem.type === "missing"
                      ? "bg-danger"
                      : "bg-success"
                  }`}
                >
                  {selectedItem.type}
                </span>{" "}
                <span className="badge bg-secondary">
                  {selectedItem.category}
                </span>

                {/* ✅ Claim Form */}
                <form onSubmit={handleClaim} className="mt-4">
                  <div className="mb-3 text-start">
                    <label className="form-label text-light">
                      Reason for claiming this item
                    </label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-warning w-100"
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Claim Item"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
