import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function ClaimsList() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await API.get("/claims", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClaims(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch claims", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, [token]);

  if (loading) return <p>⏳ Loading claims...</p>;

  return (
    <div>
      <h2 className="fw-bold mb-4">📑 My Claims</h2>
      {claims.length === 0 ? (
        <p className="text-muted">No claims submitted yet.</p>
      ) : (
        <div className="row g-3">
          {claims.map((claim) => (
            <div className="col-md-4" key={claim.id}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{claim.item?.name || "Unknown Item"}</h5>
                  <p className="card-text small">{claim.reason}</p>
                  <span
                    className={`badge ${
                      claim.status === "pending"
                        ? "bg-warning text-dark"
                        : claim.status === "approved"
                        ? "bg-success"
                        : "bg-danger"
                    }`}
                  >
                    {claim.status}
                  </span>
                </div>
                <div className="card-footer small text-muted">
                  📅 {new Date(claim.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
