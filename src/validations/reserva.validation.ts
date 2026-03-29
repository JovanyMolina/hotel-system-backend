import * as yup from 'yup'

export const crearReservaSchema = yup.object({
  huespedId: yup
    .string()
    .required('El huésped es obligatorio'),

  habitacionId: yup
    .string()
    .required('La habitación es obligatoria'),

  fechaEntrada: yup
    .date()
    .required('La fecha de entrada es obligatoria')
    .min(new Date(), 'La fecha de entrada no puede ser en el pasado'),

  fechaSalida: yup
    .date()
    .required('La fecha de salida es obligatoria')
    .min(yup.ref('fechaEntrada'), 'La fecha de salida debe ser después de la entrada'),

  notas: yup
    .string()
    .optional()
    .nullable()
})

export const actualizarReservaSchema = yup.object({
  notas: yup.string().optional().nullable(),
  estado: yup
    .string()
    .oneOf(
      ['PENDIENTE', 'CONFIRMADA', 'CHECKIN', 'CHECKOUT', 'CANCELADA'],
      'Estado no válido'
    )
    .optional()
})