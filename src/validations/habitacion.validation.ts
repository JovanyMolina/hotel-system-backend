import * as yup from 'yup'

export const crearHabitacionSchema = yup.object({
  
  numero: yup.string()
  .required('El número es obligatorio'),
  
  piso: yup.number()
  .required('El piso es obligatorio')
  .min(1),
  
  tipo: yup
    .string()
    .oneOf(['SENCILLA', 'DOBLE', 'SUITE', 'PENTHOUSE'])
    .required('El tipo es obligatorio'),
  
    capacidad: yup.number()
    .min(1)
    .max(20)
    .default(2),
  
  tamano: yup.number()
  .min(1)
  .optional()
  .nullable(),

  cantidadCamas: yup.number()
  .min(1)
  .max(50)
  .default(1),

  vista: yup.string()
  .optional()
  .nullable(),
  
  precioNoche: yup.number()
  .required('El precio es obligatorio')
  .min(1),
  
  descripcion: yup.string()
  .optional()
  .nullable(),
  
  amenidades: yup.array()
  .of(yup.string().required())
  .default([]),

  tipoCama: yup
    .string()
    .oneOf(['INDIVIDUAL', 'MATRIMONIAL', 'QUEEN', 'KING SIZE' ])
    .required('El tipo es obligatorio'),
  
  imagenes: yup.array()
  .of(yup.string().required()).default([])
})

export const actualizarHabitacionSchema = yup.object({
  numero: 
  yup.string()
  .optional(),
  
  piso: 
  yup.number()
  .min(1)
  .optional(),

  tipo: 
  yup.string()
  .oneOf(['SENCILLA', 'DOBLE', 'SUITE', 'PENTHOUSE'])
  .optional(),
  
  capacidad: 
  yup.number()
  .min(1)
  .max(20)
  .optional(),

  tamano: yup.number()
  .min(1)
  .optional()
  .nullable(),

  cantidadCamas: yup.number()
  .min(1)
  .max(10)
  .default(1),

  vista: yup.string()
  .optional()
  .nullable(),
  
  precioNoche: yup.number()
  .min(1)
  .optional(),
  
  descripcion: yup.string()
  .optional()
  .nullable(),
  
  amenidades: yup.array()
  .of(yup.string().required())
  .optional(),
  
  tipoCama: yup
    .string()
    .oneOf(['INDIVIDUAL', 'MATRIMONIAL', 'QUEEN', 'KING SIZE' ])
    .required('El tipo es obligatorio'),

  imagenes: 
  yup.array()
  .of(yup.string().required())
  .optional(),
  
  activa: yup.boolean().optional(),
  
  estado: yup
    .string()
    .oneOf(['DISPONIBLE', 'OCUPADA', 'MANTENIMIENTO', 'BLOQUEADA'])
    .optional()
})