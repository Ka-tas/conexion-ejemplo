const API_URL = "https://conexion-ejemplo-api.onrender.com";

// =======================
// Verificar autenticación
// =======================
function checkAuth() {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (!token || !user) {
    if (!location.href.includes("login.html") && !location.href.includes("index.html")) {
      location.href = "login.html";
    }
    return null;
  }
  return JSON.parse(user);
}

// =======================
// DOM Loaded
// =======================
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const logoutBtn = document.getElementById("logoutBtn");

  // ---------- LOGIN ----------
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      if (!email || !password) {
        showMessage("Completa todos los campos", "error");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
          showMessage(data.error || "Error al iniciar sesión", "error");
          return;
        }

        // Guardar token y usuario
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        window.location.href = "dashboard.html";

      } catch (err) {
        showMessage("No se pudo conectar con el servidor", "error");
      }
    });
  }

  // ---------- DASHBOARD ----------
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      location.href = "index.html";
    });

    const user = checkAuth();
    if (user) {
      loadUserInfo(user);
      loadRoleContent(user.role);
    }
  }
});

// =======================
// Mostrar datos del usuario
// =======================
function loadUserInfo(user) {
  const userName = document.getElementById("userName");
  const userRole = document.getElementById("userRole");
  const welcomeMessage = document.getElementById("welcomeMessage");

  if (userName) userName.textContent = user.nombre;
  if (userRole) userRole.textContent = user.role;
  if (welcomeMessage) {
    welcomeMessage.textContent = `Bienvenido ${user.nombre} (${user.role})`;
  }
}

// =======================
// Mensajes
// =======================
function showMessage(text, type) {
  const msg = document.getElementById("message");
  if (!msg) return;

  msg.textContent = text;
  msg.className = `message ${type}`;

  setTimeout(() => {
    msg.textContent = "";
    msg.className = "message";
  }, 4000);
}

// =======================
// Contenido por rol
// =======================
function loadRoleContent(role) {
  const content = document.getElementById("dashboardContent");
  if (!content) return;

  if (role === "profesor") {
    content.innerHTML = `
      <h3>Panel de Profesor</h3>
      <button onclick="location.href='profesor.html'">Ir al panel</button>
    `;
  } else {
    content.innerHTML = `
      <h3>Panel de Alumno</h3>
      <button onclick="location.href='alumno.html'">Ir al panel</button>
    `;
  }
}
