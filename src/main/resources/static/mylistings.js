const API = "http://localhost:8081/api/listings";

const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  loadMyListings();
});

async function loadMyListings() {
  const container = document.getElementById("myListingContainer");
  container.innerHTML = "<p class='loading-text'>Loading your listings...</p>";

  try {
    const res = await fetch(`${API}/user/${user.id}`);
    const listings = await res.json();

    container.innerHTML = "";

    if (listings.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding: 40px;">
          <p style="font-size:1.1rem; color:#666;">You haven't posted anything yet.</p>
          <button class="btn btn-primary" onclick="window.location.href='post.html'">Post Your First Item</button>
        </div>
      `;
      return;
    }

    listings.forEach((item) => {
      const card = document.createElement("div");
      card.className = "listing-card";
      card.innerHTML = `
        <div class="listing-category">${item.category}</div>
        <h3 class="listing-title">${item.title}</h3>
        <p class="listing-desc">${item.description}</p>
        <div class="listing-footer">
          <span class="listing-price">₹${item.price}</span>
          <div>
            <button class="btn btn-secondary btn-sm" onclick="openEditModal(${item.id}, '${escape(item.title)}', '${item.category}', '${escape(item.description)}', ${item.price})">✏️ Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteListing(${item.id})">🗑️ Delete</button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = "<p class='loading-text'>Error loading listings.</p>";
    console.error(err);
  }
}

function openEditModal(id, title, category, description, price) {
  document.getElementById("editId").value = id;
  document.getElementById("editTitle").value = unescape(title);
  document.getElementById("editCategory").value = category;
  document.getElementById("editDescription").value = unescape(description);
  document.getElementById("editPrice").value = price;
  document.getElementById("editModal").style.display = "flex";
}

function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
}

async function saveEdit() {
  const id = document.getElementById("editId").value;
  const title = document.getElementById("editTitle").value.trim();
  const category = document.getElementById("editCategory").value;
  const description = document.getElementById("editDescription").value.trim();
  const price = document.getElementById("editPrice").value;

  try {
    const res = await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        category,
        description,
        price: parseFloat(price),
        sellerId: user.id,
      }),
    });

    const data = await res.json();

    closeEditModal();

    const msgEl = document.getElementById("myListingMsg");
    msgEl.style.display = "block";
    msgEl.textContent = data.message;
    msgEl.className = "msg " + (data.success ? "msg-success" : "msg-error");

    if (data.success) {
      setTimeout(() => { msgEl.style.display = "none"; }, 2000);
      loadMyListings();
    }
  } catch (err) {
    console.error(err);
  }
}

async function deleteListing(id) {
  if (!confirm("Are you sure you want to delete this listing?")) return;

  try {
    const res = await fetch(`${API}/${id}?sellerId=${user.id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    const msgEl = document.getElementById("myListingMsg");
    msgEl.style.display = "block";
    msgEl.textContent = data.message;
    msgEl.className = "msg " + (data.success ? "msg-success" : "msg-error");

    if (data.success) {
      setTimeout(() => { msgEl.style.display = "none"; }, 2000);
      loadMyListings();
    }
  } catch (err) {
    console.error(err);
  }
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}
