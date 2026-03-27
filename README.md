# Hotel System — Backend

API REST para el sistema de gestión hotelera. 

---

## Tecnologías

| Capa | Tecnología |
|---|---|
| Runtime | Node.js 20 |
| Framework | Express 4 |
| Lenguaje | TypeScript |
| ORM | Prisma |
| Base de datos | PostgreSQL (Supabase) |
| Autenticación | JWT + bcrypt |
| Validaciones | Yup |
| Tiempo real | Socket.io |
| Documentación API | Swagger |
| Deploy | Railway |

---

## Variables de entorno

Crea un archivo `.env` basado en `.env.example`:
```env
DATABASE_URL=
```

---

## Instalación
```bash
git clone https://github.com/JovanyMolina/hotel-system-backend
cd hotel-system-backend
npm install
npx prisma migrate dev
npm run dev
```
