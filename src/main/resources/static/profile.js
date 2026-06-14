const API = "https://campus-connect-79vr.onrender.com/api/users";

const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  // Fill in current data from localStorage
  document.getElementById("profileName").value = user.name || "";
  document.getElementById("profileEmail").value = user.email || "";
  document.getElementById("profileCollege").value = user.college || "";
  document.getElementById("profilePhone").value = user.phone || "";
});

function showMsg(text, isError) {
  const el = document.getElementById("profileMsg");
  el.style.display = "block";
  el.textContent = text;
  el.className = "msg " + (isError ? "msg-error" : "msg-success");
}

async function updateProfile() {
  const name = document.getElementById("profileName").value.trim();
  const college = document.getElementById("profileCollege").value.trim();
  const phone = document.getElementById("profilePhone").value.trim();

  if (!name) {
    showMsg("Name cannot be empty.", true);
    return;
  }

  try {
    const res = await fetch(`${API}/profile/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, college, phone }),
    });

    const data = await res.json();

    if (data.success) {
      // Update localStorage with new values
      user.name = name;
      user.college = college;
      user.phone = phone;
      localStorage.setItem("user", JSON.stringify(user));

      showMsg("Profile updated successfully!", false);
    } else {
      showMsg(data.message, true);
    }
  } catch (err) {
    showMsg("Server error. Please try again.", true);
    console.error(err);
  }
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}
