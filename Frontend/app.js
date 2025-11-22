// Configuración de la API
// ⚠️ IMPORTANTE: Cambia esta URL por la URL de tu backend en Render
// Para desarrollo local, usa: http://localhost:8000
// Actualizado: Corrección de doble barra en URLs y CORS
const API_BASE_URL = 'https://blogaibackend.onrender.com';

// Función helper para construir URLs del API correctamente
function getApiUrl(endpoint) {
    // Remover cualquier barra final de la base URL
    const base = API_BASE_URL.replace(/\/+$/, '');
    // Remover cualquier barra inicial del endpoint
    const path = endpoint.replace(/^\/+/, '');
    // Combinar con una sola barra
    return `${base}/${path}`;
}

// Estado de la aplicación
let currentUser = null;
let authToken = null;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupEventListeners();
    loadPosts();
    checkBackendConnection();
});

// Verificar conexión con el backend
async function checkBackendConnection() {
    try {
        const response = await fetch(getApiUrl('health'));
        if (response.ok) {
            console.log('✅ Backend conectado correctamente');
        } else {
            console.warn('⚠️ Backend responde pero con errores');
        }
    } catch (error) {
        console.error('❌ No se pudo conectar con el backend:', error.message);
        showToast('No se pudo conectar con el backend. Verifica que esté corriendo.', 'error');
    }
}

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

    // Validación en tiempo real del prompt
    const promptTextarea = document.getElementById('prompt');
    if (promptTextarea) {
        promptTextarea.addEventListener('input', () => {
            const charCount = promptTextarea.value.length;
            const charCountEl = document.getElementById('prompt-char-count');
            if (charCountEl) {
                charCountEl.textContent = charCount;
                if (charCount > 450) {
                    charCountEl.style.color = 'var(--error-color)';
                } else if (charCount > 400) {
                    charCountEl.style.color = '#f59e0b';
                } else {
                    charCountEl.style.color = 'var(--text-secondary)';
                }
            }
        });
    }

    // Validación en tiempo real de contraseña
    const registerPassword = document.getElementById('register-password');
    if (registerPassword) {
        registerPassword.addEventListener('input', validatePasswordStrength);
    }

    // Validación de email en tiempo real
    document.querySelectorAll('input[type="email"]').forEach(input => {
        input.addEventListener('blur', validateEmail);
        input.addEventListener('input', clearFieldError);
    });
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

// Validar email
function validateEmail(e) {
    const emailInput = e.target;
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
        showFieldError(emailInput, 'Por favor ingresa un email válido');
        return false;
    }
    clearFieldError(e);
    return true;
}

// Validar fortaleza de contraseña
function validatePasswordStrength(e) {
    const passwordInput = e.target;
    const password = passwordInput.value;
    const hint = passwordInput.parentElement.querySelector('.form-hint');
    
    if (!hint) return;
    
    if (password.length < 6) {
        hint.textContent = 'La contraseña debe tener al menos 6 caracteres';
        hint.style.color = 'var(--error-color)';
        passwordInput.style.borderColor = 'var(--error-color)';
    } else if (password.length < 8) {
        hint.textContent = 'Contraseña débil - Usa al menos 8 caracteres para mayor seguridad';
        hint.style.color = '#f59e0b';
        passwordInput.style.borderColor = '#f59e0b';
    } else {
        hint.textContent = '✓ Contraseña válida';
        hint.style.color = 'var(--success-color)';
        passwordInput.style.borderColor = 'var(--success-color)';
    }
}

// Mostrar error en campo
function showFieldError(input, message) {
    clearFieldError({ target: input });
    input.style.borderColor = 'var(--error-color)';
    const errorMsg = document.createElement('small');
    errorMsg.className = 'field-error';
    errorMsg.textContent = message;
    errorMsg.style.color = 'var(--error-color)';
    errorMsg.style.display = 'block';
    errorMsg.style.marginTop = '5px';
    input.parentElement.appendChild(errorMsg);
}

// Limpiar error de campo
function clearFieldError(e) {
    const input = e.target || e;
    input.style.borderColor = '';
    const errorMsg = input.parentElement.querySelector('.field-error');
    if (errorMsg) {
        errorMsg.remove();
    }
}

// Mostrar alerta toast
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Manejar login
async function handleLogin(e) {
    e.preventDefault();
    clearMessages();
    
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const errorDiv = document.getElementById('login-error');
    
    // Validaciones del lado del cliente
    if (!email) {
        showFieldError(emailInput, 'El email es requerido');
        return;
    }
    
    if (!validateEmail({ target: emailInput })) {
        return;
    }
    
    if (!password) {
        showFieldError(passwordInput, 'La contraseña es requerida');
        return;
    }
    
    try {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);
        
        const response = await fetch(getApiUrl('token'), {
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
        showToast('¡Bienvenido! Inicio de sesión exitoso', 'success');
        
    } catch (error) {
        let errorMessage = error.message || 'Error al iniciar sesión';
        
        // Mejorar mensajes de error específicos
        if (errorMessage.includes('401') || errorMessage.includes('incorrectos')) {
            errorMessage = 'Email o contraseña incorrectos. Verifica tus credenciales.';
        } else if (errorMessage.includes('Network') || errorMessage.includes('Failed to fetch')) {
            errorMessage = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
        }
        
        errorDiv.textContent = errorMessage;
        errorDiv.classList.remove('hidden');
        showToast(errorMessage, 'error');
    }
}

// Manejar registro
async function handleRegister(e) {
    e.preventDefault();
    clearMessages();
    
    const emailInput = document.getElementById('register-email');
    const passwordInput = document.getElementById('register-password');
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const errorDiv = document.getElementById('register-error');
    const successDiv = document.getElementById('register-success');
    
    // Validaciones del lado del cliente
    if (!email) {
        showFieldError(emailInput, 'El email es requerido');
        return;
    }
    
    if (!validateEmail({ target: emailInput })) {
        return;
    }
    
    if (!password) {
        showFieldError(passwordInput, 'La contraseña es requerida');
        return;
    }
    
    if (password.length < 6) {
        showFieldError(passwordInput, 'La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    try {
        const response = await fetch(getApiUrl('register'), {
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
        
        successDiv.textContent = '¡Cuenta creada exitosamente! Redirigiendo al login...';
        successDiv.classList.remove('hidden');
        showToast('¡Cuenta creada exitosamente!', 'success');
        document.getElementById('register-form-element').reset();
        
        // Cambiar a tab de login después de 2 segundos
        setTimeout(() => {
            switchTab('login');
            document.getElementById('login-email').value = email;
            showToast('Ya puedes iniciar sesión con tu nueva cuenta', 'info');
        }, 2000);
        
    } catch (error) {
        let errorMessage = error.message || 'Error al registrar usuario';
        
        // Mejorar mensajes de error específicos
        if (errorMessage.includes('ya está registrado') || errorMessage.includes('already')) {
            errorMessage = 'Este email ya está registrado. Por favor inicia sesión.';
        } else if (errorMessage.includes('Network') || errorMessage.includes('Failed to fetch')) {
            errorMessage = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
        } else if (errorMessage.includes('400')) {
            errorMessage = 'Datos inválidos. Verifica que el email y contraseña sean correctos.';
        }
        
        errorDiv.textContent = errorMessage;
        errorDiv.classList.remove('hidden');
        showToast(errorMessage, 'error');
    }
}

// Manejar generación de post
async function handleGeneratePost(e) {
    e.preventDefault();
    clearMessages();
    
    const promptInput = document.getElementById('prompt');
    const prompt = promptInput.value.trim();
    const errorDiv = document.getElementById('generate-error');
    const successDiv = document.getElementById('generate-success');
    const generateBtn = document.getElementById('generate-btn');
    const generateBtnText = document.getElementById('generate-btn-text');
    const generateBtnLoading = document.getElementById('generate-btn-loading');
    
    // Validaciones del lado del cliente
    if (!prompt) {
        showFieldError(promptInput, 'Por favor describe el tema del artículo');
        return;
    }
    
    if (prompt.length < 10) {
        showFieldError(promptInput, 'El prompt debe tener al menos 10 caracteres');
        return;
    }
    
    if (prompt.length > 500) {
        showFieldError(promptInput, 'El prompt no puede exceder 500 caracteres');
        return;
    }
    
    // Deshabilitar botón y mostrar loading
    generateBtn.disabled = true;
    generateBtnText.classList.add('hidden');
    generateBtnLoading.classList.remove('hidden');
    showToast('Generando tu artículo... Esto puede tomar unos segundos', 'info');
    
    try {
        const response = await fetch(getApiUrl('generate-post'), {
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
        
        successDiv.textContent = '¡Artículo generado exitosamente! Revisa la sección de artículos.';
        successDiv.classList.remove('hidden');
        showToast('¡Artículo generado exitosamente!', 'success');
        document.getElementById('generate-form').reset();
        
        // Resetear contador de caracteres
        const charCountEl = document.getElementById('prompt-char-count');
        if (charCountEl) {
            charCountEl.textContent = '0';
            charCountEl.style.color = 'var(--text-secondary)';
        }
        
        // Recargar posts
        loadPosts();
        
        // Scroll a la sección de posts
        setTimeout(() => {
            document.getElementById('posts-section').scrollIntoView({ behavior: 'smooth' });
        }, 500);
        
    } catch (error) {
        let errorMessage = error.message || 'Error al generar el artículo';
        
        // Mejorar mensajes de error específicos
        if (errorMessage.includes('429') || errorMessage.includes('cuota') || errorMessage.includes('quota')) {
            errorMessage = 'Se ha excedido la cuota de la API. Por favor espera unos minutos antes de intentar nuevamente.';
        } else if (errorMessage.includes('401') || errorMessage.includes('no autorizado')) {
            errorMessage = 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.';
            setTimeout(() => {
                handleLogout();
                switchTab('login');
            }, 2000);
        }
        
        errorDiv.textContent = errorMessage;
        errorDiv.classList.remove('hidden');
        showToast(errorMessage, 'error');
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
        const response = await fetch(getApiUrl('posts'));
        
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
        let errorMsg = error.message || 'Error desconocido';
        if (errorMsg.includes('Network') || errorMsg.includes('Failed to fetch')) {
            errorMsg = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
        }
        
        container.innerHTML = `
            <div class="error-message" style="text-align: center; padding: 30px;">
                <div style="font-size: 3rem; margin-bottom: 15px;">⚠️</div>
                <strong style="display: block; margin-bottom: 10px; font-size: 1.2rem;">Error al cargar los artículos</strong>
                <p style="margin-bottom: 15px; color: var(--text-secondary);">${errorMsg}</p>
                <small style="display: block; margin-bottom: 20px; color: var(--text-secondary);">
                    Verifica que el backend esté corriendo en ${API_BASE_URL || 'http://localhost:8000'}
                </small>
                <button onclick="loadPosts()" class="btn btn-primary">
                    🔄 Reintentar
                </button>
            </div>
        `;
        showToast('Error al cargar los artículos', 'error');
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
    
    // Formatear el cuerpo del post para respetar saltos de línea
    const formattedBody = escapeHtml(post.body)
        .replace(/\n\n/g, '</p><p>')  // Dobles saltos de línea = nuevos párrafos
        .replace(/\n/g, '<br>');       // Saltos simples = <br>
    
    return `
        <div class="post-card">
            <div class="post-header">
                <h3 class="post-title">${escapeHtml(post.title)}</h3>
                <div class="post-meta">
                    <div>📅 ${date}</div>
                    <div>✍️ Autor #${post.author_id}</div>
                </div>
            </div>
            <div class="post-body"><p>${formattedBody}</p></div>
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
    // Confirmación más amigable
    const confirmLogout = confirm('¿Estás seguro de que deseas cerrar sesión?');
    if (confirmLogout) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
        authToken = null;
        currentUser = null;
        showUnauthenticatedView();
        document.getElementById('login-form-element').reset();
        document.getElementById('register-form-element').reset();
        clearMessages();
        showToast('Sesión cerrada exitosamente', 'info');
        // Scroll al inicio
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
