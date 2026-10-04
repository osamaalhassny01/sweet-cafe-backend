export declare class CreateProductSizeDto {
    name: string;
    price: number;
    isDefault?: boolean;
}
export declare class CreateProductAddonDto {
    nameAr: string;
    nameEn: string;
    price: number;
    isActive?: boolean;
}
export declare class CreateProductDto {
    categoryId: string;
    nameAr: string;
    nameEn: string;
    description?: string;
    price: number;
    oldPrice?: number;
    imageUrl?: string;
    galleryImages?: string[];
    isActive?: boolean;
    isAvailable?: boolean;
    isFeatured?: boolean;
    isBestSeller?: boolean;
    sortOrder?: number;
    sizes?: CreateProductSizeDto[];
    addons?: CreateProductAddonDto[];
}
