# Reto Finexus: FastAPI (Backend) + Angular (Frontend) + Postgres (DB)

Este proyecto es una aplicación web fullstack que expone operaciones **CRUD** desde un **backend en FastAPI** contra una base de datos **PostgreSQL**, y un **cliente en Angular** que consume dichos endpoints. La infraestructura local se orquesta con **Docker** y **Docker Compose**.

---

## 🎯 Objetivos del proyecto
- Proveer un API REST en FastAPI para crear, leer, actualizar y eliminar Productos (CRUD).
- Persistencia de datos en **PostgreSQL**.
- Ofrecer una interfaz web en **Angular** para interactuar con el API.
- Facilitar el despliegue local con **Docker Compose**.

---

## 🧱 Arquitectura

```
┌──────────────────────────────────────┐      HTTP (JSON)      ┌────────────────────────────────────┐
│ frontend_product_management_app (4200) │<-------------------->│ backend_product_management_api (8000) │
└──────────────────────────────────────┘                       └───────────────┬────────────────────┘
                                                                              │ SQL
                                                                              ▼
                                                                     ┌───────────────────┐
                                                                     │  Postgres (5432)  │
                                                                     └───────────────────┘
```

- **Frontend (Angular)**: Servido en `http://localhost:4200`.
- **Backend (FastAPI)**: API en `http://localhost:8000` con documentación interactiva en `/docs` (Swagger UI) y `/redoc`.
- **Base de datos (Postgres)**: Servicio en `localhost:5432`.

---

## 📁 Estructura de carpetas

Estructura real del repo (según tu proyecto):

```
root/
├─ backend_product_management_api/
│  ├─ app/
│  │  ├─ main.py               # Punto de entrada FastAPI
│  │  ├─ api/                  # Routers / endpoints
│  │  ├─ models/               # Modelos SQLAlchemy
│  │  ├─ schemas/              # Pydantic I/O
│  │  ├─ crud/                 # Operaciones CRUD
│  │  └─ db/                   # Sesión, base, conexión
│  ├─ tests/                   # pytest
│  ├─ Dockerfile
│  ├─ requirements.txt
│  ├─ pytest.ini
│  ├─ .env.example
│  └─ .env (local, no commitear)
│
├─ frontend_product_management_app/
│  ├─ src/
│  │  ├─ app/
│  │  └─ environments/         # environment.ts / environment.prod.ts
│  ├─ Dockerfile
│  ├─ package.json
│  └─ docker-compose.yml (si lo usas localmente; sugerimos centralizar en raíz)
│
├─ infra/                      # (Sugerido) Infra común
│  └─ docker-compose.yml
├─ .env                        # (Opcional) variables raíz para Compose
└─ README.md
```

> **Recomendación:** centraliza **un solo** `docker-compose.yml` en `infra/` (o en la raíz) para evitar duplicados. Mantén `.env` por servicio (`backend_product_management_api/.env` y `frontend_product_management_app/.env`) o usa uno raíz con prefijos por servicio.

---

## ⚙️ Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instaladas las siguientes herramientas en tu entorno de desarrollo:

### 🐳 Opción 1: Ejecución con Docker (recomendada)
- **Docker**  
- **Docker Compose**

> Esta es la forma más sencilla y reproducible de levantar todo el entorno (backend, frontend y base de datos) sin configurar dependencias manualmente.

---

### 💻 Opción 2: Ejecución local sin Docker
Si prefieres correr los servicios directamente desde tu máquina, asegúrate de tener:

- **Python** `3.13` o superior  
- **Node.js** `20.19` o superior  
- **@angular/cli** `19` o superior (para el frontend Angular)  
- **FastAPI** instalado (para el backend Python)

> 💡 Tip: crea y activa un entorno virtual de Python (`venv` o `conda`) antes de instalar las dependencias del backend.


---

## 🔐 Variables de entorno

Ejemplo de `.env` raíz usado por Compose:

```

# DB
POSTGRES_DB=app_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres


```

> En **desarrollo** el host de la DB visto desde FastAPI debe ser **postgres** (nombre del servicio en Compose), no `localhost`.

---

## 🐳 Levantar los servicios con Docker

Desde la carpeta donde está tu `docker-compose.yml`:

```bash
docker compose up --build -d
```

Esto levantará:
- **angular-app** en `http://localhost:4200`
- **fastapi-app** en `http://localhost:8000`
- **postgres** en `localhost:5432`

**Logs:**
```bash
docker compose logs -f fastapi-app
```

**Apagar:**
```bash
docker compose down
```


---

## 🧩 Backend (FastAPI)

### ⚙️ Variables de entorno

Antes de ejecutar el backend, crea un archivo **`.env`** dentro de la carpeta `backend/` con el siguiente contenido:

```env
# Configuración de base de datos
DB_USER="myusername"
DB_PASSWORD="MyPassword123#"
DB_HOST="localhost"
DB_NAME="db_name"
DB_PORT=5432


# Configuración del servidor
PREFIX_API=/api
```

### Ejecutar local (sin Docker)
```bash
cd backend_product_management_api
python -m venv .venv && source .venv/bin/activate   # en Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```


### Puntos de entrada
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`


### Migraciones con Alembic (opcional pero recomendado)
```bash
# Inicializar (una vez)
alembic init alembic
# Edita alembic.ini (sqlalchemy.url) o usa env var DATABASE_URL
# Generar migración automática
ałembic revision --autogenerate -m "init"
# Aplicar migraciones
alembic upgrade head
```

---

## 🖥️ Frontend (Angular)

### Ejecutar local (sin Docker)
```bash
cd frontend_product_management_app
npm install
npm run start       # o: ng serve --open --port 4200
```




---

## 🗄️ Base de datos (PostgreSQL)

- El servicio expone el puerto `5432`.
- Variables por defecto (ajustables vía `.env`): `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`.
- Puedes incluir scripts de inicialización en `infra/init/*.sql` para crear tablas/seed al levantar.



---

## 🧪 Pruebas

### Backend (pytest)
```bash
cd backend_product_management_api
pytest -v
```



---


## 🔧 Sugerencias de mejora (cuando el proyecto crezca)

**Escalabilidad & calidad**

1. **Red de servicios y gateway**:
   - Añadir **Nginx** como reverse proxy; define `/api` → backend y `/` → frontend estático en prod.

2. **Migrations**:
   - Integrar **Alembic** en backend.
3. **Observabilidad**:
   - Implemenar logging estructurado (JSON), **CloudWatch**.
4. **Seguridad**:
   - CORS restrictivo por entorno; sanitiza inputs; usa **dependencias de seguridad** (Auth JWT, rate limiting con SlowAPI).
5. **Testing & CI/CD**:
   - Backend: pytest + coverage; Frontend: Jest/Karma + ESLint. Pipeline (GitHub Actions) para build, test, lint, y push de imágenes a registry.

6. **Entornos**:
   - Separar `docker-compose.dev.yml` y `docker-compose.prod.yml`. En prod deshabilita `--reload`, usa imágenes inmutables y no montes código.
7.  **Escalado**:
   - Para más usuarios, orquesta con **Kubernetes** o ECS, autoscaling del backend y una DB administrada (RDS/Cloud SQL). Coloca un **cache** (Redis) para lecturas frecuentes.


