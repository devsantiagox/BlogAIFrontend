# 🚀 Despliegue en GitHub Pages

Esta guía te ayudará a desplegar el frontend de AI-Blog en GitHub Pages.

## 📋 Requisitos Previos

1. Tener una cuenta de GitHub
2. Tener el repositorio en GitHub
3. Tener permisos de administrador en el repositorio

## 🔧 Pasos para Desplegar

### Paso 1: Configurar GitHub Pages en el Repositorio

1. Ve a tu repositorio en GitHub
2. Haz clic en **Settings** (Configuración)
3. En el menú lateral, busca **Pages**
4. En **Source**, selecciona:
   - **Source**: `GitHub Actions`
5. Guarda los cambios

### Paso 2: Configurar la URL del Backend

**⚠️ IMPORTANTE:** Antes de desplegar, asegúrate de configurar la URL de tu backend en `app.js`:

```javascript
const API_BASE_URL = 'https://tu-backend.onrender.com';
```

Reemplaza `https://tu-backend.onrender.com` con la URL real de tu backend desplegado.

### Paso 3: Hacer Push al Repositorio

El workflow de GitHub Actions se ejecutará automáticamente cuando hagas push a la rama `main` o `master`:

```bash
git add .
git commit -m "Configurar despliegue en GitHub Pages"
git push origin main
```

### Paso 4: Verificar el Despliegue

1. Ve a la pestaña **Actions** en tu repositorio de GitHub
2. Verás el workflow "Deploy to GitHub Pages" ejecutándose
3. Espera a que termine (puede tomar 1-2 minutos)
4. Una vez completado, ve a **Settings** > **Pages**
5. Verás la URL de tu sitio: `https://tuusuario.github.io/ProyectoFinalBack`

## 🔍 Verificar que Funciona

1. Abre la URL de tu sitio en GitHub Pages
2. Abre la consola del navegador (F12)
3. Verifica que no haya errores de CORS
4. Prueba hacer login/registro

## ⚙️ Configuración del Backend para CORS

Asegúrate de que tu backend (en Render) tenga configurado CORS para aceptar peticiones desde GitHub Pages:

```python
# En tu backend, asegúrate de tener:
FRONTEND_URL=https://tuusuario.github.io
```

Y que el backend permita el origen de GitHub Pages en CORS.

## 🔄 Actualizaciones Automáticas

Cada vez que hagas cambios en los archivos de `Frontend/` y hagas push a `main`, el sitio se actualizará automáticamente.

## 🛠️ Solución de Problemas

### El workflow no se ejecuta
- Verifica que estés haciendo push a la rama `main` o `master`
- Verifica que los archivos estén en la carpeta `Frontend/`
- Revisa la pestaña **Actions** para ver errores

### Error 404 en GitHub Pages
- Espera unos minutos después del despliegue
- Verifica que el workflow se haya completado exitosamente
- Asegúrate de que el archivo `index.html` esté en `Frontend/`

### Error de CORS
- Verifica que `API_BASE_URL` en `app.js` sea correcta
- Asegúrate de que el backend permita el origen de GitHub Pages
- Revisa la consola del navegador para ver el error específico

### Los cambios no se reflejan
- Limpia la caché del navegador (Ctrl+Shift+R o Cmd+Shift+R)
- Espera unos minutos (puede haber un delay en GitHub Pages)
- Verifica que el workflow se haya ejecutado correctamente

## 📝 Notas

- El despliegue es automático con cada push a `main`
- GitHub Pages es gratuito para repositorios públicos
- El sitio estará disponible en: `https://tuusuario.github.io/ProyectoFinalBack`
- Si cambias el nombre del repositorio, la URL cambiará

## 🔗 Enlaces Útiles

- [Documentación de GitHub Pages](https://docs.github.com/en/pages)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Workflow de despliegue](.github/workflows/deploy-pages.yml)

