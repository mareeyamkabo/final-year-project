import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function ItemsTable({ items, onEdit, onDelete }) {
  return (
    <table className="table table-striped table-bordered shadow">
      <thead>
        <tr>
          <th>ID</th>
          <th>Image</th>
          <th>Name</th>
          <th>Description</th>
          <th>Location</th>
          <th>Date Lost</th>
          <th>Status</th>
          <th>Type</th>
          <th>Category</th>
          <th>Uploader</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.length > 0 ? (
          items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>
                {item.image ? (
                  <img
                    src={`http://localhost:5000/uploads/${item.image}`}
                    alt={item.name}
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                    className="rounded"
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>{item.location}</td>
              <td>{new Date(item.dateLost).toLocaleDateString()}</td>
              <td>{item.status}</td>
              <td>{item.type}</td>
              <td>{item.category}</td>
              <td>{item.uploader?.name || "N/A"}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => onEdit(item)}
                >
                  <FaEdit />
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => onDelete(item.id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="11" className="text-center">
              No items found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
