import e from "express"
import * as yup from "yup"

export const registroSchema = yup.object({
    nombre: yup
    .string()
    .required("El nombre es obligatorio")
    .min(2,"El nombre debe tener al menos 2 caracteres"),

    email: yup
    .string()
    .required("El email es obligatorio")
    .email("El email no es válido"),

    password: yup
    .string()
    .required("La contraseña es obligatoria")
    .min(6,"La contraseña debe tener al menos 6 caracteres"),

    rol: yup
    .string()
    .oneOf(['ADMIN','RECEPCIONISTA'], "ROL no válido")
})

export const loginSchema = yup.object({
    email: yup
    .string()
    .required("El email es obligatorio")
    .email("El email no es válido"),

    password: yup
    .string()
    .required("La contraseña es obligatoria")
})