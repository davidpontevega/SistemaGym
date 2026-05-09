# 🏋️ Sistema Gym API

REST API para un sistema de gestión de gimnasio desarrollada con Django REST Framework, autenticación JWT, documentación Swagger y deploy en Render.

## 🚀 Demo en producción

| Recurso | URL |
|---|---|
| API Swagger | https://sistemagym-48kj.onrender.com/api/schema/swagger-ui/ |
| Redoc | https://sistemagym-48kj.onrender.com/api/schema/redoc/ |
| Admin Django | https://sistemagym-48kj.onrender.com/admin/ |

---

## 📋 Requisitos del proyecto

- [x] Framework Django
- [x] Django ORM
- [x] Base de datos PostgreSQL
- [x] Autenticación JWT (Rutas protegidas)
- [x] Al menos un CRUD
- [x] Al menos un Endpoint con lógica de negocio
- [x] Repositorio en GitHub
- [x] Documentación Swagger
- [x] Deploy en Render ✅

---

## 🛠️ Stack tecnológico

**Backend**
- Python 3.12
- Django 5.2
- Django REST Framework 3.16
- PostgreSQL
- SimpleJWT — autenticación JWT
- drf-spectacular — documentación Swagger
- WhiteNoise — archivos estáticos
- Gunicorn — servidor de producción

**Frontend**
- React 18
- Vite
- Axios
- React Router DOM

---

## 📁 Estructura del proyecto

```
SistemaGym/
├── django_gym/              ← Backend Django
│   ├── django_gym/          ← Configuración del proyecto
│   │   ├── settings.py      ← Configuración global
│   │   ├── urls.py          ← Rutas principales
│   │   └── wsgi.py          ← Servidor WSGI
│   ├── authentication/      ← Usuarios y roles
│   │   ├── models.py        ← Roles, UserRoles
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── management/
│   │       └── commands/
│   │           └── create_superuser.py
│   ├── gym/                 ← Clases e instructores
│   │   ├── models.py        ← Instructor, GymClass, Schedule
│   │   ├── serializers.py
│   │   └── views.py
│   ├── memberships/         ← Planes, membresías y reservas
│   │   ├── models.py        ← Member, Plan, Membership, Booking
│   │   ├── serializers.py
│   │   └── views.py         ← Lógica de negocio
│   ├── api/                 ← URLs central
│   │   └── urls.py
│   ├── requirements.txt
│   └── build.sh
└── gym-frontend/            ← Frontend React
    ├── src/
    │   ├── api/
    │   │   └── axios.js     ← Configuración Axios + interceptores JWT
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── ConfirmModal.jsx
    │   └── pages/
    │       ├── Login.jsx
    │       ├── Classes.jsx
    │       ├── Booking.jsx
    │       ├── Members.jsx
    │       ├── Instructors.jsx
    │       └── Plans.jsx
    └── package.json
```

---

## 🔑 Endpoints principales

### Autenticación
| Método | Endpoint | Descripción | Protegido |
|---|---|---|---|
| POST | `/api/auth/login/` | Obtener tokens JWT | No |
| POST | `/api/auth/refresh/` | Renovar access token | No |
| POST | `/api/users/` | Registrar usuario | No |

### Clases e Instructores
| Método | Endpoint | Descripción | Protegido |
|---|---|---|---|
| GET/POST | `/api/instructors/` | Listar y crear instructores | Sí |
| GET/PUT/DELETE | `/api/instructors/{id}/` | Gestionar instructor | Sí |
| GET | `/api/instructors/available/` | Instructores disponibles por día y hora | Sí |
| GET/POST | `/api/classes/` | Listar y crear clases | Sí |
| GET/POST | `/api/schedules/` | Listar y crear horarios | Sí |

### Membresías y Reservas
| Método | Endpoint | Descripción | Protegido |
|---|---|---|---|
| GET/POST | `/api/members/` | Listar y crear miembros | Sí |
| GET/POST | `/api/plans/` | Listar y crear planes | Sí |
| POST | `/api/memberships/activate/` | ⭐ Activar membresía (lógica de negocio) | Sí |
| GET/POST | `/api/bookings/` | ⭐ Reservar clase (lógica de negocio) | Sí |
| PATCH | `/api/bookings/{id}/` | Cancelar reserva | Sí |

---

## ⭐ Lógica de negocio

### `POST /api/memberships/activate/`
Activa una membresía para un miembro aplicando las siguientes reglas:
1. Verifica que el miembro exista
2. Verifica que el plan exista
3. **Valida que el miembro no tenga ya una membresía activa**
4. Calcula automáticamente la fecha de vencimiento sumando los días del plan a la fecha actual

```json
// Request
{
  "member_id": 1,
  "plan_id": 1
}

// Response 201
{
  "id": 1,
  "member": { "id": 1, "name": "Juan Pérez", ... },
  "plan": { "id": 1, "name": "Plan Mensual", ... },
  "start_date": "2026-05-08",
  "end_date": "2026-06-07",
  "status": "ACTIVE"
}
```

### `POST /api/bookings/`
Reserva una clase aplicando 3 validaciones en orden:
1. **Verifica que el miembro tenga membresía activa y vigente**
2. **Verifica que la clase tenga cupo disponible**
3. **Verifica que el miembro no esté ya inscrito en esa clase**

```json
// Request
{
  "member_id": 1,
  "gym_class_id": 1
}

// Response 400 - sin membresía
{ "error": "El miembro no tiene una membresía activa vigente" }

// Response 400 - sin cupo
{ "error": "La clase no tiene cupo disponible" }

// Response 400 - ya inscrito
{ "error": "El miembro ya tiene esta clase reservada" }
```

---

## 💻 Instalación local

### 1. Clonar el repositorio
```bash
git clone https://github.com/davidpontevega/SistemaGym.git
cd SistemaGym/django_gym
```

### 2. Crear y activar el entorno virtual
```bash
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
```

### 3. Instalar dependencias
```bash
pip install -r requirements.txt
```

### 4. Configurar variables de entorno
Crea un archivo `.env` en la raíz de `django_gym/`:
```env
DEBUG=True
DB_NAME=django_gym
DB_USER=postgres
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_PORT=5432
```

### 5. Crear la base de datos
```sql
CREATE DATABASE django_gym;
```

### 6. Aplicar migraciones
```bash
python manage.py migrate
```

### 7. Crear superusuario
```bash
python manage.py createsuperuser
```

### 8. Levantar el servidor
```bash
python manage.py runserver
```

La API estará disponible en `http://127.0.0.1:8000`

---

## 🎨 Frontend

```bash
cd ../gym-frontend
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

---

## 🚀 Deploy en Render

El proyecto está configurado para deploy automático en Render:

- **Build Command:** `./build.sh`
- **Start Command:** `gunicorn django_gym.wsgi:application`
- **Variables de entorno:** `DATABASE_URL`, `SECRET_KEY`, `DEBUG`

El archivo `build.sh` ejecuta automáticamente:
1. Instalación de dependencias
2. Recolección de archivos estáticos
3. Migraciones de base de datos
4. Creación del superusuario

---

## 👨‍💻 Autor

**David Ponte Vega**
- GitHub: [@davidpontevega](https://github.com/davidpontevega)

---

## 📄 Licencia

MIT License