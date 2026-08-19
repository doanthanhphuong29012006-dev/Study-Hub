import * as categoryRepository from "../repositories/category.repository";

export const getAllCategories = async () => {
    const result = await categoryRepository.findAllCategories();
    return result;
}

export const getDetailCategory = async (slug: string) => {
    const category = await categoryRepository.getCategoryBySlug(slug);
    return category;
}

export const createNewCategory = async (name: string, slug: string, description: string) => {
    const categoryName = await categoryRepository.getCategoryByName(name);

    if (categoryName) {
        throw Error("Error_Category_Name");
    }

    const categorySlug = await categoryRepository.getCategoryBySlug(slug);

    if (categorySlug) {
        throw Error("Error_Category_Slug");
    }

    await categoryRepository.addNewCategory(name, slug, description);
}

export const deleteCategory = async (categoryId: string) => {
    await categoryRepository.deleteCategoryById(categoryId);
}

export const updateCategory = async (categoryId: string, name: string, slug: string, description: string) => {
    await categoryRepository.updateCategoryById(categoryId, name, slug, description);
}