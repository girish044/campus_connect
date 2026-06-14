const API = "http://localhost:8081/api/listings";

//  to Check if user is logged in or not
const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
  window.location.href = "index.html";
}

// Show welcome message
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("welcomeText").textContent = "Welcome, " + user.name + "! 👋";
  loadListings();
});

async function loadListings(keyword = "", category = "") {
  const container = document.getElementById("listingContainer");
  container.innerHTML = "<p class='loading-text'>Loading...</p>";

  let url = API;
  const params = [];
  if (keyword) params.push("keyword=" + encodeURIComponent(keyword));
  if (category) params.push("category=" + encodeURIComponent(category));
  if (params.length > 0) url += "?" + params.join("&");

  try {
    const res = await fetch(url);
    const listings = await res.json();

    container.innerHTML = "";

    if (listings.length === 0) {
      container.innerHTML = "<p class='loading-text'>No listings found. Be the first to post!</p>";
      return;
    }

    listings.forEach((item) => {
      const card = document.createElement("div");
      card.className = "listing-card";
      card.innerHTML = `
        <div class="listing-category">${item.category || "Other"}</div>
        <h3 class="listing-title">${item.title}</h3>
        <p class="listing-desc">${item.description}</p>
        <div class="listing-footer">
          <span class="listing-price">₹${item.price}</span>
          <button class="btn btn-primary btn-sm" onclick="showContact(${JSON.stringify(item).split('"').join('&quot;')})">
            Contact Seller
          </button>
        </div>
        <div class="listing-seller">
          <small>🧑 ${item.sellerName || "Unknown"}</small>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = "<p class='loading-text'>Error loading listings. Is the server running?</p>";
    console.error(err);
  }
}

function searchListings() {
  const keyword = document.getElementById("searchInput").value.trim();
  const category = document.getElementById("categoryFilter").value;
  loadListings(keyword, category);
}

function clearSearch() {
  document.getElementById("searchInput").value = "";
  document.getElementById("categoryFilter").value = "";
  loadListings();
}

function showContact(item) {
  const details = document.getElementById("contactDetails");
  details.innerHTML = `
    <p><strong>Item:</strong> ${item.title}</p>
    <p><strong>Seller:</strong> ${item.sellerName || "N/A"}</p>
    <p><strong>Email:</strong> <a href="mailto:${item.sellerEmail}">${item.sellerEmail || "N/A"}</a></p>
    <p><strong>Phone:</strong> ${item.sellerPhone || "Not provided"}</p>
  `;
  document.getElementById("contactModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("contactModal").style.display = "none";
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}

// Search on Enter key
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchListings();
});
