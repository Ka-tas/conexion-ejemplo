// Verificar si el usuario está autenticado
function checkAuth() {
    const user = localStorage.getItem('user');
    if (!user && !window.location.href.includes('login.html') && !window.location.href.includes('index.html')) {
        window.location.href = 'login.html';
    }
    return user ? JSON.parse(user) : null;
}

// Manejar login
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Si estamos en la página de login
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;
            
            // Validación simple
            if (!email || !password || !role) {
                showMessage('Por favor completa todos los campos', 'error');
                return;
            }
            
            // Simular autenticación (en un caso real, esto sería una llamada al backend)
            // Datos de ejemplo
            const users = {
                'profesor@ejemplo.com': { id: 1, nombre: 'Carlos Pérez', role: 'profesor', password: 'profesor123' },
                'alumno@ejemplo.com': { id: 2, nombre: 'Ana García', role: 'alumno', password: 'alumno123' }
            };
            
            // Verificar credenciales
            if (users[email] && users[email].password === password && users[email].role === role) {
                const user = {
                    id: users[email].id,
                    nombre: users[email].nombre,
                    email: email,
                    role: role
                };
                
                // Guardar usuario en localStorage
                localStorage.setItem('user', JSON.stringify(user));
                
                // Redirigir al dashboard
                window.location.href = 'dashboard.html';
            } else {
                showMessage('Credenciales incorrectas o rol no coincide', 'error');
            }
        });
    }
    
    // Si estamos en el dashboard
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('user');
            window.location.href = 'index.html';
        });
        
        // Mostrar información del usuario
        const user = checkAuth();
        if (user) {
            const userName = document.getElementById('userName');
            const userRole = document.getElementById('userRole');
            const welcomeMessage = document.getElementById('welcomeMessage');
            
            if (userName) userName.textContent = user.nombre;
            if (userRole) userRole.textContent = user.role === 'profesor' ? 'Profesor' : 'Alumno';
            if (welcomeMessage) welcomeMessage.textContent = `Bienvenido ${user.nombre} (${user.role === 'profesor' ? 'Profesor' : 'Alumno'})`;
            
            // Cargar contenido según el rol
            loadRoleContent(user.role);
        }
    }
});

// Mostrar mensajes
function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        
        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = 'message';
        }, 5000);
    }
}

// Cargar contenido según el rol
function loadRoleContent(role) {
    const contentDiv = document.getElementById('dashboardContent');
    if (!contentDiv) return;
    
    if (role === 'profesor') {
        contentDiv.innerHTML = `
            <div class="role-content">
                <h3>Panel de Profesor</h3>
                <p>Bienvenido al panel de gestión para profesores.</p>
                <ul>
                    <li>Gestionar cursos</li>
                    <li>Asignar tareas</li>
                    <li>Calificar estudiantes</li>
                    <li>Ver estadísticas</li>
                </ul>
                <button class="btn" onclick="window.location.href='profesor.html'">Acceder al Panel Completo</button>
            </div>
        `;
    } else if (role === 'alumno') {
        contentDiv.innerHTML = `
            <div class="role-content">
                <h3>Panel de Alumno</h3>
                <p>Bienvenido al panel de estudiantes.</p>
                <ul>
                    <li>Ver mis cursos</li>
                    <li>Consultar calificaciones</li>
                    <li>Entregar tareas</li>
                    <li>Ver mensajes del profesor</li>
                </ul>
                <button class="btn" onclick="window.location.href='alumno.html'">Acceder al Panel Completo</button>
            </div>
        `;
    }
}