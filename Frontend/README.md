# AI-Blog Frontend

Frontend para la plataforma de generación de artículos de blog usando IA.

## 🚀 Características

- ✅ Interfaz moderna y responsiva
- ✅ Autenticación (Registro y Login)
- ✅ Generación de artículos con IA
- ✅ Feed público de artículos
- ✅ Almacenamiento de sesión en localStorage
- ✅ Diseño responsive para móviles

## 📁 Estructura

```
Frontend/
├── index.html      # Página principal
├── styles.css      # Estilos
├── app.js          # Lógica de la aplicación
└── README.md       # Este archivo
```

## ⚙️ Configuración

### 1. Configurar la URL del Backend

**⚠️ IMPORTANTE:** Edita el archivo `app.js` y cambia la variable `API_BASE_URL`:

```javascript
const API_BASE_URL = 'https://tu-backend.onrender.com';
```

Reemplaza `https://tu-backend.onrender.com` con la URL real de tu backend desplegado en Render.

## 🌐 Despliegue en GitHub Pages

### Configuración Automática con GitHub Actions

El proyecto ya está configurado con un workflow de GitHub Actions que despliega automáticamente en GitHub Pages.

#### Pasos para Desplegar:

1. **Configura GitHub Pages en tu repositorio:**
   - Ve a **Settings** > **Pages** en tu repositorio de GitHub
   - En **Source**, selecciona: `GitHub Actions`

2. **Configura la URL del Backend:**
   - Edita `app.js` y cambia `API_BASE_URL` con la URL de tu backend
   ```javascript
   const API_BASE_URL = 'https://tu-backend.onrender.com';
   ```

3. **Haz push a la rama main:**
   ```bash
   git add .
   git commit -m "Configurar despliegue en GitHub Pages"
   git push origin main
   ```

4. **Verifica el despliegue:**
   - Ve a la pestaña **Actions** en GitHub para ver el progreso
   - Una vez completado, tu sitio estará en: `https://tuusuario.github.io/ProyectoFinalBack`

El workflow se ejecutará automáticamente cada vez que hagas cambios en los archivos de `Frontend/` y hagas push a `main`.

📖 **Para más detalles, consulta:** [DEPLOY_GITHUB_PAGES.md](DEPLOY_GITHUB_PAGES.md)

## 🔧 Configuración del Backend para CORS

Asegúrate de que en tu backend (Render) tengas configurado:

```env
FRONTEND_URL=https://tuusuario.github.io
```

Y que el backend tenga configurado CORS para aceptar peticiones desde GitHub Pages.

## 📖 Uso

1. **Registro**: Los usuarios pueden crear una cuenta nueva
2. **Login**: Iniciar sesión con email y contraseña
3. **Generar Artículo**: Una vez autenticado, escribir un prompt y generar un artículo
4. **Ver Artículos**: Todos los artículos generados se muestran en el feed público

## 🛠️ Tecnologías

- HTML5
- CSS3 (con variables CSS y diseño moderno)
- JavaScript Vanilla (ES6+)
- Fetch API para comunicación con el backend

## 📝 Notas

- El token JWT se guarda en `localStorage`
- La sesión persiste entre recargas de página
- El diseño es completamente responsive
- No se requiere ningún framework o build tool
- Funciona directamente desde GitHub Pages sin configuración adicional

## 🔍 Pruebas Locales

Para probar localmente antes de desplegar:

1. Abre `index.html` en tu navegador
2. O usa un servidor local:
   ```bash
   # Con Python
   python -m http.server 8000
   
   # Con Node.js
   npx serve .
   ```
3. Asegúrate de configurar `API_BASE_URL` en `app.js` con la URL de tu backend

## ⚠️ Solución de Problemas

### Los artículos no se cargan
- Verifica que `API_BASE_URL` en `app.js` sea correcta
- Verifica que el backend esté desplegado y funcionando
- Abre la consola del navegador (F12) para ver errores

### Error de CORS
- Asegúrate de que `FRONTEND_URL` esté configurado en el backend
- Verifica que la URL en el backend coincida con tu GitHub Pages

### El login no funciona
- Verifica que el backend esté accesible
- Revisa la consola del navegador para ver errores
- Asegúrate de usar el formato correcto: `username` y `password` en FormData

