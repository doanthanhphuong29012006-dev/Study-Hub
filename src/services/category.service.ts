import * as categoryRepository from "../repositories/category.repository";

export const getAllCategories = async () => {
    const result = await categoryRepository.findAllCategories;
    return result;
}

export const getDetailCategory = async (slug: string) => {
    const category = await categoryRepository.getCategoryBySlug(slug);
    return category;
}