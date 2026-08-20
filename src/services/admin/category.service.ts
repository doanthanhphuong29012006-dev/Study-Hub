import * as categoryRepository from '../../repositories/admin/category.repository';
import { getCategoryByName, getCategoryBySlug } from '../../repositories/category.repository';

export const createNewCategory = async (name: string, slug: string, description: string) => {
    const categoryName = await getCategoryByName(name);

    if (categoryName) {
        throw Error("Error_Category_Name");
    }

    const categorySlug = await getCategoryBySlug(slug);

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