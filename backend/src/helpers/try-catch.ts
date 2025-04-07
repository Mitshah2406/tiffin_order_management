import { Request, Response, NextFunction } from "express";
import JsonResponse from "./json.response";

type AsyncHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void>;

class TryCatch {
    private handler: AsyncHandler;

    constructor(handler: AsyncHandler) {
        this.handler = handler;
    }

    tryCatchGlobe() {
        return async (
            req: Request,
            res: Response,
            next: NextFunction
        ): Promise<void> => {
            try {
                await this.handler(req, res, next);
            } catch (error: any) {
                console.log("Tyr catch error", error);

                res.locals.data = { isValid: false };
                res.locals.message =
                    error instanceof Error
                        ? error.message
                        : "An unexpected error occurred";

                new JsonResponse(req, res).jsonError(error.message, 500);

                next(error);
            }
        };
    }
}

export default TryCatch;