<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Student Dashboard</title>
  <style>
    :root {
      --primary: #4a90e2;
      --dark: #1e1e2f;
      --bg: #f4f7fb;
      --white: rgba(255, 255, 255, 0.85);
      --danger: #e74c3c;
      --success: #27ae60;
      --warning: #f39c12;
      --info: #3498db;
      --gray: rgba(255,255,255,0.3);
    }

    body {
      font-family: 'Segoe UI', sans-serif;
      margin: 0;
      padding: 30px;
      background: linear-gradient(135deg, #e0eafc, #cfdef3);
      color: var(--dark);
    }

    body.dark {
      background: linear-gradient(135deg, #141E30, #243B55);
      color: var(--white);
    }

    h1 {
      text-align: center;
      margin-bottom: 10px;
    }

    .tabs {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-bottom: 25px;
    }

    .tabs button {
      padding: 10px 20px;
      border-radius: 50px;
      border: none;
      background: var(--primary);
      color: white;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
    }
    .tabs button.active {
      background: var(--info);
    }
    .tabs button:hover { transform: scale(1.05); }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
    }

    .card {
      background: var(--white);
      border-radius: 16px;
      box-shadow: 0 6px 18px rgba(0,0,0,0.1);
      padding: 15px;
      transition: transform 0.2s;
      backdrop-filter: blur(10px);
    }
    .card:hover { transform: translateY(-5px); }
    body.dark .card { background: rgba(40,44,52,0.8); color: #fff; }

    .card img {
      width: 100%;
      height: 160px;
      object-fit: cover;
      border-radius: 12px;
      margin-bottom: 10px;
      cursor: pointer;
    }

    .badge {
      display: inline-block;
      padding: 5px 12px;
      border-radius: 50px;
      font-size: 12px;
      font-weight: bold;
      color: #fff;
      text-transform: capitalize;
    }
    .badge.pending { background: var(--warning); }
    .badge.approved { background: var(--success); }
    .badge.resolved { background: var(--info); }

    .darkmode-btn {
      position: fixed;
      top: 20px; right: 20px;
      background: #6c5ce7;
      border: none;
      padding: 10px 14px;
      border-radius: 50px;
      color: white;
      cursor: pointer;
    }

    /* Full image modal */
    .modal {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(0,0,0,0.7);
      z-index: 1000;
    }
    .modal.hidden { display: none; }
    .modal img {
      max-width: 90%;
      max-height: 85vh;
      border-radius: 12px;
    }
    .modal button {
      margin-top: 10px;
      padding: 6px 14px;
      border: none;
      border-radius: 8px;
      background: var(--danger);
      color: #fff;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <h1>🎓 Student Dashboard</h1>

  <div class="tabs">
    <button id="tabApproved" class="active">Approved & Resolved</button>
    <button id="tabMine">My Submissions</button>
  </div>

  <div id="approvedList" class="grid"></div>
  <div id="myList" class="grid" style="display:none;"></div>

  <button class="darkmode-btn" onclick="toggleDarkMode()">🌙</button>

  <!-- Full image modal -->
  <div id="imageModal" class="modal hidden">
    <div>
      <img id="fullImg" src="" alt="Full" />
      <div style="text-align:center;">
        <button onclick="closeImage()">Close</button>
      </div>
    </div>
  </div>

  <script>
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "login.html";

    let currentUserId = null;

    function toggleDarkMode() { document.body.classList.toggle("dark"); }

    function showImage(src) {
      document.getElementById("fullImg").src = src;
      document.getElementById("imageModal").classList.remove("hidden");
    }
    function closeImage() {
      document.getElementById("imageModal").classList.add("hidden");
    }

    async function getUserInfo() {
      const res = await fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const user = await res.json();
        currentUserId = Number(user.id);
      }
    }

    function renderItem(item) {
      const imgSrc = item.image
        ? `http://localhost:5000/uploads/${item.image}`
        : "https://via.placeholder.com/300x160?text=No+Image";

      return `
        <div class="card">
          <img src="${imgSrc}" onclick="showImage('${imgSrc}')" />
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <p><strong>Location:</strong> ${item.location}</p>
          <p><strong>Date Lost:</strong> ${new Date(item.dateLost).toLocaleDateString()}</p>
          <span class="badge ${item.status}">${item.status}</span>
        </div>
      `;
    }

    async function fetchItems() {
      const res = await fetch("http://localhost:5000/api/items", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const items = await res.json();

      // Approved + resolved for everyone
      const approvedItems = items.filter(i =>
        i.status === "approved" || i.status === "resolved"
      );
      document.getElementById("approvedList").innerHTML =
        approvedItems.length === 0
          ? "<p>No approved items yet.</p>"
          : approvedItems.map(renderItem).join("");

      // My submissions (any status)
      const myItems = items.filter(i => i.uploader && Number(i.uploader.id) === Number(currentUserId));
      document.getElementById("myList").innerHTML =
        myItems.length === 0
          ? "<p>You have not submitted anything yet.</p>"
          : myItems.map(renderItem).join("");
    }

    // Tabs
    document.getElementById("tabApproved").addEventListener("click", () => {
      document.getElementById("approvedList").style.display = "grid";
      document.getElementById("myList").style.display = "none";
      document.getElementById("tabApproved").classList.add("active");
      document.getElementById("tabMine").classList.remove("active");
    });
    document.getElementById("tabMine").addEventListener("click", () => {
      document.getElementById("approvedList").style.display = "none";
      document.getElementById("myList").style.display = "grid";
      document.getElementById("tabMine").classList.add("active");
      document.getElementById("tabApproved").classList.remove("active");
    });

    (async () => {
      await getUserInfo();
      fetchItems();
    })();
  </script>
</body>
</html>
