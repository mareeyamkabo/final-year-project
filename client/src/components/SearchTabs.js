import React, { useState, useEffect } from "react";
import API from "../services/api";
import ItemsTable from "./ItemsTable";

export default function SearchTabs() {
  const [activeTab, setActiveTab] = useState("category");
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [selectedDate, setSelectedDate] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await API.get("/items", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(res.data);
        setCategories([...new Set(res.data.map((i) => i.category || "general"))]);
      } catch (err) {
        console.error("❌ Failed to fetch items", err);
      }
    };
    fetchItems();
  }, [token]);

  const filteredByCategory = items.filter((i) => (i.category || "general") === selectedCategory);
  const filteredByDate = selectedDate
    ? items.filter((i) => i.dateLost?.startsWith(selectedDate))
    : [];

  return (
    <div>
      <h2 className="fw-bold mb-4">🔍 Search Items</h2>
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "category" ? "active" : ""}`}
            onClick={() => setActiveTab("category")}
          >
            By Category
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "date" ? "active" : ""}`}
            onClick={() => setActiveTab("date")}
          >
            By Date
          </button>
        </li>
      </ul>

      {activeTab === "category" && (
        <div>
          <select
            className="form-select mb-3"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <ItemsTable items={filteredByCategory} readOnly />
        </div>
      )}

      {activeTab === "date" && (
        <div>
          <input
            type="date"
            className="form-control mb-3"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <ItemsTable items={filteredByDate} readOnly />
        </div>
      )}
    </div>
  );
}
