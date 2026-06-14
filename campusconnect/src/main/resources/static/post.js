const API = "http://localhost:8081/api/listings";

const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
  window.location.href = "index.html";
}

function showMsg(text, isError) {
  const el = document.getElementById("postMsg");
  el.style.display = "block";
  el.textContent = text;
  el.className = "msg " + (isError ? "msg-error" : "msg-success");
  el.scrollIntoView({ behavior: "smooth" });
}

async function postListing() {
  const title = document.getElementById("title").value.trim();
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value.trim();
  const price = document.getElementById("price").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!title || !category || !description || !price) {
    showMsg("Please fill all required fields.", true);
    return;
  }

  const listing = {
    title,
    category,
    description,
    price: parseFloat(price),
    sellerName: user.name,
    sellerEmail: user.email,
    sellerPhone: phone || user.phone || "",
    sellerId: user.id,
  };

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(listing),
    });

    const data = await res.json();

    if (data.success) {
      showMsg(data.message, false);
      // Clear form
      document.getElementById("title").value = "";
      document.getElementById("category").value = "";
      document.getElementById("description").value = "";
      document.getElementById("price").value = "";
      document.getElementById("phone").value = "";

      setTimeout(() => {
        window.location.href = "marketplace.html";
      }, 1200);
    } else {
      showMsg(data.message, true);
    }
  } catch (err) {
    showMsg("Server error. Please make sure Spring Boot is running.", true);
    console.error(err);
  }
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}
