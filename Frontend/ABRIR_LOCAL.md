# 🌐 Abrir el Frontend Localmente

## ✅ Configuración Completada

El frontend ya está configurado para usar el backend local:
- ✅ URL del backend actualizada a: `http://localhost:8000/`
- ✅ Servidor HTTP iniciado en: `http://localhost:8080`

## 🚀 Abrir el Frontend

### Opción 1: Desde el Navegador (Recomendado)

1. **Abre tu navegador** (Chrome, Firefox, Edge, etc.)
2. **Ve a la siguiente URL**:
   ```
   http://localhost:8080
   ```
3. **O directamente abre el archivo**:
   - Ve a la carpeta: `BlogAIFrontend/Frontend/`
   - Haz doble clic en `index.html`

### Opción 2: Desde la Terminal

**Windows:**
```bash
start http://localhost:8080
```

**Linux:**
```bash
xdg-open http://localhost:8080
```

**Mac:**
```bash
open http://localhost:8080
```

## 📋 Verificar que Todo Funcione

### 1. Backend Debe Estar Corriendo

Asegúrate de que el backend esté corriendo en otra terminal:
```bash
cd BlogAIBackend
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Deberías ver:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### 2. Frontend Debe Estar Accesible

El frontend debería estar en: http://localhost:8080

## 🧪 Validar el Frontend

Una vez abierto el navegador, prueba:

1. **Ver la página principal**
   - Deberías ver "AI-Blog" y los formularios de login/registro

2. **Registrar un usuario**
   - Click en "Registrarse"
   - Ingresa un email y contraseña
   - Click en "Registrarse"

3. **Iniciar sesión**
   - Usa las credenciales que acabas de crear
   - Click en "Iniciar Sesión"

4. **Ver los artículos**
   - Deberías ver la sección "Artículos Generados"
   - Los artículos se cargan automáticamente

5. **Generar un artículo**
   - Una vez logueado, verás el formulario "Generar Nuevo Artículo"
   - Escribe un prompt (ej: "Escribe sobre las ventajas de la inteligencia artificial")
   - Click en "Generar Artículo"
   - Espera a que se genere (puede tomar unos segundos)

## 🐛 Solución de Problemas

### Error: "No se puede acceder a localhost:8080"
- Verifica que el servidor HTTP esté corriendo
- Intenta reiniciar el servidor:
  ```bash
  cd BlogAIFrontend/Frontend
  python -m http.server 8080
  ```

### Error de CORS en la consola del navegador
- Verifica que el backend esté corriendo en `http://localhost:8000`
- Abre la consola del navegador (F12) para ver el error específico
- Verifica que `FRONTEND_URL=http://localhost:8080` esté en el `.env` del backend

### El frontend no se conecta al backend
- Verifica que ambos servidores estén corriendo:
  - Backend: `http://localhost:8000`
  - Frontend: `http://localhost:8080`
- Abre la consola del navegador (F12) para ver errores de red
- Verifica que `API_BASE_URL` en `app.js` sea `http://localhost:8000/`

### Los artículos no se cargan
- Abre la consola del navegador (F12) → pestaña "Network"
- Verifica que las peticiones a `/posts` estén funcionando
- Verifica que el backend esté respondiendo correctamente

## 💡 Tips

- **Consola del Navegador**: Presiona F12 para abrir las herramientas de desarrollador
- **Ver Peticiones**: En la pestaña "Network" puedes ver todas las peticiones HTTP
- **Ver Errores**: En la pestaña "Console" puedes ver errores de JavaScript
- **Recargar**: Presiona Ctrl+Shift+R (o Cmd+Shift+R en Mac) para recargar sin caché

## ✅ Checklist de Validación

- [ ] El frontend carga correctamente en http://localhost:8080
- [ ] Puedo ver el formulario de registro/login
- [ ] Puedo registrar un nuevo usuario
- [ ] Puedo iniciar sesión con el usuario creado
- [ ] Veo los artículos en el feed
- [ ] Puedo generar un nuevo artículo
- [ ] No hay errores en la consola del navegador (F12)
- [ ] No hay errores de CORS

---

**¡Listo! Tu frontend debería estar funcionando perfectamente.** 🎉

