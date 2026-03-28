import { RolUsuario } from "@prisma/client";

declare global {
    namespace Express {
        interface Request {
            usuario?: {
                id: string;
                email: string;
                rol: RolUsuario;
                nombre: string;
            };
        }
    }
}

export {};