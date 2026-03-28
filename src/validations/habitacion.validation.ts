import * as yup from 'yup'

export const crearHabitacionSchema = yup.object({
  numero: yup
    .string()
    .required('El número de habitación es obligatorio'),

  piso: yup
    .number()
    .required('El piso es obligatorio')
    .min(1, 'El piso debe ser mayor a 0'),

  tipo: yup
    .string()
    .oneOf(['SENCILLA', 'DOBLE', 'SUITE', 'PENTHOUSE'], 'Tipo de habitación no válido')
    .required('El tipo es obligatorio'),

  capacidad: yup
    .number()
    .min(1, 'La capacidad mínima es 1')
    .default(2),

  precioNoche: yup
    .number()
    .required('El precio por noche es obligatorio')
    .min(1, 'El precio debe ser mayor a 0'),

  descripcion: yup
    .string()
    .optional(),

  amenidades: yup
    .array()
    .of(yup.string().required())
    .default([]),

  imagenes: yup
    .array()
    .of(yup.string().required())
    .default([])
})

export const actualizarHabitacionSchema = yup.object({
  numero: yup.string().optional(),
  piso: yup.number().min(1).optional(),
  tipo: yup.string().oneOf(['SENCILLA', 'DOBLE', 'SUITE', 'PENTHOUSE']).optional(),
  capacidad: yup.number().min(1).optional(),
  precioNoche: yup.number().min(1).optional(),
  descripcion: yup.string().optional(),
  amenidades: yup.array().of(yup.string().required()).optional(),
  imagenes: yup.array().of(yup.string().required()).optional(),
  activa: yup.boolean().optional(),
  estado: yup.string().oneOf(['DISPONIBLE', 'OCUPADA', 'MANTENIMIENTO', 'BLOQUEADA']).optional()
})