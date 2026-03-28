import { Request, Response, NextFunction } from "express"
import * as yup from "yup"

export function validar(schema: yup.ObjectSchema<any>) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try{
            req.body = await schema.validate (req.body, {abortEarly:false , stripUnknown: true})
            next()
        }
        catch(error){
            if(error instanceof yup.ValidationError){

                res.status(400).json({
                    ok:false,
                    mensaje: "Error de validacion ",
                    errores: error.errors
                })
                return
            }
            next(error)
        }
    }
}