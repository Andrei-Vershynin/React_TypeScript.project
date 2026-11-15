import type { Request, Response } from "express";
import type { ProductResponse } from "../../dto/product/responses.js";
import type { CreateProductRequest } from "../../dto/product/requests.js";
import type { ErrorResponse } from "../../errors.js";


export interface ProductHandler{
    getAllProducts: (
        req: Request,
        res: Response<ProductResponse[] | ErrorResponse>
    ) => Promise<void>;
    getProductById: (
        req: Request,
        res: Response<ProductResponse | ErrorResponse>
    ) => Promise<void>;
    createProduct: (
        req: Request<{}, {}, CreateProductRequest>,
        res: Response<ProductResponse | ErrorResponse>
    ) => Promise<void>;

}