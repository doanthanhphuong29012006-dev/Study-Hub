import { findAllCategories } from "../repositories/category.repository";

export const getAllCategories = async () => {
    const result = await findAllCategories();
    return result;
}