import * as yup from 'yup'

export const crearHuespedSchema = yup.object({
  nombre: yup
    .string()
    .required('El nombre es obligatorio')
    .min(2, 'Mínimo 2 caracteres'),

  apellido: yup
    .string()
    .required('El apellido es obligatorio')
    .min(2, 'Mínimo 2 caracteres'),

  email: yup
    .string()
    .email('El email no es válido')
    .optional()
    .nullable(),

  telefono: yup
    .string()
    .optional()
    .nullable(),

  documento: yup
    .string()
    .optional()
    .nullable(),

  tipoDocumento: yup
    .string()
    .oneOf(['INE', 'PASAPORTE', 'LICENCIA', 'OTRO'], 'Tipo de documento no válido')
    .optional()
    .nullable(),

  nacionalidad: yup
    .string()
    .optional()
    .nullable(),

  notas: yup
    .string()
    .optional()
    .nullable(),

  esVip: yup
    .boolean()
    .default(false)
})

export const actualizarHuespedSchema = yup.object({
  nombre: yup.string().min(2).optional(),
  apellido: yup.string().min(2).optional(),
  email: yup.string().email().optional().nullable(),
  telefono: yup.string().optional().nullable(),
  documento: yup.string().optional().nullable(),
  tipoDocumento: yup
    .string()
    .oneOf(['INE', 'PASAPORTE', 'LICENCIA', 'OTRO'])
    .optional()
    .nullable(),
  nacionalidad: yup.string().optional().nullable(),
  notas: yup.string().optional().nullable(),
  esVip: yup.boolean().optional()
})