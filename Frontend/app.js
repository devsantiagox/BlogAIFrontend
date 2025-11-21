// Configuración de la API
// ⚠️ IMPORTANTE: Cambia esta URL por la URL de tu backend en Render
const API_BASE_URL = 'https://blogaibackend.onrender.com/';

// Estado de la aplicación
let currentUser = null;
let authToken = null;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupEventListeners();
    loadPosts();
});

// Verificar si el usuario está autenticado
function checkAuth() {
    const token = localStorage.getItem('authToken');
    const email = localStorage.getItem('userEmail');
    
    if (token && email) {
        authToken = token;
        currentUser = { email };
        showAuthenticatedView();
    } else {
        showUnauthenticatedView();
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Tabs de autenticación
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tab = e.target.dataset.tab;
            switchTab(tab);
        });
    });

    // Formulario de login
    document.getElementById('login-form-element').addEventListener('submit', handleLogin);
    
    // Formulario de registro
    document.getElementById('register-form-element').addEventListener('submit', handleRegister);
    
    // Formulario de generación
    document.getElementById('generate-form').addEventListener('submit', handleGeneratePost);
    
    // Botón de logout
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
}

// Cambiar entre tabs de login/register
function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    document.getElementById(`${tab}-form`).classList.add('active');
    
    // Limpiar mensajes
    clearMessages();
}

// Limpiar mensajes de error/éxito
function clearMessages() {
    document.querySelectorAll('.error-message, .success-message').forEach(msg => {
        msg.classList.add('hidden');
        msg.textContent = '';
    });
}

// Manejar login
async function handleLogin(e) {
    e.preventDefault();
    clearMessages();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');
    
    try {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);
        
        const response = await fetch(`${API_BASE_URL}/token`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Error al iniciar sesión');
        }
        
        const data = await response.json();
        authToken = data.access_token;
        currentUser = { email };
        
        // Guardar en localStorage
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('userEmail', email);
        
        showAuthenticatedView();
        document.getElementById('login-form-element').reset();
        
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.remove('hidden');
    }
}

// Manejar registro
async function handleRegister(e) {
    e.preventDefault();
    clearMessages();
    
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const errorDiv = document.getElementById('register-error');
    const successDiv = document.getElementById('register-success');
    
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Error al registrar usuario');
        }
        
        successDiv.textContent = '¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.';
        successDiv.classList.remove('hidden');
        document.getElementById('register-form-element').reset();
        
        // Cambiar a tab de login después de 2 segundos
        setTimeout(() => {
            switchTab('login');
            document.getElementById('login-email').value = email;
        }, 2000);
        
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.remove('hidden');
    }
}

// Manejar generación de post
async function handleGeneratePost(e) {
    e.preventDefault();
    clearMessages();
    
    const prompt = document.getElementById('prompt').value;
    const errorDiv = document.getElementById('generate-error');
    const successDiv = document.getElementById('generate-success');
    const generateBtn = document.getElementById('generate-btn');
    const generateBtnText = document.getElementById('generate-btn-text');
    const generateBtnLoading = document.getElementById('generate-btn-loading');
    
    // Deshabilitar botón y mostrar loading
    generateBtn.disabled = true;
    generateBtnText.classList.add('hidden');
    generateBtnLoading.classList.remove('hidden');
    
    try {
        const response = await fetch(`${API_BASE_URL}/generate-post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ prompt })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Error al generar el artículo');
        }
        
        const post = await response.json();
        
        successDiv.textContent = '¡Artículo generado exitosamente!';
        successDiv.classList.remove('hidden');
        document.getElementById('generate-form').reset();
        
        // Recargar posts
        loadPosts();
        
        // Scroll a la sección de posts
        setTimeout(() => {
            document.getElementById('posts-section').scrollIntoView({ behavior: 'smooth' });
        }, 500);
        
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.remove('hidden');
    } finally {
        // Rehabilitar botón
        generateBtn.disabled = false;
        generateBtnText.classList.remove('hidden');
        generateBtnLoading.classList.add('hidden');
    }
}

// Cargar posts
async function loadPosts() {
    const container = document.getElementById('posts-container');
    container.innerHTML = '<div class="loading">Cargando artículos...</div>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/posts`);
        
        if (!response.ok) {
            throw new Error('Error al cargar los artículos');
        }
        
        const posts = await response.json();
        
        if (posts.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📝</div>
                    <div class="empty-state-text">Aún no hay artículos generados</div>
                    <p style="margin-top: 10px; color: var(--text-secondary);">Sé el primero en generar un artículo</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = posts.map(post => createPostCard(post)).join('');
        
    } catch (error) {
        container.innerHTML = `
            <div class="error-message">
                <strong>Error al cargar los artículos:</strong><br>
                ${error.message}<br>
                <small style="margin-top: 10px; display: block;">Verifica que la URL del backend sea correcta en app.js</small>
            </div>
        `;
    }
}

// Crear tarjeta de post
function createPostCard(post) {
    const date = new Date(post.created_at).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    return `
        <div class="post-card">
            <div class="post-header">
                <h3 class="post-title">${escapeHtml(post.title)}</h3>
                <div class="post-meta">
                    <div>📅 ${date}</div>
                    <div>✍️ Autor #${post.author_id}</div>
                </div>
            </div>
            <div class="post-body">${escapeHtml(post.body)}</div>
            ${post.seo_keywords ? `
                <div class="post-seo">
                    <div class="post-seo-label">🔍 Palabras clave SEO:</div>
                    <div class="post-seo-keywords">${escapeHtml(post.seo_keywords)}</div>
                </div>
            ` : ''}
        </div>
    `;
}

// Escapar HTML para prevenir XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Mostrar vista autenticada
function showAuthenticatedView() {
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('generate-section').classList.remove('hidden');
    document.getElementById('user-info').classList.remove('hidden');
    document.getElementById('user-email').textContent = currentUser.email;
}

// Mostrar vista no autenticada
function showUnauthenticatedView() {
    document.getElementById('auth-section').classList.remove('hidden');
    document.getElementById('generate-section').classList.add('hidden');
    document.getElementById('user-info').classList.add('hidden');
}

// Manejar logout
function handleLogout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    authToken = null;
    currentUser = null;
    showUnauthenticatedView();
    document.getElementById('login-form-element').reset();
    document.getElementById('register-form-element').reset();
    clearMessages();
}
