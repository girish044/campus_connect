const API = "http://localhost:8081/api/users";

function showSignup() {
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("signupSection").style.display = "block";
}

function showLogin() {
  document.getElementById("signupSection").style.display = "none";
  document.getElementById("loginSection").style.display = "block";
}

function showMsg(id, text, isError) {
  const el = document.getElementById(id);
  el.style.display = "block";
  el.textContent = text;
  el.className = "msg " + (isError ? "msg-error" : "msg-success");
}

async function doLogin() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    showMsg("loginMsg", "Please enter email and password.", true);
    return;
  }

  try {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.success) {
      // Save user to localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      showMsg("loginMsg", data.message, false);

      // Redirect after short delay
      setTimeout(() => {
        window.location.href = "marketplace.html";
      }, 800);
    } else {
      showMsg("loginMsg", data.message, true);
    }
  } catch (err) {
    showMsg("loginMsg", "Server not reachable. Make sure Spring Boot is running on port 8081.", true);
    console.error(err);
  }
}

async function doSignup() {
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();
  const college = document.getElementById("signupCollege").value.trim();
  const phone = document.getElementById("signupPhone").value.trim();

  if (!name || !email || !password) {
    showMsg("signupMsg", "Name, Email, and Password are required.", true);
    return;
  }

  if (password.length < 6) {
    showMsg("signupMsg", "Password must be at least 6 characters.", true);
    return;
  }

  try {
    const res = await fetch(`${API}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, college, phone }),
    });

    const data = await res.json();

    if (data.success) {
      showMsg("signupMsg", data.message + " Redirecting to login...", false);
      setTimeout(() => {
        showLogin();
        document.getElementById("signupMsg").style.display = "none";
      }, 1500);
    } else {
      showMsg("signupMsg", data.message, true);
    }
  } catch (err) {
    showMsg("signupMsg", "Server not reachable. Make sure Spring Boot is running on port 8081.", true);
    console.error(err);
  }
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}

// allow for login 
document.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const loginSection = document.getElementById("loginSection");
    const signupSection = document.getElementById("signupSection");
    if (loginSection && loginSection.style.display !== "none") {
      doLogin();
    } else if (signupSection && signupSection.style.display !== "none") {
      doSignup();
    }
  }
});
