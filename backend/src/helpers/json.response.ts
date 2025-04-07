import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class JsonResponse {
    private req: Request;
    private res: Response;
    private method_name?: string;

    constructor(req: Request, res: Response, method_name?: string) {
        this.req = req;
        this.res = res;
        this.method_name = method_name;
    }

    jsonSuccess(data: any, message: string): void {
        const obj = {
            success: true,
            data: data,
            message: message,
        };
        this.res.status(StatusCodes.OK).send(obj);
    }

    jsonError(message: string, statusCode: number): void {
        const obj = {
            success: false,
            data: null,
            message:
                message || "An error occurred while processing your request",
        };

        this.res.status(statusCode || StatusCodes.BAD_REQUEST).send(obj);
    }
}

export default JsonResponse;