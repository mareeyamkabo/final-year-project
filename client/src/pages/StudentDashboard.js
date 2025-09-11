import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function StudentDashboard() {
  const [items, setItems] = useState([]);
  const [myItems, setMyItems] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  // form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
  });

  const user = JSON.parse(localStorage.getItem("user")); // assume backend sends {id, name, role}

  // Fetch items
  const fetchItems = async () => {
    try {
      const res = await API.get("/items");
      const data = res.data;
      setItems(data.filter((i) => i.status !== "pending")); // only approved/resolved
      setMyItems(data.filter((i) => i.submittedBy === user.id)); // student’s submissions
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // handle dark mode toggle
  const toggleDark = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode);
  };

  // handle form input
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("description", formData.description);
      form.append("image", formData.image);

      await API.post("/items", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Item submitted successfully (pending approval).");
      setFormData({ name: "", description: "", image: null });
      fetchItems();
    } catch (err) {
      console.error("Error submitting item:", err);
    }
  };

  // component for item card
  const ItemCard = ({ item }) => (
    <div
      className={`p-4 rounded-2xl shadow-lg ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
      style={{
        boxShadow: darkMode
          ? "8px 8px 16px #0a0a0a, -8px -8px 16px #1e1e1e"
          : "8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff",
      }}
    >
      {item.image && (
        <img
          src={`http://localhost:3000/uploads/${item.image}`}
          alt={item.name}
          className="w-full h-40 object-cover rounded-lg mb-3 cursor-pointer"
          onClick={() => window.open(`http://localhost:3000/uploads/${item.image}`, "_blank")}
        />
      )}
      <h2 className="font-semibold text-lg">{item.name}</h2>
      <p className="text-sm">{item.description}</p>
      <span
        className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${
          item.status === "approved"
            ? "bg-green-500 text-white"
            : item.status === "resolved"
            ? "bg-blue-500 text-white"
            : "bg-yellow-500 text-black"
        }`}
      >
        {item.status}
      </span>
    </div>
  );

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} min-h-screen p-6`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🎓 Student Dashboard</h1>
        <button
          onClick={toggleDark}
          className="px-4 py-2 rounded-full bg-purple-500 text-white shadow-lg hover:scale-105 transition"
        >
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* Upload Form */}
      <form
        onSubmit={handleSubmit}
        className={`p-6 mb-6 rounded-2xl ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
        style={{
          boxShadow: darkMode
            ? "8px 8px 16px #0a0a0a, -8px -8px 16px #1e1e1e"
            : "8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff",
        }}
      >
        <h2 className="text-xl font-semibold mb-4">Submit Lost/Found Item</h2>
        <input
          type="text"
          name="name"
          placeholder="Item name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border mb-3"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border mb-3"
          required
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="mb-3"
        />
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-blue-500 text-white font-semibold hover:scale-105 transition"
        >
          Submit Item
        </button>
      </form>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-full font-medium ${
            activeTab === "all" ? "bg-blue-500 text-white" : "bg-gray-300 dark:bg-gray-700"
          }`}
        >
          All Items
        </button>
        <button
          onClick={() => setActiveTab("mine")}
          className={`px-4 py-2 rounded-full font-medium ${
            activeTab === "mine" ? "bg-blue-500 text-white" : "bg-gray-300 dark:bg-gray-700"
          }`}
        >
          My Submissions
        </button>
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {(activeTab === "all" ? items : myItems).length === 0 ? (
          <p>No items to show.</p>
        ) : (
          (activeTab === "all" ? items : myItems).map((item) => (
            <ItemCard key={item.id} item={item} />
          ))
        )}
      </div>
    </div>
  );
}
