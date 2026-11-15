import type { ProductRepository } from "../../domain/post/product/repository";


export function createProductService(repository: ProductRepository) {
    return {
        async getProducts(take: number | undefined, categoryId: number | undefined) {
            return repository.getAllProducts(take, categoryId)
        },
        
        async findProduct(id: number) {
            return repository.findProductById(id)
        },
        
        async createNewProduct(data: { name: any; price: any; image: any; categoryId: any; }) {
            let { name, price, image, categoryId } = data;

            if (
                typeof name !== 'string' || !name.trim() ||
                typeof price !== 'number' || price <= 0 ||
                typeof image !== 'string' || !image.trim() ||
                typeof categoryId !== 'number' || categoryId <= 0
            ) {
                throw new Error('INVALID_PRODUCT_DATA')
            }
            let product = {
                name: name,
                price: price,
                image: image,
                categoryId: categoryId
            };
            
            return await repository.createProduct(product);
        }
    }
}